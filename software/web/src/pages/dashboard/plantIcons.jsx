/*
 * A fixed pool of filled cactus silhouettes. Each plant is assigned one
 * deterministically from its id, so the same plant always shows the same icon
 * without storing the choice anywhere. Add more marks here to widen the pool.
 */
const base = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "currentColor",
};

// Arms and stems are drawn as thick round-capped strokes, which renders as a
// solid silhouette with smooth elbows.
const limb = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const POT = "M5.5 15h13l-1.4 5.6a1.5 1.5 0 0 1-1.46 1.1H8.36a1.5 1.5 0 0 1-1.46-1.1z";

const ICONS = [
  // Saguaro, two arms
  <svg {...base}>
    <g {...limb}>
      <path d="M12 21V5" />
      <path d="M12 14H9.5Q7 14 7 11V9" />
      <path d="M12 11.5h2.5Q17 11.5 17 8.5V7" />
    </g>
  </svg>,
  // Saguaro, one arm
  <svg {...base}>
    <g {...limb}>
      <path d="M11.5 21V6" />
      <path d="M11.5 13H14Q16.5 13 16.5 10V8" />
    </g>
  </svg>,
  // Organ pipe
  <svg {...base}>
    <g {...limb} strokeWidth="3">
      <path d="M12 21V4.5" />
      <path d="M12 20.5Q7.5 20.5 7.5 16V8.5" />
      <path d="M12 20.5Q16.5 20.5 16.5 16V7" />
      <path d="M7.5 20.5Q3.5 20.5 3.5 17V13" />
      <path d="M16.5 20.5Q20.5 20.5 20.5 17V11.5" />
    </g>
  </svg>,
  // Ribbed barrel
  <svg {...base}>
    <ellipse cx="6.4" cy="15.7" rx="1.05" ry="4.3" />
    <ellipse cx="9.2" cy="14" rx="1.05" ry="6" />
    <ellipse cx="12" cy="13.2" rx="1.05" ry="6.8" />
    <ellipse cx="14.8" cy="14" rx="1.05" ry="6" />
    <ellipse cx="17.6" cy="15.7" rx="1.05" ry="4.3" />
  </svg>,
  // Barrel in bloom
  <svg {...base}>
    <circle cx="12" cy="14" r="6.5" />
    <circle cx="12" cy="5.4" r="1.9" />
  </svg>,
  // Prickly pear
  <svg {...base}>
    <ellipse cx="11" cy="15.5" rx="5" ry="5.5" />
    <ellipse cx="16.5" cy="9.5" rx="3.2" ry="3.8" transform="rotate(25 16.5 9.5)" />
    <ellipse cx="6.6" cy="9.2" rx="2.6" ry="3.2" transform="rotate(-25 6.6 9.2)" />
  </svg>,
  // Bunny ears
  <svg {...base}>
    <ellipse cx="12" cy="16" rx="5" ry="5.2" />
    <ellipse cx="8.7" cy="8.6" rx="2.4" ry="3.4" transform="rotate(-12 8.7 8.6)" />
    <ellipse cx="15.3" cy="8.6" rx="2.4" ry="3.4" transform="rotate(12 15.3 8.6)" />
  </svg>,
  // Agave
  <svg {...base}>
    <g {...limb} strokeWidth="2.3">
      <path d="M12 20V9.5" />
      <path d="M12 20 7.2 11M12 20l4.8-9M12 20 3.6 14.5M12 20l8.4-5.5M12 20 5 17.6M12 20l7-2.4" />
    </g>
  </svg>,
  // Aloe
  <svg {...base}>
    <g {...limb} strokeWidth="2.7">
      <path d="M12 20.5V11.5" />
      <path d="M12 20.5Q6.2 18 5.8 10.5" />
      <path d="M12 20.5Q17.8 18 18.2 10.5" />
    </g>
  </svg>,
  // Clump
  <svg {...base}>
    <circle cx="7.8" cy="16.6" r="4.4" />
    <circle cx="15.8" cy="16" r="4.9" />
    <circle cx="11.6" cy="9.6" r="3.9" />
    <circle cx="17.6" cy="8.4" r="1.5" />
  </svg>,
  // Potted prickly pear
  <svg {...base}>
    <ellipse cx="11.6" cy="10" rx="4.6" ry="5" />
    <ellipse cx="16.6" cy="6.6" rx="2.3" ry="2.8" transform="rotate(25 16.6 6.6)" />
    <path d={POT} />
  </svg>,
  // Bishop's cap
  <svg {...base}>
    <circle cx="12" cy="12.5" r="4.2" />
    {[0, 72, 144, 216, 288].map((deg) => (
      <ellipse
        key={deg}
        cx="12"
        cy="7.9"
        rx="3"
        ry="4.6"
        transform={`rotate(${deg} 12 12.5)`}
      />
    ))}
  </svg>,
];

// Stable string hash so a plant keeps its icon across reloads and re-orders.
export function getPlantIcon(id) {
  const key = String(id);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % ICONS.length;
  }
  return ICONS[hash];
}