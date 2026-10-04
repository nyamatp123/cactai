import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';

const LABEL = { day: 'Light across the day', week: 'Light across the week', month: 'Light across the month' };
const TICK = { fontSize: 11, fill: '#7a8f82' };

// 20000 -> "20k"
function shortNumber(v) {
  return Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`;
}

export default function LightChart({ data, timeRange = 'day', lightUnit = 'lux' }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <span className="chart-card-title">{LABEL[timeRange]}</span>
      </div>
      <BarChart
        responsive
        style={{ width: '100%', height: 180 }}
        data={data}
        margin={{ top: 10, right: 16, bottom: 0, left: -20 }}
      >
        <XAxis
          dataKey="label"
          tick={TICK}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={28}
        />
        <YAxis
          tick={TICK}
          tickLine={false}
          axisLine={false}
          tickCount={4}
          tickFormatter={shortNumber}
        />
        <Tooltip
          cursor={{ fill: 'rgba(63, 122, 85, 0.06)' }}
          contentStyle={{
            fontSize: 12,
            background: '#fff',
            color: '#1f3329',
            border: 'none',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          labelStyle={{ color: '#5e7266' }}
          itemStyle={{ color: '#1f3329' }}
          formatter={v => [`${v.toLocaleString()}${lightUnit === 'lux' ? ' lux' : ''}`, 'Light']}
        />
        <Bar dataKey="light" fill="#F0D888" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </div>
  );
}
