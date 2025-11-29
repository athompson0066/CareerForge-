import React, { useState } from 'react';
import { Download, Copy, Check, Globe, FileJson, LayoutTemplate, X, AlertCircle, Code } from 'lucide-react';
import { ResumeData } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, data }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'wordpress' | 'json' | 'iframe'>('html');
  const [copied, setCopied] = useState(false);
  const [deployUrl, setDeployUrl] = useState(typeof window !== 'undefined' ? window.location.origin : 'https://your-deployed-app.com');

  if (!isOpen) return null;

  const getPreviewHTML = () => {
    const previewElement = document.getElementById('web-preview');
    if (!previewElement) return '';
    return previewElement.innerHTML;
  };

  const generateFullHTML = () => {
    const content = getPreviewHTML();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.fullName} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
      .font-serif { font-family: 'Playfair Display', serif; }
      /* Hide elements that require React state */
      .ai-interactive { display: none !important; }
      .ai-agent-trigger { display: none !important; }
      .ai-agent-section { display: none !important; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased">
    ${content}
    <script>
      // Simple script to handle smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
        });
      });
    </script>
</body>
</html>`;
  };

  const handleDownloadHTML = () => {
    const html = generateFullHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyWordPress = () => {
    const content = getPreviewHTML();
    // Wrap in a div to ensure isolation
    const wpCode = `<!-- START PORTFOLIO EMBED -->\n<div class="portfolio-embed font-sans">\n<script src="https://cdn.tailwindcss.com"></script>\n${content}\n</div>\n<!-- END PORTFOLIO EMBED -->`;
    
    navigator.clipboard.writeText(wpCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyIframe = () => {
    const iframeCode = `<iframe 
  src="${deployUrl}" 
  style="width: 100%; height: 100vh; border: none;" 
  allow="microphone; camera; clipboard-write" 
  title="${data.personalInfo.fullName} Portfolio"
></iframe>`;
    
    navigator.clipboard.writeText(iframeCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
              <LayoutTemplate size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Export & Templates</h2>
              <p className="text-sm text-slate-500">Save your design or publish to external platforms.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          <div className="grid grid-cols-4 gap-2 p-1 bg-slate-100 rounded-lg mb-8">
            <button 
              onClick={() => setActiveTab('html')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'html' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Globe size={16} /> <span className="hidden sm:inline">Web (HTML)</span>
            </button>
            <button 
              onClick={() => setActiveTab('wordpress')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'wordpress' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutTemplate size={16} /> <span className="hidden sm:inline">WordPress</span>
            </button>
             <button 
              onClick={() => setActiveTab('iframe')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'iframe' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Code size={16} /> <span className="hidden sm:inline">Embed</span>
            </button>
            <button 
              onClick={() => setActiveTab('json')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all ${activeTab === 'json' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FileJson size={16} /> <span className="hidden sm:inline">JSON</span>
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Disclaimer */}
            {activeTab !== 'iframe' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-sm text-amber-800">
                <AlertCircle size={20} className="shrink-0 text-amber-600" />
                <p>
                  <strong>Note:</strong> Static exports (HTML/WordPress) capture the design perfectly but <strong>disable the AI Chatbot</strong>. To use the Chatbot, use the "Embed" option.
                </p>
              </div>
            )}
             {activeTab === 'iframe' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-sm text-blue-800">
                <Check size={20} className="shrink-0 text-blue-600" />
                <p>
                  <strong>Full Functionality:</strong> This embed method keeps the AI Chatbot (Sarah) and Voice features fully active. You must host this app first!
                </p>
              </div>
            )}

            {activeTab === 'html' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-indigo-600">
                      <Globe size={32} />
                   </div>
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Standalone Website</h3>
                   <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                     Download a single <code>index.html</code> file with all styles embedded. Ready to upload to Netlify, Vercel, or any hosting provider.
                   </p>
                   <button 
                    onClick={handleDownloadHTML}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                   >
                     <Download size={18} /> Download HTML File
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'wordpress' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                   <h3 className="text-lg font-semibold text-slate-900 mb-4">WordPress Integration</h3>
                   <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 mb-6">
                     <li>Create a new Page or Post in WordPress.</li>
                     <li>Select the <strong>"Custom HTML"</strong> block (Gutenberg) or Code module.</li>
                     <li>Paste the code below. It includes the layout and Tailwind styles.</li>
                   </ol>
                   
                   <div className="relative">
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={handleCopyWordPress}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <textarea 
                        readOnly 
                        className="w-full h-48 bg-slate-900 text-slate-300 text-xs font-mono p-4 rounded-lg outline-none resize-none"
                        value="<!-- Click 'Copy Code' to get the full HTML template for WordPress -->"
                      />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'iframe' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Embed Live App</h3>
                   <p className="text-sm text-slate-500 mb-4">
                     Embed your deployed portfolio into Wix, Squarespace, or Notion.
                   </p>

                   <div className="mb-4">
                     <label className="block text-xs font-medium text-slate-700 mb-1">Your Deployed App URL</label>
                     <input 
                        type="text" 
                        value={deployUrl}
                        onChange={(e) => setDeployUrl(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md text-sm"
                        placeholder="https://my-portfolio.vercel.app"
                     />
                   </div>
                   
                   <div className="relative">
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={handleCopyIframe}
                          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md hover:bg-slate-700 transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? "Copied!" : "Copy Code"}
                        </button>
                      </div>
                      <textarea 
                        readOnly 
                        className="w-full h-32 bg-slate-900 text-green-400 text-xs font-mono p-4 rounded-lg outline-none resize-none"
                        value={`<iframe \n  src="${deployUrl}" \n  style="width: 100%; height: 100vh; border: none;" \n  allow="microphone; camera; clipboard-write" \n  title="Portfolio"\n></iframe>`}
                      />
                   </div>
                   <p className="text-xs text-slate-500 mt-2">
                     * The <code>allow="microphone"</code> attribute is required for the Voice AI to function.
                   </p>
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 text-emerald-600">
                      <FileJson size={32} />
                   </div>
                   <h3 className="text-lg font-semibold text-slate-900 mb-2">Resume Data Template</h3>
                   <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                     Export your content structure as a JSON file. Use this to backup your data or import it into other applications.
                   </p>
                   <button 
                    onClick={handleDownloadJSON}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                   >
                     <Download size={18} /> Download JSON Template
                   </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;