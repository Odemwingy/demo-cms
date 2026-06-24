import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { Activity, GitPullRequest, FileText, Edit2, Info, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function HomeView() {
  const { selectedAirline, selectedCycle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [allMedia, setAllMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  useEffect(() => {
    let url = '/api/media';
    const params = new URLSearchParams();
    if (selectedAirline) params.append('airline_id', selectedAirline);
    if (selectedCycle) params.append('cycle', selectedCycle);
    if (params.toString()) url += `?${params.toString()}`;

    setIsLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setAllMedia(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedAirline, selectedCycle]);

  const [localMedia, setLocalMedia] = useState<any[]>([]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isSorted, setIsSorted] = useState(false);

  const categoryMedia = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'ROOT') return allMedia;
    return allMedia.filter(m => (m.video_type === selectedCategory || m.audio_type === selectedCategory || (!m.video_type && !m.audio_type && selectedCategory === 'Uncategorized')));
  }, [allMedia, selectedCategory]);

  useEffect(() => {
    setLocalMedia(categoryMedia);
    setIsSorted(false);
  }, [categoryMedia]);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragEnter = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const items = [...localMedia];
    const draggedItem = items[draggedIdx];
    items.splice(draggedIdx, 1);
    items.splice(idx, 0, draggedItem);
    setDraggedIdx(idx);
    setLocalMedia(items);
    setIsSorted(true);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const handleSaveSort = () => {
    alert('Sort order saved successfully!');
    setIsSorted(false);
    setSelectedRowId(null);
  };

  const handleResetSort = () => {
    setLocalMedia(categoryMedia);
    setIsSorted(false);
  };

  const handleUIDClick = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    window.open(`/metadata/video?uid=${uid}`, '_blank', 'width=1000,height=800');
  };

  return (
    <div className="flex h-full w-full bg-slate-50/50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <div className="flex-1 flex flex-col overflow-hidden">

            {/* Toolbar Area */}
            <div className="bg-white border-b border-slate-200 shrink-0">
              <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-orange-500 text-white">
                <div className="text-sm font-semibold flex items-center gap-2">
                  <span>Routes: Default | Class: All | Category: {selectedCategory}</span>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-xs font-bold text-white hover:text-orange-200"
                >
                  BACK
                </button>
              </div>
              
              <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between min-h-[48px]">
                {(selectedRowId || isSorted) ? (
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-sm font-semibold text-slate-700">{selectedRowId ? `1 of ${localMedia.length} row(s) selected` : 'Sort order modified'}</span>
                    {selectedRowId && <button onClick={() => setSelectedRowId(null)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">CLEAR SELECTION</button>}
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 rounded transition-colors flex items-center gap-1 opacity-50 cursor-not-allowed">
                        <Edit2 className="w-3.5 h-3.5"/> EDIT(1)
                      </button>

                      <button 
                        onClick={handleSaveSort}
                        className={`px-3 py-1.5 text-xs font-bold text-white border rounded transition-colors ${isSorted ? 'bg-slate-800 border-slate-900 hover:bg-slate-900' : 'bg-slate-400 border-slate-400 cursor-not-allowed'}`}>
                        SAVE
                      </button>
                      <button 
                        onClick={handleResetSort}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded transition-colors">
                        RESET
                      </button>

                    </div>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                      <button className="text-xs font-bold text-slate-600 border border-slate-300 px-2 py-1 rounded hover:bg-slate-50">SORT ▾</button>
                      <button className="text-xs font-bold text-slate-600 border border-slate-300 px-2 py-1 rounded hover:bg-slate-50 flex items-center gap-1">⇄ RE-CHANNEL</button>
                      <button className="text-xs font-bold text-white bg-indigo-600 border border-indigo-700 px-2 py-1 rounded hover:bg-indigo-700 flex items-center gap-1">- UN-CHANNEL</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Add Media</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Add to Bundle</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Group</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Ungroup</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Remove</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Add to Category(s)</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Sync With...</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Create Version</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded transition-colors whitespace-nowrap">Excel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-white">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-12 text-center bg-slate-200">POS</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-12 text-center bg-slate-200 border-l border-white">CHN</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-12 text-center bg-slate-200 border-l border-white">SI</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-16 text-center bg-slate-200 border-l border-white">GRP</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-24 bg-slate-200 border-l border-white">UID</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 bg-slate-200 border-l border-white">TITLE</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-48 text-center bg-slate-200 border-l border-white">SOUNDTRACKS</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-24 text-center bg-slate-200 border-l border-white">R/T</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-24 text-center bg-slate-200 border-l border-white">RATING</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-48 text-center bg-slate-200 border-l border-white">FILENAME</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-24 text-center bg-slate-200 border-l border-white">FILESIZE</th>
                    <th className="px-2 py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-300 w-12 text-center bg-slate-200 border-l border-white">ADV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500">
                        Loading media...
                      </td>
                    </tr>
                  ) : localMedia.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500">
                        No media found for {selectedCategory}
                      </td>
                    </tr>
                  ) : (
                    localMedia.map((media, idx) => {
                      const isSelected = selectedRowId === media.id;
                      return (
                        <tr 
                          key={media.id} 
                          onClick={() => setSelectedRowId(isSelected ? null : media.id)}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragEnter={() => handleDragEnter(idx)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => e.preventDefault()}
                          className={`transition-colors cursor-pointer ${isSelected ? 'bg-indigo-50/80 border-y border-indigo-200 shadow-sm relative z-10' : 'hover:bg-slate-50'} ${draggedIdx === idx ? 'opacity-50 bg-slate-200' : ''}`}
                        >
                          <td className="px-2 py-1.5 text-xs text-slate-700 text-center font-medium border-r border-slate-100">{idx + 1}</td>
                          <td className="px-2 py-1.5 text-xs text-red-500 font-medium text-center border-r border-slate-100">{media.chn || (idx % 2 === 0 ? '0' : '')}</td>
                          <td className="px-2 py-1.5 text-xs text-slate-700 text-center border-r border-slate-100">0</td>
                          <td className="px-2 py-1.5 text-xs text-slate-400 text-center border-r border-slate-100">--</td>
                          <td className="px-2 py-1.5 text-xs border-r border-slate-100">
                            <span 
                              onClick={(e) => handleUIDClick(e, media.uid)}
                              className="text-indigo-600 font-bold hover:underline cursor-pointer"
                            >
                              {media.uid}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-xs font-bold text-slate-800 truncate max-w-[200px] border-r border-slate-100">{media.title}</td>
                          <td className="px-2 py-1.5 text-xs text-center border-r border-slate-100">
                            {media.soundtracks ? (
                              <div className="flex gap-1 justify-center flex-wrap">
                                {media.soundtracks.split(',').map((s: string) => (
                                  <span key={s} className="px-2 py-0.5 border border-blue-300 text-blue-700 rounded-full text-[9px] bg-white whitespace-nowrap">{s.trim() || 'ENG'}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 border border-blue-300 text-blue-700 rounded-full text-[9px] bg-white whitespace-nowrap">ENG</span>
                            )}
                          </td>
                          <td className="px-2 py-1.5 text-xs text-slate-700 text-center border-r border-slate-100 font-medium">{media.duration || '00:00:00'}</td>
                          <td className="px-2 py-1.5 text-xs text-slate-500 text-center border-r border-slate-100">{media.rating || 'N/R'}</td>
                          <td className="px-2 py-1.5 text-xs text-slate-600 truncate max-w-[150px] border-r border-slate-100 text-center">{media.filename || `${media.uid}_asset.mp4`}</td>
                          <td className="px-2 py-1.5 text-xs text-slate-600 text-right border-r border-slate-100">{media.filesize || '0.02 GiB'}</td>
                          <td className="px-2 py-1.5 text-xs text-center text-slate-400 hover:text-indigo-600">
                            <Edit2 className="w-3.5 h-3.5 mx-auto" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-2 text-xs text-slate-600 font-medium flex justify-between items-center shrink-0">
              <span>Fetched {localMedia.length} of {allMedia.length} total rows.</span>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
          </div>
      </div>
    </div>
  );
}
