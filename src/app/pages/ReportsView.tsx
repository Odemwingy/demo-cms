import React, { useState, useEffect } from 'react';
import { BarChart3, Filter, Download, ExternalLink } from 'lucide-react';
import { cn } from '../components/ui/Button';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import { useAuth } from '../AuthContext';

const REPORT_TABS = [
  { id: 'media', label: 'Media Report' },
  { id: 'change-request', label: 'Change Request Report' },
  { id: 'lcs-vls', label: 'LCS/VLS Report' },
  { id: 'qc', label: 'QC Report' },
  { id: 'action', label: 'Action Report' },
];

export function ReportsView() {
  const [activeTab, setActiveTab] = useState('media');
  const { selectedAirline, selectedCycle } = useAuth();
  const [mediaData, setMediaData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'media') {
      let url = '/api/media';
      const params = new URLSearchParams();
      if (selectedAirline) params.append('airline_id', selectedAirline);
      if (selectedCycle) params.append('cycle', selectedCycle);

      setIsLoading(true);
      fetch(url + (params.toString() ? `?${params.toString()}` : ''))
        .then(res => res.json())
        .then(data => {
          setMediaData(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [selectedAirline, selectedCycle, activeTab]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-8 flex flex-col gap-6 shrink-0 z-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reports Center</h1>
            <p className="text-slate-500 mt-2">Generate and export system reports across all media cycles.</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Selected
          </Button>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {REPORT_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 relative">
        {activeTab === 'media' && (
          <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Advanced Filters Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                <Filter className="w-5 h-5 text-indigo-500" />
                Advanced Report Filter
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UID/SID/Title</label>
                  <input type="text" placeholder="Search ID or Title..." className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Media Type</label>
                  <Select>
                    <option>All Media Types</option>
                    <option>Video - Movie</option>
                    <option>Video - TV Episode</option>
                    <option>Audio - Album</option>
                    <option>Game</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lab / Distributor</label>
                  <input type="text" placeholder="e.g. West Entertainment" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Config</label>
                  <Select>
                    <option>All Systems</option>
                    <option>eXW / eXO</option>
                    <option>eX2 / eX3 / eFX</option>
                    <option>S3Ki L3</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sign-Off Status</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked /> Pending
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked /> Full Sign-Off
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">QC Status</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked /> Passed
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked /> Failed
                    </label>
                    <label className="flex items-center gap-1.5 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked /> Untested
                    </label>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">Apply Filters</Button>
                </div>
              </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>UID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Media Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Aspect Ratio</TableHead>
                    <TableHead>Sign-off Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading data...</TableCell>
                    </TableRow>
                  ) : mediaData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">No media data available for the selected cycle.</TableCell>
                    </TableRow>
                  ) : (
                    mediaData.slice(0, 50).map((m: any) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium text-indigo-600">{m.uid}</TableCell>
                        <TableCell className="text-slate-800 max-w-[200px] truncate">{m.title}</TableCell>
                        <TableCell className="text-slate-600">{m.video_type || m.audio_type || 'Unknown'}</TableCell>
                        <TableCell className="text-slate-600">{m.duration || '--'}</TableCell>
                        <TableCell className="text-slate-600">{m.aspect_ratio || '--'}</TableCell>
                        <TableCell>
                          <Badge variant={m.sign_off_status === 'Full Sign-Off' ? 'success' : 'warning'}>
                            {m.sign_off_status || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
                <span>Showing {mediaData.length > 0 ? 1 : 0} to {Math.min(mediaData.length, 50)} of {mediaData.length} entries</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Prev</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 'media' && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-12 h-12 text-indigo-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{REPORT_TABS.find(t => t.id === activeTab)?.label}</h3>
            <p className="text-slate-500 max-w-md mt-3">
              This report type is available in the full implementation. It provides specialized data views and Excel exports based on Envee guidelines.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
