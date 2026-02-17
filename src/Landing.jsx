import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Zap, AlertCircle, AlertTriangle, CheckCircle2, XCircle, 
  FileText, BarChart2, Search, 
  UserX, Edit3, EyeOff, Key, ServerCrash, ShieldAlert,
  TrendingUp, DollarSign, Rocket, Users, Play, ChevronRight, Settings,
  PenTool, BookOpen
} from "lucide-react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
const C = {
  bg: "#08090d",
  surface: "#0f1117",
  surface2: "#161b26",
  border: "#1d2335",
  accent: "#00d4ff",
  orange: "#ff6b35",
  purple: "#8b5cf6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  text: "#e2e8f0",
  muted: "#64748b",
};

/* ─── GLOBAL STYLES injected once ───────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=JetBrains+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

  @keyframes gridDrift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes orbFloat  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.04)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes slideUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes packetMove {
    from{left:-20px;opacity:1} 88%{opacity:1} to{left:calc(100% + 20px);opacity:0}
  }
  @keyframes signalFlow { to{left:100%} }
  @keyframes latPulse  { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.5) drop-shadow(0 0 8px #ef444488)} }
  @keyframes scanRow   { 0%{width:0} 50%{width:100%} 100%{width:0} }
  @keyframes cbShake   { from{transform:rotate(-12deg)} to{transform:rotate(0)} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes tickIn    { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
  @keyframes scaleIn   { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

  .animate-slide-up { animation: slideUp .55s ease both; }
  .animate-slide-up-1 { animation: slideUp .55s .1s ease both; }
  .animate-slide-up-2 { animation: slideUp .55s .2s ease both; }
  .animate-slide-up-3 { animation: slideUp .55s .3s ease both; }

  .section-reveal { opacity:0; transform:translateY(36px); transition: opacity .6s ease, transform .6s ease; }
  .section-reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-child { opacity:0; transform:translateY(20px); transition: opacity .5s ease, transform .5s ease; }
  .reveal-child.visible { opacity:1; transform:translateY(0); }

  /* RESPONSIVE UTILS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  
  @media (max-width: 768px) {
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
    .hero-title { font-size: 42px !important; }
    .section-padding { padding: 48px 20px !important; }
  }
`;

function injectStyles() {
  if (document.getElementById("sbdp-styles")) return;
  const s = document.createElement("style");
  s.id = "sbdp-styles";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

/* ─── HOOKS ─────────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── TINY PRIMITIVES ────────────────────────────────────────────── */
const Tag = ({ children, color = C.accent }) => (
  <span style={{
    display: "inline-block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    padding: "3px 9px",
    borderRadius: 5,
    background: color + "18",
    color,
    border: `1px solid ${color}30`,
    margin: "2px 2px",
  }}>{children}</span>
);

const SectionTag = ({ num, label }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, letterSpacing: "0.14em",
    color: C.accent, marginBottom: 12,
  }}>
    <span>{num} · {label}</span>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${C.accent}44, transparent)` }} />
  </div>
);

const Callout = ({ type = "info", label, children }) => {
  const colors = { info: C.accent, warn: C.yellow, danger: C.red, good: C.green };
  const c = colors[type] || C.accent;
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${c}`, borderRadius: "0 10px 10px 0",
      padding: "16px 20px", margin: "24px 0", position: "relative", overflow: "hidden",
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.14em", color: c, marginBottom: 7 }}>{label}</div>
      <div style={{ fontSize: 14, color: "rgba(226,232,240,.82)", lineHeight: 1.65 }}>{children}</div>
    </div>
  );
};

const Card = ({ children, hover = true, style = {} }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface, 
        border: `1px solid ${C.border}`,
        borderRadius: 14, padding: "24px",
        position: "relative",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all .3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        boxShadow: hov ? `0 20px 40px -10px ${C.accent}15` : "none",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", inset: 0, borderRadius: 14, padding: 1,
        background: hov ? `linear-gradient(to bottom right, ${C.accent}88, ${C.purple}88, transparent)` : "transparent",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        pointerEvents: "none", opacity: hov ? 1 : 0, transition: "opacity .3s"
      }} />
      {children}
    </div>
  );
};

const CodeBlock = ({ filename, children }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: "#0d1117", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", margin: "18px 0", position: "relative", group: "code" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, marginLeft: 4 }}>{filename}</span>
        </div>
        <button onClick={copy} style={{ background: "transparent", border: "none", cursor: "pointer", color: copied ? C.green : C.muted, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", transition: "color .2s" }}>
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, lineHeight: 1.85, color: "#c9d1d9", padding: "18px 20px", overflowX: "auto", whiteSpace: "pre" }}>{children}</pre>
    </div>
  );
};

const VizBox = ({ title, children }) => {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} style={{ 
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "26px", margin: "24px 0",
      opacity: 0, animation: visible ? "scaleIn .6s ease forwards" : "none" 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, marginBottom: 20, letterSpacing: "0.1em" }}>
        <Play size={10} color={C.accent} fill={C.accent} /> {title}
      </div>
      {children}
    </div>
  );
};

const Section = ({ id, children }) => {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} id={id} className={`section-reveal section-padding${visible ? " visible" : ""}`}
      style={{ maxWidth: 980, margin: "0 auto", padding: "72px 24px", borderBottom: `1px solid ${C.border}` }}>
      {children}
    </section>
  );
};

const Lead = ({ children }) => (
  <p style={{ fontSize: 17, color: "rgba(226,232,240,.68)", fontWeight: 300, maxWidth: 640, marginBottom: 40, lineHeight: 1.65 }}>{children}</p>
);

const DetailNote = ({ title, children }) => {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} style={{ 
      background: C.surface + "80", borderLeft: `3px solid ${C.purple}`, padding: "16px 20px", margin: "24px 0", fontSize: 13, lineHeight: 1.6, color: C.muted,
      opacity: 0, transform: "translateX(-10px)", animation: visible ? "slideInRight .5s ease forwards" : "none"
    }}>
      <strong style={{ color: C.purple, display: "block", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>PRO TIP: {title}</strong>
      {children}
    </div>
  );
};

