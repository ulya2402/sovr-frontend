import { useState } from "react";
import { T, TAG } from "../theme";
import { SourceChip, ShareModal } from "./UI";

export function Card({ card, theme, idx }: any) {
  const c = T[theme];
  const tag = TAG[card.cat]?.[theme] || TAG.ai[theme];
  const [saved, setSaved] = useState(false);
  const [hov, setHov] = useState(false);
  const [share, setShare] = useState(false);
  
  return (
    <>
      {share && <ShareModal card={card} theme={theme} onClose={() => setShare(false)} />}
      <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ position: "relative", background: hov ? c.surface2 : c.surface, border: `1px solid ${hov ? c.borderHover : c.border}`, borderRadius: 18, padding: "1.5rem 1.5rem 1.25rem", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? (theme === "dark" ? "0 24px 64px rgba(0,0,0,0.45)" : "0 16px 48px rgba(0,0,0,0.09)") : "none", animation: `cardIn 0.55s cubic-bezier(0.4,0,0.2,1) ${idx * 0.07}s both`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "2px", borderRadius: 2, background: `linear-gradient(to bottom,transparent,${tag.bar},transparent)`, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.85rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.57rem", letterSpacing: "0.08em", textTransform: "uppercase", background: tag.bg, color: tag.color, padding: "0.22rem 0.65rem", borderRadius: 6 }}><i className={card.icon} style={{ fontSize: "0.65rem" }} />{card.tag}</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", color: c.textMuted, letterSpacing: "0.04em", marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}><i className="ri-time-line" style={{ fontSize: "0.6rem" }} />{card.time}</span>
        </div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "1.15rem", fontWeight: 400, lineHeight: 1.32, color: c.text, marginBottom: "0.6rem", letterSpacing: "-0.015em" }}>{card.title}</h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: "0.83rem", lineHeight: 1.75, color: c.textSub, marginBottom: "0.9rem" }}>{card.body}</p>
        <div style={{ marginBottom: "0.85rem" }}><SourceChip source={card.source} theme={theme} variant="normal" /></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.9rem", borderTop: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: tag.bg, border: `1px solid ${tag.bar}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: tag.color, flexShrink: 0 }}><i className="ri-user-3-line" /></div>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.57rem", color: c.textMuted }}>{card.author}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setSaved(!saved)} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.06em", textTransform: "uppercase", color: saved ? c.amber : c.textMuted, background: saved ? c.amberDim : "transparent", border: `1px solid ${saved ? c.amber + "40" : c.border}`, borderRadius: 8, padding: "0.3rem 0.65rem", cursor: "pointer", transition: "all 0.2s" }}><i className={saved ? "ri-bookmark-fill" : "ri-bookmark-line"} style={{ fontSize: "0.68rem" }} />{saved ? "Tersimpan" : "Simpan"}</button>
            <button onClick={() => setShare(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.06em", textTransform: "uppercase", color: c.textMuted, background: "transparent", border: `1px solid ${c.border}`, borderRadius: 8, padding: "0.3rem 0.65rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = c.blue; e.currentTarget.style.borderColor = c.blue + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.borderColor = c.border; }}><i className="ri-share-forward-line" style={{ fontSize: "0.68rem" }} />Share</button>
          </div>
        </div>
      </article>
    </>
  );
}

export function EditorCard({ card, theme, idx }: any) {
  const c = T[theme];
  const tag = TAG[card.cat]?.[theme] || TAG.ai[theme];
  const [saved, setSaved] = useState(false);
  const [hov, setHov] = useState(false);
  const [share, setShare] = useState(false);
  
  return (
    <>
      {share && <ShareModal card={card} theme={theme} onClose={() => setShare(false)} />}
      <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ position: "relative", overflow: "hidden", background: theme === "dark" ? (hov ? "#1c1814" : "#161310") : (hov ? "#fdf5e0" : "#fef9ec"), border: `1px solid ${hov ? c.amber + "55" : c.edBorder}`, borderRadius: 22, padding: 0, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? (theme === "dark" ? "0 28px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,83,0.1)" : "0 16px 50px rgba(180,137,30,0.14)") : (theme === "dark" ? "0 4px 20px rgba(212,168,83,0.04)" : "0 4px 16px rgba(184,137,30,0.07)"), animation: `cardIn 0.55s cubic-bezier(0.4,0,0.2,1) ${idx * 0.1}s both` }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,transparent,${c.amber},transparent)` }} />
        <div style={{ position: "absolute", top: 18, right: 18, width: 32, height: 32, borderRadius: "50%", background: c.amberDim, border: `1px solid ${c.amber}40`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontSize: "0.85rem", color: c.amber, fontStyle: "italic", zIndex: 1, flexShrink: 0 }}>{idx + 1}</div>
        <div style={{ padding: "1.5rem 1.75rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.57rem", letterSpacing: "0.08em", textTransform: "uppercase", background: tag.bg, color: tag.color, padding: "0.22rem 0.65rem", borderRadius: 6 }}><i className={card.icon} style={{ fontSize: "0.65rem" }} />{card.tag}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", color: c.textMuted, display: "flex", alignItems: "center", gap: 4 }}><i className="ri-time-line" style={{ fontSize: "0.6rem" }} />{card.time}</span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "1.45rem", fontWeight: 400, lineHeight: 1.28, color: c.text, marginBottom: "0.8rem", letterSpacing: "-0.02em" }}>{card.title}</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "1rem 0" }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(to right,${c.amber}55,transparent)` }} />
            <i className="ri-quill-pen-line" style={{ fontSize: "0.65rem", color: c.amber, opacity: 0.55 }} />
            <div style={{ height: 1, width: 18, background: `${c.amber}25` }} />
          </div>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.8, color: c.textSub, marginBottom: "1.1rem" }}>{card.body}</p>
          <div style={{ marginBottom: "1.1rem" }}><SourceChip source={card.source} theme={theme} variant="editor" /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: `1px solid ${c.amber}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.amberDim, border: `1px solid ${c.amber}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", color: c.amber, flexShrink: 0 }}><i className="ri-quill-pen-line" /></div>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.57rem", color: c.textMuted }}>{card.author}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.5rem", color: `${c.amber}70` }}>· Editor Pick</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setSaved(!saved)} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.06em", textTransform: "uppercase", color: saved ? c.amber : c.textMuted, background: saved ? c.amberDim : "transparent", border: `1px solid ${saved ? c.amber + "50" : c.amber + "22"}`, borderRadius: 8, padding: "0.3rem 0.65rem", cursor: "pointer", transition: "all 0.2s" }}><i className={saved ? "ri-bookmark-fill" : "ri-bookmark-line"} style={{ fontSize: "0.68rem" }} />{saved ? "Tersimpan" : "Simpan"}</button>
              <button onClick={() => setShare(true)} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.06em", textTransform: "uppercase", color: c.textMuted, background: "transparent", border: `1px solid ${c.amber}22`, borderRadius: 8, padding: "0.3rem 0.65rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = c.blue; e.currentTarget.style.borderColor = c.blue + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.borderColor = c.amber + "22"; }}><i className="ri-share-forward-line" style={{ fontSize: "0.68rem" }} />Share</button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}