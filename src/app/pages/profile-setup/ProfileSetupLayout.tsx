import React from 'react';
import { Outlet } from 'react-router';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ProfileSetupLayout() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-4 shrink-0 shadow-sm z-10">
        <select className="border border-slate-300 rounded px-3 py-1.5 min-w-[200px] text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50 hover:bg-slate-100 transition-colors">
          <option>P2 - Air Pana</option>
          <option>HU - Hainan Airlines</option>
        </select>
        <Button variant="primary" size="sm" className="flex items-center gap-1 shadow-sm">
          <Plus className="w-4 h-4" /> Add New Program
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto bg-slate-100">
        <Outlet />
      </div>
    </div>
  );
}
