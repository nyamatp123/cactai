import { lightLabel } from './plantStatus';

// Moisture bands for a cactus
const MOISTURE_BANDS = [
  { max: 20,  label: 'Needs water',  bg: '#F8E3D8', arc: '#C4572F', track: '#F0CBB9', showWater: true  },
  { max: 40,  label: 'Healthy zone', bg: '#FEF9C3', arc: '#C9A217', track: '#EDE7A0', showWater: false },
  { max: 60,  label: 'Well watered', bg: '#DDE9D6', arc: '#3F7A55', track: '#B8D4BC', showWater: false },
  { max: 80,  label: 'Too wet',      bg: '#F5D0C8', arc: '#8B2E1F', track: '#E8B8B0', showWater: false },
  { max: 100, label: 'Overwatered',  bg: '#E8AFA3', arc: '#5C1409', track: '#D49088', showWater: false },
];

function getMoistureBand(pct) {
  if (pct == null) return null;
  return MOISTURE_BANDS.find(b => pct < b.max) ?? MOISTURE_BANDS[MOISTURE_BANDS.length - 1];
}


function MoistureRing({ pct, arcColor, trackColor }) {
  const R = 38;
  const size = 100;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * R;
  const safePct = Math.min(100, Math.max(0, pct ?? 0));
  const arc = (safePct / 100) * circ;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="90" height="90" aria-hidden="true">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={trackColor ?? '#F0CBB9'} strokeWidth="11" />
      {safePct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={arcColor ?? '#C4572F'}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      )}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="600"
        fill="#1f3329"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {pct != null ? `${safePct}%` : '—'}
      </text>
    </svg>
  );
}

function LightPill({ level }) {
  return (
    <span className="stat-light-pill">
      {level}
    </span>
  );
}

// TODO: wire onWaterNow to backend when available
export default function StatCards({ readings, onWaterNow }) {
  const hasData = readings != null;
  const moisture = hasData ? readings.latestMoisture : null;
  const lux = hasData ? readings.latestLux : null;
  const avgMoisture = hasData ? readings.avgMoisture : null;
  const avgLux = hasData ? readings.avgLux : null;

  const band = getMoistureBand(moisture);
  const level = lightLabel(lux);

  return (
    <div className="stat-cards-row">
      {/* Left: Soil moisture */}
      <div className="stat-card stat-card--moisture" style={{ background: band?.bg ?? '#F4F4F4' }}>
        <div className="stat-card-ring">
          <MoistureRing
            pct={moisture != null ? Math.round(moisture) : null}
            arcColor={band?.arc}
            trackColor={band?.track}
          />
        </div>
        <div className="stat-card-body">
          <span className="stat-card-label">Soil moisture</span>
          <span className="stat-card-status">
            {moisture == null ? '—' : band?.label}
          </span>
          {band?.showWater && (
            <button className="stat-water-btn" onClick={onWaterNow} type="button">
              Water now
            </button>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="stat-cards-right">
        {/* Light now */}
        <div className="stat-card stat-card--light" style={{ background: '#F8EFC9' }}>
          <div className="stat-card-light-top">
            <span className="stat-card-label">Light now</span>
            <LightPill level={lux == null ? '—' : level} />
          </div>
          <span className="stat-card-big-num">
            {lux != null ? lux.toLocaleString() : '—'}
          </span>
        </div>

        {/* Avg today */}
        <div className="stat-card stat-card--avg" style={{ background: '#DDE9D6' }}>
          <span className="stat-card-label">Avg today</span>
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
