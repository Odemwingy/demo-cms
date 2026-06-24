import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Folder, Plus, Edit2, Trash2, Tag, LayoutTemplate, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function CategoryManager() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('profileId');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  
  // Filters
  const [selectedMediaConfig, setSelectedMediaConfig] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  useEffect(() => {
    if (id) {
      fetch(`/api/categories/${id}`)
        .then(res => res.json())
        .then(data => setCategories(data));
    }
    if (profileId) {
      fetch('/api/profiles')
        .then(res => res.json())
        .then(data => {
          const p = data.find((x: any) => x.id === profileId);
          setProfile(p);
        });
    }
  }, [id, profileId]);

  const filteredCategories = categories.filter(c => {
    if (selectedMediaConfig !== 'all' && c.media_config_id !== 'all' && c.media_config_id !== selectedMediaConfig) return false;
    if (selectedClass !== 'all' && c.class_id !== 'all' && c.class_id !== selectedClass) return false;
    if (selectedLanguage !== 'all' && c.language_id !== 'all' && c.language_id !== selectedLanguage) return false;
    return true;
  });

  // Build Tree
  const buildTree = (cats: any[], parentId: string | null = null) => {
    return cats
      .filter(c => c.parent_id === parentId)
      .map(c => ({
        ...c,
        children: buildTree(cats, c.id)
      }));
  };

  const tree = buildTree(filteredCategories, null);

  const renderNode = (node: any) => {
    const isVirtual = node.virtual === 1;
    const hasPropagation = node.propagation_data && node.propagation_data.length > 2; // > "[]"
    
    return (
      <div key={node.id} className="ml-6 mt-2">
        <div className={`flex items-center justify-between p-2 rounded border ${isVirtual ? 'border-dashed border-slate-400 bg-slate-50 opacity-70' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="flex items-center gap-2">
            <Folder className={`w-4 h-4 ${isVirtual ? 'text-slate-400' : 'text-indigo-500'}`} />
            <span className={`font-semibold ${isVirtual ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-700'}`}>
              {node.default_name}
            </span>
            <span className="text-xs bg-slate-100 text-slate-500 px-1.5 rounded ml-2">CID: {node.cid}</span>
            <span className="text-xs bg-blue-50 text-blue-600 px-1.5 rounded">{node.cid_type}</span>
            {hasPropagation && (
              <span className="text-xs bg-orange-100 text-orange-700 px-1.5 rounded flex items-center gap-1">
                <Layers className="w-3 h-3" /> Propagated
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><Plus className="w-4 h-4"/></button>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4"/></button>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="border-l-2 border-slate-100 ml-3">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Panel: Filters */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-bold text-slate-800">Tree Filters</h2>
          <p className="text-xs text-slate-500">Filter tree matrix by dimensions.</p>
        </div>
        
        <div className="p-4 space-y-6 flex-1">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Media Config</label>
            <select 
              value={selectedMediaConfig} 
              onChange={e => setSelectedMediaConfig(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded p-1.5 text-sm"
            >
              <option value="all">ALL CONFIGS</option>
              {profile?.mediaConfigs?.map((m: any) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Class / Cabin</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded p-1.5 text-sm"
            >
              <option value="all">ALL CLASSES</option>
              {profile?.classes?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.mma_display_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Language</label>
            <select 
              value={selectedLanguage} 
              onChange={e => setSelectedLanguage(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded p-1.5 text-sm"
            >
              <option value="all">ALL LANGUAGES</option>
              <option value="en">English</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Panel: Tree Builder */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-indigo-600" />
              Category Matrix Builder
            </h1>
            <p className="text-xs text-slate-500">Currently managing Category Set ID: <span className="font-mono">{id}</span></p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Import Tree</Button>
            <Button variant="primary" size="sm" className="flex items-center gap-1"><Plus className="w-4 h-4" /> Add Root Category</Button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto bg-slate-50">
          {tree.length === 0 ? (
            <div className="text-center text-slate-400 py-10 bg-white border border-dashed border-slate-300 rounded-lg">
              <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No categories found for this filter combination.</p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[500px]">
              {tree.map(renderNode)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
