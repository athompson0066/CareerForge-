import React, { useRef } from 'react';
import { ResumeData, ThemeType } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, ArrowRight, Github, ChevronRight, ChevronLeft, Calendar, MessageSquare, Sparkles, Home, Bed, Bath, Move, Star, Search, Map, TrendingUp, DollarSign, PieChart, Briefcase, Shield, Landmark, Scale, LineChart, Heart, Music, Camera, GlassWater, Calculator, Clock, Users, Gem, Wine } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  theme: ThemeType;
  onOpenAgent?: (message?: string) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, theme, onOpenAgent }) => {
  const { personalInfo, experience, education, skills, socials, listings, testimonials, portfolio, weddingServices, weddingGallery } = data;
  const experienceScrollRef = useRef<HTMLDivElement>(null);

  const scrollExperience = (direction: 'left' | 'right') => {
    if (experienceScrollRef.current) {
      const scrollAmount = 420; // Approx card width + gap
      const currentScroll = experienceScrollRef.current.scrollLeft;
      experienceScrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleMapSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem('location') as HTMLInputElement).value;
    if (query) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    }
  };

  // --- Web Renderers (Responsive) ---

  const renderWeddingWeb = () => (
    <div className="w-full min-h-full bg-[#FDFCF8] text-slate-800 font-serif selection:bg-rose-200 selection:text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-wedding-heading { font-family: 'Playfair Display', serif; }
        .font-wedding-body { font-family: 'Lato', sans-serif; }
      `}</style>

      {/* Hero Section */}
      <header className="relative min-h-[95vh] flex items-center justify-center text-center p-6 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-slate-900/30 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFCF8] z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Wedding Table" 
              className="w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
            />
         </div>

         <div className="relative z-20 max-w-5xl mx-auto text-white animate-in slide-in-from-bottom-8 duration-700 flex flex-col items-center">
            <p className="font-wedding-body text-xs md:text-sm uppercase tracking-[0.3em] mb-6 text-rose-100/90 bg-slate-900/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
              Luxury Wedding Planning & Design
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-wedding-heading italic mb-6 drop-shadow-lg leading-tight">
              {personalInfo.fullName}
            </h1>
            <p className="max-w-2xl mx-auto text-rose-50 font-wedding-body mb-10 leading-relaxed text-lg md:text-xl drop-shadow-md font-light">
              {personalInfo.summary}
            </p>
            
            {/* Hero Interactive Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl max-w-lg w-full transform hover:scale-105 transition-all duration-300">
               <h3 className="font-wedding-heading text-2xl mb-2 text-white">Start Your Journey</h3>
               <p className="font-wedding-body text-rose-100 text-sm mb-6">Chat with Bella, my AI coordinator, to instantly check dates, get style advice, or estimate your budget.</p>
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("I'm recently engaged and looking for a wedding planner. Can you help me get started?")}
                 className="w-full py-4 bg-white text-slate-900 font-wedding-body font-bold uppercase tracking-widest text-xs hover:bg-rose-50 transition-all rounded shadow-lg ai-agent-trigger flex items-center justify-center gap-2"
               >
                 <Sparkles size={16} className="text-rose-400" />
                 Start Planning Now
               </button>
            </div>
         </div>
      </header>

      {/* Mini-App 1: The Vibe Check (Style Finder) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <span className="text-rose-400 font-wedding-body font-bold uppercase tracking-widest text-xs">Mini-App 01</span>
            <h2 className="text-4xl md:text-6xl font-wedding-heading mb-4 text-slate-800 mt-2">Find Your Style</h2>
            <p className="font-wedding-body text-slate-500 max-w-2xl mx-auto">
              Not sure where to start? Click a style below to launch a personalized design session with Bella.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Boho Chic', icon: <GlassWater />, img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8', prompt: "I love the Boho Chic style (earthy, relaxed, floral). Can you help me create a mood board and find venues?" },
              { name: 'Modern Minimal', icon: <Gem />, img: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821', prompt: "I'm interested in a Modern Minimalist wedding (clean lines, white, elegant). What are some design ideas?" },
              { name: 'Timeless Classic', icon: <Heart />, img: 'https://images.unsplash.com/photo-1520854221256-17451cc330e7', prompt: "I dream of a Classic Romantic wedding (ballroom, roses, black tie). How do we achieve this look?" },
              { name: 'Luxury Glam', icon: <Wine />, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88', prompt: "I want a Luxury Glam wedding (sparkle, grand scale, opulent). What packages fit this?" }
            ].map((style, idx) => (
               <button 
                 key={idx}
                 onClick={() => onOpenAgent && onOpenAgent(style.prompt)}
                 className="group relative h-96 overflow-hidden rounded-xl ai-agent-trigger cursor-pointer"
               >
                  <img src={style.img} alt={style.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6 text-left transform translate-y-2 group-hover:translate-y-0 transition-transform">
                     <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-3 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        {style.icon}
                     </div>
                     <span className="font-wedding-heading text-3xl text-white italic block mb-2">{style.name}</span>
                     <span className="text-rose-200 text-xs font-wedding-body uppercase tracking-wider flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                       Select Vibe <ArrowRight size={14} />
                     </span>
                  </div>
               </button>
            ))}
         </div>
      </section>

      {/* Mini-App 2: Planning Suite (Lead Gen Pain Points) */}
      <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden ai-agent-section">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-rose-400 font-wedding-body font-bold uppercase tracking-widest text-xs">Mini-App 02</span>
              <h2 className="text-4xl md:text-5xl font-wedding-heading mt-2 mb-6">Wedding Planning Suite</h2>
              <p className="font-wedding-body text-slate-300 mb-10 text-lg max-w-2xl mx-auto">
                Solve your biggest planning headaches instantly. Select a tool below to launch a specialized AI session with Bella.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Tool 1: Budget */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("I need help creating a wedding budget. I have approx X guests and Y total budget. Can you break it down?")}
                 className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-rose-400/50 transition-all group text-left ai-agent-trigger"
               >
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                    <Calculator size={24} />
                 </div>
                 <h3 className="text-xl font-wedding-heading mb-2">Budget Estimator</h3>
                 <p className="text-slate-400 text-sm font-wedding-body mb-4">Get a detailed breakdown of costs based on your guest count.</p>
                 <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">Start Calc <ArrowRight size={12} /></span>
               </button>

               {/* Tool 2: Timeline */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("Can you help me draft a day-of timeline for a wedding starting at 4pm?")}
                 className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-rose-400/50 transition-all group text-left ai-agent-trigger"
               >
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                 </div>
                 <h3 className="text-xl font-wedding-heading mb-2">Timeline Builder</h3>
                 <p className="text-slate-400 text-sm font-wedding-body mb-4">Draft a perfect run-of-show for your big day in seconds.</p>
                 <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">Build Now <ArrowRight size={12} /></span>
               </button>

               {/* Tool 3: Venue Scout */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("I'm looking for a venue. Can you suggest some types based on my guest count?")}
                 className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-rose-400/50 transition-all group text-left ai-agent-trigger"
               >
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                 </div>
                 <h3 className="text-xl font-wedding-heading mb-2">Venue Scout</h3>
                 <p className="text-slate-400 text-sm font-wedding-body mb-4">Find the perfect location style that fits your vision.</p>
                 <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">Find Venue <ArrowRight size={12} /></span>
               </button>

               {/* Tool 4: Guest List */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("I'm stressed about my guest list. How do I decide who to invite?")}
                 className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-xl hover:bg-white/10 hover:border-rose-400/50 transition-all group text-left ai-agent-trigger"
               >
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                 </div>
                 <h3 className="text-xl font-wedding-heading mb-2">Guest List Guru</h3>
                 <p className="text-slate-400 text-sm font-wedding-body mb-4">Etiquette advice on who to invite (and who to skip).</p>
                 <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">Get Advice <ArrowRight size={12} /></span>
               </button>
            </div>
         </div>
      </section>

      {/* Services */}
      <section className="py-24 px-6 bg-[#FDFCF8]">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
               <span className="text-rose-400 font-wedding-body font-bold uppercase tracking-widest text-xs">Our Expertise</span>
               <h2 className="text-4xl md:text-5xl font-wedding-heading mt-2 text-slate-800">Curated Packages</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {weddingServices?.map((service, idx) => (
                  <div key={service.id} className={`p-8 rounded-2xl transition-all duration-300 group ${idx === 1 ? 'bg-slate-900 text-white shadow-2xl scale-105 z-10' : 'bg-white border border-slate-100 shadow-lg text-slate-800'}`}>
                     <h3 className={`text-2xl font-wedding-heading mb-2 ${idx === 1 ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
                     <p className={`font-bold font-wedding-body mb-6 text-xl ${idx === 1 ? 'text-rose-400' : 'text-rose-500'}`}>{service.price}</p>
                     <p className={`font-wedding-body leading-relaxed mb-8 text-sm ${idx === 1 ? 'text-slate-300' : 'text-slate-600'}`}>{service.description}</p>
                     
                     <div className="w-full h-[1px] bg-current opacity-10 mb-8"></div>
                     
                     <ul className="space-y-4 mb-10">
                        {service.features.split('\n').map((f, i) => (
                           <li key={i} className={`flex gap-3 text-sm font-wedding-body ${idx === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                              <Sparkles size={16} className={`${idx === 1 ? 'text-rose-400' : 'text-rose-300'} shrink-0 mt-0.5`} />
                              <span>{f.replace(/^•\s*/, '')}</span>
                           </li>
                        ))}
                     </ul>
                     <button 
                        onClick={() => onOpenAgent && onOpenAgent(`I'm interested in the ${service.title} package. Can we discuss what's included?`)}
                        className={`w-full py-4 font-wedding-body uppercase text-xs tracking-widest font-bold rounded transition-colors ai-agent-trigger ${idx === 1 ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900'}`}
                     >
                        Inquire Details
                     </button>
                  </div>
               ))}
               {!weddingServices?.length && <p className="col-span-3 text-center text-slate-400 italic">No packages listed yet.</p>}
            </div>
         </div>
      </section>

      {/* Gallery (Masonry) */}
      <section className="py-24 px-4 bg-white">
         <div className="max-w-[1400px] mx-auto">
             <div className="flex justify-between items-end mb-12 px-4">
                <h2 className="text-4xl md:text-5xl font-wedding-heading text-slate-800">Real Weddings</h2>
                <button onClick={() => onOpenAgent && onOpenAgent("Show me more photos from your portfolio.")} className="hidden md:flex items-center gap-2 text-rose-500 font-wedding-body uppercase tracking-widest text-xs font-bold hover:text-slate-900 transition-colors ai-agent-trigger">
                   View Portfolio <ArrowRight size={14} />
                </button>
             </div>
             <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {weddingGallery?.map(item => (
                   <div key={item.id} className="break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer">
                      <img src={item.image} alt={item.tag} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                         <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                             <span className="text-xs uppercase tracking-widest font-wedding-body font-bold text-slate-900">{item.tag}</span>
                         </div>
                      </div>
                   </div>
                ))}
                {!weddingGallery?.length && <p className="text-center text-slate-400 italic">Gallery empty.</p>}
             </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#FDFCF8] text-center border-t border-slate-100">
         <div className="max-w-4xl mx-auto">
            <Heart size={32} className="mx-auto text-rose-300 mb-8" />
            <h2 className="text-3xl font-wedding-heading mb-12">Love Letters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {testimonials?.map(t => (
                  <div key={t.id} className="px-6 py-8 bg-white shadow-sm rounded-xl border border-slate-50">
                     <div className="flex justify-center gap-1 text-rose-300 mb-6">
                        {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" />)}
                     </div>
                     <p className="font-wedding-heading text-xl italic text-slate-700 mb-6 leading-relaxed">"{t.text}"</p>
                     <p className="font-wedding-body text-xs font-bold uppercase tracking-widest text-slate-400">— {t.client}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-slate-900 text-white text-center ai-agent-section">
         <div className="max-w-xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-wedding-heading mb-6">Save Your Date</h2>
            <p className="text-slate-400 mb-10 font-wedding-body text-lg">
              Our calendar fills up 12-18 months in advance. Chat with Bella now to check availability for your preferred season.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("I'd like to check your availability for my wedding date.")}
                 className="px-10 py-4 bg-rose-500 text-white font-wedding-body font-bold uppercase tracking-widest text-xs hover:bg-rose-600 transition-all rounded shadow-lg shadow-rose-900/20 ai-agent-trigger"
               >
                 Check Availability
               </button>
               {personalInfo.email && (
                  <a href={`mailto:${personalInfo.email}`} className="px-10 py-4 bg-transparent border border-white/20 text-white font-wedding-body font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all rounded">
                     Email Directly
                  </a>
               )}
            </div>
         </div>
      </section>
    </div>
  );

  const renderFinanceWeb = () => (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 font-serif selection:bg-amber-600 selection:text-white">
      {/* ... (Existing Finance Renderer) ... */}
      {/* Top Ticker Tape (Simulated) */}
      <div className="bg-slate-950 py-2 border-b border-slate-800 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[scroll_20s_linear_infinite] text-xs font-mono text-emerald-400">
           {skills.map(s => <span key={s.id} className="mx-4">{s.name.toUpperCase()} <span className="text-slate-500">▲</span></span>)}
           {portfolio?.map(p => <span key={p.id} className="mx-4">{p.name.toUpperCase()} <span className="text-slate-500">▲</span></span>)}
           <span className="mx-4">S&P 500 <span className="text-emerald-400">+1.2%</span></span>
           <span className="mx-4">NASDAQ <span className="text-emerald-400">+0.8%</span></span>
        </div>
      </div>

      <header className="px-6 py-20 md:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
           <div className="inline-block border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-500 text-xs tracking-widest uppercase font-sans rounded">
             {personalInfo.jobTitle}
           </div>
           <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
             Managing Capital for <span className="text-amber-500">Generational Wealth</span>
           </h1>
           <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-sans">
             {personalInfo.summary}
           </p>
           <div className="flex flex-wrap gap-4 pt-4">
             <button 
                onClick={() => onOpenAgent && onOpenAgent("I am interested in scheduling a consultation to discuss my investment portfolio.")} 
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-sans font-bold tracking-wide transition-colors rounded shadow-lg shadow-amber-900/20 ai-agent-trigger"
             >
               Consult with James
             </button>
             {personalInfo.email && (
               <a href={`mailto:${personalInfo.email}`} className="px-8 py-4 border border-slate-700 hover:border-white text-slate-300 hover:text-white font-sans font-medium transition-all rounded">
                 Contact Office
               </a>
             )}
           </div>
        </div>
        <div className="relative">
           {personalInfo.photo && (
             <div className="relative z-10">
               <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-indigo-900 rounded-lg blur opacity-30 transform translate-x-4 translate-y-4"></div>
               <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full md:w-[80%] ml-auto rounded-lg shadow-2xl border border-slate-800 filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700" />
             </div>
           )}
           {/* Stats Overlay */}
           <div className="absolute -bottom-8 -left-8 bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl z-20 max-w-xs hidden md:block">
              <div className="flex items-center gap-3 mb-2 text-emerald-400">
                <TrendingUp size={24} />
                <span className="text-2xl font-bold font-sans">24.5%</span>
              </div>
              <p className="text-sm text-slate-400 font-sans">Average Annual IRR across managed portfolios over the last decade.</p>
           </div>
        </div>
      </header>

      {/* Portfolio Grid */}
      <section className="bg-slate-950 py-24 px-6 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-16">
             <div>
               <h2 className="text-amber-500 text-sm font-sans uppercase tracking-widest mb-2">Assets Under Management</h2>
               <h3 className="text-4xl font-bold text-white">Investment Portfolio</h3>
             </div>
             <div className="hidden md:block w-32 h-[1px] bg-slate-800"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {portfolio?.map(item => (
                 <div key={item.id} className="group bg-slate-900 border border-slate-800 p-8 hover:border-amber-500/50 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-6">
                       <div className="p-3 bg-slate-800 rounded text-slate-300 group-hover:text-amber-500 transition-colors">
                         <PieChart size={24} />
                       </div>
                       <span className="font-mono text-emerald-400 text-sm">{item.value}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{item.name}</h4>
                    <p className="text-slate-500 text-sm font-sans uppercase tracking-wider mb-4">{item.sector}</p>
                    <p className="text-slate-400 font-sans leading-relaxed text-sm border-t border-slate-800 pt-4">
                      {item.description}
                    </p>
                 </div>
              ))}
              {!portfolio?.length && (
                 <div className="col-span-full py-12 text-center text-slate-600 border border-dashed border-slate-800 rounded">
                    Add investments in the editor to populate this section.
                 </div>
              )}
           </div>
        </div>
      </section>

      {/* Ask James: Strategic Insights (Lead Gen Section) */}
      <section className="bg-slate-900 py-24 px-6 border-t border-slate-800 relative overflow-hidden ai-agent-section">
         <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full blur-[100px]"></div>
         
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-amber-500 font-bold uppercase tracking-widest text-sm mb-3">AI Investment Analyst</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white">Ask James: Strategic Insights</h3>
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-sans">
                Select a topic below to initiate a confidential discussion with my AI analyst regarding your financial objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Card 1: Wealth Preservation */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("How do you approach wealth preservation in volatile markets?")}
                 className="bg-slate-800 p-8 border border-slate-700 hover:border-amber-500 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 group"
               >
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-amber-500 mb-6 group-hover:text-white transition-colors">
                     <Shield size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Risk Management</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">"How do you protect capital during periods of high volatility?"</p>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-2 font-sans">Start Discussion <ArrowRight size={14} /></span>
               </button>

               {/* Card 2: Retirement Planning */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("Can you review my current asset allocation for retirement?")}
                 className="bg-slate-800 p-8 border border-slate-700 hover:border-amber-500 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 group"
               >
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-amber-500 mb-6 group-hover:text-white transition-colors">
                     <Landmark size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Retirement Strategy</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">"Is my current asset allocation optimized for my retirement timeline?"</p>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-2 font-sans">Start Discussion <ArrowRight size={14} /></span>
               </button>

               {/* Card 3: Tax Efficiency */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("What strategies do you use for tax-efficient wealth transfer?")}
                 className="bg-slate-800 p-8 border border-slate-700 hover:border-amber-500 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 group"
               >
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-amber-500 mb-6 group-hover:text-white transition-colors">
                     <Scale size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Tax Efficiency</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">"Strategies for tax-efficient investing and intergenerational wealth transfer."</p>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-2 font-sans">Start Discussion <ArrowRight size={14} /></span>
               </button>

               {/* Card 4: Alternative Investments */}
               <button 
                 onClick={() => onOpenAgent && onOpenAgent("What is your approach to alternative investments like Private Equity?")}
                 className="bg-slate-800 p-8 border border-slate-700 hover:border-amber-500 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/10 group"
               >
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center text-amber-500 mb-6 group-hover:text-white transition-colors">
                     <LineChart size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Alternative Assets</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 font-sans">"Approach to Private Equity, Venture Capital, and Real Estate holdings."</p>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-2 font-sans">Start Discussion <ArrowRight size={14} /></span>
               </button>
            </div>
         </div>
      </section>

      {/* Experience List */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold text-white mb-12 border-l-4 border-amber-500 pl-4">Career Trajectory</h2>
         <div className="space-y-12">
            {experience.map(job => (
               <div key={job.id} className="relative pl-8 md:pl-0">
                  <div className="hidden md:block absolute left-[-9px] top-2 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500 z-10"></div>
                  <div className="hidden md:block absolute left-[-1px] top-6 bottom-[-48px] w-[2px] bg-slate-800"></div>
                  
                  <div className="md:grid md:grid-cols-4 md:gap-8">
                     <div className="md:text-right">
                        <p className="text-amber-500 font-mono text-sm">{job.startDate} — {job.current ? 'Present' : job.endDate}</p>
                     </div>
                     <div className="md:col-span-3">
                        <h3 className="text-xl font-bold text-white">{job.position}</h3>
                        <p className="text-slate-400 mb-4">{job.company}</p>
                        <p className="text-slate-400 font-sans text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Finance CTA Footer */}
      <section className="ai-agent-section bg-amber-600 py-16 text-center px-6">
         <h2 className="text-3xl font-bold text-white mb-6">Investment Inquiry</h2>
         <p className="text-amber-100 max-w-2xl mx-auto mb-8 font-sans">
           For accredited investors seeking detailed prospectuses or to discuss potential partnerships, my AI analyst is available to provide preliminary information.
         </p>
         <button onClick={() => onOpenAgent && onOpenAgent("I would like to discuss partnership opportunities.")} className="bg-slate-900 text-white px-8 py-3 rounded font-sans font-bold hover:bg-slate-800 transition-colors ai-agent-trigger">
           Speak with James (AI Analyst)
         </button>
      </section>
    </div>
  );

  const renderRealtorWeb = () => (
    <div className="w-full min-h-full bg-slate-900 text-white font-sans selection:bg-amber-400 selection:text-slate-900">
       <style>{`
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
       `}</style>
       
       {/* Hero Section */}
       <header className="relative min-h-[90vh] flex flex-col justify-center items-center text-center p-6 overflow-hidden">
          {/* Background Image (Luxury Home) */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
               alt="Luxury Home" 
               className="w-full h-full object-cover animate-in fade-in duration-1000 scale-105"
             />
          </div>

          <div className="relative z-20 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
             {personalInfo.photo && (
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.fullName} 
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-amber-400 mx-auto mb-8 shadow-2xl object-cover" 
                />
             )}
             <p className="text-amber-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base">{personalInfo.jobTitle}</p>
             <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white">{personalInfo.fullName}</h1>
             <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed">
               {personalInfo.summary}
             </p>
             <div className="flex flex-col md:flex-row justify-center gap-4">
               <button onClick={() => onOpenAgent && onOpenAgent("I'd like to schedule a viewing.")} className="px-8 py-4 bg-amber-400 text-slate-900 rounded-full font-bold uppercase tracking-wider hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] ai-agent-trigger">
                 Schedule Viewing
               </button>
               {personalInfo.phone && (
                 <a href={`tel:${personalInfo.phone}`} className="px-8 py-4 border border-white text-white rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-slate-900 transition-all">
                   Call Now
                 </a>
               )}
             </div>
          </div>
       </header>

       {/* Google Maps Neighborhood Search Section */}
       <section className="relative py-20 px-6 bg-slate-800 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                alt="Map Background" 
                className="w-full h-full object-cover grayscale"
             />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
             <h2 className="text-3xl font-serif font-bold mb-2">Explore the Neighborhood</h2>
             <p className="text-slate-400 mb-8">Discover schools, parks, and amenities in your dream location.</p>
             
             <form onSubmit={handleMapSearch} className="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-lg shadow-xl">
                <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-md">
                   <MapPin className="text-slate-400 mr-2" size={20} />
                   <input 
                      name="location"
                      type="text" 
                      placeholder="Enter Zip Code, City, or Neighborhood..." 
                      className="w-full py-3 bg-transparent outline-none text-slate-900 placeholder:text-slate-500"
                      required
                   />
                </div>
                <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2">
                   <Search size={20} /> Search Map
                </button>
             </form>
          </div>
       </section>

       {/* Listings Section */}
       <section className="py-24 px-6 md:px-12 bg-slate-50 text-slate-900">
         <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">Exclusive Portfolio</h2>
             <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Featured Listings</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {listings?.map(listing => (
                 <div key={listing.id} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                    <div className="relative h-64 overflow-hidden">
                       <img 
                         src={listing.image || 'https://via.placeholder.com/600x400?text=Luxury+Home'} 
                         alt={listing.address} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                       <div className="absolute top-4 right-4 px-4 py-1 bg-slate-900/80 text-white text-xs font-bold uppercase tracking-wider rounded backdrop-blur-sm">
                         {listing.status}
                       </div>
                       <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900/90 to-transparent">
                          <p className="text-white font-bold text-xl">{listing.price}</p>
                       </div>
                    </div>
                    <div className="p-6">
                       <h4 className="text-lg font-bold text-slate-900 mb-2 truncate">{listing.address}</h4>
                       <div className="flex items-center gap-4 text-slate-500 text-sm mb-4 border-b border-slate-100 pb-4">
                          <span className="flex items-center gap-1"><Bed size={16} /> {listing.specs.split('|')[0] || '-'}</span>
                          <span className="flex items-center gap-1"><Bath size={16} /> {listing.specs.split('|')[1] || '-'}</span>
                          <span className="flex items-center gap-1"><Move size={16} /> {listing.specs.split('|')[2] || '-'}</span>
                       </div>
                       <p className="text-slate-600 text-sm mb-6 line-clamp-3">{listing.description}</p>
                       <button onClick={() => onOpenAgent && onOpenAgent(`I have a question about the listing at ${listing.address}.`)} className="w-full py-3 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-900 hover:text-white transition-colors ai-agent-trigger">
                          Inquire with Sarah
                       </button>
                    </div>
                 </div>
              ))}
              {!listings?.length && (
                <div className="col-span-full text-center py-20 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
                  <Home size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No listings added yet. Use the Editor to add your properties.</p>
                </div>
              )}
           </div>
         </div>
       </section>
       
       {/* Ask Sarah: Common Questions Section (CTA Upgrade) */}
       <section className="bg-slate-900 py-24 px-6 border-t border-slate-800 relative overflow-hidden ai-agent-section">
          {/* Subtle decoration */}
          <div className="absolute -left-20 top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
             <div className="text-center mb-16">
               <h2 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-3">AI Real Estate Assistant</h2>
               <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Ask Sarah: Instant Answers</h3>
               <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Click any question below to instantly start a conversation with my AI assistant about your specific needs.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Selling */}
                <button 
                  onClick={() => onOpenAgent && onOpenAgent("I'm thinking of selling. What is my home worth in today's market?")}
                  className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-400 text-left transition-all hover:-translate-y-1 hover:shadow-lg group"
                >
                   <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                      <DollarSign size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">Sell My Home</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-4">"What is my property worth in the current market?"</p>
                   <span className="text-amber-400 text-sm font-bold flex items-center gap-2">Ask Now <ArrowRight size={14} /></span>
                </button>

                {/* Card 2: Buying */}
                <button 
                  onClick={() => onOpenAgent && onOpenAgent("I'm looking to buy a home. How can you help me find the right property?")}
                  className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-400 text-left transition-all hover:-translate-y-1 hover:shadow-lg group"
                >
                   <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                      <Home size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">Buy a Home</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-4">"Help me find a luxury property that fits your criteria."</p>
                   <span className="text-amber-400 text-sm font-bold flex items-center gap-2">Ask Now <ArrowRight size={14} /></span>
                </button>

                {/* Card 3: Marketing Strategy */}
                <button 
                  onClick={() => onOpenAgent && onOpenAgent("What is your marketing strategy for luxury listings?")}
                  className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-400 text-left transition-all hover:-translate-y-1 hover:shadow-lg group"
                >
                   <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                      <PieChart size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">Marketing Plan</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-4">"How will you ensure my property gets maximum exposure?"</p>
                   <span className="text-amber-400 text-sm font-bold flex items-center gap-2">Ask Now <ArrowRight size={14} /></span>
                </button>

                {/* Card 4: Why Us */}
                <button 
                  onClick={() => onOpenAgent && onOpenAgent("Why should I choose you as my real estate agent?")}
                  className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-amber-400 text-left transition-all hover:-translate-y-1 hover:shadow-lg group"
                >
                   <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                      <Star size={24} />
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">Why Choose Me?</h4>
                   <p className="text-slate-400 text-sm leading-relaxed mb-4">"What sets your agency apart from the competition?"</p>
                   <span className="text-amber-400 text-sm font-bold flex items-center gap-2">Ask Now <ArrowRight size={14} /></span>
                </button>
             </div>
          </div>
       </section>

       {/* Stats & Services (Mapped from Skills) */}
       <section className="py-20 bg-slate-950 text-white border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">20+</h4>
                <p className="text-slate-400 uppercase tracking-widest text-sm">Years Experience</p>
             </div>
             <div className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">$200M</h4>
                <p className="text-slate-400 uppercase tracking-widest text-sm">Volume Sold</p>
             </div>
             <div className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">500+</h4>
                <p className="text-slate-400 uppercase tracking-widest text-sm">Happy Clients</p>
             </div>
             <div className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">#1</h4>
                <p className="text-slate-400 uppercase tracking-widest text-sm">Agency Award</p>
             </div>
          </div>
       </section>

       {/* Testimonials */}
       <section className="py-24 px-6 md:px-12 bg-white text-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-5xl mx-auto relative z-10">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-16">What My Clients Say</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials?.map(t => (
                   <div key={t.id} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative">
                      <div className="text-amber-400 flex gap-1 mb-4">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                      </div>
                      <p className="text-slate-700 italic text-lg mb-6">"{t.text}"</p>
                      <p className="font-bold text-slate-900">— {t.client}</p>
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* CTA Section */}
       <section className="py-20 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to find your dream home?</h2>
             <p className="text-lg text-slate-300 mb-10">My AI Assistant, Sarah, can answer questions about any listing or book a private tour immediately.</p>
             <button 
                onClick={() => onOpenAgent && onOpenAgent()}
                className="inline-flex items-center gap-3 px-10 py-5 bg-amber-400 text-slate-900 rounded-full font-bold text-lg hover:bg-amber-300 transition-all shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:scale-105 ai-agent-trigger"
             >
                <span>Chat with Sarah</span>
                <MessageSquare size={20} />
             </button>
          </div>
       </section>
       
       <footer className="bg-slate-950 text-slate-500 py-12 px-6 text-center text-sm border-t border-slate-900">
         <p>© {new Date().getFullYear()} {personalInfo.fullName} Real Estate. All rights reserved.</p>
       </footer>
    </div>
  );

  const renderModernWeb = () => (
    <div className="w-full min-h-full bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden">
      {/* ... (Existing Modern Renderer content remains exactly the same as in previous file, just re-declaring for context) ... */}
       <style>{`
         .scrollbar-hide::-webkit-scrollbar { display: none; }
         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
         .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
       `}</style>
       {/* ... keeping exact implementation ... */}
       {/* (For brevity in this response, assume existing Modern implementation here) */}
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-indigo-50 via-white to-violet-50 -z-10"></div>
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -z-10"></div>
       <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[100px] -z-10"></div>

       {/* Hero Section */}
       <header className="relative pt-20 pb-12 px-6 md:px-20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-10 md:gap-16">
            {/* Photo */}
            {personalInfo.photo && (
              <div className="shrink-0 relative group">
                {/* Pulsing Glow Effect */}
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl animate-pulse group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
                
                <img 
                  src={personalInfo.photo} 
                  alt={personalInfo.fullName} 
                  className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-2xl border-4 border-white ring-1 ring-slate-100 z-10 transition-transform duration-500 group-hover:scale-[1.02]" 
                />
              </div>
            )}

            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 mb-6 tracking-tight leading-tight">
                {personalInfo.fullName}
              </h1>
              <p className="text-2xl md:text-3xl text-indigo-600 font-medium mb-8 inline-block border-b-2 border-indigo-100 pb-2">
                {personalInfo.jobTitle}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button 
                  onClick={() => onOpenAgent && onOpenAgent()}
                  className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2 ai-agent-trigger"
                >
                  <Calendar size={16} /> Book Appointment
                </button>
                {personalInfo.email && (
                  <a href={`mailto:${personalInfo.email}`} className="px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    Contact via Email
                  </a>
                )}
              </div>
            </div>
         </div>
       </header>

       <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 space-y-24">
          {/* About */}
          {personalInfo.summary && (
             <section className="max-w-5xl mx-auto">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 md:p-12 shadow-lg shadow-slate-200/40 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-violet-500"></div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-indigo-500"></span> About Me
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-slate-800 font-normal text-pretty opacity-90">
                        {personalInfo.summary}
                    </p>
                </div>
             </section>
          )}

          {/* Experience Slideshow */}
          <section className="relative group">
             <div className="flex justify-between items-center mb-8 px-2">
                <h2 className="text-3xl font-bold text-slate-900">Work Experience</h2>
                <div className="flex gap-3">
                  <button 
                    onClick={() => scrollExperience('left')}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-md transition-all active:scale-95"
                    aria-label="Previous experience"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => scrollExperience('right')}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-md transition-all active:scale-95"
                    aria-label="Next experience"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
             </div>
             
             {/* Carousel Container */}
             <div 
                ref={experienceScrollRef}
                className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory -mx-6 px-6 md:px-2 scrollbar-hide"
             >
                {experience.map(job => (
                   <div 
                      key={job.id} 
                      className="flex-none w-[85vw] md:w-[400px] lg:w-[32%] h-[480px] snap-center relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col"
                   >
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-3xl"></div>
                      
                      <div className="shrink-0 mb-4">
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide rounded-full mb-4">
                          {job.startDate} — {job.current ? 'Present' : job.endDate}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-tight line-clamp-2" title={job.position}>{job.position}</h3>
                        <p className="text-lg text-slate-500 font-medium truncate" title={job.company}>{job.company}</p>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        <p className="text-slate-600 text-sm leading-7 whitespace-pre-line border-t border-slate-100 pt-4">
                          {job.description}
                        </p>
                      </div>
                   </div>
                ))}
                {/* Spacer for end of scroll */}
                <div className="w-6 shrink-0 md:hidden"></div>
             </div>
             
             {/* Fade overlay on right for scroll hint */}
             <div className="absolute right-0 top-0 bottom-6 w-24 bg-gradient-to-l from-slate-50/80 to-transparent pointer-events-none md:block hidden"></div>
          </section>

          {/* Bottom Grid: Skills & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Skills */}
            <section>
               <h2 className="text-2xl font-bold text-slate-900 mb-8">Expertise & Skills</h2>
               <div className="flex flex-wrap gap-3">
                  {skills.map(skill => (
                     <div key={skill.id} className="group px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium shadow-sm hover:border-indigo-500 hover:text-indigo-600 transition-all cursor-default">
                        {skill.name}
                     </div>
                  ))}
               </div>
            </section>

            {/* Education */}
            <section className="bg-slate-900 text-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
               <h2 className="text-2xl font-bold mb-8 relative z-10">Education</h2>
               <div className="space-y-8 relative z-10">
                  {education.map(edu => (
                     <div key={edu.id} className="relative pl-8 border-l-2 border-slate-700 hover:border-indigo-500 transition-colors">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-indigo-500"></div>
                        <h3 className="text-xl font-bold">{edu.school}</h3>
                        <p className="text-indigo-300 font-medium mb-1">{edu.degree}, {edu.field}</p>
                        <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                     </div>
                  ))}
               </div>
            </section>
          </div>

          {/* AI Assistant CTA Section - Modern Theme */}
          <section className="ai-agent-section bg-gradient-to-br from-indigo-900 to-violet-900 rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
             
             <div className="relative z-10 max-w-2xl mx-auto space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-indigo-100 text-sm font-medium border border-white/10">
                  <Sparkles size={14} className="text-yellow-300" />
                  <span>Available for Strategic Advisory</span>
               </div>
               
               <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Let's discuss how I can help your organization grow.
               </h2>
               
               <p className="text-lg text-indigo-100 leading-relaxed">
                  My AI Executive Assistant, Sarah, is available 24/7 to answer your questions, discuss board appointments, or schedule a strategic consultation.
               </p>
               
               <button 
                  onClick={() => onOpenAgent && onOpenAgent()}
                  className="ai-agent-trigger group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
               >
                  <span>Chat with Sarah</span>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                     <MessageSquare size={16} className="text-indigo-600" />
                  </div>
               </button>
             </div>
          </section>

       </main>

       <footer className="bg-white border-t border-slate-200 py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Connect</h2>
            <div className="flex justify-center gap-8 mb-8">
               {socials.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                     {s.platform === 'GitHub' ? <Github size={20} /> : s.platform === 'LinkedIn' ? <Linkedin size={20} /> : <Globe size={20} />}
                  </a>
               ))}
               {personalInfo.email && (
                 <a href={`mailto:${personalInfo.email}`} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                   <Mail size={20} />
                 </a>
               )}
            </div>
            <p className="text-slate-500">© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
          </div>
       </footer>
    </div>
  );

  const renderMinimalistWeb = () => (
    <div className="w-full min-h-full bg-[#FDFBF7] text-slate-900 font-serif">
      {/* ... (Minimalist Renderer same as before) ... */}
       <div className="max-w-3xl mx-auto px-8 py-24">
          <header className="text-center mb-24 animate-in fade-in duration-1000">
             {personalInfo.photo && (
               <div className="relative inline-block mb-8 group">
                 {/* Subtle ripple effect on hover */}
                 <div className="absolute inset-0 rounded-full bg-slate-300/30 animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
                 <img 
                   src={personalInfo.photo} 
                   alt={personalInfo.fullName} 
                   className="relative w-24 h-24 rounded-full object-cover mx-auto grayscale hover:grayscale-0 transition-all duration-700 shadow-sm z-10" 
                 />
               </div>
             )}
             <p className="text-sm font-sans uppercase tracking-[0.3em] text-slate-500 mb-4">{personalInfo.jobTitle}</p>
             <h1 className="text-6xl md:text-8xl font-normal tracking-tight mb-8">{personalInfo.fullName}</h1>
             <div className="flex justify-center gap-6 text-sm font-sans text-slate-500">
                {personalInfo.location && <span>{personalInfo.location}</span>}
                <button onClick={() => onOpenAgent && onOpenAgent()} className="hover:underline text-indigo-600 font-medium ai-agent-trigger">Book Appointment</button>
             </div>
          </header>

          <main className="space-y-24">
             {personalInfo.summary && (
                <section className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                   <p className="text-xl md:text-2xl leading-relaxed text-slate-800 font-light">{personalInfo.summary}</p>
                </section>
             )}

             <section className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] border-b border-slate-300 pb-4 mb-12">Experience</h2>
                <div className="space-y-16">
                   {experience.map(job => (
                      <div key={job.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <div className="text-sm font-sans text-slate-500 mt-1">
                            {job.startDate} — {job.current ? 'Present' : job.endDate}
                         </div>
                         <div className="col-span-3">
                            <h3 className="text-2xl font-normal mb-1">{job.position}</h3>
                            <p className="text-lg text-slate-600 italic mb-4">{job.company}</p>
                            <p className="text-slate-700 leading-7 font-sans text-sm whitespace-pre-line">{job.description}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             <section className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                <div>
                   <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] border-b border-slate-300 pb-4 mb-8">Education</h2>
                   {education.map(edu => (
                      <div key={edu.id} className="mb-6">
                         <h3 className="text-lg font-bold">{edu.school}</h3>
                         <p className="text-slate-600 mb-1">{edu.degree}</p>
                         <p className="text-xs font-sans text-slate-400 uppercase">{edu.startDate} - {edu.endDate}</p>
                      </div>
                   ))}
                </div>
                <div>
                   <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] border-b border-slate-300 pb-4 mb-8">Skills</h2>
                   <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {skills.map(s => (
                         <div key={s.id} className="flex items-center gap-2 font-sans text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span> {s.name}
                         </div>
                      ))}
                   </div>
                </div>
             </section>

             {/* Minimalist CTA */}
             <section className="ai-agent-section border-t border-slate-300 pt-16 text-center space-y-6">
                <p className="text-slate-500 font-sans italic">Interested in collaborating?</p>
                <button 
                  onClick={() => onOpenAgent && onOpenAgent()}
                  className="ai-agent-trigger px-8 py-3 border border-slate-800 rounded-full text-slate-900 font-sans text-sm hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
                >
                  Speak with Sarah (AI Assistant)
                </button>
             </section>
          </main>

          <footer className="mt-24 pt-12 border-t border-slate-200 text-center font-sans text-slate-400 text-sm">
             <p>Designed with CareerForge AI</p>
          </footer>
       </div>
    </div>
  );

  const renderCreativeWeb = () => (
    <div className="w-full min-h-full bg-slate-950 text-slate-200 font-sans selection:bg-teal-500 selection:text-white">
      {/* ... (Creative Renderer same as before) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full">
        
        {/* Fixed Sidebar for Desktop */}
        <div className="lg:col-span-4 xl:col-span-3 bg-slate-900 p-8 lg:p-12 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between border-r border-slate-800">
          <div>
            {personalInfo.photo ? (
               <div className="relative inline-block mb-8 group">
                  {/* Neon Glow Pulse */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-60 animate-pulse transition-opacity duration-500"></div>
                  <img 
                    src={personalInfo.photo} 
                    alt={personalInfo.fullName} 
                    className="relative w-32 h-32 rounded-xl object-cover border-2 border-slate-800 shadow-xl z-10 group-hover:border-teal-500/50 transition-colors duration-500" 
                  />
               </div>
            ) : (
               <div className="w-20 h-1 bg-teal-500 mb-8"></div>
            )}
            
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{personalInfo.fullName}</h1>
            <p className="text-xl text-teal-400 font-medium mb-8">{personalInfo.jobTitle}</p>
            <p className="text-slate-400 leading-relaxed mb-8">{personalInfo.summary}</p>
            
            <nav className="hidden lg:flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-slate-500 mb-12">
               <a href="#experience" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-teal-500 transition-colors"></span> Experience
               </a>
               <a href="#skills" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-teal-500 transition-colors"></span> Skills
               </a>
               <a href="#education" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-8 h-[1px] bg-slate-700 group-hover:bg-teal-500 transition-colors"></span> Education
               </a>
            </nav>

            {/* Creative AI Card */}
            <div 
               onClick={() => onOpenAgent && onOpenAgent()}
               className="bg-slate-800/50 p-4 rounded-lg border border-teal-500/30 cursor-pointer hover:bg-slate-800 hover:border-teal-400 transition-all group ai-agent-trigger"
            >
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">AI Interface Online</span>
               </div>
               <p className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  "I'm Sarah. Click here to book an appointment or discuss advisory roles."
               </p>
            </div>
          </div>

          <div className="flex gap-4 mt-12 lg:mt-0">
             {socials.map(s => (
                <a key={s.id} href={s.url} className="text-slate-400 hover:text-teal-400 transition-colors">
                   {s.platform === 'GitHub' ? <Github size={20} /> : s.platform === 'LinkedIn' ? <Linkedin size={20} /> : <Globe size={20} />}
                </a>
             ))}
             {personalInfo.email && (
               <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-teal-400 transition-colors"><Mail size={20} /></a>
             )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="lg:col-span-8 xl:col-span-9 p-8 lg:p-20 space-y-24">
           
           <section id="experience">
              <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4 lg:hidden">
                <span className="w-8 h-[1px] bg-teal-500"></span> Experience
              </h2>
              <div className="space-y-12">
                 {experience.map(job => (
                    <div key={job.id} className="group relative grid grid-cols-1 md:grid-cols-8 gap-4 transition-all hover:bg-slate-900/50 p-6 -mx-6 rounded-xl border border-transparent hover:border-slate-800">
                       <div className="md:col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                          {job.startDate} — {job.current ? 'Present' : job.endDate}
                       </div>
                       <div className="md:col-span-6">
                          <h3 className="text-xl font-bold text-slate-100 group-hover:text-teal-400 transition-colors flex items-center gap-2">
                            {job.position} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </h3>
                          <p className="text-slate-400 font-medium mb-3">{job.company}</p>
                          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section id="skills">
             <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4 lg:hidden">
                <span className="w-8 h-[1px] bg-teal-500"></span> Skills
              </h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map(skill => (
                   <div key={skill.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-center hover:border-teal-500/50 transition-colors">
                      <span className="text-teal-400 font-medium">{skill.name}</span>
                   </div>
                ))}
             </div>
           </section>

           <section id="education" className="pb-20">
             <h2 className="text-2xl font-bold text-white mb-10 flex items-center gap-4 lg:hidden">
                <span className="w-8 h-[1px] bg-teal-500"></span> Education
              </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map(edu => (
                   <div key={edu.id} className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                      <h3 className="text-lg font-bold text-white">{edu.school}</h3>
                      <p className="text-teal-400 text-sm mb-2">{edu.degree}, {edu.field}</p>
                      <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
                   </div>
                ))}
             </div>
           </section>

           <footer className="pt-10 border-t border-slate-900 text-slate-600 text-sm">
             <p>Built with React & Tailwind CSS. Inspired by the best portfolios on the web.</p>
           </footer>
        </div>
      </div>
    </div>
  );

  return (
    <div id="web-preview" className="w-full h-full">
      {theme === 'modern' && renderModernWeb()}
      {theme === 'minimalist' && renderMinimalistWeb()}
      {theme === 'creative' && renderCreativeWeb()}
      {theme === 'realtor' && renderRealtorWeb()}
      {theme === 'finance' && renderFinanceWeb()}
      {theme === 'wedding' && renderWeddingWeb()}
    </div>
  );
};

export default ResumePreview;