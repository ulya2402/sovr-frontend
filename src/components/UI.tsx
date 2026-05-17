import { useState, useEffect, useRef } from "react";
import { T, FILTERS } from "../theme";

export function SourceSheet({ source, theme, onClose }: any) {
  const c = T[theme];
  const [vis, setVis] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVis(true)); return () => cancelAnimationFrame(id); }, []);
  const close = () => { setVis(false); setTimeout(onClose, 320); };
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 1000, background: vis ? (theme === "dark" ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.25)") : "rgba(0,0,0,0)", transition: "background 0.3s", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 520, background: c.surface, borderRadius: "22px 22px 0 0", border: `1px solid ${c.borderHover}`, borderBottom: "none", padding: "0 1.75rem 2.5rem", transform: vis ? "translateY(0)" : "translateY(100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)", boxShadow: theme === "dark" ? "0 -32px 80px rgba(0,0,0,0.7)" : "0 -16px 48px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0 1.25rem" }}><div style={{ width: 36, height: 4, borderRadius: 2, background: c.border }} /></div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: c.textMuted, marginBottom: "1.25rem" }}>Sumber Berita</div>
        <div style={{ background: c.surface2, border: `1px solid ${c.border}`, borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.85rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: c.amberDim, border: `1px solid ${c.amber}30`, display: "flex", alignItems: "center", justifyContent: "center", color: c.amber, fontSize: "1.2rem" }}><i className={source.logo} /></div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", color: c.text, fontWeight: 400 }}>{source.name}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: c.textMuted, letterSpacing: "0.04em", marginTop: 3 }}>{source.domain}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: "0.6rem", borderTop: `1px solid ${c.border}` }}>
            <i className="ri-calendar-line" style={{ fontSize: "0.75rem", color: c.textMuted }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", color: c.textMuted, letterSpacing: "0.04em" }}>Dipublikasikan {source.publishDate}</span>
          </div>
        </div>
        <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "0.85rem", background: c.amberDim, border: `1px solid ${c.amber}40`, borderRadius: 14, textDecoration: "none", fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: c.amber, transition: "all 0.2s" }}>Buka Artikel Asli <i className="ri-external-link-line" style={{ fontSize: "0.85rem" }} /></a>
        <button onClick={close} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "0.75rem", marginTop: 8, background: "transparent", border: `1px solid ${c.border}`, borderRadius: 14, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: c.textMuted }}>Tutup</button>
      </div>
    </div>
  );
}

export function ShareModal({ card, theme, onClose }: any) {
  const c = T[theme];
  const [toast, setToast] = useState("");
  const url = window.location.href;
  const act = (type: string) => {
    if (type === "telegram") window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(card.title)}`, "_blank");
    else if (type === "instagram") { navigator.clipboard.writeText(`${card.title}\n\nBaca di SOVR.:\n${url}`); setToast("Teks disalin!"); }
    else { navigator.clipboard.writeText(url); setToast("Link disalin!"); }
    if (type !== "telegram") setTimeout(() => setToast(""), 2000);
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, background: theme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: c.surface, border: `1px solid ${c.borderHover}`, borderRadius: 20, padding: "1.75rem", width: 340, maxWidth: "90vw", boxShadow: theme === "dark" ? "0 40px 100px rgba(0,0,0,0.8)" : "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: c.amber, textTransform: "uppercase" }}>Bagikan</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: "1.2rem", lineHeight: 1 }}><i className="ri-close-line" /></button>
        </div>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: "1rem", color: c.text, lineHeight: 1.4, marginBottom: "1.25rem" }}>{card.title}</p>
        {[
          { type: "telegram", icon: "ri-telegram-fill", label: "Telegram", col: "#29b6f6" },
          { type: "instagram", icon: "ri-instagram-fill", label: "Instagram", col: "#e1306c" },
          { type: "copy", icon: "ri-link", label: "Salin Link", col: c.amber },
        ].map(o => (
          <button key={o.type} onClick={() => act(o.type)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: c.surface2, border: `1px solid ${c.border}`, borderRadius: 12, padding: "0.65rem 1rem", marginBottom: 6, cursor: "pointer", color: o.col, fontFamily: "'Space Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.04em", transition: "all 0.15s" }}>
            <i className={o.icon} style={{ fontSize: "1rem" }} /> {o.label}
          </button>
        ))}
        {toast && <div style={{ marginTop: 8, textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: c.amber }}>{toast}</div>}
      </div>
    </div>
  );
}

export function SourceChip({ source, theme, variant = "normal" }: any) {
  const c = T[theme];
  const [src, setSrc] = useState(false);
  return (
    <>
      {src && <SourceSheet source={source} theme={theme} onClose={() => setSrc(false)} />}
      <button onClick={() => setSrc(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.06em", color: variant === "editor" ? c.amber : c.textMuted, background: variant === "editor" ? c.amberDim : "transparent", border: `1px solid ${variant === "editor" ? c.amber + "35" : c.border}`, borderRadius: 8, padding: "0.28rem 0.7rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.color = c.amber; e.currentTarget.style.borderColor = c.amber + "50"; e.currentTarget.style.background = c.amberDim; }} onMouseLeave={e => { e.currentTarget.style.color = variant === "editor" ? c.amber : c.textMuted; e.currentTarget.style.borderColor = variant === "editor" ? c.amber + "35" : c.border; e.currentTarget.style.background = variant === "editor" ? c.amberDim : "transparent"; }}>
        <i className="ri-link-m" style={{ fontSize: "0.65rem" }} />{source.name}
      </button>
    </>
  );
}