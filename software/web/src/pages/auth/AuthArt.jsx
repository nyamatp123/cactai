export function Blob() {
  return (
    <svg className="login__blob" viewBox="0 0 600 1000" preserveAspectRatio="xMaxYMid slice">
      <path
        fill="#d7e8d0"
        d="M600 0H190C160 120 230 225 330 262C190 335 115 455 138 565C160 660 228 700 262 722C130 795 62 900 42 1000H600Z"
      />
    </svg>
  );
}

export function CactusCluster() {
  const ink = "#243a30";
  return (
    <svg className="login__cacti" viewBox="0 0 500 420">
      {/* Saguaro: thick outline strokes, then fill strokes */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke={ink} strokeWidth="54">
          <path d="M258 380V90" />
          <path d="M258 250H214Q198 250 198 234V165" />
          <path d="M258 205H302Q318 205 318 189V135" />
        </g>
        <g stroke="#5c9a68" strokeWidth="46">
          <path d="M258 380V90" />
          <path d="M258 250H214Q198 250 198 234V165" />
          <path d="M258 205H302Q318 205 318 189V135" />
        </g>
        <g stroke="#7fb87f" strokeWidth="3">
          <path d="M248 100V370" />
          <path d="M268 100V370" />
          <path d="M198 170V230" />
          <path d="M318 140V185" />
        </g>
      </g>

      {/* Prickly pear */}
      <g stroke={ink} strokeWidth="4" fill="#86b96f">
        <ellipse cx="96" cy="262" rx="26" ry="38" transform="rotate(-22 96 262)" />
        <ellipse cx="152" cy="258" rx="25" ry="36" transform="rotate(20 152 258)" />
        <ellipse cx="124" cy="330" rx="38" ry="52" />
      </g>
      <g fill={ink}>
        <circle cx="112" cy="310" r="2.5" /><circle cx="136" cy="330" r="2.5" />
        <circle cx="118" cy="352" r="2.5" /><circle cx="92" cy="255" r="2.5" />
        <circle cx="155" cy="250" r="2.5" /><circle cx="104" cy="275" r="2.5" />
      </g>
      <circle cx="152" cy="220" r="9" fill="#e8798c" stroke={ink} strokeWidth="3" />

      {/* Barrel cactus */}
      <g stroke={ink} strokeWidth="4">
        <ellipse cx="370" cy="340" rx="58" ry="52" fill="#3f7a52" />
        <path d="M370 290V390M340 296Q326 340 340 386M400 296Q414 340 400 386" fill="none" stroke="#5c9a68" strokeWidth="3" />
      </g>
      <g stroke={ink} strokeWidth="3" fill="#f2a7b5">
        <circle cx="358" cy="288" r="8" /><circle cx="382" cy="288" r="8" /><circle cx="370" cy="280" r="8" />
      </g>
      <circle cx="370" cy="289" r="5" fill="#f6d36b" />

      {/* Small round cacti */}
      <circle cx="455" cy="372" r="30" fill="#6aa66f" stroke={ink} strokeWidth="4" />
      <circle cx="100" cy="396" r="22" fill="#5c9a68" stroke={ink} strokeWidth="4" />

      {/* Sand */}
      <path d="M10 460C80 410 140 368 250 368C380 368 450 376 500 386V460Z" fill="#ead9a6" />
      <path d="M10 460C80 410 140 368 250 368C380 368 450 376 500 386" fill="none" stroke={ink} strokeWidth="4" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.2l7.8 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.8l7.8-6.1z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.8 6.1C6.6 42.6 14.6 48 24 48z"/>
    </svg>
  );
}