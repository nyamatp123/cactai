import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, ReferenceLine,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { getMoistureData } from '../../utils/parseReadings';

const THIRST_LINE = 15;

export default function MoistureChart({ timeRange = 'day' }) {
  const data = useMemo(() => getMoistureData(timeRange), [timeRange]);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="chart-card-title">Moisture over time</span>
        <span className="chart-thirst-label">Thirst line {THIRST_LINE}%</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="moistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3e7a55" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3e7a55" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#7a8f82' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#7a8f82' }}
            tickLine={false}
            axisLine={false}
            tickCount={4}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            formatter={v => [`${v}%`, 'Moisture']}
          />
          <ReferenceLine
            y={THIRST_LINE}
            stroke="#c0392b"
            strokeDasharray="6 4"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="moisture"
            stroke="#3e7a55"
            fill="url(#moistGrad)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3e7a55' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
