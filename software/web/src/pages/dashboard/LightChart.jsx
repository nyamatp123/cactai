import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getLightData } from '../../utils/parseReadings';

const LABEL = { day: 'Light across the day', week: 'Light across the week', month: 'Light across the month' };

function barColor(lux) {
  if (lux > 300) return '#c8960a';
  if (lux > 150) return '#ddb030';
  if (lux > 50)  return '#e8c84a';
  return '#f0dc8a';
}

export default function LightChart({ timeRange = 'day' }) {
  const data = useMemo(() => getLightData(timeRange), [timeRange]);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="chart-card-title">{LABEL[timeRange]}</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 10, right: 16, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#7a8f82' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#7a8f82' }}
            tickLine={false}
            axisLine={false}
            tickCount={4}
            tickFormatter={v => `${v}`}
          />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            formatter={v => [`${v} lux`, 'Light']}
          />
          <Bar dataKey="lux" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.lux)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
