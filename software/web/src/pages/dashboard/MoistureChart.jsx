import {
    AreaChart, Area, XAxis, YAxis, ReferenceLine, Tooltip,
} from 'recharts';
import { THIRST_LINE } from './plantStatus';

const TICK = { fontSize: 11, fill: 'var(--faint)' };

// `data` comes from mergeReadings.js: sampleMoisture is the CSV history and
// moisture is live. The X axis uses idx because the two can repeat clock times.
export default function MoistureChart({ data, thirstLine = THIRST_LINE, hasLive = false, liveStartIndex = -1 }) {
    const livePoints = data.filter(r => r.moisture != null).length;
    const labelAt = i => data[i]?.label ?? '';

    const historyStroke = hasLive ? 'var(--chart-history-line)' : 'var(--chart-line)';
    const historyFill = hasLive ? 'var(--chart-history-fill)' : 'var(--chart-fill)';

    return (
        <div className="chart-card">
            <div className="chart-card-header">
                <span className="chart-card-title">Moisture over time</span>
                <span className="chart-thirst-label">Thirst line {thirstLine}%</span>
            </div>
            <AreaChart
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
                    domain={[0, 100]}
                    tick={TICK}
                    tickLine={false}
                    axisLine={false}
                    tickCount={4}
                    tickFormatter={v => `${v}%`}
                />
                <Tooltip
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
                    formatter={v => [v == null ? '—' : `${v}%`, 'Moisture']}
                />
                <ReferenceLine
                    y={thirstLine}
                    stroke="var(--chart-thirst)"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
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
                <Area
                    type="monotone"
                    dataKey="sampleMoisture"
                    stroke={historyStroke}
                    strokeDasharray={hasLive ? '4 4' : undefined}
                    fill={historyFill}
                    fillOpacity={1}
                    strokeWidth={hasLive ? 1.5 : 2}
                    dot={false}
                    activeDot={{ r: 4, fill: historyStroke }}
                    connectNulls={false}
                />
                <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="var(--chart-line)"
                    fill="var(--chart-fill)"
                    fillOpacity={1}
                    strokeWidth={2}
                    dot={livePoints < 3 ? { r: 3, fill: 'var(--chart-line)', strokeWidth: 0 } : false}
                    activeDot={{ r: 4, fill: 'var(--chart-line)' }}
                    connectNulls={false}
                />
            </AreaChart>
        </div>
    );
}