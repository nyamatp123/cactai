// Shown when moisture is below the plant type's thirst line.
// Colors live in CSS (StatCards.theme.css) keyed by `key`, so both themes work.
const NEEDS_WATER = { key: 'needs-water', label: 'Needs water' };

// Moisture bands for a cactus that isn't thirsty
const MOISTURE_BANDS = [
    { max: 40, key: 'healthy', label: 'Healthy zone' },
    { max: 60, key: 'well', label: 'Well watered' },
    { max: 80, key: 'wet', label: 'Too wet' },
    { max: 100, key: 'over', label: 'Overwatered' },
];

function getMoistureBand(pct, needsWater) {
    if (pct == null) return null;
    if (needsWater) return NEEDS_WATER;
    return MOISTURE_BANDS.find(b => pct < b.max) ?? MOISTURE_BANDS[MOISTURE_BANDS.length - 1];
}

function MoistureRing({ pct }) {
    const R = 38;
    const size = 100;
    const cx = size / 2;
    const cy = size / 2;
    const circ = 2 * Math.PI * R;
    const safePct = Math.min(100, Math.max(0, pct ?? 0));
    const arc = (safePct / 100) * circ;

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width="90" height="90" aria-hidden="true">
            <circle className="ring-track" cx={cx} cy={cy} r={R} fill="none" strokeWidth="11" />
            {safePct > 0 && (
                <circle
                    className="ring-arc"
                    cx={cx}
                    cy={cy}
                    r={R}
                    fill="none"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={`${arc} ${circ}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                />
            )}
            <text
                className="ring-text"
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
            >
                {pct != null ? `${safePct}%` : '—'}
            </text>
        </svg>
    );
}

function LightPill({ level }) {
    return <span className="stat-light-pill">{level}</span>;
}

// TODO: wire onWaterNow to backend when available
export default function StatCards({
    current,
    averages,
    needsWater,
    lightLevel,
    avgLabel = 'Avg today',
    onWaterNow,
}) {
    const moisture = current?.moisture ?? null;
    const lux = current?.light ?? null;
    const avgMoisture = averages?.moisture ?? null;
    const avgLux = averages?.light ?? null;

    const band = getMoistureBand(moisture, needsWater);

    return (
        <div className="stat-cards-row">
            {/* Left: Soil moisture */}
            <div className="stat-card stat-card--moisture" data-band={band?.key ?? 'empty'}>
                <div className="stat-card-ring">
                    <MoistureRing pct={moisture != null ? Math.round(moisture) : null} />
                </div>
                <div className="stat-card-body">
                    <span className="stat-card-label">Soil moisture</span>
                    <span className="stat-card-status">
                        {moisture == null ? '—' : band?.label}
                    </span>
                    {needsWater && (
                        <button className="stat-water-btn" onClick={onWaterNow} type="button">
                            Water now
                        </button>
                    )}
                </div>
            </div>

            {/* Right column */}
            <div className="stat-cards-right">
                {/* Light now */}
                <div className="stat-card stat-card--light">
                    <div className="stat-card-light-top">
                        <span className="stat-card-label">Light now</span>
                        <LightPill level={lux == null ? '—' : lightLevel} />
                    </div>
                    <span className="stat-card-big-num">
                        {lux != null ? lux.toLocaleString() : '—'}
                    </span>
                </div>

                {/* Avg today */}
                <div className="stat-card stat-card--avg">
                    <span className="stat-card-label">{avgLabel}</span>
                    <span className="stat-card-avg-text">
                        {avgMoisture != null ? `${avgMoisture}%` : '—'}
                        {' · '}
                        {avgLux != null ? avgLux.toLocaleString() : '—'}
                    </span>
                </div>
            </div>
        </div>
    );
}