import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const MOCK_ROUTES = [
  { id: '1', profile: 'eFx Intl', name: 'Japanese Group/Japanese', origin: 'NGO', dest: 'SPN', flightNum: 'NULL', info: 'Route:Japanese Group', mediaConfig: '0', scriptId: '0', paLangId: '0', soundId: '10', serviceId: '0' },
  { id: '2', profile: 'eFx Intl', name: 'Japanese Group/Japanese', origin: 'NGO', dest: 'MNL', flightNum: 'NULL', info: 'Route:Japanese Group', mediaConfig: '0', scriptId: '0', paLangId: '0', soundId: '10', serviceId: '0' },
  { id: '3', profile: 'eFx Intl', name: 'Australia Group', origin: 'SYD', dest: 'LAX', flightNum: 'NULL', info: 'Route:Australia Group', mediaConfig: '0', scriptId: '0', paLangId: '0', soundId: '1', serviceId: '0' },
  { id: '4', profile: 'eFx Intl', name: 'South America Group', origin: 'REC', dest: 'FOR', flightNum: 'NULL', info: 'Route:South America Group', mediaConfig: '0', scriptId: '0', paLangId: '0', soundId: '1', serviceId: '0' },
];

export function RouteManager() {
  const [routes] = useState(MOCK_ROUTES);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Routes Configuration</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import Routes
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Route
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm">
            <tr>
              <th className="px-4 py-3 font-semibold">Profile</th>
              <th className="px-4 py-3 font-semibold">Route Name</th>
              <th className="px-4 py-3 font-semibold">Origin</th>
              <th className="px-4 py-3 font-semibold">Dest</th>
              <th className="px-4 py-3 font-semibold">Flight No.</th>
              <th className="px-4 py-3 font-semibold">Info</th>
              <th className="px-4 py-3 font-semibold">Media Config</th>
              <th className="px-4 py-3 font-semibold" title="Script Config ID">Script ID</th>
              <th className="px-4 py-3 font-semibold" title="PA Language Config ID">PA Lang ID</th>
              <th className="px-4 py-3 font-semibold" title="Sound Config ID">Sound ID</th>
              <th className="px-4 py-3 font-semibold" title="Service Config ID">Service ID</th>
              <th className="px-4 py-3 font-semibold text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routes.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-700">{r.profile}</td>
                <td className="px-4 py-3 text-slate-600">{r.name}</td>
                <td className="px-4 py-3 text-indigo-600 font-medium">{r.origin}</td>
                <td className="px-4 py-3 text-indigo-600 font-medium">{r.dest}</td>
                <td className="px-4 py-3 text-slate-500">{r.flightNum}</td>
                <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]" title={r.info}>{r.info}</td>
                <td className="px-4 py-3 text-slate-500">{r.mediaConfig}</td>
                <td className="px-4 py-3 text-rose-600 font-medium text-center">{r.scriptId}</td>
                <td className="px-4 py-3 text-rose-600 font-medium text-center">{r.paLangId}</td>
                <td className="px-4 py-3 text-rose-600 font-medium text-center">{r.soundId}</td>
                <td className="px-4 py-3 text-slate-500 text-center">{r.serviceId}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No routes configured yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
