import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router';

const MOCK_CATEGORY_SETS = [
  { id: '1', name: 'Set-01', system: 'eX2/eX1 International', createdOn: '2015-05-12', createdBy: 'Admin', appliedCycles: 6 },
  { id: '2', name: 'Set-02', system: 'eFx Dom', createdOn: '2016-11-20', createdBy: 'System', appliedCycles: 2 },
  { id: '3', name: 'eX3 Default', system: 'New eX3', createdOn: '2018-01-05', createdBy: 'Admin', appliedCycles: 12 },
];

export function CategorySetManager() {
  const [sets] = useState(MOCK_CATEGORY_SETS);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Category Sets</h2>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category Set
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
            <tr>
              <th className="px-6 py-3 font-semibold">System Profile</th>
              <th className="px-6 py-3 font-semibold">Category Set Name</th>
              <th className="px-6 py-3 font-semibold">Created On</th>
              <th className="px-6 py-3 font-semibold">Created By</th>
              <th className="px-6 py-3 font-semibold text-center">Applied Programs (Cycles)</th>
              <th className="px-6 py-3 font-semibold text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sets.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{s.system}</td>
                <td className="px-6 py-4 text-indigo-600 font-medium cursor-pointer hover:underline" onClick={() => navigate('/administration/category-tree')}>
                  {s.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{s.createdOn}</td>
                <td className="px-6 py-4 text-slate-500">{s.createdBy}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    {s.appliedCycles}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View/Edit Tree" onClick={() => navigate('/administration/category-tree')}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {sets.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No category sets configured yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
