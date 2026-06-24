import React, { useState } from 'react';
import { RefreshCcw, Archive, UploadCloud, AlertTriangle, PlayCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';

export function CycleView() {
  const [integrityPassed, setIntegrityPassed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignOff = async () => {
    const res = await fetch('/api/sign-off', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);
  };

  const handleIntegrityCheck = async () => {
    const res = await fetch('/api/integrity-check', { method: 'POST' });
    const data = await res.json();
    setIntegrityPassed(data.success);
    setMessage(data.message);
  };

  const handleExport = async () => {
    const res = await fetch('/api/export', { method: 'POST' });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Cycle Management</h1>
            <p className="text-slate-500 mt-2">Manage media cycles, perform integrity checks, and prepare for export.</p>
          </div>
          <Button size="lg" className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Create New Cycle
          </Button>
        </header>

        {message && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <CardContent className="relative z-10 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="success" className="uppercase tracking-wider">Active</Badge>
                <span className="text-sm font-medium text-slate-500">China Southern (CZ) • 2026/07 Cycle</span>
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Cycle Export Operations</h2>
              <p className="text-slate-600 max-w-xl">
                This cycle is currently open. Ensure all media is fully signed off before running the Integrity Check and generating the final XML export.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-medium mb-1">Total Media</p>
                  <p className="text-2xl font-bold text-slate-800">172</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-500 font-medium mb-1">Status</p>
                  <p className="text-2xl font-bold text-amber-600">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            <h3 className="text-lg font-bold mb-6 text-white/90">Quick Actions</h3>
            <div className="space-y-3 relative z-10">
              <button onClick={handleSignOff} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-300" />
                  <span className="font-medium text-sm">Sign Off Cycle</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-emerald-300" />
                  <span className="font-medium text-sm">Sync Status Sheet</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-300 group-hover:text-red-400" />
                  <span className="font-medium text-sm group-hover:text-red-100">Clear LCS/VLS</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <Card>
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Export Readiness</h3>
            <span className="text-sm font-medium text-slate-500">Integrity checks must pass before export</span>
          </div>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Run Integrity Check</h4>
                <p className="text-sm text-slate-600 mb-4">Validates media files, categories, required images, and DND flags.</p>
                <Button variant="secondary" onClick={handleIntegrityCheck}>
                  Check Now
                </Button>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <UploadCloud className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Create Export</h4>
                <p className="text-sm text-slate-600 mb-4">Generate export package (XML) for deployment.</p>
                <Button 
                  onClick={handleExport}
                  disabled={!integrityPassed}
                  variant="default"
                >
                  {integrityPassed ? 'Create Export XML' : 'Export Locked'}
                </Button>
                {!integrityPassed && (
                  <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Requires Integrity Check pass
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
