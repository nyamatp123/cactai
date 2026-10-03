import { isThirsty, lightLabel } from './plantStatus';
import cactusTips from './cactusTips';
import useRotatingTip from '../../hooks/useRotatingTip';

function CactusSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true" fill="none">
      {/* shadow ellipse */}
      <ellipse cx="45" cy="82" rx="22" ry="5" fill="#E6EDE0" />
      {/* pot body */}
      <path d="M31 62 L59 62 L55 80 L35 80 Z" fill="#E8B79F" />
      {/* pot rim */}
      <rect x="28" y="57" width="34" height="7" rx="3" fill="#D79B80" />
      {/* main stem */}
      <rect x="40" y="18" width="10" height="42" rx="5" fill="#3F7A55" />
      {/* left arm */}
      <rect x="22" y="30" width="20" height="8" rx="4" fill="#3F7A55" />
      <rect x="22" y="20" width="8" height="18" rx="4" fill="#5F9272" />
      {/* right arm */}
      <rect x="48" y="36" width="18" height="8" rx="4" fill="#3F7A55" />
      <rect x="58" y="24" width="8" height="20" rx="4" fill="#5F9272" />
      {/* cactus top cap */}
      <ellipse cx="45" cy="18" rx="5" ry="4" fill="#5F9272" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 1 L10.2 7.8 L17 9 L10.2 10.2 L9 17 L7.8 10.2 L1 9 L7.8 7.8 Z"
        fill="#fff"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3 L11 8 L6 13" stroke="#3F7A55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PlantPanel({ plant, readings, lastWatered, onAskCactai }) {
  const moisture = readings?.latestMoisture ?? null;
  const lux = readings?.latestLux ?? null;

  const thirsty = isThirsty(moisture);
  const lightLevelLabel = lightLabel(lux);

  const rawTip = useRotatingTip(cactusTips);
  const tip = rawTip.startsWith('Tip: ') ? rawTip.slice(5) : rawTip;

  const soilLabel = moisture == null ? '—' : thirsty ? 'Dry' : 'Moist';
  const soilColor = moisture == null ? '#5e7266' : thirsty ? '#C4572F' : '#3F7A55';

  const lightColors = { Bright: '#3F7A55', Medium: '#B8962B', Low: '#C4572F', '—': '#5e7266' };
  const lightColor = lightColors[lightLevelLabel] ?? '#5e7266';

  function moodLine(m) {
    if (m == null) return '—';
    if (m < 20)  return 'Your plant is feeling a bit dry';
    if (m < 40)  return 'Your plant is feeling great!';
    if (m < 60)  return 'Your plant is a bit wet but great overall';
    if (m < 80)  return "Your plant is getting rained on!! No more water for a while";
    return "Your plant is drowning, try draining some water please";
  }
  const mood = moodLine(moisture);

  return (
    <aside className="plant-panel">
      {/* 1. Plant card */}
      <div className="pp-card pp-plant-card">
        <CactusSVG />
        <p className="pp-plant-name">{plant?.name ?? 'Your plant'}</p>
        <p className="pp-plant-mood">{mood}</p>
      </div>

      {/* 2. Plant details card */}
      <div className="pp-card pp-details-card">
        <p className="pp-details-title">Plant details</p>
        <div className="pp-detail-row">
          <span className="pp-detail-label">Soil</span>
          <span className="pp-detail-value" style={{ color: soilColor }}>{soilLabel}</span>
        </div>
        <div className="pp-detail-row">
          <span className="pp-detail-label">Light</span>
          <span className="pp-detail-value" style={{ color: lightColor }}>{lightLevelLabel}</span>
        </div>
        <div className="pp-detail-row">
          <span className="pp-detail-label">Last watered</span>
          {/* TODO: lastWatered will come from the backend later */}
          <span className="pp-detail-value" style={{ color: '#1f3329' }}>{lastWatered ?? '—'}</span>
        </div>
      </div>

      {/* 3. Tip card */}
      {tip && (
        <div className="pp-card pp-tip-card">
          <p className="pp-tip-heading">Tip</p>
          <p className="pp-tip-text">{tip}</p>
        </div>
      )}

      {/* 4. Ask Cactai button */}
      {/* TODO: chat panel is not built yet — button calls onAskCactai only */}
      <button
        type="button"
        className="pp-ask-btn"
        onClick={onAskCactai}
        aria-label="Ask Cactai to analyze your data"
      >
        <span className="pp-ask-icon" aria-hidden="true">
          <SparkleIcon />
        </span>
        <span className="pp-ask-text">
          <span className="pp-ask-primary">Ask Cactai</span>
          <span className="pp-ask-secondary">Analyze your data</span>
        </span>
        <ChevronRight />
      </button>
    </aside>
  );
}
