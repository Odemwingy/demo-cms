import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Save, Image as ImageIcon, FileVideo, History, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const MAIN_TABS = [
  'FILE INFO', 'SERIES/EPISODE INFO', 'SOUNDTRACKS / SUBS', 
  'OTHER INFO', 'METADATA', 'TRAILER', 'IMAGES', 'CATEGORIES'
];

export function MetadataView({ type = 'video' }: { type?: string }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialUid = searchParams.get('uid');

  const [activeTab, setActiveTab] = useState('FILE INFO');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Nested states for METADATA tab
  const [activeSystem, setActiveSystem] = useState<string>('eX3');
  const [activeLang, setActiveLang] = useState<string>('English');

  useEffect(() => {
    if (initialUid) {
      fetchMediaDetails(initialUid);
    } else {
      setSelectedMedia(null);
      setFormData({
        uid: '',
        title: '',
        video_type: 'Movie',
        audio_type: 'Song',
        duration: '',
        filename: '',
        lab: '',
        systems_config: [{ system_name: 'eX3', start_date: 'Jun 2015', end_date: 'Dec 2035' }]
      });
    }
  }, [initialUid]);

  const fetchMediaDetails = (uid: string) => {
    fetch(`/api/media/${uid}`)
      .then(res => res.json())
      .then(data => {
        setSelectedMedia(data);
        setFormData(data);
        if (data.systems_config && data.systems_config.length > 0) {
          setActiveSystem(data.systems_config[0].system_name);
        } else {
          setActiveSystem('eX3'); // fallback
        }
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const newMeta = [...(prev.metadata || [])];
      let metaEntry = newMeta.find(m => m.system_name === activeSystem && m.language === activeLang);
      if (!metaEntry) {
        metaEntry = { system_name: activeSystem, language: activeLang };
        newMeta.push(metaEntry);
      }
      metaEntry[name] = value;
      return { ...prev, metadata: newMeta };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = selectedMedia ? 'PUT' : 'POST';
      const url = selectedMedia ? `/api/media/${selectedMedia.uid}` : '/api/media';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updated = await res.json();
      setSelectedMedia(updated);
      alert('Changes saved successfully!');
    } catch(e) {
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const getActiveMeta = () => {
    if (!formData.metadata) return {};
    return formData.metadata.find((m: any) => m.system_name === activeSystem && m.language === activeLang) || {};
  };
  const activeMeta = getActiveMeta();

  const systemsList = formData.systems_config || [{system_name: 'eX3'}];
  const languagesList = ['English', 'Chinese - Simplified']; // Mock static list for now

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f6f8]">
      {/* Header Actions */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#e86d1f]/10 border border-[#e86d1f]/20 flex items-center justify-center">
            {type === 'video' ? <FileVideo className="w-5 h-5 text-[#e86d1f]" /> : <ImageIcon className="w-5 h-5 text-[#e86d1f]" />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">MMA Home {'>'} Metadata {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 bg-slate-100 border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors">
            Change Request
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#e86d1f] border border-[#d65f15] text-white shadow-sm text-sm font-medium hover:bg-[#d65f15] transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Right Detail Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-white m-2 border border-slate-300 overflow-hidden text-sm">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-3 h-10">
            {selectedMedia ? (
              <>
                <span className="text-slate-500 font-medium">UID: {selectedMedia.uid}</span>
                <span className="px-2 py-0.5 border border-slate-300 bg-white text-slate-600 text-xs uppercase tracking-wider rounded-sm">MASTER</span>
                <span className="px-2 py-0.5 border border-slate-300 bg-white text-slate-600 text-xs uppercase tracking-wider rounded-sm">FULL SIGNOFF</span>
                {selectedMedia.qc_status && (
                  <span className="px-2 py-0.5 border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs uppercase tracking-wider rounded-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> QC PASSED
                  </span>
                )}
              </>
            ) : (
              <span className="text-slate-400 font-medium italic">Create New Media</span>
            )}
          </div>

          <div className="bg-white border-b border-slate-300 pt-2 px-2 flex gap-1 overflow-x-auto no-scrollbar shrink-0">
            {MAIN_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors whitespace-nowrap rounded-t-sm",
                  activeTab === tab
                    ? "border-slate-300 border-b-transparent bg-[#e86d1f] text-white"
                    : "border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                )}
                style={{ marginBottom: activeTab === tab ? '-1px' : '0' }}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 relative bg-white">
            
            {/* FILE INFO TAB */}
            {activeTab === 'FILE INFO' && (
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-5xl">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">UID</label>
                    {selectedMedia ? (
                      <span className="text-slate-900">{formData.uid}</span>
                    ) : (
                      <input type="text" name="uid" placeholder="Auto-generated if blank" value={formData.uid || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Release Title</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">{type === 'video' ? '*Video Type' : '*Audio Type'}</label>
                    <div className="flex-1 flex gap-2">
                      <select name={type === 'video' ? 'video_type' : 'audio_type'} value={type === 'video' ? (formData.video_type || '') : (formData.audio_type || '')} onChange={handleInputChange} className="w-1/2 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                        <option value="Movie">Movie</option>
                        <option value="TV Episode">TV Episode</option>
                        <option value="Safety">Safety</option>
                        <option value="Song">Song</option>
                        <option value="Album">Album</option>
                      </select>
                      <select name="edit_version" value={formData.edit_version || ''} onChange={handleInputChange} className="w-1/2 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                        <option value="Edited">Edited</option><option value="Theatrical">Theatrical</option><option value="Standard">Standard</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Duration</label>
                    <div className="flex-1 flex gap-2 items-center">
                      <input type="text" name="duration" value={formData.duration || ''} onChange={handleInputChange} placeholder="00:00:00" className="w-24 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                      <span className="text-xs text-slate-500 font-mono bg-slate-100 px-1 border border-slate-200">02:04:57</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Filename</label>
                    <div className="flex-1 flex gap-2 items-center">
                      <select className="w-20 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]"><option>Yes</option><option>No</option></select>
                      <input type="text" name="filename" value={formData.filename || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f] text-blue-600 underline" />
                      <span className="text-xs font-bold text-slate-600">MFM</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Lab</label>
                    <input type="text" name="lab" value={formData.lab || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Year</label>
                    <input type="text" name="release_year" value={formData.release_year || ''} onChange={handleInputChange} className="w-24 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Credits Start Time</label>
                    <input type="text" name="credits_start_time" value={formData.credits_start_time || ''} onChange={handleInputChange} placeholder="00:00:00" className="w-24 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Trailer Media ID</label>
                    <input type="text" name="trailer_mid" value={formData.trailer_mid || ''} onChange={handleInputChange} placeholder="e.g. 1289" className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 font-semibold text-slate-700 shrink-0 mt-1">Keywords</label>
                    <textarea name="keywords" value={formData.keywords || ''} onChange={handleInputChange} rows={2} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f] resize-none" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Intro Start Time</label>
                    <input type="text" name="intro_start_time" value={formData.intro_start_time || ''} onChange={handleInputChange} placeholder="00:00:00" className="w-24 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  
                  {/* Systems */}
                  <div className="flex items-start mt-6">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Systems</label>
                    <div className="flex-1 space-y-2">
                      {(formData.systems_config || []).map((sys: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <span className="w-32 text-right">{sys.system_name}</span>
                          <input type="checkbox" defaultChecked />
                          <label>held</label>
                          <select className="px-1 py-0.5 border border-slate-300"><option>{sys.start_date}</option></select>
                          <span>to</span>
                          <select className="px-1 py-0.5 border border-slate-300"><option>{sys.end_date}</option></select>
                          <button className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">exact</button>
                        </div>
                      ))}
                      {/* Checkbox examples from screenshot */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-32 text-right">OneMediaAdPool</span>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">MID</label>
                    <input type="text" name="mid" value={formData.mid || ''} onChange={handleInputChange} className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Rating</label>
                    <select name="rating" value={formData.rating || ''} onChange={handleInputChange} className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                      <option value="N/R">N/R</option><option value="PG13 / R">PG13 / R</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Aspect Ratio</label>
                    <div className="flex items-center gap-2">
                      <select name="aspect_ratio" value={formData.aspect_ratio || ''} onChange={handleInputChange} className="w-40 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                        <option value="16x9Adjustable">16x9Adjustable</option><option value="4x3Adjustable">4x3Adjustable</option>
                      </select>
                      <span className="text-xs font-bold text-green-700">16x9</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Encoding</label>
                    <select name="encoding" value={formData.encoding || ''} onChange={handleInputChange} className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                      <option value="MPEG4">MPEG4</option><option value="MPEG2">MPEG2</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Bitrate</label>
                    <select name="bitrate" value={formData.bitrate || ''} onChange={handleInputChange} className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                      <option value="1.5Mbps">1.5Mbps</option><option value="3.5Mbps">3.5Mbps</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">*Distributor</label>
                    <input type="text" name="distributor" value={formData.distributor || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">EIDR</label>
                    <input type="text" name="eidr" value={formData.eidr || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">UPC/ISRC</label>
                    <input type="text" name="upc_isrc" value={formData.upc_isrc || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Country</label>
                    <select name="country" value={formData.country || ''} onChange={handleInputChange} className="flex-1 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]">
                      <option value=""></option><option value="USA">USA</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">User Media ID</label>
                    <input type="text" name="user_media_id" value={formData.user_media_id || ''} onChange={handleInputChange} className="w-32 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Intro End Time</label>
                    <input type="text" name="intro_end_time" value={formData.intro_end_time || ''} onChange={handleInputChange} placeholder="00:00:00" className="w-24 px-2 py-1 border border-slate-300 outline-none focus:border-[#e86d1f]" />
                  </div>
                  <div className="flex items-start mt-4 pt-4 border-t border-slate-200">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Soundtracks</label>
                    <div className="flex gap-4 text-xs">
                      <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> English (2)</label>
                      <label className="flex items-center gap-1"><input type="checkbox" /> Chinese (1)</label>
                      <label className="flex items-center gap-1"><input type="checkbox" /> German (4)</label>
                    </div>
                  </div>
                  <div className="flex items-start mt-2">
                    <label className="w-40 font-semibold text-slate-700 shrink-0">Subtitles</label>
                    <div className="flex gap-4 text-xs">
                      <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> English (2)</label>
                      <label className="flex items-center gap-1"><input type="checkbox" defaultChecked /> Chinese (1)</label>
                      <label className="flex items-center gap-1"><input type="checkbox" /> German (4)</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* METADATA TAB */}
            {activeTab === 'METADATA' && (
              <div className="flex flex-col h-full">
                {/* System Sub Tabs */}
                <div className="flex gap-1 border-b border-[#e86d1f] mb-4 overflow-x-auto no-scrollbar shrink-0">
                  {systemsList.map((sys: any) => (
                    <button
                      key={sys.system_name}
                      onClick={() => setActiveSystem(sys.system_name)}
                      className={cn(
                        "px-4 py-1 text-xs font-bold uppercase border-t border-l border-r rounded-t-sm whitespace-nowrap",
                        activeSystem === sys.system_name
                          ? "bg-[#e86d1f] text-white border-[#e86d1f]"
                          : "bg-slate-100 text-[#e86d1f] border-slate-200 hover:bg-slate-200"
                      )}
                    >
                      {sys.system_name}
                    </button>
                  ))}
                  {/* Mock extra tabs from screenshot 3 */}
                  <button className="px-4 py-1 text-xs font-bold uppercase bg-slate-100 text-[#e86d1f] border border-slate-200 rounded-t-sm">EX3/GCS Phase 2 GUI</button>
                </div>

                {/* Language Sub Tabs */}
                <div className="flex gap-1 border-b border-slate-300 mb-6">
                  {languagesList.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={cn(
                        "px-4 py-1 text-xs font-bold uppercase rounded-t-sm whitespace-nowrap",
                        activeLang === lang
                          ? "bg-slate-300 text-slate-800"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Metadata Fields */}
                <div className="grid grid-cols-2 gap-8 max-w-5xl">
                  {/* Meta Left */}
                  <div className="space-y-3">
                    {[
                      { label: 'Title', name: 'title' },
                      { label: 'Short Title', name: 'short_title' },
                      { label: 'Director', name: 'director' },
                      { label: 'Cast', name: 'cast_members' },
                      { label: 'Year', name: 'release_year' }
                    ].map(f => (
                      <div key={f.name} className="flex items-center">
                        <label className="w-32 text-xs text-slate-700">{f.label}</label>
                        <input type="text" name={f.name} value={activeMeta[f.name] || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner" />
                      </div>
                    ))}
                    <div className="flex items-center">
                      <label className="w-32 text-xs text-slate-700">Genre</label>
                      <select name="genre" value={activeMeta.genre || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner">
                        <option value="Drama">Drama</option><option value="Action">Action</option>
                      </select>
                    </div>
                    {[
                      { label: 'Country Origin', name: 'country_origin' },
                      { label: 'People Score', name: 'people_score' },
                      { label: 'Critic Score', name: 'critic_score' }
                    ].map(f => (
                      <div key={f.name} className="flex items-center">
                        <label className="w-32 text-xs text-slate-700">{f.label}</label>
                        <input type="text" name={f.name} value={activeMeta[f.name] || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner" />
                      </div>
                    ))}
                  </div>

                  {/* Meta Right */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <label className="w-32 text-xs text-slate-700 pt-1">Description</label>
                      <textarea name="description" rows={4} value={activeMeta.description || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner resize-none text-xs" />
                    </div>
                    <div className="flex items-start">
                      <label className="w-32 text-xs text-slate-700 pt-1">Short Description</label>
                      <textarea name="short_description" rows={3} value={activeMeta.short_description || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner resize-none text-xs" />
                    </div>
                    <div className="flex items-start">
                      <label className="w-32 text-xs text-slate-700 pt-1">Review</label>
                      <textarea name="review" rows={2} value={activeMeta.review || ''} onChange={handleMetadataChange} className="flex-1 px-2 py-1 border border-slate-300 text-blue-700 outline-none focus:border-[#e86d1f] shadow-inner resize-none text-xs" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  <button onClick={handleSave} className="px-4 py-1 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-sm">Save</button>
                  <button className="px-4 py-1 bg-slate-100 border border-slate-300 text-[#0066cc] text-xs font-bold rounded-sm">Add Language</button>
                  <button className="px-4 py-1 bg-slate-100 border border-slate-300 text-[#0066cc] text-xs font-bold rounded-sm">Remove Language</button>
                </div>

                {/* Bottom Copy Config */}
                <div className="mt-10 border-t border-slate-200 pt-6 max-w-5xl">
                  <h4 className="font-bold text-slate-800 mb-2">Metadata Shared By:</h4>
                  <div className="text-xs text-slate-600 pl-4 space-y-1 mb-6">
                    <div>eX3/GCS Phase 2 GUI / eX3/GCS Phase 2 GUI VHS eXTV : English</div>
                    <div>eX3_B787-9_Legacy_CD : English</div>
                  </div>

                  <h4 className="font-bold text-slate-800 mb-2">Copy Metadata To:</h4>
                  <div className="pl-4 space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> eXO eXO/eX1 & eFX
                      </label>
                      <label className="flex items-center gap-2 text-xs pl-6">
                        <input type="checkbox" /> Chinese - Simplified
                      </label>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center gap-2 text-xs">
                        <input type="checkbox" /> eX3/GCS Phase 2 GUI
                      </label>
                      <label className="flex items-center gap-2 text-xs pl-6">
                        <input type="checkbox" /> Chinese - Simplified
                      </label>
                    </div>
                    <button className="w-max mt-2 px-3 py-1 bg-slate-100 border border-slate-300 text-[#0066cc] text-xs font-bold rounded-sm">Select/Deselect All</button>
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES TAB */}
            {activeTab === 'IMAGES' && (
              <div>
                {/* Info Alert */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Upload media assets based on the target device. The CMS will automatically scale and map these images to Panasonic's internal specifications (e.g., <code>poster_1</code>, <code>poster_11</code>) during the cycle export process.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seatback Group */}
                <div className="border border-slate-300 rounded-md overflow-hidden mb-6 bg-white shadow-sm">
                  <div className="bg-slate-100 border-b border-slate-300 px-4 py-3 flex items-center gap-3">
                    <Columns3 className="h-5 w-5 text-slate-500" />
                    <h3 className="text-base font-bold text-slate-800">Seatback Display (1080p, 213 DPI)</h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-8">
                    {/* Main Poster */}
                    <div className="flex gap-4 border border-slate-200 p-4 rounded bg-slate-50">
                      <div className="w-24 h-36 bg-slate-200 border border-slate-300 flex-shrink-0 relative overflow-hidden shadow-sm">
                        <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop" className="object-cover w-full h-full" alt="" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="font-bold text-slate-800 mb-1">Standard Poster (2:3)</div>
                        <div className="text-xs text-slate-500 mb-3">Primary artwork for seatback menu. Automatically mapped to <code>poster_1</code>, <code>poster_21</code>.</div>
                        <div className="text-xs font-mono text-slate-600 mb-4">Required: &gt;= 400x600px</div>
                        <div className="mt-auto flex gap-2">
                          <button className="px-3 py-1.5 bg-white border border-slate-300 text-[#0066cc] rounded text-xs font-medium shadow-sm hover:bg-slate-50">Upload / Replace</button>
                        </div>
                      </div>
                    </div>
                    {/* Hero Banner */}
                    <div className="flex gap-4 border border-slate-200 p-4 rounded bg-slate-50">
                      <div className="w-36 h-20 bg-slate-100 border border-slate-300 border-dashed flex-shrink-0 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6 opacity-30" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="font-bold text-slate-800 mb-1">Hero Banner (16:9)</div>
                        <div className="text-xs text-slate-500 mb-3">Wide banner for featured sections. Automatically mapped to <code>poster_12</code>.</div>
                        <div className="text-xs font-mono text-slate-600 mb-4">Required: &gt;= 800x450px</div>
                        <div className="mt-auto flex gap-2">
                          <button className="px-3 py-1.5 bg-white border border-slate-300 text-[#0066cc] rounded text-xs font-medium shadow-sm hover:bg-slate-50">Upload Image</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handset Group */}
                <div className="border border-slate-300 rounded-md overflow-hidden bg-white shadow-sm">
                  <div className="bg-slate-100 border-b border-slate-300 px-4 py-3 flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-slate-500" />
                    <h3 className="text-base font-bold text-slate-800">Handset Controller (720p, 320 XHDPI)</h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-8">
                    {/* Square Thumbnail */}
                    <div className="flex gap-4 border border-slate-200 p-4 rounded bg-slate-50">
                      <div className="w-24 h-24 bg-slate-100 border border-slate-300 border-dashed flex-shrink-0 flex items-center justify-center text-slate-400">
                         <ImageIcon className="w-6 h-6 opacity-30" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="font-bold text-slate-800 mb-1">Square Icon (1:1)</div>
                        <div className="text-xs text-slate-500 mb-3">Used on handset grids. Automatically mapped to <code>poster_11</code>.</div>
                        <div className="text-xs font-mono text-slate-600 mb-4">Required: &gt;= 300x300px (@2x)</div>
                        <div className="mt-auto flex gap-2">
                          <button className="px-3 py-1.5 bg-white border border-slate-300 text-[#0066cc] rounded text-xs font-medium shadow-sm hover:bg-slate-50">Upload Image</button>
                          <button className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-xs font-medium shadow-sm">Auto-Crop</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Placeholders */}
            {!['FILE INFO', 'METADATA', 'IMAGES'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                <div className="text-lg">[{activeTab}] Content</div>
                <div className="text-sm">This tab has not been fully implemented in the frontend prototype yet.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
