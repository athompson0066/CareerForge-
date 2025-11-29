import React, { useState } from 'react';
import { ResumeData, Experience, Education, Skill, SocialLink, Listing, Testimonial, PortfolioItem, WeddingService, WeddingGalleryItem } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2, Loader2, Sparkles, X, Home, Star, Briefcase, Heart, Link, ImageIcon } from 'lucide-react';
import * as geminiService from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContext, setAiContext] = useState<string>('');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const expSummary = data.experience.map(e => `${e.position} at ${e.company}`).join(', ');
    const skillsSummary = data.skills.map(s => s.name).join(', ');
    
    const summary = await geminiService.generateSummary(
      data.personalInfo.jobTitle,
      expSummary,
      skillsSummary
    );
    
    updatePersonalInfo('summary', summary);
    setIsGenerating(false);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const improveExperience = async (id: string, text: string) => {
    setAiContext(id);
    setIsGenerating(true);
    const improved = await geminiService.improveBulletPoint(text, data.personalInfo.jobTitle);
    updateExperience(id, 'description', improved);
    setIsGenerating(false);
    setAiContext('');
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({ ...data, experience: [newExp, ...data.experience] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const addSkill = () => {
    const newSkill: Skill = { id: Date.now().toString(), name: '', level: 3 };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
  };

  const suggestAISkills = async () => {
    setIsGenerating(true);
    const currentSkillNames = data.skills.map(s => s.name);
    const suggestions = await geminiService.suggestSkills(data.personalInfo.jobTitle, currentSkillNames);
    
    const newSkills = suggestions.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      level: 3
    }));

    onChange({ ...data, skills: [...data.skills, ...newSkills] });
    setIsGenerating(false);
  };

  // Realtor Specific Functions
  const addListing = () => {
    const newListing: Listing = {
      id: Date.now().toString(),
      address: '',
      price: '',
      specs: '',
      description: '',
      status: 'For Sale',
      image: ''
    };
    onChange({ ...data, listings: [...(data.listings || []), newListing] });
  };

  const updateListing = (id: string, field: keyof Listing, value: any) => {
    onChange({
      ...data,
      listings: data.listings?.map(l => l.id === id ? { ...l, [field]: value } : l)
    });
  };

  const removeListing = (id: string) => {
    onChange({ ...data, listings: data.listings?.filter(l => l.id !== id) });
  };

  const addTestimonial = () => {
    const newTest: Testimonial = {
      id: Date.now().toString(),
      client: '',
      text: '',
      rating: 5
    };
    onChange({ ...data, testimonials: [...(data.testimonials || []), newTest] });
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: any) => {
    onChange({
      ...data,
      testimonials: data.testimonials?.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTestimonial = (id: string) => {
    onChange({ ...data, testimonials: data.testimonials?.filter(t => t.id !== id) });
  };

  // Finance Specific Functions
  const addPortfolio = () => {
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      name: '',
      sector: '',
      value: '',
      description: ''
    };
    onChange({ ...data, portfolio: [...(data.portfolio || []), newItem] });
  };

  const updatePortfolio = (id: string, field: keyof PortfolioItem, value: string) => {
    onChange({
      ...data,
      portfolio: data.portfolio?.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removePortfolio = (id: string) => {
    onChange({ ...data, portfolio: data.portfolio?.filter(p => p.id !== id) });
  };

  // Wedding Specific Functions
  const addWeddingService = () => {
    const newItem: WeddingService = {
      id: Date.now().toString(),
      title: '',
      price: '',
      description: '',
      features: ''
    };
    onChange({ ...data, weddingServices: [...(data.weddingServices || []), newItem] });
  };

  const updateWeddingService = (id: string, field: keyof WeddingService, value: string) => {
    onChange({
      ...data,
      weddingServices: data.weddingServices?.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };

  const removeWeddingService = (id: string) => {
    onChange({ ...data, weddingServices: data.weddingServices?.filter(s => s.id !== id) });
  };

  const addWeddingGallery = () => {
    const newItem: WeddingGalleryItem = {
      id: Date.now().toString(),
      image: '',
      tag: ''
    };
    onChange({ ...data, weddingGallery: [...(data.weddingGallery || []), newItem] });
  };

  const updateWeddingGallery = (id: string, field: keyof WeddingGalleryItem, value: string) => {
    onChange({
      ...data,
      weddingGallery: data.weddingGallery?.map(g => g.id === id ? { ...g, [field]: value } : g)
    });
  };

  const removeWeddingGallery = (id: string) => {
    onChange({ ...data, weddingGallery: data.weddingGallery?.filter(g => g.id !== id) });
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Personal Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => toggleSection('personal')}
          className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="font-semibold text-slate-800">Personal Information</span>
          {activeSection === 'personal' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {activeSection === 'personal' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
             
            {/* Photo Upload */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {data.personalInfo.photo && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    <img src={data.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => updatePersonalInfo('photo', '')}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                      title="Remove photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <div className="flex-1 space-y-3">
                   <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase mb-1">
                      <span>Image URL</span>
                   </div>

                   {/* URL Input */}
                   <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <Link size={14} className="text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="https://site.com/photo.jpg" 
                        value={data.personalInfo.photo || ''}
                        onChange={(e) => updatePersonalInfo('photo', e.target.value)}
                        className="w-full py-2 text-sm outline-none bg-transparent"
                      />
                   </div>
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <input 
                type="text" 
                value={data.personalInfo.jobTitle}
                onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input 
                type="text" 
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
             <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                <span>Professional Summary</span>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={isGenerating || !data.personalInfo.jobTitle}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Auto-Generate
                </button>
              </label>
              <textarea 
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                rows={4}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Briefly describe your professional background..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Wedding Services (Wedding Planner Section) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-rose-200/60">
        <button 
          onClick={() => toggleSection('wedding')}
          className="w-full px-6 py-4 flex justify-between items-center bg-rose-50 hover:bg-rose-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
             <Heart size={18} className="text-rose-500" />
             <span className="font-semibold text-slate-800">Wedding Packages (Planner)</span>
          </div>
          {activeSection === 'wedding' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'wedding' && (
          <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
             {/* Packages */}
             {data.weddingServices?.map((item) => (
                <div key={item.id} className="relative p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                    <button onClick={() => removeWeddingService(item.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Package Name</label>
                          <input type="text" value={item.title} onChange={(e) => updateWeddingService(item.id, 'title', e.target.value)} className="w-full p-2 border rounded-md" />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                          <input type="text" value={item.price} onChange={(e) => updateWeddingService(item.id, 'price', e.target.value)} className="w-full p-2 border rounded-md" placeholder="From $3,500" />
                       </div>
                       <div className="md:col-span-2">
                           <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                           <textarea value={item.description} onChange={(e) => updateWeddingService(item.id, 'description', e.target.value)} className="w-full p-2 border rounded-md resize-none" rows={2} />
                       </div>
                       <div className="md:col-span-2">
                           <label className="block text-xs font-medium text-slate-500 mb-1">Features (Bullets)</label>
                           <textarea value={item.features} onChange={(e) => updateWeddingService(item.id, 'features', e.target.value)} className="w-full p-2 border rounded-md resize-none" rows={3} placeholder="• Full planning..." />
                       </div>
                    </div>
                </div>
             ))}
             <button onClick={addWeddingService} className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-rose-300 rounded-lg text-rose-500 hover:bg-rose-50 transition-all font-medium">
               <Plus size={18} /> Add Package
             </button>

             <hr className="border-slate-200 my-2" />
             
             {/* Gallery */}
             <h3 className="font-semibold text-slate-700">Gallery Images</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {data.weddingGallery?.map((item) => (
                 <div key={item.id} className="group relative bg-slate-100 rounded-lg border border-slate-200 p-2">
                    <div className="aspect-square bg-slate-200 rounded overflow-hidden mb-2">
                        <img src={item.image || 'https://via.placeholder.com/300'} alt={item.tag} className="w-full h-full object-cover" />
                    </div>
                    
                    <button onClick={() => removeWeddingGallery(item.id)} className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white"><X size={14} /></button>
                    
                    <input 
                      type="text" 
                      value={item.tag} 
                      onChange={(e) => updateWeddingGallery(item.id, 'tag', e.target.value)}
                      className="w-full text-xs p-1 border rounded mb-2"
                      placeholder="Tag"
                    />
                    <input 
                      type="text"
                      placeholder="Image URL..."
                      value={item.image}
                      onChange={(e) => updateWeddingGallery(item.id, 'image', e.target.value)}
                      className="w-full text-[10px] p-1 border rounded bg-white text-slate-600 truncate"
                    />
                 </div>
               ))}
               <button onClick={addWeddingGallery} className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-rose-400 hover:bg-rose-50 transition-all text-slate-400 hover:text-rose-500 p-2">
                  <ImageIcon size={24} />
                  <span className="text-xs mt-2 font-medium text-center">Add Image</span>
               </button>
             </div>
          </div>
        )}
       </div>

       {/* Real Estate Listings (Realtor Section) */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-amber-200/60">
        <button 
          onClick={() => toggleSection('listings')}
          className="w-full px-6 py-4 flex justify-between items-center bg-amber-50 hover:bg-amber-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
             <Home size={18} className="text-amber-600" />
             <span className="font-semibold text-slate-800">Real Estate Listings (Realtor)</span>
          </div>
          {activeSection === 'listings' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'listings' && (
          <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
             {data.listings?.map((listing) => (
                <div key={listing.id} className="relative p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                    <button onClick={() => removeListing(listing.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       {/* Image Upload */}
                       <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Property Image URL</label>
                          <div className="h-32 bg-slate-200 rounded-lg overflow-hidden relative mb-2">
                             {listing.image ? (
                                <img src={listing.image} alt="Property" className="w-full h-full object-cover" />
                             ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                   <ImageIcon size={24} />
                                </div>
                             )}
                          </div>
                          
                          {/* URL Input */}
                          <input 
                             type="text"
                             placeholder="Paste Image URL..."
                             value={listing.image || ''}
                             onChange={(e) => updateListing(listing.id, 'image', e.target.value)}
                             className="w-full p-1.5 text-xs border border-slate-300 rounded"
                          />
                       </div>
                       
                       <div className="col-span-2 md:col-span-1 space-y-3">
                          <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Price</label>
                             <input type="text" value={listing.price} onChange={(e) => updateListing(listing.id, 'price', e.target.value)} className="w-full p-2 border rounded-md" placeholder="$1,200,000" />
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Specs (Beds/Baths)</label>
                             <input type="text" value={listing.specs} onChange={(e) => updateListing(listing.id, 'specs', e.target.value)} className="w-full p-2 border rounded-md" placeholder="4 Bed | 3 Bath" />
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                             <select value={listing.status} onChange={(e) => updateListing(listing.id, 'status', e.target.value)} className="w-full p-2 border rounded-md">
                                <option>For Sale</option>
                                <option>Pending</option>
                                <option>Sold</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                       <input type="text" value={listing.address} onChange={(e) => updateListing(listing.id, 'address', e.target.value)} className="w-full p-2 border rounded-md mb-2" />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                       <textarea value={listing.description} onChange={(e) => updateListing(listing.id, 'description', e.target.value)} className="w-full p-2 border rounded-md resize-none" rows={3} />
                    </div>
                </div>
             ))}
             <button onClick={addListing} className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50 transition-all font-medium">
               <Plus size={18} /> Add Listing
             </button>
          </div>
        )}
       </div>

       {/* Investment Portfolio (Finance Section) */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-indigo-200/60">
        <button 
          onClick={() => toggleSection('portfolio')}
          className="w-full px-6 py-4 flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
             <Briefcase size={18} className="text-indigo-600" />
             <span className="font-semibold text-slate-800">Investment Portfolio (Finance)</span>
          </div>
          {activeSection === 'portfolio' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'portfolio' && (
          <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
             {data.portfolio?.map((item) => (
                <div key={item.id} className="relative p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                    <button onClick={() => removePortfolio(item.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Company/Asset Name</label>
                          <input type="text" value={item.name} onChange={(e) => updatePortfolio(item.id, 'name', e.target.value)} className="w-full p-2 border rounded-md" />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Sector</label>
                          <input type="text" value={item.sector} onChange={(e) => updatePortfolio(item.id, 'sector', e.target.value)} className="w-full p-2 border rounded-md" placeholder="Tech, Energy, etc." />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Value / Return</label>
                          <input type="text" value={item.value} onChange={(e) => updatePortfolio(item.id, 'value', e.target.value)} className="w-full p-2 border rounded-md" placeholder="$50M AUM or 25% IRR" />
                       </div>
                       <div className="md:col-span-2">
                           <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                           <textarea value={item.description} onChange={(e) => updatePortfolio(item.id, 'description', e.target.value)} className="w-full p-2 border rounded-md resize-none" rows={2} />
                       </div>
                    </div>
                </div>
             ))}
             <button onClick={addPortfolio} className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all font-medium">
               <Plus size={18} /> Add Investment
             </button>
          </div>
        )}
       </div>

      {/* Experience */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => toggleSection('experience')}
          className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="font-semibold text-slate-800">Experience</span>
          {activeSection === 'experience' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'experience' && (
          <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="relative p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Position</label>
                    <input 
                      type="text" 
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
                    <input 
                      type="text" 
                      placeholder="YYYY-MM"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder={exp.current ? "Present" : "YYYY-MM"}
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-50"
                      />
                      <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                        <input 
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-slate-500 mb-1 flex justify-between">
                    <span>Description (Bullet Points)</span>
                    <button 
                      onClick={() => improveExperience(exp.id, exp.description)}
                      disabled={isGenerating || !exp.description}
                      className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                      {isGenerating && aiContext === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                      Improve with AI
                    </button>
                  </label>
                  <textarea 
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={4}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                  />
                </div>
              </div>
            ))}
            
            <button 
              onClick={addExperience}
              className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all font-medium"
            >
              <Plus size={18} /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => toggleSection('skills')}
          className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <span className="font-semibold text-slate-800">Skills</span>
          {activeSection === 'skills' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'skills' && (
          <div className="p-6 animate-in slide-in-from-top-2 duration-200">
             <div className="flex justify-end mb-4">
                <button 
                   onClick={suggestAISkills}
                   disabled={isGenerating || !data.personalInfo.jobTitle}
                   className="text-sm flex items-center gap-1 text-white bg-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
                 >
                   {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                   Suggest Skills
                 </button>
             </div>
             
             <div className="flex flex-wrap gap-2 mb-4">
               {data.skills.map(skill => (
                 <div key={skill.id} className="group flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 transition-colors">
                   <input 
                      value={skill.name}
                      onChange={(e) => onChange({
                        ...data, 
                        skills: data.skills.map(s => s.id === skill.id ? {...s, name: e.target.value} : s)
                      })}
                      className="bg-transparent border-none outline-none text-sm w-24 text-slate-700"
                      placeholder="Skill"
                   />
                   <button 
                    onClick={() => removeSkill(skill.id)}
                    className="text-slate-400 hover:text-red-500"
                   >
                     <Trash2 size={12} />
                   </button>
                 </div>
               ))}
             </div>

             <button 
              onClick={addSkill}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus size={14} /> Add Skill Manually
            </button>
          </div>
        )}
      </div>

      {/* Testimonials */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => toggleSection('testimonials')}
          className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            <span className="font-semibold text-slate-800">Testimonials</span>
          </div>
          {activeSection === 'testimonials' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === 'testimonials' && (
          <div className="p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
             {data.testimonials?.map((t) => (
                <div key={t.id} className="relative p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                    <button onClick={() => removeTestimonial(t.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Client Name</label>
                       <input type="text" value={t.client} onChange={(e) => updateTestimonial(t.id, 'client', e.target.value)} className="w-full p-2 border rounded-md mb-2" />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-slate-500 mb-1">Review</label>
                       <textarea value={t.text} onChange={(e) => updateTestimonial(t.id, 'text', e.target.value)} className="w-full p-2 border rounded-md resize-none" rows={2} />
                    </div>
                </div>
             ))}
             <button onClick={addTestimonial} className="flex items-center justify-center gap-2 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-slate-800 transition-all font-medium">
               <Plus size={18} /> Add Testimonial
             </button>
          </div>
        )}
       </div>

    </div>
  );
};

export default Editor;