import { useState, useEffect, useRef } from "react";
import { T } from "../theme";

// ==========================================
// 1. KARTU FEED (Animasi Mulus + Efek Fade Out)
// ==========================================
export function Card({ card, theme, idx }: any) {
  const c = T[theme];
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Mesin pengukur tinggi elemen
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [contentHeight, setContentHeight] = useState("2000px"); 

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setContentHeight("4.5rem"); // Tinggi saat menyusut
    }
  }, [isExpanded]);

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 14, padding: "1.75rem", background: c.bg, border: `1px solid ${isExpanded ? c.accent : c.border}`, borderRadius: 12, textDecoration: "none", color: "inherit", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.08}s both`, position: "relative" }} onMouseEnter={e => { if(!isExpanded) e.currentTarget.style.borderColor = c.accent; if(!isExpanded) e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { if(!isExpanded) e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = "translateY(0)"; }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: c.accentDim, color: c.accent }}><i className="ri-user-3-line" style={{ fontSize: "0.9rem" }} /></div>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.author}</span>
        </div>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", color: c.textMuted, fontWeight: 500 }}>{card.time}</span>
      </div>
      
      {/* BODY DENGAN ANIMASI MAX-HEIGHT & FADE OUT */}
      <div style={{ cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: c.text, lineHeight: 1.3, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{card.title}</h3>
        
        <div style={{ maxHeight: contentHeight, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative" }}>
          
          <p ref={contentRef} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", color: c.textSub, lineHeight: 1.6, fontWeight: 400, whiteSpace: "pre-wrap", margin: 0 }}>
            {card.body}
          </p>
          
          {/* Efek Gradasi (Memudar) yang muncul saat teks ditutup */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2.5rem", background: `linear-gradient(to bottom, transparent, ${c.bg})`, opacity: isExpanded ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: "none" }} />
        </div>
      </div>

      {/* SUMBER TERSEMBUNYI */}
      {isExpanded && (
        <div style={{ padding: "1rem", background: c.accentDim, borderRadius: 8, border: `1px dashed ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem", animation: "slideFadeDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards", transformOrigin: "top" }}>
          <style>{`@keyframes slideFadeDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: c.textMuted, textTransform: "uppercase", marginBottom: "0.2rem" }}>Sumber Referensi</div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", fontWeight: 800, color: c.accent }}>{card.source.name}</div>
          </div>
          {card.source.url !== "#" ? (
            <a href={card.source.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: c.bg, background: c.accent, padding: "0.5rem 1rem", borderRadius: 6, textDecoration: "none" }}>Buka Link <i className="ri-external-link-line" /></a>
          ) : (
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 600, color: c.textMuted }}>Internal SOVR</span>
          )}
        </div>
      )}
      
      {/* FOOTER & TOMBOL PANAH */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: `1px solid ${c.border}`, marginTop: "0.5rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: c.textMuted, textTransform: "uppercase", background: c.accentDim, padding: "0.3rem 0.75rem", borderRadius: 4 }}>{card.tag}</span>
        
        <button onClick={() => setIsExpanded(!isExpanded)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: isExpanded ? c.accent : "transparent", border: `1px solid ${c.border}`, color: isExpanded ? c.bg : c.accent, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <i className="ri-arrow-down-s-line" style={{ fontSize: "1.2rem", transform: isExpanded ? "rotate(-180deg)" : "rotate(0deg)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </button>
      </div>
    </article>
  );
}

// ==========================================
// 2. KARTU PILIHAN EDITOR
// ==========================================
export function EditorCard({ card, theme, idx }: any) {
  const c = T[theme];
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [contentHeight, setContentHeight] = useState("2000px");

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setContentHeight("6.5rem"); // Tinggi saat menyusut (sedikit lebih panjang dari Card biasa)
    }
  }, [isExpanded]);

  return (
    <div style={{ position: "relative", padding: "2rem", background: c.bg, border: `1px solid ${isExpanded ? c.accent : c.border}`, borderRadius: 12, display: "flex", flexDirection: "column", gap: 16, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", animation: `fadeIn 0.6s ease ${idx * 0.1}s both` }} onMouseEnter={e => { if(!isExpanded) e.currentTarget.style.borderColor = c.accent; }} onMouseLeave={e => { if(!isExpanded) e.currentTarget.style.borderColor = c.border; }}>
      <div style={{ position: "absolute", top: -1, left: -1, width: 40, height: 40, borderTop: `3px solid ${c.accent}`, borderLeft: `3px solid ${c.accent}`, borderTopLeftRadius: 12 }} />
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${c.border}`, paddingBottom: "1rem", cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent }}><i className="ri-user-star-line" style={{ fontSize: "1.1rem" }} /></div>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.author}</div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", color: c.textMuted, fontWeight: 500, marginTop: 2 }}>{card.time}</div>
          </div>
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: c.text, border: `1px solid ${c.border}`, padding: "0.3rem 0.8rem", borderRadius: 100, textTransform: "uppercase" }}>{card.tag}</div>
      </div>
      
      {/* BODY */}
      <div style={{ cursor: "pointer" }} onClick={() => setIsExpanded(!isExpanded)}>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: c.text, lineHeight: 1.25, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{card.title}</h3>
        
        <div style={{ maxHeight: contentHeight, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)", position: "relative" }}>
          
          <p ref={contentRef} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.95rem", color: c.textSub, lineHeight: 1.7, fontWeight: 400, whiteSpace: "pre-wrap", margin: 0 }}>
            {card.body}
          </p>

          {/* Efek Gradasi (Memudar) */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3rem", background: `linear-gradient(to bottom, transparent, ${c.bg})`, opacity: isExpanded ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: "none" }} />
        </div>
      </div>
      
      {/* SUMBER TERSEMBUNYI */}
      {isExpanded && (
        <div style={{ padding: "1.25rem", background: c.accentDim, borderRadius: 8, border: `1px dashed ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.5rem", animation: "slideFadeDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards", transformOrigin: "top" }}>
          <div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", color: c.textMuted, textTransform: "uppercase", marginBottom: "0.3rem" }}>Sumber Referensi</div>
            <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", fontWeight: 800, color: c.accent }}>{card.source.name}</div>
          </div>
          {card.source.url !== "#" ? (
            <a href={card.source.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700, color: c.bg, background: c.accent, padding: "0.6rem 1.25rem", borderRadius: 6, textDecoration: "none", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Buka Link <i className="ri-external-link-line" /></a>
          ) : (
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: c.textMuted }}>Internal SOVR</span>
          )}
        </div>
      )}

      {/* FOOTER TOMBOL PANAH */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <button onClick={() => setIsExpanded(!isExpanded)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", background: isExpanded ? c.accent : "transparent", border: `1px solid ${c.border}`, color: isExpanded ? c.bg : c.accent, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <i className="ri-arrow-down-s-line" style={{ fontSize: "1.3rem", transform: isExpanded ? "rotate(-180deg)" : "rotate(0deg)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        </button>
      </div>
    </div>
  );
}