const RealWorldExample = ({ title, scenario, solution }) => {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} style={{ 
      background: "linear-gradient(to bottom right, #161b26, #0f1117)", border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, margin: "32px 0",
      opacity: 0, transform: "translateY(20px)", animation: visible ? "slideUp .6s ease forwards" : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: C.accent, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
        <BookOpen size={14} /> REAL WORLD SCENARIO: {title}
      </div>
      <div className="grid-2" style={{ gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><XCircle size={12} /> THE PROBLEM</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{scenario}</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={12} /> THE FIX</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{solution}</div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>{children}</h2>
);

const Em = ({ children }) => <span style={{ color: C.accent, fontStyle: "normal" }}>{children}</span>;

/* ─── ANIMATED PACKET FLOW ───────────────────────────────────────── */
const PacketFlow = ({ label, blocked = false }) => (
  <div style={{ position: "relative", height: 52, background: C.surface2, borderRadius: 10, overflow: "hidden", margin: "14px 0", border: `1px solid ${C.border}` }}>
    {!blocked && [0, 0.65, 1.3].map((delay, i) => (
      <div key={i} style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        width: 11, height: 11, borderRadius: "50%",
        background: C.accent, boxShadow: `0 0 10px ${C.accent}`,
        animation: `packetMove 2s ${delay}s linear infinite`,
      }} />
    ))}
    {blocked && <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.red, letterSpacing: "0.1em" }}>◼ BLOCKED</div>}
    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: blocked ? "transparent" : C.muted, letterSpacing: "0.1em" }}>{label}</div>
  </div>
);

/* ─── CIRCUIT BREAKER ────────────────────────────────────────────── */
const CircuitBreaker = () => {
  const stateData = [
    { key: "closed", label: "CLOSED", color: C.green, icon: <Zap size={24} />, dep: "Healthy — requests flowing normally", signal: false },
    { key: "open",   label: "OPEN",   color: C.red,   icon: <AlertCircle size={24} />, dep: "Tripped — all requests fail fast immediately", signal: true },
    { key: "half",   label: "HALF-OPEN", color: C.yellow, icon: <AlertTriangle size={24} />, dep: "Testing — single probe request; success→CLOSED, fail→OPEN", signal: false },
  ];
  const [idx, setIdx] = useState(0);
  const s = stateData[idx];

  return (
    <VizBox title="CIRCUIT BREAKER — click button to cycle states">
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, alignItems: "center" }}>
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Your Service</div>
          <div style={{ fontSize: 12, color: C.muted }}>sending requests</div>
          <div style={{ height: 3, borderRadius: 2, background: s.signal ? C.red : C.green, margin: "12px 0", position: "relative", overflow: "hidden" }}>
            {!s.signal && <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(to right, transparent, white, transparent)", animation: "signalFlow 1.5s linear infinite" }} />}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <button onClick={() => setIdx((idx + 1) % 3)} style={{
            width: 80, height: 80, borderRadius: "50%",
            background: s.color + "18", border: `3px solid ${s.color}`,
            color: s.color, fontSize: 26, cursor: "pointer",
            transition: "all .3s", display: "flex", alignItems: "center", justifyContent: "center",
            animation: idx === 1 ? "cbShake .3s ease" : "none",
          }}>{s.icon}</button>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: s.color, letterSpacing: "0.1em" }}>{s.label}</div>
          <div style={{ fontSize: 11, color: C.muted, textAlign: "center", maxWidth: 90 }}>click to cycle</div>
        </div>

        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, textAlign: "center" }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Dependency</div>
          <div style={{ fontSize: 12, color: C.muted, minHeight: 36 }}>{s.dep}</div>
          <div style={{ height: 3, borderRadius: 2, background: s.signal ? C.red : C.green, margin: "12px 0", position: "relative", overflow: "hidden" }}>
            {!s.signal && <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(to right, transparent, white, transparent)", animation: "signalFlow 1.5s linear infinite" }} />}
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: 20 }}>
        {[
          { st: "CLOSED", c: C.green, desc: "Requests flow through. Error rate monitored continuously." },
          { st: "OPEN",   c: C.red,   desc: "Fail fast — no downstream calls made. Cooldown period active." },
          { st: "HALF-OPEN", c: C.yellow, desc: "One probe request passes. Success→CLOSED. Fail→OPEN." },
        ].map(({ st, c, desc }) => (
          <div key={st} style={{ background: c + "0d", border: `1px solid ${c}30`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: c, marginBottom: 6 }}>{st}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{desc}</div>
          </div>
        ))}
      </div>
    </VizBox>
  );
};

