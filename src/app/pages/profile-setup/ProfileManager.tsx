import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, ListTree, Plane, AlertCircle, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ProfileManager() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [activeMediaConfigProfile, setActiveMediaConfigProfile] = useState<any | null>(null);
  const [activeClassProfile, setActiveClassProfile] = useState<any | null>(null);

  const fetchProfiles = () => {
    setIsLoading(true);
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profiles:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="bg-slate-50 flex flex-col h-full rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Profile Manager</h2>
          <p className="text-xs text-slate-500">Manage your IFE Profiles, Media Configs, Classes, and Classification Trees.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchProfiles}>Refresh</Button>
          <Button variant="primary" size="sm" onClick={() => setEditingProfile({ isNew: true })} className="flex items-center gap-1">
            <Plus className="w-4 h-4"/> New Profile
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-8 flex-1 overflow-auto">
        <div className="flex gap-6 items-start h-full pb-8 flex-wrap">
          {profiles.map(p => {
            const isLinked = !!p.linked_profile_id;
            return (
              <div key={p.id} className="w-[280px] bg-white rounded-lg shadow-md border border-slate-200 flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className={`px-4 py-3 border-b border-slate-200 flex justify-between items-center ${isLinked ? 'bg-indigo-50/50' : 'bg-slate-50'}`}>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{p.name}</h3>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold flex items-center gap-1">
                      {p.type} {isLinked && <><Plane className="w-3 h-3 text-indigo-400 ml-1"/> Linked</>}
                    </div>
                  </div>
                  <button onClick={() => setEditingProfile(p)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-md transition-colors"><Edit2 className="w-4 h-4"/></button>
                </div>

                {/* Body Details */}
                <div className="px-4 py-3 flex-1 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-xs">Schema Version</span>
                    <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{p.version}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-500 text-xs">Category Set</span>
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[120px]" title={p.categorySet?.name}>
                      {p.categorySet?.name || 'None'}
                    </span>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button 
                      onClick={() => setActiveMediaConfigProfile(p)}
                      className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors text-slate-600 group"
                    >
                      <Settings className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform"/>
                      <span className="text-[10px] font-bold">Media Configs ({p.mediaConfigs?.length || 0})</span>
                    </button>
                    <button 
                      onClick={() => setActiveClassProfile(p)}
                      className="flex flex-col items-center justify-center p-2 rounded border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-colors text-slate-600 group"
                    >
                      <Plane className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform"/>
                      <span className="text-[10px] font-bold">Classes ({p.classes?.length || 0})</span>
                    </button>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <Button 
                    variant="primary" 
                    className="w-full flex justify-center items-center gap-2"
                    onClick={() => window.location.hash = `#/profile-setup/categories/${p.categorySet?.id}?profileId=${p.id}`}
                    disabled={!p.categorySet}
                  >
                    <ListTree className="w-4 h-4"/> Manage Category Tree
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Basic Modals Placeholders */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="px-4 py-3 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
              <h3 className="font-bold">{editingProfile.isNew ? 'New Profile' : 'Edit Profile'}</h3>
              <button onClick={() => setEditingProfile(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-700"/></button>
            </div>
            <div className="p-4 space-y-4 text-sm text-slate-600">
              <div className="p-3 bg-blue-50 text-blue-800 rounded border border-blue-200 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5"/>
                <p>Profile editing is linked to Shipment Info (Aircraft Mfg, TailNum, etc.). Form implementation placeholder.</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setEditingProfile(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMediaConfigProfile && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg p-6 w-[500px]">
             <h3 className="font-bold mb-4">Media Configs for {activeMediaConfigProfile.name}</h3>
             <ul className="space-y-2">
               {activeMediaConfigProfile.mediaConfigs?.map((mc: any) => (
                 <li key={mc.id} className="p-2 border rounded flex justify-between items-center bg-slate-50">
                   <span className="font-semibold text-sm">{mc.name} <span className="text-xs text-slate-400">({mc.config_id})</span></span>
                   <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">Linked classes: {activeMediaConfigProfile.classes?.filter((c:any) => c.media_config_id === mc.id).length}</span>
                 </li>
               ))}
             </ul>
             <div className="mt-6 flex justify-end">
               <Button onClick={() => setActiveMediaConfigProfile(null)}>Close</Button>
             </div>
           </div>
         </div>
      )}

      {activeClassProfile && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg p-6 w-[500px]">
             <h3 className="font-bold mb-4">Classes for {activeClassProfile.name}</h3>
             <ul className="space-y-2">
               {activeClassProfile.classes?.map((c: any) => (
                 <li key={c.id} className="p-2 border rounded flex justify-between items-center bg-slate-50 text-sm">
                   <span className="font-bold text-slate-700">{c.mma_display_name}</span>
                   <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded border border-orange-200">
                     Media Config: {c.media_config_id === 'ALL' ? 'ALL' : activeClassProfile.mediaConfigs?.find((m:any) => m.id === c.media_config_id)?.name || c.media_config_id}
                   </span>
                 </li>
               ))}
             </ul>
             <div className="mt-6 flex justify-end">
               <Button onClick={() => setActiveClassProfile(null)}>Close</Button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
}
