import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

const LABEL = { day: 'Light across the day', week: 'Light across the week', month: 'Light across the month' };
const TICK = { fontSize: 11, fill: 'var(--faint)' };

// 20000 -> "20k"
function shortNumber(v) {
    return Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}k` : `${v}`;
}

// `data` comes from mergeReadings.js: sampleLight is the CSV history and light
// is live. A row has one or the other, so the stacked bars never overlap.
export default function LightChart({ data, timeRange = 'day', lightUnit = 'lux', hasLive = false, liveStartIndex = -1 }) {
    const labelAt = i => data[i]?.label ?? '';

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
                    dataKey="idx"
                    tickFormatter={labelAt}
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
                    cursor={{ fill: 'var(--chart-cursor)' }}
                    contentStyle={{
                        fontSize: 12,
                        background: 'var(--surface)',
                        color: 'var(--ink)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px var(--shadow)',
                    }}
                    labelStyle={{ color: 'var(--muted)' }}
                    itemStyle={{ color: 'var(--ink)' }}
                    labelFormatter={labelAt}
                    formatter={v => [v == null ? '—' : `${v.toLocaleString()}${lightUnit === 'lux' ? ' lux' : ''}`, 'Light']}
                />
                {liveStartIndex > 0 && (
                    <ReferenceLine
                        x={liveStartIndex}
                        stroke="var(--faint)"
                        strokeDasharray="3 3"
                        label={{ value: 'Live', position: 'insideTopRight', fontSize: 11, fill: 'var(--muted)' }}
                    />
                )}
                {/* With no live points the history is drawn exactly like it always was */}
                <Bar
                    dataKey="sampleLight"
                    stackId="light"
                    fill={hasLive ? 'var(--chart-light-history-faded)' : 'var(--chart-light-history)'}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                />
                <Bar dataKey="light" stackId="light" fill="var(--chart-light)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
        </div>
    );
}