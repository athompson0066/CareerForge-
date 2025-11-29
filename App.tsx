import React, { useState, useEffect } from 'react';
import { ResumeData, ThemeType } from './types';
import { INITIAL_RESUME_DATA, THEMES } from './constants';
import ResumePreview from './components/ResumePreview';
import Editor from './components/Editor';
import AgentWidget from './components/AgentWidget';
import ExportModal from './components/ExportModal';
import { Wand2, Palette, Share2, PanelLeftClose, PanelLeftOpen, Monitor } from 'lucide-react';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [activeTheme, setActiveTheme] = useState<ThemeType>('modern');
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // For mobile
  const [showEditor, setShowEditor] = useState(true); // For desktop toggle
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [agentInitialMessage, setAgentInitialMessage] = useState('');
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    // Check for ?embed=true in URL to hide UI elements
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === 'true') {
      setIsEmbed(true);
      setShowEditor(false);
    }
  }, []);

  const handleOpenAgent = (message?: string) => {
    if (message) {
      setAgentInitialMessage(message);
    }
    setIsAgentOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col ${isEmbed ? 'h-screen overflow-hidden bg-white' : ''}`}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Navigation / Header - Hidden in Embed Mode */}
      {!isEmbed && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Wand2 size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CareerForge AI</span>
              <span className="hidden sm:inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">Web Portfolio Builder</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Tabs */}
              <div className="md:hidden flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                >
                  Edit
                </button>
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                >
                  Preview
                </button>
              </div>

              {/* Desktop Editor Toggle */}
              <button 
                onClick={() => setShowEditor(!showEditor)}
                className="hidden md:flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                title={showEditor ? "Hide Editor" : "Show Editor"}
              >
                {showEditor ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                <span className="hidden lg:inline">{showEditor ? "Hide Editor" : "Show Editor"}</span>
              </button>

              <button 
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Export / Publish</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 w-full mx-auto flex gap-8 overflow-hidden ${isEmbed ? 'p-0 h-full max-w-full' : 'max-w-7xl p-4 md:p-8 h-[calc(100vh-64px)]'}`}>
        
        {/* Editor Column - Hidden in Embed Mode */}
        {!isEmbed && (
          <div className={`w-full md:w-[450px] lg:w-[500px] flex-shrink-0 flex flex-col gap-6 transition-all duration-300 ${activeTab === 'preview' ? 'hidden' : 'flex'} ${showEditor ? 'md:flex' : 'md:hidden'} no-print overflow-y-auto pr-2 pb-20`}>
            
            {/* Theme Selector */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Palette size={16} className="text-indigo-500" />
                Select Layout
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`relative p-2 rounded-lg border-2 transition-all text-left group overflow-hidden ${activeTheme === theme.id ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-transparent hover:border-slate-300 bg-slate-50'}`}
                  >
                    <div className={`h-12 w-full rounded mb-2 ${theme.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    <span className={`text-xs font-medium block text-center ${activeTheme === theme.id ? 'text-indigo-700' : 'text-slate-600'}`}>{theme.name}</span>
                    {activeTheme === theme.id && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Editor data={resumeData} onChange={setResumeData} />
          </div>
        )}

        {/* Preview Column - Always Web View */}
        <div className={`flex-1 flex flex-col overflow-hidden relative transition-all duration-300 ${activeTab === 'editor' && !isEmbed ? 'hidden' : 'flex'} md:flex ${!isEmbed ? 'bg-slate-200/50 rounded-xl border border-slate-200 shadow-inner' : 'bg-white'}`}>
            {/* Browser Mockup Header - Hidden in Embed Mode */}
            {!isEmbed && (
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-500 flex items-center gap-2">
                  <Monitor size={12} className="text-slate-400"/>
                  <span className="truncate">{resumeData.personalInfo.website || 'your-portfolio.com'}</span>
                </div>
              </div>
            )}

            {/* Scrollable Web Preview */}
            <div className="flex-1 overflow-y-auto bg-white scroll-smooth relative scrollbar-hide">
               <ResumePreview 
                  data={resumeData} 
                  theme={activeTheme} 
                  onOpenAgent={handleOpenAgent}
                />
            </div>
        </div>
      </main>
      
      {/* AI Agent Widget */}
      <AgentWidget 
        resumeData={resumeData} 
        isOpen={isAgentOpen}
        onToggle={setIsAgentOpen}
        activeTheme={activeTheme}
        initialMessage={agentInitialMessage}
        onMessageConsumed={() => setAgentInitialMessage('')}
      />

      {/* Export Modal */}
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        data={resumeData} 
      />
    </div>
  );
};

export default App;