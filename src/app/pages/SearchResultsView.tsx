import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, Loader2 } from 'lucide-react';

export function SearchResultsView() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'MMA';
  
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // We'll map the `type` parameter to standard search if necessary,
    // but the backend right now only has `/api/media?search=...`.
    // In a real scenario, the backend would filter by the type.
    setIsLoading(true);
    fetch(`/api/media?search=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [q, type]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Header matching screenshot */}
      <div className="bg-orange-500 text-white px-4 py-2 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 text-sm font-bold">
          <span>Search Results:</span>
          <span className="bg-white text-orange-600 px-2 py-0.5 rounded text-xs">{q}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center bg-white rounded text-slate-800">
            <Search className="w-3.5 h-3.5 text-orange-500 absolute left-2" />
            <input 
              type="text" 
              defaultValue={q}
              className="pl-7 pr-2 py-1 text-xs outline-none bg-transparent w-48 font-medium" 
              readOnly 
            />
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select className="border border-slate-300 rounded px-1 py-0.5 outline-none bg-slate-50">
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>entries</span>
        </div>
        <div>
          Fetched {results.length} results.
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm text-[10px] text-slate-600 font-bold uppercase">
            <tr>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">UID ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">MID TYPE ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white">SYSTEM ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">MID ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">METADATA ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white">GROUP TITLE ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white">ARTIST/CAST/AUTHOR ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white">TITLE ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">DURATION ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white">FILENAME ▲▼</th>
              <th className="px-3 py-2 border-b border-slate-300 bg-slate-200 border-l border-white text-center">STATUS ▲▼</th>
            </tr>
            {/* Inline Search Fields row */}
            <tr className="bg-slate-50">
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="UID" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><select className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white"><option></option></select></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><select className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white"><option></option></select></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="MID" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><select className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white"><option></option></select></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="Group Title" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="Artist/Cast/Author" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="Title" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="Duration" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><input className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white" placeholder="Filename" /></th>
              <th className="px-3 py-1 border-b border-slate-200 border-l border-white"><select className="w-full border border-slate-300 rounded px-1 py-0.5 text-xs text-slate-500 bg-white"><option></option></select></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Searching for {q}...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-500 font-medium">No results found for {type} = "{q}"</td>
              </tr>
            ) : (
              results.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 text-center font-medium text-slate-700">{item.uid}</td>
                  <td className="px-3 py-2 text-center text-slate-600">{item.video_type ? 'video' : 'audio'}</td>
                  <td className="px-3 py-2 text-slate-600 text-[10px] leading-tight">
                    eX3 eX3,eFX Qt - New GUI,<br/>eX3 Hainan NewGUI / eX3 NG Phase 2
                  </td>
                  <td className="px-3 py-2 text-center text-slate-700 font-medium">{item.id}</td>
                  <td className="px-3 py-2 text-center text-slate-600">English</td>
                  <td className="px-3 py-2 text-slate-600 font-medium"></td>
                  <td className="px-3 py-2 text-slate-600 font-medium">{item.director || 'Artist'}</td>
                  <td className="px-3 py-2 font-bold text-slate-800">
                    <span className="bg-orange-100 text-orange-800 px-1 rounded">{item.title}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-slate-600 font-medium">{item.duration || '00:00:00'}</td>
                  <td className="px-3 py-2 text-slate-600 font-mono">{item.filename || `${item.uid}ma.mp4`}</td>
                  <td className="px-3 py-2 text-center font-semibold text-slate-700">held</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
