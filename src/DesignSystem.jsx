import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────── */
export const C = {
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
export const GLOBAL_CSS = `
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

export function injectStyles() {
  if (document.getElementById("sbdp-styles")) return;
  const s = document.createElement("style");
  s.id = "sbdp-styles";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

/* ─── HOOKS ─────────────────────────────────────────────────────── */
export function useInView(threshold = 0.12) {
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

/* ─── PRIMITIVES ────────────────────────────────────────────── */
export const Tag = ({ children, color = C.accent }) => (
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

export const SectionTag = ({ num, label }) => (
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

export const Callout = ({ type = "info", label, children }) => {
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

export const Card = ({ children, hover = true, style = {} }) => {
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

export const VizBox = ({ title, children }) => {
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

export const Section = ({ id, children }) => {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} id={id} className={`section-reveal section-padding${visible ? " visible" : ""}`}
      style={{ maxWidth: 980, margin: "0 auto", padding: "72px 24px", borderBottom: `1px solid ${C.border}` }}>
      {children}
    </section>
  );
};

export const Lead = ({ children }) => (
  <p style={{ fontSize: 17, color: "rgba(226,232,240,.68)", fontWeight: 300, maxWidth: 640, marginBottom: 40, lineHeight: 1.65 }}>{children}</p>
);

export const DetailNote = ({ title, children }) => {
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

export const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 14 }}>{children}</h2>
);

export const Em = ({ children }) => <span style={{ color: C.accent, fontStyle: "normal" }}>{children}</span>;

export const ProgressBar = () => {
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

export const HeroGlow = () => (
   <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: "120vw", height: "120vh", background: `radial-gradient(circle at 50% 30%, ${C.accent}12 0%, ${C.purple}08 30%, transparent 60%)`, pointerEvents: "none", zIndex: 0 }} />
);