/* ─── RETRY STORM ────────────────────────────────────────────────── */
const RetryStorm = () => {
  const [loads, setLoads] = useState([35, 48, 29]);
  const toggle = (i) => {
    const next = [...loads];
    next[i] = next[i] > 80 ? Math.round(30 + Math.random() * 30) : 95;
    setLoads(next);
  };
  return (
    <VizBox title="RETRY STORM — click servers to simulate overload">
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        {loads.map((load, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ flex: 1, minWidth: 110, background: C.surface2, border: `1px solid ${load > 80 ? C.red + "55" : C.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all .25s" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Server {i + 1}</div>
            <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, width: `${load}%`, background: load > 80 ? `linear-gradient(to right,${C.yellow},${C.red})` : `linear-gradient(to right,${C.green},${C.yellow})`, transition: "width .5s ease" }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: load > 80 ? C.red : C.muted, marginTop: 5 }}>{load}% load</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: C.red + "0d", border: `1px solid ${C.red}30`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.red, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><XCircle size={12} /> UNBOUNDED RETRIES</div>
          <div style={{ fontSize: 13, color: C.muted }}>100 RPS × 3 retry attempts = <strong style={{ color: C.red }}>up to 300 RPS hammering an already-broken server</strong>, accelerating its collapse.</div>
        </div>
        <div style={{ background: C.green + "0d", border: `1px solid ${C.green}30`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.green, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={12} /> BOUNDED + BACKOFF</div>
          <div style={{ fontSize: 13, color: C.muted }}>Max 1 retry + exponential backoff + jitter + circuit breaker = <strong style={{ color: C.green }}>controlled degradation, not amplification</strong>.</div>
        </div>
      </div>
    </VizBox>
  );
};

/* ─── LATENCY CHART ──────────────────────────────────────────────── */
const LatencyChart = () => {
  const bars = [
    { label: "p50", pct: 22, color: C.green, desc: "fast" },
    { label: "p75", pct: 36, color: C.yellow, desc: "moderate" },
    { label: "p90", pct: 54, color: C.orange, desc: "slower" },
    { label: "p95", pct: 72, color: "#ff4500", desc: "slow" },
    { label: "p99", pct: 100, color: C.red, desc: <span style={{display: "flex", alignItems: "center", gap: 4, justifyContent: "center"}}>tail <Zap size={10} fill={C.red} /></span>, pulse: true },
  ];
  return (
    <VizBox title="WHY P99 MATTERS — illustrative latency distribution (hover bars)">
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 90, padding: "0 4px" }}>
        {bars.map(b => {
          const [hov, setHov] = useState(false);
          return (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: hov ? b.color : C.muted }}>{b.label}</div>
              <div
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{
                  width: "100%", height: `${b.pct}%`, borderRadius: "4px 4px 0 0",
                  background: b.color, cursor: "default", transition: "filter .2s",
                  animation: b.pulse ? "latPulse 2s ease-in-out infinite" : "none",
                  filter: hov ? "brightness(1.35)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, padding: "6px 4px" }}>
        {bars.map(b => <div key={b.label} style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, textAlign: "center" }}>{b.desc}</div>)}
      </div>
      <div style={{ background: C.red + "10", border: `1px solid ${C.red}30`, borderRadius: 8, padding: "11px 14px", marginTop: 10, fontSize: 13, color: C.muted }}>
        Your average can look healthy while 1 in 100 users waits seconds. At meaningful traffic, the tail hits real people every second. <strong style={{ color: C.text }}>Monitor p95 and p99, not just averages.</strong>
      </div>
    </VizBox>
  );
};

/* ─── INDEX VIZ ──────────────────────────────────────────────────── */
const IndexViz = () => (
  <div className="grid-2" style={{ margin: "24px 0" }}>
    {[
      { good: false, label: "FULL TABLE SCAN — no useful index", rows: [true, true, true, true, true, true, true, true], note: "Reads every row. Gets slower as data grows." },
      { good: true,  label: "INDEX SEEK — composite index matches", rows: [false, false, true, true, false, false, false, false], note: "Jumps directly to matching rows. Stays fast at scale." },
    ].map(({ good, label, rows, note }) => (
      <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "9px 13px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, background: good ? C.green + "18" : C.red + "18", color: good ? C.green : C.red, borderBottom: `1px solid ${good ? C.green + "30" : C.red + "30"}` }}>{label}</div>
        <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 5 }}>
          {rows.map((hit, i) => (
            <div key={i} style={{ height: 7, borderRadius: 4, background: hit ? C.green + "40" : good ? "#1d2335" : C.red + "25", position: "relative", overflow: "hidden" }}>
              {!good && <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, background: "rgba(255,255,255,.06)", animation: "scanRow 2.2s ease-in-out infinite", animationDelay: `${i * 0.12}s` }} />}
            </div>
          ))}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, marginTop: 6 }}>{note}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ─── SAGA FLOW ───────────────────────────────────────────────────── */
const SagaFlow = () => {
  const [failed, setFailed] = useState(null);
  const steps = [
    { title: "Reserve Inventory", desc: "Mark items reserved — not yet committed.", comp: "rollback: release" },
    { title: "Authorize Payment", desc: "Hold funds — do not capture yet.", comp: "rollback: void auth" },
    { title: "Confirm Shipment", desc: "Finalize order, capture payment.", comp: "rollback: cancel" },
  ];
  return (
    <VizBox title="SAGA PATTERN — click a step to simulate failure">
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((s, i) => {
          const isCompensating = failed !== null && i < failed;
          const isFailed = failed === i;

          return (
            <div key={i} onClick={() => setFailed(failed === i ? null : i)} style={{
              display: "grid", gridTemplateColumns: "40px 1fr 110px", gap: 14, alignItems: "center",
              padding: "14px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer",
              background: isFailed ? C.red + "08" : isCompensating ? C.yellow + "06" : "transparent",
              transition: "background .3s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${isFailed ? C.red : isCompensating ? C.yellow : C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: isFailed ? C.red : isCompensating ? C.yellow : C.accent, transition: "all .3s", flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: isFailed ? C.red : C.text, display: "flex", alignItems: "center", gap: 6 }}>{s.title} {isFailed && <span style={{display: "flex", alignItems: "center", gap: 4, color: C.red}}><Zap size={14} fill={C.red} /> FAILED</span>}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{isCompensating ? "↩ compensating..." : s.desc}</div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "4px 8px", borderRadius: 6, textAlign: "center", background: isCompensating ? C.yellow + "18" : C.green + "12", color: isCompensating ? C.yellow : C.green, border: `1px solid ${isCompensating ? C.yellow + "40" : C.green + "30"}` }}>
                {isCompensating ? "compensating" : s.comp}
              </div>
            </div>
          );
        })}
        {failed !== null && (
          <div style={{ padding: "12px 0 4px", animation: "fadeIn .3s ease" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 110px", gap: 14, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.red, fontSize: 18, flexShrink: 0 }}>!</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.red }}>Compensation triggered</div>
                <div style={{ fontSize: 12, color: C.muted }}>Executing rollback for {failed} completed step{failed !== 1 ? "s" : ""}, in reverse order.</div>
              </div>
              <div onClick={() => setFailed(null)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "4px 8px", borderRadius: 6, textAlign: "center", background: C.border, color: C.muted, cursor: "pointer" }}>reset</div>
            </div>
          </div>
        )}
      </div>
    </VizBox>
  );
};

/* ─── INCIDENT TIMELINE ─────────────────────────────────────────── */
const IncidentTimeline = () => {
  const steps = [
    { color: C.accent,  n: "1", title: "Confirm Impact", desc: "Error rate, latency percentiles, affected routes / regions / user segments. Read dashboards — don't guess." },
    { color: C.red,     n: "2", title: "Stop the Bleeding", desc: "Disable via feature flag · shed load or cap concurrency · rollback if blast radius is high. Do this before diagnosing." },
    { color: C.yellow,  n: "3", title: "Diagnose with Evidence", desc: "Metrics tell you what. Traces tell you where. Logs tell you why. Starting with logs usually wastes time." },
    { color: C.green,   n: "4", title: "Fix and Verify in Dashboards", desc: "Watch error rate recover. Wait for p99 to normalize. Don't declare success because you deployed a fix." },
    { color: C.purple,  n: "5", title: "Post-Incident Action Items", desc: "Timeline · Impact · Root cause · Contributing factors · Detection gaps · Action items with owners and deadlines." },
  ];
  return (
    <div style={{ position: "relative", paddingLeft: 44, margin: "32px 0" }}>
      <div style={{ position: "absolute", left: 14, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${C.accent}, ${C.purple}, ${C.green})` }} />
      {steps.map((s, i) => (
        <div key={i} style={{ position: "relative", marginBottom: 28 }}>
          <div style={{ position: "absolute", left: -37, top: 3, width: 24, height: 24, borderRadius: "50%", background: C.surface, border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: s.color, zIndex: 1 }}>{s.n}</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.title}</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
        </div>
      ))}
    </div>
  );
};

/* ─── IDEMPOTENCY FLOW ──────────────────────────────────────────── */
const IdempotencyFlow = () => (
  <VizBox title="IDEMPOTENCY FLOW — client sends request with key">
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: C.surface2 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "3px 8px", borderRadius: 4, background: C.green + "20", color: C.green, border: `1px solid ${C.green}40`, minWidth: 58, textAlign: "center" }}>CHECK</span>
        <span style={{ fontSize: 14 }}>Does <code style={{ background: C.surface, padding: "1px 6px", borderRadius: 4, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>idempotency_key</code> exist in durable store?</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: "10px 4px" }}>
        {[
          { title: "YES → RETURN STORED", color: C.green, items: ["Return existing result", "No side effects executed", "Client gets their answer safely"] },
          { title: "NO → EXECUTE", color: C.accent, items: ["Record key, status=processing", "Execute the operation", "Store result, status=complete", "Return result"] },
        ].map(({ title, color, items }) => (
          <div key={title} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, background: C.surface2 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color, marginBottom: 10 }}>{title}</div>
            {items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12 }}>
                <span style={{ color, fontWeight: 700 }}>→</span>
                <span style={{ color: C.muted }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </VizBox>
);

