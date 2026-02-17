import React from "react";
import { Zap, TrendingUp, CheckCircle2, Rocket, EyeOff, Key, Users } from "lucide-react";
import { C, Section, SectionTag, SectionTitle, Lead, Callout, Em } from "./DesignSystem";

const Roadmap = () => {
  return (
    <Section id="s14">
      <SectionTag num="14" label="CAREER ROADMAP" />
      <SectionTitle>The Path to <Em>Senior</Em></SectionTitle>
      <Lead>Seniority isn't about years of experience. It's about a fundamental shift in how you perceive the system, the team, and the risk.</Lead>

      {/* JUNIOR -> MID */}
      <div style={{ margin: "48px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, padding: "6px 16px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.muted }}>JUNIOR → MID</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>The Competence Shift</h3>
        </div>
        
        <div style={{ background: C.surface2, borderLeft: `3px solid ${C.accent}`, padding: "20px 24px", borderRadius: "0 12px 12px 0", marginBottom: 32 }}>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, marginBottom: 0 }}>
            You stop asking "how do I do this?" and start asking "is this the right thing to do?" The tools become transparent. The domain becomes the hard part.
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, marginBottom: 16, letterSpacing: "0.1em" }}>YOU'RE READY WHEN YOU NOTICE THESE IN YOURSELF</div>
          {[
            "You can estimate work accurately and communicate when estimates change.",
            "You instinctively reach for error handling, not as an afterthought.",
            "You've written something you're genuinely proud of: not just something that worked.",
            "A junior asks you a question and you have a real answer, not a guess."
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 14 }}>
              <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
              <span style={{ color: C.muted }}>{text}</span>
            </div>
          ))}
        </div>

        <Callout type="warn" label="HONEST WARNING">
          <strong>Many people plateau here permanently.</strong> Competent execution without system ownership is comfortable. The next step requires deliberately taking on responsibility you weren't given.
        </Callout>
      </div>

      {/* MID LEVEL */}
      <div style={{ margin: "64px 0", padding: "40px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: `linear-gradient(to right, ${C.accent}, ${C.purple})` }} />
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "start", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.surface2, padding: "4px 12px", borderRadius: 100, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted }}>18 months – 4 years</span>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>Mid-Level: The Implementer</h3>
            <div style={{ fontSize: 16, color: C.muted, fontStyle: "italic" }}>"You write code that works correctly."</div>
          </div>
        </div>

        <div className="grid-2" style={{ gap: 40 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.accent, marginBottom: 16, letterSpacing: "0.1em" }}>WHAT YOUR DAYS ACTUALLY LOOK LIKE</div>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "You own features end-to-end: design, implementation, testing, and deployment.",
                "You handle PR reviews without anxiety and give useful, specific feedback.",
                "You've been on-call at least once and survived it. Maybe even fixed something under pressure.",
                "You think about edge cases, write defensive code, and handle errors explicitly.",
                "You start questioning decisions in the codebase that seemed like magic before.",
                "You can mentor a junior without making them feel stupid.",
                "You still sometimes rebuild things from scratch when a targeted fix would be wiser."
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                  <span style={{ color: C.border }}>·</span> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: C.surface2, padding: 20, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
                <Zap size={14} /> REAL STRENGTH
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Reliable execution. You can be handed a complex problem and trusted to come back with something that works and is maintainable. You know your tools well.</div>
            </div>

            <div style={{ background: C.surface2, padding: 20, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.yellow, marginBottom: 8 }}>
                <EyeOff size={14} /> BLIND SPOT
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>You think in features, not in systems. You don't yet feel the weight of the operational consequences of your decisions: the 3am pages, the slow queries that accumulate, the schema migration that blocks deploys for six minutes.</div>
            </div>

             <div style={{ background: C.surface2, padding: 20, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                <Key size={14} /> THE UNLOCK MOMENT
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>Your first time being the senior person on a project: when there's no one above you to check your design. The discomfort of that responsibility changes how you think.</div>
            </div>
          </div>
        </div>
      </div>

      {/* MID -> SENIOR */}
      <div style={{ margin: "48px 0" }}>
         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, padding: "6px 16px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.muted }}>MID → SENIOR</div>
          <h3 style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>The Ownership Shift</h3>
        </div>
        
        <div style={{ background: C.surface2, borderLeft: `3px solid ${C.purple}`, padding: "20px 24px", borderRadius: "0 12px 12px 0", marginBottom: 32 }}>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.6, marginBottom: 0 }}>
            You stop thinking about your code and start thinking about your service. The unit of concern changes from the feature to the system. You feel the weight of decisions that will outlive your memory of making them.
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted, marginBottom: 16, letterSpacing: "0.1em" }}>YOU'RE READY WHEN YOU NOTICE THESE IN YOURSELF</div>
          {[
            "You read a PR and think about what happens at 3am, not just whether it's correct now.",
            "You write a design doc and voluntarily include a section on what could go wrong.",
            "You've been in a production incident and made a calm decision under pressure.",
            "You've changed your mind in a technical discussion because of evidence, not because of social pressure."
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 14 }}>
              <span style={{ color: C.green, fontWeight: 700 }}>✓</span>
              <span style={{ color: C.muted }}>{text}</span>
            </div>
          ))}
        </div>

        <Callout type="warn" label="HONEST WARNING">
           <strong>This transition is slow and invisible from the inside.</strong> You don't suddenly become senior. One day you realize you've been thinking differently for months without noticing.
        </Callout>
      </div>

      {/* SENIOR LEVEL */}
      <div style={{ margin: "64px 0", padding: "40px", background: `linear-gradient(to bottom right, ${C.surface}, ${C.surface2})`, border: `1px solid ${C.purple}44`, borderRadius: 20, position: "relative", overflow: "hidden", boxShadow: `0 0 60px -30px ${C.purple}22` }}>
         <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 4, background: `linear-gradient(to right, ${C.purple}, ${C.accent})` }} />
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "start", gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, padding: "4px 12px", borderRadius: 100, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.muted }}>4+ years</span>
            </div>
            <h3 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>Senior: The System Thinker</h3>
            <div style={{ fontSize: 16, color: C.muted, fontStyle: "italic" }}>"You write code that works correctly, reliably, and durably."</div>
          </div>
           <div style={{ background: C.surface, padding: "12px 16px", borderRadius: 10, border: `1px solid ${C.border}`, maxWidth: 280 }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: C.muted, marginBottom: 6 }}>DEFAULT MENTAL QUESTION</div>
             <div style={{ fontSize: 13, color: C.accent, fontWeight: 500 }}>"What could go wrong here: and what happens to users when it does?"</div>
           </div>
        </div>

        <div className="grid-2" style={{ gap: 40 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.purple, marginBottom: 16, letterSpacing: "0.1em" }}>WHAT YOUR DAYS ACTUALLY LOOK LIKE</div>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "You spend as much time on design documents as on code: sometimes more.",
                "You read the PR description before the diff. You're looking for what's missing, not what's wrong.",
                "You write the runbook before the feature ships. You instrument before you optimize.",
                "You push back on requirements when you see a simpler path to the same outcome.",
                "You ask 'what does rollback look like?' before 'when does this ship?'",
                "You treat on-call burden as a design signal. Frequent pages mean the system is communicating something.",
                "You think in tradeoffs, not solutions. Every choice has a cost somewhere.",
                "You deliberately make junior engineers more capable rather than doing their work for them."
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                  <span style={{ color: C.border }}>·</span> {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ background: C.surface, padding: 20, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 8 }}>
                <Zap size={14} /> REAL STRENGTH
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>You see the full lifecycle. You know that a feature isn't done when it ships: it's done when it's been running quietly for six months, hasn't caused a page, and can be changed safely.</div>
            </div>

            <div style={{ background: C.surface, padding: 20, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.yellow, marginBottom: 8 }}>
                <EyeOff size={14} /> BLIND SPOT
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>You can slow teams down by over-engineering or by being too cautious about risk. The challenge is knowing when "good enough, shipped" beats "perfect, delayed." You have to relearn pragmatism intentionally.</div>
            </div>

             <div style={{ background: C.surface, padding: 20, borderRadius: 12, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 8 }}>
                <Key size={14} /> THE UNLOCK MOMENT
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>The first time you prevent an outage by saying "wait" in a design review: and people listen, and it turns out you were right. That moment crystallizes what the role actually is.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ margin: "64px 0" }}>
         <SectionTitle>Things Worth Knowing <Em>Early</Em></SectionTitle>
         <Lead>Honest Truths About This Journey</Lead>
         
         <div className="grid-2">
           {[
             { icon: <TrendingUp size={24} />, title: "Time alone doesn't make you senior", desc: "You can spend 6 years as a mid-level engineer if you never take on the discomfort of ownership." },
             { icon: <Zap size={24} />, title: "Seniority is a mindset shift, not a skill accumulation", desc: "You don't need to know more technologies. You need to think differently about failure, time, and risk." },
             { icon: <CheckCircle2 size={24} />, title: "The transition is invisible from the inside", desc: "You won't feel yourself becoming senior. You'll just gradually notice you've been thinking like one for a while." },
             { icon: <Users size={24} />, title: "Everyone skips stages", desc: "A strong junior in one company is a weak junior in another. Context matters enormously." },
             { icon: <Rocket size={24} />, title: "Seniority doesn't mean you stop writing code", desc: "It means the code you write is increasingly surrounded by judgment: what to build, how to build it, and what not to build." },
           ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, padding: 16, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface }}>
                <div style={{ color: C.accent }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
           ))}
         </div>
      </div>
    </Section>
  );
};

export default Roadmap;
