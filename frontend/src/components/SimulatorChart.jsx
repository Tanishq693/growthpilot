import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';

export default function SimulatorChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-xs font-bold neo-box p-4 bg-yellow-100">
        Loading simulator telemetry...
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000] text-xs space-y-1 font-mono">
          <p className="font-extrabold text-cyan-400 border-b border-slate-700 pb-1 uppercase">{label} {data.is_dead_hour ? '(Dead Hour Slot)' : ''}</p>
          <p className="text-slate-200">Baseline Revenue: <span className="text-white font-bold">₹{data.baseline_revenue}</span></p>
          <p className="text-emerald-400 font-extrabold">Simulated Revenue: <span>₹{data.simulated_revenue}</span></p>
          {data.is_dead_hour && (
            <p className="text-amber-300 text-[10px] font-bold mt-1 pt-1 border-t border-slate-800">
              ⚡ Boosted via 15% OFF Paytm Link Primitive
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-60 sm:h-64 neo-box p-3 bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
          <XAxis 
            dataKey="hour_label" 
            tick={{ fontSize: 11, fill: '#0F172A', fontWeight: 'bold' }} 
            axisLine={{ stroke: '#0F172A', strokeWidth: 2 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#0F172A', fontWeight: 'bold' }} 
            axisLine={{ stroke: '#0F172A', strokeWidth: 2 }}
            tickLine={false}
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }}
            formatter={(value) => value === 'baseline_revenue' ? 'Baseline Revenue' : 'Simulated Revenue (Post-Campaign)'}
          />
          <Bar dataKey="baseline_revenue" name="baseline_revenue" fill="#94A3B8" stroke="#0F172A" strokeWidth={1.5} radius={[3, 3, 0, 0]} barSize={12} />
          <Bar dataKey="simulated_revenue" name="simulated_revenue" stroke="#0F172A" strokeWidth={1.5} radius={[3, 3, 0, 0]} barSize={12}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.is_dead_hour ? '#10B981' : '#00BAF2'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
