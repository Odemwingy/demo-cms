import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const MOCK_CLASSES = [
  { id: '1', profile: 'eXK-1', mediaConfig: 'All', displayName: 'All', exportedClasses: ['Economy', 'PremiumEconomy', 'Business'] },
  { id: '2', profile: 'eXK-1', mediaConfig: 'NewConfig', displayName: 'Special First', exportedClasses: ['FCRC', 'CCRC', 'First2'] },
  { id: '3', profile: 'eXK-1', mediaConfig: 'NewConfig', displayName: 'Special Business', exportedClasses: ['Business'] },
];

export function ClassManager() {
  const [classes] = useState(MOCK_CLASSES);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Class Configurations</h2>
        <Button variant="primary" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Class
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
            <tr>
              <th className="px-6 py-3 font-semibold">Profile</th>
              <th className="px-6 py-3 font-semibold">Media Config</th>
              <th className="px-6 py-3 font-semibold">MMA Display Name</th>
              <th className="px-6 py-3 font-semibold">Exported Classes</th>
              <th className="px-6 py-3 font-semibold text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-700">{c.profile}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${c.mediaConfig === 'All' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                    {c.mediaConfig}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{c.displayName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {c.exportedClasses.map(ec => (
                      <span key={ec} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded border border-indigo-100">
                        {ec}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No classes configured yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
