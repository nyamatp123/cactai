import { useState, useRef, useEffect } from 'react';
import { askCactai } from '../../api/cactai';
import { lightLabel, moistureLabel } from './plantStatus';

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 1 L10.2 7.8 L17 9 L10.2 10.2 L9 17 L7.8 10.2 L1 9 L7.8 7.8 Z" fill="currentColor" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="chat-bubble chat-bubble--cactai chat-typing" aria-label="Cactai is typing">
      <span className="chat-dot" style={{ animationDelay: '0ms' }} />
      <span className="chat-dot" style={{ animationDelay: '160ms' }} />
      <span className="chat-dot" style={{ animationDelay: '320ms' }} />
    </div>
  );
}

// Readings card shown under replies about the plant's condition
function StatsCard({ stats }) {
  const rows = [];
  if (stats.moisture != null) rows.push(['Moisture', `${stats.moisture}% · ${moistureLabel(stats.moisture, stats.ranges)}`]);
  if (stats.lux != null) rows.push(['Light', `${stats.lux} · ${lightLabel(stats.lux).toLowerCase()}`]);
  if (!rows.length) return null;
  return (
    <dl className="chat-stats">
      {rows.map(([label, value]) => (
        <div key={label} className="chat-stats-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const QUICK_PROMPTS = ['Is my cactus healthy?', 'Should I water now?', 'Is the light enough?'];

export default function CactaiChat({ plant, readings, messages, onAddMessage }) {
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorRetry, setErrorRetry] = useState(null);
  const textareaRef = useRef(null);
  const listRef = useRef(null);

  const plantName = plant?.name ?? 'your plant';
  const hasUserMessages = messages.some(m => m.role === 'user');

  const openingMsg = {
    id: '__opening__',
    role: 'cactai',
    text: `Hi! I can read ${plantName}'s moisture and light data and tell you how it compares to a healthy cactus. What would you like to know?`,
  };

  const displayMessages = messages.length === 0 ? [openingMsg] : messages;

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, isPending]);

  // Auto-grow textarea up to ~4 lines
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  }, [input]);

  async function callCactai(question) {
    setIsPending(true);
    setErrorRetry(null);
    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      // On retry the question is already the last message; don't send it twice
      const last = history[history.length - 1];
      if (last?.role === 'user' && last.text === question) history.pop();
      const { reply, showStats } = await askCactai({ question, plant, readings, history });
      // Snapshot the readings so old cards don't change when new data arrives
      const stats = showStats
        ? {
            moisture: readings?.latestMoisture ?? null,
            lux: readings?.latestLux ?? null,
            ranges: plant?.idealRanges ?? null,
          }
        : null;
      onAddMessage({ role: 'cactai', text: reply, stats });
    } catch {
      setErrorRetry(question);
    } finally {
      setIsPending(false);
    }
  }

  function send(text) {
    const question = text.trim();
    if (!question || isPending) return;
    setInput('');
    textareaRef.current?.focus();
    onAddMessage({ role: 'user', text: question });
    callCactai(question);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="cactai-chat">
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="chat-sparkle-circle" aria-hidden="true">
            <SparkleIcon />
          </span>
          <span className="chat-title">Cactai</span>
        </div>
        <span className="chat-subtitle">Uses your sensor data</span>
      </div>

      <div
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Conversation with Cactai"
        ref={listRef}
      >
        {displayMessages.map((msg, i) => (
          <div key={msg.id ?? i} className={`chat-row chat-row--${msg.role}`}>
            <div className={`chat-bubble chat-bubble--${msg.role}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              {msg.stats && <StatsCard stats={msg.stats} />}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="chat-row chat-row--cactai">
            <TypingDots />
          </div>
        )}
        {errorRetry && !isPending && (
          <div className="chat-row chat-row--cactai">
            <div className="chat-bubble chat-bubble--cactai chat-bubble--error">
              <span style={{ color: '#1F3B2D' }}>Sorry, I couldn&rsquo;t reach Cactai. Try again?</span>
              <button
                type="button"
                className="chat-retry-btn"
                onClick={() => callCactai(errorRetry)}
                aria-label="Retry last message"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {!hasUserMessages && !isPending && !errorRetry && (
        <div className="chat-chips">
          {QUICK_PROMPTS.map(p => (
            <button key={p} type="button" className="chat-chip" onClick={() => send(p)}>
              {p}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <div className="chat-input-pill">
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your cactus"
            aria-label="Ask Cactai about your cactus"
            maxLength={500}
            rows={1}
            disabled={isPending}
          />
          <button
            type="button"
            className="chat-send-btn"
            onClick={() => send(input)}
            disabled={!input.trim() || isPending}
            aria-label="Send"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