/* ─── REVIEW CHECKLIST ──────────────────────────────────────────── */
const ReviewChecklist = () => {
  const items = [
    { label: "Correctness", desc: "What invariants must hold? What happens on duplicates, timeouts, or partial failure?" },
    { label: "Reliability", desc: "Are timeouts set? Retries bounded and safe? Is a circuit breaker or bulkhead needed?" },
    { label: "Observability", desc: "Are metrics/logs/traces included? Can we debug this in production at 3am?" },
    { label: "Security", desc: "Input validation? AuthZ at every trust boundary? Secrets handled correctly?" },
    { label: "Performance", desc: "DB query count? Indexes correct? Caching? Fanout size under load?" },
    { label: "Rollout", desc: "Safe migration path? Feature flag for kill switch? Rollback plan documented?" },
  ];
  const [checked, setChecked] = useState(new Set());
  const toggle = (i) => {
    const n = new Set(checked);
    n.has(i) ? n.delete(i) : n.add(i);
    setChecked(n);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "24px 0" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, marginBottom: 4 }}>
        {checked.size}/{items.length} reviewed
        {checked.size === items.length && <span style={{ color: C.green, marginLeft: 10, animation: "fadeIn .3s ease" }}> ✓ PR reviewed</span>}
      </div>
      {items.map((item, i) => {
        const on = checked.has(i);
        return (
          <div key={i} onClick={() => toggle(i)} style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            background: on ? C.green + "0a" : C.surface,
            border: `1px solid ${on ? C.green + "44" : C.border}`,
            borderRadius: 10, padding: "13px 16px", cursor: "pointer",
            transition: "all .2s", userSelect: "none",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: `2px solid ${on ? C.green : C.border}`,
              background: on ? C.green : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .2s",
            }}>
              {on && <span style={{ fontSize: 13, color: "white", animation: "tickIn .2s ease" }}>✓</span>}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{item.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── TRADEOFF CARDS ─────────────────────────────────────────────── */
const tradeoffs = [
  { a: "Latency", b: "Cost", desc: "Faster responses need more compute, memory, or cache spend. Set your SLO, then buy accordingly." },
  { a: "Consistency", b: "Availability", desc: "During a partition you must choose. Know which side you're on for each operation before the outage." },
  { a: "Simplicity", b: "Scalability", desc: "Complexity has its own failure modes. Don't scale what you don't need to." },
  { a: "Dev Velocity", b: "Operational Burden", desc: "Speed now is on-call pain later. Accrue debt intentionally, with a paydown plan." },
];

/* ─── MIGRATION STEPS ────────────────────────────────────────────── */
const MigrationSteps = () => {
  const steps = [
    { n: "1", color: C.accent,  title: "Add new column as nullable", note: "No code changes needed yet" },
    { n: "2", color: C.accent,  title: "Deploy: write to both old and new columns", note: "Dual-write period — both paths active" },
    { n: "3", color: C.yellow,  title: "Backfill in small batches", note: "Never one big migration — it locks the table" },
    { n: "4", color: C.green,   title: "Switch reads to new column", note: "After verifying backfill is complete" },
    { n: "5", color: C.green,   title: "Add NOT NULL constraint, drop old column", note: "Separate deploy, after full verification" },
  ];
  return (
    <div style={{ margin: "24px 0" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 14, padding: "13px 0", borderBottom: i < steps.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${s.color}`, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: s.color, flexShrink: 0 }}>{s.n}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── OBSERVABILITY TRIO ─────────────────────────────────────────── */
const ObsTrio = () => {
  const cards = [
    {
      icon: <FileText size={28} />, title: "Logs", color: C.accent,
      items: ["Request ID (trace correlation)", "User / principal ID", "Route / operation", "Status code + latency", "Error category (timeout, validation…)"],
      note: "Log events, not essays. At scale: keep all errors, sample info.",
    },
    {
      icon: <BarChart2 size={28} />, title: "Metrics", color: C.orange,
      items: ["Request rate + error rate", "Latency p50/p95/p99", "DB connections + query latency", "Queue depth + consumer lag", "CPU, memory, GC pressure"],
      note: "First stop in any incident. Tells you what is broken.",
    },
    {
      icon: <Search size={28} />, title: "Traces", color: C.purple,
      items: ["Inbound request boundary", "Every DB call span", "Every external API call", "Queue publish / consume", "Tail-based sampling for slow traces"],
      note: "Tells you where time is spent. Essential for distributed systems.",
    },
  ];
  return (
    <div className="grid-3" style={{ margin: "32px 0" }}>
      {cards.map(c => (
        <Card key={c.title} style={{ borderBottom: `3px solid ${c.color}`, paddingBottom: 18 }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{c.title}</div>
          {c.items.map(it => (
            <div key={it} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: C.muted, padding: "3px 0" }}>
              <span style={{ color: c.color, fontWeight: 900 }}>·</span>{it}
            </div>
          ))}
          <div style={{ fontSize: 11, color: C.muted, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>{c.note}</div>
        </Card>
      ))}
    </div>
  );
};

/* ─── THREAT MODEL ───────────────────────────────────────────────── */
/* ─── THREAT MODEL ───────────────────────────────────────────────── */
const threats = [
  { icon: <UserX size={20} color={C.purple} />, name: "Spoofing",       desc: "Validate identity at every boundary. Short-lived tokens. Protect refresh tokens." },
  { icon: <Edit3 size={20} color={C.orange} />, name: "Tampering",      desc: "Validate all inputs at the boundary. Schema + allowlist fields. Reject unknown fields." },
  { icon: <EyeOff size={20} color={C.muted} />, name: "Repudiation",    desc: "Audit logs for sensitive actions. Immutable, append-only where possible." },
  { icon: <Settings size={20} color={C.accent} />, name: "Info Disclosure",desc: "Don't leak stack traces. Use a secrets manager — never env vars or source code." },
  { icon: <ServerCrash size={20} color={C.red} />, name: "DoS",            desc: "Rate limit auth endpoints per IP + per account. Circuit breakers. Backpressure." },
  { icon: <Key size={20} color={C.yellow} />, name: "Priv Escalation",desc: "Enforce AuthZ at every trust boundary, not just the entry point." },
];

/* ─── HERO ───────────────────────────────────────────────────────── */
const Hero = () => {
  const navLinks = [
    ["#s1", "Service Ownership"], ["#s2", "Failure Thinking"], ["#s3", "Tradeoffs"],
    ["#s4", "Incidents"], ["#s5", "Circuit Breakers"], ["#s6", "Networking"],
    ["#s7", "SQL"], ["#s8", "Caching"], ["#s9", "Observability"],
    ["#s10", "Security"], ["#s11", "Distributed Patterns"], ["#s12", "Code Reviews"], ["#s13", "Growth"],
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.accent}07 1px, transparent 1px), linear-gradient(90deg, ${C.accent}07 1px, transparent 1px)`, backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)", animation: "gridDrift 20s ease-in-out infinite" }} />
      {/* Orbs */}
      {[["-80px", "-80px", 440, C.accent, "0s"], ["auto", "-80px", 360, C.purple, "-4s"], ["50%", "50%", 280, C.orange, "-2s"]].map(([top, right, size, color, delay], i) => (
        <div key={i} style={{ position: "absolute", top, right: i === 2 ? "auto" : right, left: i === 2 ? "50%" : "auto", width: size, height: size, borderRadius: "50%", background: color + "0a", filter: "blur(80px)", animation: `orbFloat 8s ${delay} ease-in-out infinite`, pointerEvents: "none" }} />
      ))}

      <div className="animate-slide-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accent + "16", border: `1px solid ${C.accent}30`, padding: "6px 16px", borderRadius: 100, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: C.accent, marginBottom: 28, position: "relative" }}>
        <span style={{ animation: "blink 2s infinite", fontSize: 8 }}>●</span> SYSTEMS · FIELD GUIDE · 2026
      </div>

      <h1 className="animate-slide-up-1 hero-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(46px,8vw,92px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", position: "relative" }}>
        <span style={{ display: "block", color: C.text }}>Senior Backend</span>
        <span style={{ display: "block", background: `linear-gradient(to right, ${C.accent}, ${C.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Developer</span>
        <span style={{ display: "block", color: C.muted, fontSize: "0.54em", fontWeight: 400, letterSpacing: 0, marginTop: 14 }}>Playbook — systems-first, language-agnostic</span>
      </h1>

      <p className="animate-slide-up-2" style={{ fontSize: 17, color: C.muted, maxWidth: 520, margin: "22px auto 44px", fontWeight: 300, position: "relative" }}>
        You don't just write code — you keep it running. True seniority is about taking responsibility for the whole system, not just your pull requests.
      </p>

      <nav className="animate-slide-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", maxWidth: 700, position: "relative" }}>
        {navLinks.map(([href, label]) => (
          <a key={href} href={href} style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, textDecoration: "none", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, transition: "all .2s" }}
            onMouseEnter={e => { e.target.style.borderColor = C.accent; e.target.style.color = C.accent; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.muted; e.target.style.transform = "none"; }}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
};

/* ─── COMPARE ────────────────────────────────────────────────────── */
const Compare = ({ badLabel, badTitle, badText, goodLabel, goodTitle, goodText }) => (
  <div className="grid-2" style={{ margin: "24px 0" }}>
    <div style={{ background: C.red + "08", border: `1px solid ${C.red}30`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.red, marginBottom: 10 }}>{badLabel}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: C.red, marginBottom: 8 }}>{badTitle}</div>
      <div style={{ fontSize: 13, color: C.muted }}>{badText}</div>
    </div>
    <div style={{ background: C.green + "08", border: `1px solid ${C.green}30`, borderRadius: 12, padding: 20 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.green, marginBottom: 10 }}>{goodLabel}</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: C.green, marginBottom: 8 }}>{goodTitle}</div>
      <div style={{ fontSize: 13, color: C.muted }}>{goodText}</div>
    </div>
  </div>
);

/* ─── CACHE FLOW ─────────────────────────────────────────────────── */
const CacheFlow = () => (
  <VizBox title="CACHE HIT vs MISS FLOW">
    {[
      { label: "CACHE HIT → sub-millisecond", color: C.green, end: "Redis Cache" },
      { label: "CACHE MISS → much slower", color: C.red, end: "Database (via miss)" },
    ].map(({ label, color, end }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", minWidth: 80, textAlign: "center", fontSize: 12, fontWeight: 600 }}>Client</div>
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ height: 2, borderRadius: 2, background: color, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(to right, transparent, rgba(255,255,255,.6), transparent)", animation: "signalFlow 2s linear infinite" }} />
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color, textAlign: "center", marginTop: 4 }}>{label}</div>
        </div>
        <div style={{ background: color + "12", border: `1px solid ${color}40`, borderRadius: 10, padding: "10px 14px", minWidth: 100, textAlign: "center", fontSize: 12, fontWeight: 600, color }}>{end}</div>
      </div>
    ))}
  </VizBox>
);

const HeroGlow = () => (
  <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: "120vw", height: "120vh", background: `radial-gradient(circle at 50% 30%, ${C.accent}12 0%, ${C.purple}08 30%, transparent 60%)`, pointerEvents: "none", zIndex: 0 }} />
);

const ProgressBar = () => {
  const [width, setWidth] = useState(0);
  const handleScroll = () => {
    const total = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scroll = `${total / windowHeight}`;
    setWidth(scroll);
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, height: 3, background: C.surface, width: "100%", zIndex: 9999 }}>
      <div style={{ height: "100%", background: `linear-gradient(to right, ${C.accent}, ${C.purple})`, width: `${width * 100}%`, transition: "width 0.1s" }} />
    </div>
  );
};

/* ─── MAIN APP ───────────────────────────────────────────────────── */
export default function Landing() {
  useEffect(() => { injectStyles(); }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <ProgressBar />
      <HeroGlow />
      <Hero />

      {/* S1: Ownership */}
      <Section id="s1">
        <SectionTag num="01" label="THE SHIFT" />
        <SectionTitle>You Run a <Em>Service</Em>, Not a Repo</SectionTitle>
        <Lead>Senior engineers care about how the code behaves in the real world, over months and years. It's not just about features — it's about these six things:</Lead>

        <Lead>Senior engineers deliver service behavior over time — not just features. That means owning six dimensions simultaneously.</Lead>

        <div className="grid-3" style={{ marginBottom: 32 }}>
          {[
            { icon: <TrendingUp size={30} color={C.green} />, title: "Reliability", desc: "Availability, error rate, durability" },
            { icon: <Zap size={30} color={C.accent} />, title: "Latency",     desc: "p95/p99 — never just averages" },
            { icon: <CheckCircle2 size={30} color={C.purple} />, title: "Correctness", desc: "Data integrity, idempotency, no silent corruption" },
            { icon: <DollarSign size={30} color={C.orange} />, title: "Cost",         desc: "Infra, DB, cache, vendor, on-call time" },
            { icon: <Rocket size={30} color={C.red} />, title: "Delivery Health", desc: "Safe rollout/rollback, predictable lead time" },
            { icon: <Users size={30} color={C.yellow} />, title: "Team Health", desc: "Sane on-call, clear ownership, less fire-fighting" },
          ].map(c => <Card key={c.title} style={{ textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{c.desc}</div>
          </Card>)}
        </div>

        <Callout type="info" label="IF YOU OWN IT, YOU KNOW THE ANSWERS">
          What breaks if traffic doubles? · How long until a user notices a slowdown? · How fast can we undo a bad update? · If the database fails, do we lose data?
        </Callout>

        <Compare
          badLabel={<span style={{display:"flex", alignItems:"center", gap:6}}><XCircle size={14} /> JUNIOR MOVE</span>} badTitle="Add retries"
          badText="Blindly adding retries to fix timeouts creates a retry storm. 100 RPS becomes 300 hitting an already-broken server."
          goodLabel={<span style={{display:"flex", alignItems:"center", gap:6}}><CheckCircle2 size={14} /> SYSTEMS MOVE</span>} goodTitle="Budget → Timeout → Circuit Break"
          goodText="Define an end-to-end deadline. Set per-call timeouts smaller than remaining budget. Add circuit breaking. Add overload protection. Instrument everything."
        />

        <VizBox title="SYSTEMS TIMEOUT FLOW">
          <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
            {[
              { label: "Client Request", sub: "deadline = e.g. 800ms", active: true },
              null,
              { label: "Set Timeout", sub: "budget − overhead" },
              null,
              { label: "Circuit Breaker", sub: "error rate check", warn: true },
              null,
              { label: "Downstream", sub: "or 503 fast-fail", good: true },
            ].map((node, i) => node === null ? (
              <div key={i} style={{ flexShrink: 0, width: 36, height: 2, background: C.border, position: "relative", margin: "0 -1px" }}>
                <span style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", color: C.border, display: "flex", alignItems: "center" }}><ChevronRight size={14} /></span>
              </div>
            ) : (
              <div key={i} style={{ flexShrink: 0, background: C.surface2, border: `1px solid ${node.active ? C.accent : node.warn ? C.yellow : node.good ? C.green : C.border}`, borderRadius: 10, padding: "12px 14px", textAlign: "center", minWidth: 120, boxShadow: node.active ? `0 0 18px ${C.accent}18` : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: node.active ? C.accent : node.warn ? C.yellow : node.good ? C.green : C.text }}>{node.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, marginTop: 4 }}>{node.sub}</div>
              </div>
            ))}
          </div>
        </VizBox>

        <DetailNote title="OWNERSHIP MEANS SLEEPING WELL">
          True ownership isn't about being on-call 24/7. It's about building systems that don't wake you up. If you build it fragile, you pay with your sleep. If you build it robust, you get to work on fun stuff.
        </DetailNote>
      </Section>

      {/* S2: Failures */}
      <Section id="s2">
        <SectionTag num="02" label="FAILURE THINKING" />
        <SectionTitle>Think in <Em>Failures</Em> First</SectionTitle>
        <Lead>Assume everything will break. The database will slow down. The network will cut out. Your code might run the same transaction twice. Plan for this now, so you don't panic later.</Lead>

        <Callout type="danger" label="NON-NEGOTIABLE">
          <strong>Never process the same payment twice.</strong> Users <em>will</em> click the button again if it's slow. Your code must recognize "I've already seen this request" and stop itself from charging them a second time. This is called <strong>Idempotency</strong>.
        </Callout>

        <IdempotencyFlow />

        <VizBox title="REAL EXAMPLE — 'Send Email' when provider times out">
          <PacketFlow label="REQUEST PACKETS → EMAIL PROVIDER" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
            {[
              { color: C.accent, step: "STEP 1", text: "Check if key already has a provider_message_id before doing anything." },
              { color: C.yellow, step: "ON TIMEOUT", text: "Query provider status — don't retry blindly. The provider may have already sent it." },
              { color: C.muted,  step: "UNCERTAIN?", text: "Mark uncertain. Enqueue a verification job. Do not spam retries inline." },
            ].map(({ color, step, text }) => (
              <div key={step} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color, marginBottom: 7 }}>{step}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{text}</div>
              </div>
            ))}
          </div>
        </VizBox>

        <RealWorldExample 
          title="Payment Processing Timeout"
          scenario="User clicks 'Pay Now'. The backend calls Stripe. Stripe takes 25 seconds. The user gets bored and refreshes the page, triggering a second payment request."
          solution="Implement idempotency keys. When the second request arrives with the same 'order_id', checking the database reveals a 'processing' state. Code returns the status of the first request instead of charging the card again."
        />
      </Section>

      {/* S3: Tradeoffs */}
      <Section id="s3">
        <SectionTag num="03" label="DECISION-MAKING" />
        <SectionTitle>Tradeoffs <Em>Are</Em> the Job</SectionTitle>
        <Lead>There is no "perfect" choice. Every tech decision has a downside. If you can't tell me what the downside is, you haven't looked hard enough.</Lead>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "28px 0" }}>
          {tradeoffs.map(({ a, b, desc }) => (
            <Card key={a}>
              <div style={{ position: "absolute", top: 12, right: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: C.muted, background: C.surface2, padding: "2px 8px", borderRadius: 4 }}>trade</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{a}</div>
              <div style={{ fontSize: 18, color: C.muted, margin: "4px 0" }}>⇅</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.orange }}>{b}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.55 }}>{desc}</div>
            </Card>
          ))}
        </div>

        <CodeBlock filename="decision-framework.pseudo">
{`define  constraint = (SLO | budget | compliance_req)
for     option in [option_A, option_B, option_C]:
  → What fails under load?
  → What fails during partial outage?
  → What new on-call burden does this add?
  → What is the rollback plan?

// If you can't answer all four, the design isn't done.`}
        </CodeBlock>

        <DetailNote title="THERE ARE NO SOLUTIONS, ONLY TRADEOFFS">
          Senior engineers stop looking for the 'best' database. They ask: 'What is the read/write ratio? Do we need ACID? What is the consistency model?' Every exciting new tech comes with a boring new maintenance burden.
        </DetailNote>
      </Section>

      {/* S4: Incidents */}
      <Section id="s4">
        <SectionTag num="04" label="PRODUCTION PRESSURE" />
        <SectionTitle>Incidents Happen. <Em>Stay Calm.</Em></SectionTitle>
        <Lead>When production is on fire, don't guess. Stop the bleeding first. Fix the root cause second.</Lead>

        <Callout type="danger" label="THE RULE">
          <strong>Stabilize → Then Debug.</strong> Don't try to find the bug while the site is down. Turn off the feature, roll back the update, or add capacity. Get the site back up <em>first</em>. Then look at the logs.
        </Callout>

        <IncidentTimeline />
        
        <RealWorldExample 
          title="The 'Slow' Database"
          scenario="The site feels slow. The team starts reading random log files. They find nothing. Meanwhile, the database is overloaded because a new update introduced a bad query."
          solution="Look at <strong>Metrics</strong> first. A nice chart showing 'Database CPU at 100%' tells you the problem instantly. Logs are for details; Metrics are for big picture."
        />
      </Section>

      {/* S5: Circuit Breakers */}
      <Section id="s5">
        <SectionTag num="05" label="CIRCUIT BREAKERS & RETRIES" />
        <SectionTitle>Fail Fast or <Em>Fail Everything</Em></SectionTitle>
        <Lead>A circuit breaker is the difference between a contained failure and a cascading outage. Most teams add one after the incident.</Lead>

        <CircuitBreaker />
        <RetryStorm />

        <DetailNote title="THE THUNDERING HERD">
          When a service comes back online after a crash, thousands of clients might retry instantly. This 'thundering herd' knocks the service back offline. Jitter (randomizing retry delays) is the vaccine.
        </DetailNote>
      </Section>

      {/* S6: Networking */}
      <Section id="s6">
        <SectionTag num="06" label="NETWORKING" />
        <SectionTitle>Latency Is Not <Em>Magic</Em></SectionTitle>
        <Lead>Handshake timings scale with RTT. Under packet loss, tail latency explodes. p99 matters infinitely more than average.</Lead>

        <LatencyChart />

        <Compare
          badLabel={<span style={{display:"flex", alignItems:"center", gap:6}}><XCircle size={14} /> COMMON MISTAKE</span>} badTitle="New connection per request"
          badText="TCP handshake + TLS negotiation on every call adds latency proportional to your RTT. Under any meaningful load this overhead accumulates significantly."
          goodLabel={<span style={{display:"flex", alignItems:"center", gap:6}}><CheckCircle2 size={14} /> CORRECT</span>} goodTitle="Connection pooling always"
          goodText="Keep-alive + pooling for HTTP and DB connections. Pay the handshake cost once, reuse for hundreds of requests."
        />

        <Callout type="warn" label="TIMEOUT BUDGET PROPAGATION">
          Every downstream call must read the <strong>remaining budget</strong> and set its own timeout smaller than what's left. Never retry past the overall client deadline. Propagate deadlines, not timeouts.
        </Callout>

        <RealWorldExample 
          title="The 30-Second Page Load"
          scenario="Service A calls Service B (10s timeout), which calls Service C (10s timeout). If B hangs for 9s then calls C, and C takes 5s, the total time is 14s. But the user gave up at 5s."
          solution="Pass a 'deadline' timestamp header. If Service B receives a request with 1s remaining on the deadline, it shouldn't even bother calling Service C. Fail fast and save resources."
        />
      </Section>

      {/* S7: SQL */}
      <Section id="s7">
        <SectionTag num="07" label="SQL PERFORMANCE" />
        <SectionTitle>Indexes: Fastest Win,<br /><Em>Easiest Foot-Gun</Em></SectionTitle>
        <Lead>Every missing index is a full table scan. Every unnecessary index is a write penalty. Neither is free.</Lead>

        <IndexViz />

        <div className="grid-3" style={{ margin: "24px 0" }}>
          {[
            { title: "Composite order matters", desc: "The index helps queries filtering on the leftmost prefix. Column order is not arbitrary." },
            { title: "Partial indexes are powerful", desc: "Index only the hot subset. Smaller, faster, less cache pressure." },
            { title: "Measure, don't guess", desc: "Check actual execution plans on production-shaped data. Estimates lie." },
          ].map(({ title, desc }) => <Card key={title}><div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 7 }}>{title}</div><div style={{ fontSize: 12, color: C.muted }}>{desc}</div></Card>)}
        </div>

        <Callout type="warn" label="SAFE SCHEMA MIGRATION — expand then contract">
          Never add a NOT NULL constraint in the same migration as the column. Breaking old code with a strict constraint is an outage generator.
        </Callout>

        <MigrationSteps />

        <Callout type="warn" label="OFFSET PAGINATION = TRAP AT SCALE">
          Use cursor/keyset pagination for large datasets. Offset gets slower with depth and is unstable under concurrent inserts.
        </Callout>

        <DetailNote title="MIGRATIONS ARE SCARY">
          Renaming a column is downtime. Changing a type is downtime. Adding a constraint is downtime. Unless you decompose it into 5 safe, backwards-compatible steps. It feels slow, but it's the only way to stay online.
        </DetailNote>
      </Section>

      {/* S8: Caching */}
      <Section id="s8">
        <SectionTag num="08" label="CACHING" />
        <SectionTitle>Correctness First,<br /><Em>Speed Second</Em></SectionTitle>
        <Lead>A cache that serves wrong data is worse than no cache. Understand your invalidation strategy before choosing your caching strategy.</Lead>

        <CacheFlow />

        <div className="grid-3" style={{ margin: "24px 0" }}>
          {[
            { label: "LAZY POPULATION", color: C.accent,  desc: "Write to DB. On read miss, populate cache. Simple. Slightly stale on cold." },
            { label: "WRITE-THROUGH",   color: C.orange,  desc: "Write DB + cache together. Consistent. Slightly slower writes. Safest default." },
            { label: "WRITE-BEHIND ⚠️", color: C.red,     desc: "Cache first, async persist. Fast. High correctness risk. Use with extreme care." },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ background: C.surface, border: `1px solid ${color === C.red ? C.red + "44" : C.border}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color, marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{desc}</div>
            </div>
          ))}
        </div>

        <Callout type="danger" label="⚡ CACHE STAMPEDE">
          When a hot key expires, all concurrent requests miss simultaneously and hammer the database. Fix: single-flight coalescing (first request rebuilds, others wait), stale-while-revalidate, or jittered TTLs to prevent synchronized expiry.
        </Callout>

        <RealWorldExample 
          title="The Celebrity Tweet"
          scenario="A celebrity tweets a link to a product. 100,000 users click it. The product cache expires. 100,000 requests hit the database at the exact same millisecond."
          solution="Use 'Locking' or 'Request Coalescing' in the cache layer. Only ONE request goes to the DB to fetch the product. The other 99,999 wait for that one result and share it."
        />
      </Section>

      {/* S9: Observability */}
      <Section id="s9">
        <SectionTag num="09" label="OBSERVABILITY" />
        <SectionTitle>If You Can't See It,<br /><Em>You Can't Run It</Em></SectionTitle>
        <Lead>Observability is not a nice-to-have. It's the difference between resolving incidents in minutes and resolving them in hours.</Lead>

        <ObsTrio />

        <Callout type="info" label="GOOD ALERT STRUCTURE">
          Every alert must have: <strong>symptom + threshold + duration</strong> → <strong>likely user impact</strong> → <strong>immediate mitigation steps</strong> → <strong>link to dashboard/runbook</strong>. If a responder can't take a concrete action when it fires, it's noise — not an alert.
        </Callout>

        <DetailNote title="CARDINALITY EXPLOSION">
          Don't put user IDs or request IDs in your metric tags (labels). If you have 1 million users, that's 1 million distinct time-series. Your metrics bill will bankrupt the company. Use Logs for high-cardinality data, Metrics for aggregates.
        </DetailNote>
      </Section>

      {/* S10: Security */}
      <Section id="s10">
        <SectionTag num="10" label="SECURITY" />
        <SectionTitle>The Basics That Prevent<br /><Em>Real Incidents</Em></SectionTitle>
        <Lead>Security is not about perfection. It's about removing the easy wins for attackers. Most breaches exploit basic misconfigurations.</Lead>

        <div className="grid-3" style={{ margin: "24px 0" }}>
          {threats.map(({ icon, name, desc }) => {
            const [hov, setHov] = useState(false);
            return (
              <div key={name} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: C.surface, border: `1px solid ${hov ? C.red + "55" : C.border}`, borderRadius: 10, padding: "16px 14px", transition: "all .25s", transform: hov ? "translateY(-2px)" : "none" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "24px 0" }}>
          {["Validate inputs at the boundary — schema + allowlist fields", "Reject unknown fields to prevent mass assignment bugs", "Rate limit auth endpoints per IP and per account", "Use a proper secrets manager — rotate credentials regularly", "Short-lived access tokens; protect refresh tokens from storage leaks", "Keep audit logs for all sensitive actions"].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: "12px 16px", fontSize: 14 }}>
              <span style={{ color: C.green, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* S11: Distributed Patterns */}
      <Section id="s11">
        <SectionTag num="11" label="DISTRIBUTED PATTERNS" />
        <SectionTitle>Sagas: Multi-Step<br /><Em>Without Transactions</Em></SectionTitle>
        <Lead>You can't have distributed transactions. Use compensating actions instead. Design for rollback from the start — not after the first outage.</Lead>

        <Callout type="warn" label="DELIVERY REALITY">
          <strong>At-least-once is the default</strong> — duplicates happen. "Exactly-once" is achieved through dedupe + idempotency, not by magic. Design every consumer to handle duplicates safely.
        </Callout>

        <SagaFlow />

        <Callout type="info" label="MONOLITH vs MICROSERVICES">
          <strong>Services are expensive.</strong> Deployments multiply. Contracts multiply. Incidents become coupled. Default to a <strong>modular monolith</strong> until scaling or ownership boundaries actually force separation. "Because scale" is not a reason.
        </Callout>

        <div className="grid-4" style={{ margin: "24px 0" }}>
          {[
            { title: "Circuit Breaking", desc: "Fail fast when a dependency is unhealthy. Probe periodically to recover." },
            { title: "Graceful Degradation", desc: "Partial functionality beats total failure. But never skip auth as a fallback." },
            { title: "Bulkheads", desc: "Separate resource pools so a noisy feature can't starve critical flows." },
            { title: "Backpressure", desc: "When saturated, reject new work early (429/503) instead of timing everything out." },
          ].map(({ title, desc }) => <Card key={title} style={{ padding: 16 }}><div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{title}</div><div style={{ fontSize: 12, color: C.muted }}>{desc}</div></Card>)}
        </div>
      </Section>

      {/* S12: Code Reviews */}
      <Section id="s12">
        <SectionTag num="12" label="CODE REVIEWS" />
        <SectionTitle>A Senior Review<br />Is About <Em>Risk</Em></SectionTitle>
        <Lead>Not style. Not preference. Not line-by-line perfection. Risk: what breaks, when, and how bad is it?</Lead>

        <ReviewChecklist />

        <RealWorldExample 
          title="The 'Looks Good To Me' Outage"
          scenario="A senior dev approves a PR that adds a new column to a high-traffic table. They missed that the migration locks the table for 5 minutes. The site goes down during the deploy."
          solution="Reviewers must ask: 'How does this deploy? Does it lock? What if it fails?' Code correctness is only half the job. Operational safety is the other half."
        />
      </Section>

      {/* S13: Growth */}
      <Section id="s13">
        <SectionTag num="13" label="LEVELING UP" />
        <SectionTitle>Circuit Breakers</SectionTitle>
        <Lead>If a service is broken, stop calling it. Hammering a dead service just makes things worse. Let it recover.</Lead>

        <DetailNote title="LIKE A FUSE IN YOUR HOUSE">
          In your house, if you plug in too many heaters, a fuse blows to save the wiring. In software, a 'Circuit Breaker' stops requests to a failing server to save the rest of the system.
        </DetailNote>

        <div className="grid-2" style={{ margin: "28px 0" }}>
          {[
            { num: "HABIT 1", color: C.accent,  icon: <PenTool size={72} color={C.accent} />, title: "Design docs before coding", desc: "A 1-page doc that can't state failure modes and rollback means the design isn't done yet." },
            { num: "HABIT 2", color: C.orange,  icon: <BookOpen size={72} color={C.orange} />, title: "Read real incident reports", desc: "AWS, Google, Cloudflare, and Stripe all publish postmortems. Steal patterns from their pain." },
            { num: "HABIT 3", color: C.purple,  icon: <Search size={72} color={C.purple} />, title: "Challenge default tech picks", desc: '"Because scale" and "because Kafka" are not reasons. Every choice should survive interrogation.' },
            { num: "HABIT 4", color: C.green,   icon: <BarChart2 size={72} color={C.green} />, title: "Instrument first, optimize second", desc: "Prove the bottleneck. Fix the biggest one. Verify improvement. Never optimize blind." },
          ].map(({ num, color, icon, title, desc }) => (
            <Card key={num} style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -16, right: -16, fontSize: 72, opacity: 0.06, pointerEvents: "none" }}>{icon}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color, marginBottom: 9 }}>{num}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 7 }}>{title}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{desc}</div>
            </Card>
          ))}
        </div>

        <CodeBlock filename="postmortem-template.pseudo">
{`timeline:      [what happened and when — to the minute]
impact:        [users affected | revenue | SLO breach duration]
root_cause:    [single proximate cause, not a list]
contributing:  [systemic factors that allowed it]
detection:     [why didn't we know sooner?]
action_items: [
  { owner: "alice", task: "add circuit breaker to payment svc", deadline: "...", priority: P0 },
  { owner: "bob",   task: "alert on queue lag > 60s",           deadline: "...", priority: P1 },
]
// No orphaned tasks. Every item has an owner and a deadline.`}
        </CodeBlock>
      </Section>

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "56px 24px", color: C.muted, fontSize: 13, borderTop: `1px solid ${C.border}` }}>
        <strong style={{ color: C.accent }}>Senior Backend Developer Playbook</strong> — Systems-first, language-agnostic<br />
        <span style={{ opacity: 0.6 }}>Run the service. Instrument everything. Design for failure. Ship safe.</span>
      </footer>
    </div>
  );
}
