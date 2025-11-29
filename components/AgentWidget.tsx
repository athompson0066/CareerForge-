import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, ThemeType } from '../types';
import { MessageSquare, X, Send, Mic, Sparkles, Headphones, Minimize2, Bot, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { createChatSession, genAIClient } from '../services/geminiService';
import { Chat, LiveServerMessage, Modality } from '@google/genai';

interface AgentWidgetProps {
  resumeData: ResumeData;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  activeTheme?: ThemeType;
  initialMessage?: string;
  onMessageConsumed?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SARAH_IMAGE_URL = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const JAMES_IMAGE_URL = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const BELLA_IMAGE_URL = "https://images.unsplash.com/photo-1595956553066-feb431ef8782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

// --- Audio Helper Functions ---
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const AgentWidget: React.FC<AgentWidgetProps> = ({ resumeData, isOpen, onToggle, activeTheme, initialMessage, onMessageConsumed }) => {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  
  // Determine Persona based on Theme
  const isRealtor = activeTheme === 'realtor';
  const isFinance = activeTheme === 'finance';
  const isWedding = activeTheme === 'wedding';
  
  let personaName = 'Sarah';
  let personaRole = 'Executive Assistant';
  let avatarUrl = SARAH_IMAGE_URL;

  if (isFinance) {
    personaName = 'James';
    personaRole = 'Senior Investment Analyst';
    avatarUrl = JAMES_IMAGE_URL;
  } else if (isRealtor) {
    personaName = 'Sarah';
    personaRole = 'Real Estate Assistant';
  } else if (isWedding) {
    personaName = 'Bella';
    personaRole = 'Lead Wedding Planner';
    avatarUrl = BELLA_IMAGE_URL;
  }

  // Text Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Voice State
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState(0); // For visualizer
  
  // Refs for Live API
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const currentSessionPromiseRef = useRef<Promise<any> | null>(null);

  // --- Text Chat Logic ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, mode]);

  // Handle Initial Message Injection
  useEffect(() => {
    if (initialMessage && isOpen) {
      setInputText(initialMessage);
      // Optional: Auto-send if desired, but pre-filling is safer for user intent
      if (onMessageConsumed) {
        onMessageConsumed();
      }
    }
  }, [initialMessage, isOpen, onMessageConsumed]);

  // Reset chat when theme/persona changes
  useEffect(() => {
     setMessages([{
        id: 'init',
        role: 'model',
        text: `Hello! I'm ${personaName}, ${isWedding ? 'your' : "Linda's"} ${personaRole}. How can I help you today?`
     }]);
     chatSessionRef.current = null;
  }, [personaName, personaRole, isWedding]);

  const initTextChat = () => {
    let context = `You are ${personaName}, the AI ${personaRole} for ${resumeData.personalInfo.fullName}. `;

    if (isRealtor) {
      context += `
        User Context: Potential home buyer or seller.
        Data: ${JSON.stringify(resumeData.listings || [], null, 2)}
        Goal: Answer questions about specific properties (price, beds, location). encourage booking a viewing.
        Keep responses concise.
      `;
    } else if (isFinance) {
       context += `
        User Context: Potential investor or partner.
        Data: ${JSON.stringify(resumeData.portfolio || [], null, 2)}
        Goal: Discuss investment philosophy, portfolio performance, and sector allocation. Be analytical.
        Keep responses concise.
      `;
    } else if (isWedding) {
       context += `
        User Context: Engaged couple planning a wedding.
        Packages: ${JSON.stringify(resumeData.weddingServices || [], null, 2)}
        Tone: Empathetic, Excited, Calm, Organized.
        Goal: Help them feel less stressed, suggest specific packages, and book a consultation.
        If they mention budget, ask for their guest count and approximate budget to give advice.
      `;
    } else {
       // --- DEFAULT / LINDA QUAYNOR EXECUTIVE ASSISTANT ---
       context += `
        ROLE: You are the gatekeeper and Executive Assistant for Linda Quaynor. 
        TONE: Professional, polite, efficient, and high-end corporate.
        
        KNOWLEDGE BASE (Use this strictly):
        - Current Roles: ${resumeData.experience.filter(e => e.current).map(e => `${e.position} at ${e.company}`).join('; ')}.
        - Past Roles: ${resumeData.experience.filter(e => !e.current).map(e => `${e.position} at ${e.company} (${e.startDate} to ${e.endDate})`).join('; ')}.
        - Key Skills: ${resumeData.skills.map(s => s.name).join(', ')}.
        - Bio: ${resumeData.personalInfo.summary}

        APPOINTMENT BOOKING PROTOCOL:
        1. If the user asks to "book a meeting", "schedule a call", or "consult" with Linda:
           - You MUST FIRST ask for their "Name" and "Organization/Company".
           - DO NOT provide the link until you have this information.
        2. Once they provide their name/organization:
           - Reply: "Thank you. Linda is currently prioritizing strategic partnership discussions. You may select a time on her calendar here: https://calendly.com/linda-quaynor/executive-consultation"
        
        FAQ HANDLING:
        - If asked about her Board experience: Highlight Delwik Group and ARM Labs.
        - If asked about her consulting background: Mention Deloitte (Partner) and Accenture.
        - If asked for contact info: Provide ${resumeData.personalInfo.email}.

        Keep responses under 3 sentences unless detailing work history.
      `;
    }

    chatSessionRef.current = createChatSession(context);
  };

  useEffect(() => {
    if (isOpen && !chatSessionRef.current && mode === 'text') {
      initTextChat();
    }
  }, [isOpen, mode]);

  const handleSendText = async () => {
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: inputText });
      const responseText = result.text;
      
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText || "I'm sorry, I couldn't generate a response." 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: "Something went wrong. Please try again." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Live Voice Logic ---

  const startLiveSession = async () => {
    try {
      setIsLiveConnecting(true);
      setConnectionError(null);
      
      // 1. Check Media API Availability
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media Devices API not supported. Voice features require HTTPS or localhost.");
      }

      // 2. Check for Microphones explicitly
      // This prevents the "Requested device not found" error from crashing the flow unexpectedly
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasMic = devices.some(d => d.kind === 'audioinput');
        if (!hasMic) {
           throw new Error("No microphone detected on your device. Please connect a microphone.");
        }
      } catch (e: any) {
        // enumerateDevices might fail or be blocked by privacy settings on some browsers
        // We log it but proceed to getUserMedia which will trigger the prompt or error
        console.warn("Could not enumerate devices (privacy restriction):", e);
        if (e.message && e.message.includes("No microphone detected")) {
           throw e;
        }
      }

      // 3. Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      // CRITICAL: Resume contexts which might be suspended by the browser
      await inputCtx.resume();
      await outputCtx.resume();

      audioContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      // 4. Request Mic Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let context = `You are ${personaName}, the AI ${personaRole} for ${resumeData.personalInfo.fullName}.`;
      
      if (isFinance) {
        context += ` Focus on investments: ${JSON.stringify(resumeData.portfolio)}`;
      } else if (isRealtor) {
        context += ` Focus on real estate: ${JSON.stringify(resumeData.listings)}`;
      } else if (isWedding) {
        context += ` Focus on wedding planning and packages: ${JSON.stringify(resumeData.weddingServices)}`;
      } else {
        // Voice Context for Linda
        context += `
          You are acting as Linda Quaynor's Executive Assistant.
          Use the following profile data to answer questions: ${JSON.stringify(resumeData.experience)}.
          If someone wants to book a meeting, politely ask for their Name and Company first.
          Then tell them to visit the website to find the booking link, or say you will email them.
          Be concise, professional, and warm.
        `;
      }
      
      const sessionPromise = genAIClient.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          systemInstruction: context,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: isFinance ? 'Fenrir' : 'Kore' } }, 
          },
        },
        callbacks: {
          onopen: () => {
            console.log("Live session opened");
            setIsLiveConnected(true);
            setIsLiveConnecting(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolumeLevel(Math.min(rms * 5, 1)); 

              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              
              const b64Data = arrayBufferToBase64(pcmData.buffer);
              
              if (currentSessionPromiseRef.current) {
                currentSessionPromiseRef.current.then(session => {
                  session.sendRealtimeInput({
                    media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: b64Data
                    }
                  });
                });
              }
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
              const ctx = outputContextRef.current;
              const uint8Array = base64ToUint8Array(audioData);
              const int16 = new Int16Array(uint8Array.buffer);
              const float32 = new Float32Array(int16.length);
              for(let i=0; i<int16.length; i++) {
                float32[i] = int16[i] / 32768.0;
              }
              
              const buffer = ctx.createBuffer(1, float32.length, 24000);
              buffer.getChannelData(0).set(float32);
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              const currentTime = ctx.currentTime;
              const startTime = Math.max(nextStartTimeRef.current, currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
              
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
              setVolumeLevel(0.5 + Math.random() * 0.5); 
            }

            if (msg.serverContent?.turnComplete) {
               setVolumeLevel(0);
            }
          },
          onclose: () => {
            console.log("Live session closed");
            stopLiveSession();
          },
          onerror: (err) => {
            console.error("Live session error", err);
            stopLiveSession();
            setConnectionError("Connection interrupted. Please try again.");
          }
        }
      });
      
      currentSessionPromiseRef.current = sessionPromise;

    } catch (e: any) {
      console.warn("Failed to start live session:", e);
      setIsLiveConnecting(false);
      setIsLiveConnected(false);
      
      // Cleanup contexts if they were created
      audioContextRef.current?.close();
      outputContextRef.current?.close();

      // Specific Error Handling for User Feedback
      if (e.name === 'NotFoundError' || e.message?.includes('device not found') || e.message?.includes('No microphone')) {
        setConnectionError("Microphone not found. Please connect a mic.");
      } else if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setConnectionError("Microphone permission denied. Please allow access.");
      } else if (e.name === 'NotReadableError') {
         setConnectionError("Microphone is busy. Close other apps.");
      } else {
        setConnectionError("Connection failed. Check your API Key or Network.");
      }
    }
  };

  const stopLiveSession = () => {
    inputSourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    outputContextRef.current?.close();
    
    activeSourcesRef.current.forEach(s => s.stop());
    activeSourcesRef.current.clear();

    setIsLiveConnected(false);
    setVolumeLevel(0);
    currentSessionPromiseRef.current = null;
  };

  const toggleVoiceMode = () => {
    if (mode === 'voice') {
      stopLiveSession();
      setMode('text');
    } else {
      setMode('voice');
      startLiveSession();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => onToggle(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl z-50 transition-transform hover:scale-105 active:scale-95 group ai-agent-trigger"
        aria-label={`Chat with ${personaName}`}
      >
        <div className={`absolute inset-0 rounded-full opacity-20 animate-ping duration-[3000ms] ${isFinance ? 'bg-amber-500' : isWedding ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
        <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white shadow-inner bg-slate-200">
          <img 
            src={avatarUrl} 
            alt={`${personaName} AI Agent`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        <div className="absolute top-0 right-0 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full z-20 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200 animate-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
           <div className={`w-8 h-8 rounded-full border overflow-hidden ${isFinance ? 'border-amber-400' : isWedding ? 'border-rose-300' : 'border-indigo-200'}`}>
             <img src={avatarUrl} alt={personaName} className="w-full h-full object-cover" />
           </div>
           <div>
             <h3 className="font-bold text-slate-800 text-sm">{personaName} - {personaRole}</h3>
             <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-slate-500">Online | Powered by Gemini</p>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={toggleVoiceMode}
             className={`p-2 rounded-full transition-colors ${mode === 'voice' ? 'bg-red-100 text-red-600' : 'hover:bg-slate-200 text-slate-600'}`}
             title={mode === 'voice' ? 'End Call' : 'Start Voice Call'}
           >
             {mode === 'voice' ? <Headphones size={18} /> : <Headphones size={18} />}
           </button>
           <button onClick={() => onToggle(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600">
             <Minimize2 size={18} />
           </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'text' ? (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className={`w-6 h-6 rounded-full border overflow-hidden mr-2 mt-1 shrink-0 ${isFinance ? 'border-amber-400' : isWedding ? 'border-rose-300' : 'border-indigo-200'}`}>
                    <img src={avatarUrl} alt={personaName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? `bg-${isFinance ? 'amber-600' : isWedding ? 'rose-500' : 'indigo-600'} text-white rounded-br-none shadow-md` 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full border overflow-hidden mr-2 mt-1 shrink-0">
                    <img src={avatarUrl} alt={personaName} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            {/* Quick Suggestions */}
             <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                {isWedding && (
                   <>
                    <button onClick={() => setInputText("What is your Full Service package?")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-200">
                       💍 Full Planning
                    </button>
                    <button onClick={() => setInputText("Can you help me with a budget?")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-200">
                       💰 Budget Help
                    </button>
                   </>
                )}
                {isRealtor && (
                   <>
                    <button onClick={() => setInputText("I'd like to book a meeting.")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-amber-50 hover:text-amber-600 transition-colors border border-slate-200">
                       📅 Book Appointment
                    </button>
                   </>
                )}
                {isFinance && (
                   <>
                    <button onClick={() => setInputText("Tell me about your investment strategy.")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-amber-50 hover:text-amber-600 transition-colors border border-slate-200">
                       📈 Strategy
                    </button>
                   </>
                )}
                {!isRealtor && !isFinance && !isWedding && (
                  <>
                     <button onClick={() => setInputText("I'd like to book a consultation.")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200">
                        📅 Schedule Meeting
                     </button>
                     <button onClick={() => setInputText("Tell me about Linda's Board experience.")} className="whitespace-nowrap px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200">
                        🏛️ Board Roles
                     </button>
                  </>
                )}
             </div>
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendText(); }}
              className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${personaName}...`}
                className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim() || isTyping}
                className={`p-2 text-white rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isFinance ? 'bg-amber-600 hover:bg-amber-700' : isWedding ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </>
      ) : (
        // Voice Mode UI
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
           {isLiveConnected && (
             <>
               <div 
                  className={`absolute w-64 h-64 rounded-full blur-3xl transition-transform duration-100 z-0 ${isFinance ? 'bg-amber-600/30' : isWedding ? 'bg-rose-500/30' : 'bg-indigo-600/30'}`}
                  style={{ transform: `scale(${1 + volumeLevel})` }}
               ></div>
               
               <div 
                  className={`absolute w-72 h-72 rounded-full blur-[80px] transition-transform duration-1000 ease-in-out z-0 animate-pulse mix-blend-screen ${isFinance ? 'bg-yellow-400/20' : isWedding ? 'bg-pink-400/20' : 'bg-teal-400/20'}`}
                  style={{ transform: `scale(${1.1 + (volumeLevel * 0.4)})` }}
               ></div>
             </>
           )}

           <div className="relative z-10 flex flex-col items-center gap-8 text-center p-8">
              {isLiveConnecting ? (
                 <div className="flex flex-col items-center gap-4 text-slate-400">
                    <Loader2 size={48} className={`animate-spin ${isFinance ? 'text-amber-500' : isWedding ? 'text-rose-500' : 'text-indigo-500'}`} />
                    <p>Connecting to {personaName}...</p>
                 </div>
              ) : isLiveConnected ? (
                 <>
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl shadow-indigo-900/50 relative z-10 border-4 border-slate-800 bg-slate-800 overflow-hidden">
                          <img src={avatarUrl} alt={personaName} className="w-full h-full object-cover" />
                       </div>
                       <div className={`absolute inset-0 rounded-full border animate-ping z-0 ${isFinance ? 'border-amber-500/30' : isWedding ? 'border-rose-500/30' : 'border-indigo-500/30'}`}></div>
                    </div>
                    
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold text-white">{personaName} Listening...</h3>
                       <p className="text-slate-400 text-sm">"I'm here to help plan your special day."</p>
                    </div>

                    <div className="flex items-center gap-1 h-12">
                       {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 rounded-full transition-all duration-75 ${isFinance ? 'bg-amber-400' : isWedding ? 'bg-rose-400' : 'bg-indigo-400'}`}
                            style={{ 
                              height: `${20 + Math.random() * (volumeLevel * 100)}%`,
                              opacity: 0.5 + volumeLevel 
                            }}
                          ></div>
                       ))}
                    </div>
                 </>
              ) : (
                 <div className="text-slate-400 flex flex-col items-center max-w-xs">
                    <AlertCircle size={32} className="text-red-400 mb-2" />
                    <p className="text-red-400 mb-4 font-medium">{connectionError || "Connection Lost."}</p>
                    <button onClick={startLiveSession} className="px-6 py-2.5 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                      Try Again
                    </button>
                 </div>
              )}
           </div>

           <div className="absolute bottom-8 w-full px-8 z-20">
              <button 
                onClick={toggleVoiceMode}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <X size={16} /> End Call & Return to Chat
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentWidget;