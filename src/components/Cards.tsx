import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import { T } from "../theme";
import { slugify } from "../App"; // 🔥 FIX: Mengimpor fungsi slugify dari App.tsx

// ─────────────────────────────────────────────
// SISTEM DESAIN — satu sumber kebenaran
// Ubah di sini, berlaku ke seluruh card
// ─────────────────────────────────────────────

// Ukuran font — mode normal (layar)
const FONT = {
  authorLabel:  "0.72rem",   // nama penulis
  timeLabel:    "0.68rem",   // waktu/tanggal
  tagLabel:     "0.63rem",   // badge kategori
  titleFeed:    "1.15rem",   // judul card feed
  titleEditor:  "1.4rem",    // judul card editor (lebih besar, lebih premium)
  body:         "0.88rem",   // isi berita
  sourceLabel:  "0.55rem",   // label "Sumber Referensi"
  sourceName:   "0.82rem",   // nama sumber
  domainBrand:  "0.78rem",   // domain watermark di footer
};

// Ukuran font — mode download (gambar 640px = setara desktop 1080px karena pixelRatio 3×)
const FONT_CAP = {
  authorLabel:  "0.78rem",
  timeLabel:    "0.72rem",
  tagLabel:     "0.68rem",
  titleFeed:    "1.3rem",
  titleEditor:  "1.55rem",
  body:         "0.95rem",
  sourceLabel:  "0.58rem",
  sourceName:   "0.88rem",
  domainBrand:  "0.82rem",
};

// Spacing vertikal antar section — GAP di flex column
const GAP_NORMAL  = 12;   // px, jarak antar section saat di layar
const GAP_CAPTURE = 16;   // px, sedikit lebih longgar saat jadi gambar

// Padding card
const PAD_NORMAL  = "1.5rem 1.6rem";
const PAD_CAPTURE = "2.2rem 2.6rem";

// Lebar gambar download
const CAPTURE_WIDTH = 640;

// ─────────────────────────────────────────────
// HELPER: style font + warna — DRY
// ─────────────────────────────────────────────
const MR = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'Manrope', sans-serif",
  ...extra,
});


// ══════════════════════════════════════════════
// 1. KARTU FEED
// ══════════════════════════════════════════════
export function Card({ card, theme, idx }: any) {
  const c = T[theme];
  const [isExpanded, setIsExpanded]   = useState(true);
  const [showShare,  setShowShare]    = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const cardRef    = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [contentHeight, setContentHeight] = useState("2000px");

  const domain = typeof window !== "undefined" ? window.location.hostname : "sovr.news";

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setContentHeight("4.4rem");
    }
  }, [isExpanded]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 🔥 FIX: Menggunakan URL Slug yang cantik untuk Feed
    const link = `${window.location.origin}/feed/${slugify(card.title)}`;
    navigator.clipboard.writeText(link).then(() => alert(`Link disalin!\n${link}`));
    setShowShare(false);
  };

  const handleDownloadImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(false);
    if (!cardRef.current) return;
    try {
      setIsCapturing(true);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        width: CAPTURE_WIDTH,
        backgroundColor: c.bg,
        style: {
          margin: "0",
          transform: "none",
          width: `${CAPTURE_WIDTH}px`,
          minWidth: `${CAPTURE_WIDTH}px`,
          boxSizing: "border-box",
        },
        filter: (node: Element) =>
          !(node instanceof HTMLElement && node.classList.contains("no-print")),
      });

      const a = document.createElement("a");
      a.download = `SOVR-Insight-${card.id}.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat gambar, coba lagi.");
    } finally {
      setIsCapturing(false);
    }
  };

  const F = isCapturing ? FONT_CAP : FONT;

  return (
    <article
      ref={cardRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isCapturing ? GAP_CAPTURE : GAP_NORMAL,
        background: c.bg,
        border: `1px solid ${isExpanded || isCapturing ? c.accent : c.border}`,
        borderRadius: 12,
        position: "relative",
        width: isCapturing ? `${CAPTURE_WIDTH}px` : "100%",
        minWidth: isCapturing ? `${CAPTURE_WIDTH}px` : "auto",
        padding: isCapturing ? PAD_CAPTURE : PAD_NORMAL,
        boxSizing: "border-box",
        transition: isCapturing ? "none" : "border-color 0.25s, transform 0.25s",
        animation: isCapturing ? "none" : `slideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s both`,
      }}
      onMouseEnter={(e) => { if (!isExpanded && !isCapturing) { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={(e) => { if (!isCapturing) { e.currentTarget.style.borderColor = isExpanded ? c.accent : c.border; e.currentTarget.style.transform = "translateY(0)"; } }}
    >

      {/* ── SECTION 1: Header — avatar + nama + waktu ── */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: isCapturing ? "default" : "pointer" }}
        onClick={() => !isCapturing && setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 26, height: 26, borderRadius: 6,
            background: c.accentDim, color: c.accent, flexShrink: 0,
          }}>
            <i className="ri-user-3-line" style={{ fontSize: "0.85rem" }} />
          </div>
          <span style={MR({ fontSize: F.authorLabel, fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: "0.07em" })}>
            {card.author}
          </span>
        </div>
        <span style={MR({ fontSize: F.timeLabel, fontWeight: 500, color: c.textMuted })}>
          {card.time}
        </span>
      </div>

      {/* ── Divider tipis antara header dan konten ── */}
      <div style={{ height: 1, background: c.border, opacity: 0.6, flexShrink: 0 }} />

      {/* ── SECTION 2: Judul + Isi ── */}
      <div
        style={{ cursor: isCapturing ? "default" : "pointer" }}
        onClick={() => !isCapturing && setIsExpanded(!isExpanded)}
      >
        <h3 style={MR({
          fontSize: F.titleFeed,
          fontWeight: 700,
          color: c.text,
          lineHeight: 1.38,
          margin: "0 0 0.5rem 0",
          letterSpacing: "-0.01em",
        })}>
          {card.title}
        </h3>

        <div style={{
          maxHeight: isCapturing ? "none" : contentHeight,
          overflow: "hidden",
          transition: isCapturing ? "none" : "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
        }}>
          <p ref={contentRef} style={MR({
            fontSize: F.body,
            color: c.textSub,
            lineHeight: 1.68,
            fontWeight: 400,
            whiteSpace: "pre-wrap",
            margin: 0,
          })}>
            {card.body}
          </p>
          {!isCapturing && (
            <div className="no-print" style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "2.5rem",
              background: `linear-gradient(to bottom, transparent, ${c.bg})`,
              opacity: isExpanded ? 0 : 1,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }} />
          )}
        </div>
      </div>

      {/* ── SECTION 3: Kotak Sumber ── */}
      {(isExpanded || isCapturing) && (
        <div style={{
          padding: isCapturing ? "0.9rem 1.1rem" : "0.85rem 1rem",
          background: c.accentDim,
          borderRadius: 8,
          border: `1px dashed ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: isCapturing ? "none" : "slideFadeDown 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          <div>
            <div style={MR({ fontSize: F.sourceLabel, fontWeight: 700, letterSpacing: "0.1em", color: c.textMuted, textTransform: "uppercase", marginBottom: "0.2rem" })}>
              Sumber Referensi
            </div>
            <div style={MR({ fontSize: F.sourceName, fontWeight: 800, color: c.accent })}>
              {card.source.name}
            </div>
          </div>
          {!isCapturing && (
            card.source.url !== "#"
              ? <a
                  href={card.source.url} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={MR({ fontSize: "0.63rem", fontWeight: 700, color: c.bg, background: c.accent, padding: "0.45rem 0.9rem", borderRadius: 6, textDecoration: "none" })}
                >
                  Buka Link <i className="ri-external-link-line" />
                </a>
              : <span style={MR({ fontSize: "0.6rem", fontWeight: 600, color: c.textMuted })}>Internal SOVR</span>
          )}
        </div>
      )}

      {/* ── SECTION 4: Footer — tag + tombol / watermark ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "0.6rem",
        borderTop: `1px solid ${c.border}`,
      }}>
        <span style={MR({
          fontSize: F.tagLabel,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: c.textMuted,
          textTransform: "uppercase",
          background: c.accentDim,
          padding: "0.28rem 0.7rem",
          borderRadius: 4,
        })}>
          {card.tag}
        </span>

        {isCapturing ? (
          <span style={MR({ fontSize: F.domainBrand, fontWeight: 800, color: c.accent, letterSpacing: "0.04em" })}>
            {domain}
          </span>
        ) : (
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative" }} onMouseLeave={() => setShowShare(false)}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowShare(!showShare); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: showShare ? c.accent : "transparent", border: `1px solid ${showShare ? c.accent : c.border}`, color: showShare ? c.bg : c.textMuted, cursor: "pointer", transition: "all 0.2s" }}
              >
                <i className="ri-share-forward-line" style={{ fontSize: "0.95rem" }} />
              </button>
              {showShare && (
                <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "0.35rem", display: "flex", flexDirection: "column", gap: 2, minWidth: 168, boxShadow: theme === "dark" ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.09)", zIndex: 20, animation: "slideUp 0.18s ease forwards", transformOrigin: "bottom right" }}>
                  <button onClick={handleCopyLink} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "0.55rem 0.75rem", background: "transparent", border: "none", fontFamily: "'Manrope', sans-serif", fontSize: "0.73rem", fontWeight: 700, color: c.text, cursor: "pointer", borderRadius: 6, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = c.accentDim} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <i className="ri-link" style={{ color: c.textMuted, fontSize: "0.95rem" }} /> Copy Link Berita
                  </button>
                  <button onClick={handleDownloadImage} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "0.55rem 0.75rem", background: "transparent", border: "none", fontFamily: "'Manrope', sans-serif", fontSize: "0.73rem", fontWeight: 700, color: c.text, cursor: "pointer", borderRadius: 6, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = c.accentDim} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <i className="ri-instagram-line" style={{ color: c.textMuted, fontSize: "0.95rem" }} /> Download (IG/WA)
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "50%", background: isExpanded ? c.accent : "transparent", border: `1px solid ${c.border}`, color: isExpanded ? c.bg : c.accent, cursor: "pointer", transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)" }}
            >
              <i className="ri-arrow-down-s-line" style={{ fontSize: "1.1rem", transform: isExpanded ? "rotate(-180deg)" : "rotate(0)", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}


// ══════════════════════════════════════════════
// 2. KARTU PILIHAN EDITOR
// ══════════════════════════════════════════════
export function EditorCard({ card, theme, idx }: any) {
  const c = T[theme];
  const [isExpanded, setIsExpanded]   = useState(true);
  const [showShare,  setShowShare]    = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const cardRef    = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [contentHeight, setContentHeight] = useState("2000px");

  const domain = typeof window !== "undefined" ? window.location.hostname : "sovr.news";

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setContentHeight("6.2rem");
    }
  }, [isExpanded]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 🔥 FIX: Menggunakan URL Slug yang cantik untuk Editor Picks
    const link = `${window.location.origin}/editor-picks/${slugify(card.title)}`;
    navigator.clipboard.writeText(link).then(() => alert(`Link disalin!\n${link}`));
    setShowShare(false);
  };

  const handleDownloadImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(false);
    if (!cardRef.current) return;
    try {
      setIsCapturing(true);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        width: CAPTURE_WIDTH,
        backgroundColor: c.bg,
        style: {
          margin: "0",
          transform: "none",
          width: `${CAPTURE_WIDTH}px`,
          minWidth: `${CAPTURE_WIDTH}px`,
          boxSizing: "border-box",
        },
        filter: (node: Element) =>
          !(node instanceof HTMLElement && node.classList.contains("no-print")),
      });

      const a = document.createElement("a");
      a.download = `SOVR-PilihanEditor-${card.id}.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat gambar, coba lagi.");
    } finally {
      setIsCapturing(false);
    }
  };

  const F = isCapturing ? FONT_CAP : FONT;

  return (
    <div
      ref={cardRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: isCapturing ? GAP_CAPTURE : GAP_NORMAL,
        background: c.bg,
        border: `1px solid ${isExpanded || isCapturing ? c.accent : c.border}`,
        borderRadius: 12,
        width: isCapturing ? `${CAPTURE_WIDTH}px` : "100%",
        minWidth: isCapturing ? `${CAPTURE_WIDTH}px` : "auto",
        padding: isCapturing ? "2.6rem 3rem" : "1.75rem 1.8rem",
        boxSizing: "border-box",
        transition: isCapturing ? "none" : "border-color 0.25s",
        animation: isCapturing ? "none" : `fadeIn 0.6s ease ${idx * 0.1}s both`,
      }}
      onMouseEnter={(e) => { if (!isExpanded && !isCapturing) e.currentTarget.style.borderColor = c.accent; }}
      onMouseLeave={(e) => { if (!isExpanded && !isCapturing) e.currentTarget.style.borderColor = c.border; }}
    >
      {/* Dekorasi sudut kiri atas */}
      <div style={{
        position: "absolute", top: -1, left: -1,
        width: 36, height: 36,
        borderTop: `3px solid ${c.accent}`,
        borderLeft: `3px solid ${c.accent}`,
        borderTopLeftRadius: 12,
        pointerEvents: "none",
      }} />

      {/* ── SECTION 1: Header — avatar + nama + waktu + tag ── */}
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.85rem", borderBottom: `1px solid ${c.border}`, cursor: isCapturing ? "default" : "pointer" }}
        onClick={() => !isCapturing && setIsExpanded(!isExpanded)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, flexShrink: 0 }}>
            <i className="ri-user-star-line" style={{ fontSize: "1rem" }} />
          </div>
          <div>
            <div style={MR({ fontSize: F.authorLabel, fontWeight: 700, color: c.accent, textTransform: "uppercase", letterSpacing: "0.06em" })}>
              {card.author}
            </div>
            <div style={MR({ fontSize: F.timeLabel, color: c.textMuted, fontWeight: 500, marginTop: 2 })}>
              {card.time}
            </div>
          </div>
        </div>
        <div style={MR({
          fontSize: F.tagLabel,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: c.text,
          border: `1px solid ${c.border}`,
          padding: "0.28rem 0.75rem",
          borderRadius: 100,
          textTransform: "uppercase",
          flexShrink: 0,
        })}>
          {card.tag}
        </div>
      </div>

      {/* ── SECTION 2: Judul + Isi ── */}
      <div
        style={{ cursor: isCapturing ? "default" : "pointer" }}
        onClick={() => !isCapturing && setIsExpanded(!isExpanded)}
      >
        <h3 style={MR({
          fontSize: F.titleEditor,
          fontWeight: 800,
          color: c.text,
          lineHeight: 1.3,
          margin: "0 0 0.55rem 0",
          letterSpacing: "-0.02em",
        })}>
          {card.title}
        </h3>

        <div style={{
          maxHeight: isCapturing ? "none" : contentHeight,
          overflow: "hidden",
          transition: isCapturing ? "none" : "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
        }}>
          <p ref={contentRef} style={MR({
            fontSize: F.body,
            color: c.textSub,
            lineHeight: 1.72,
            fontWeight: 400,
            whiteSpace: "pre-wrap",
            margin: 0,
          })}>
            {card.body}
          </p>
          {!isCapturing && (
            <div className="no-print" style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "3rem",
              background: `linear-gradient(to bottom, transparent, ${c.bg})`,
              opacity: isExpanded ? 0 : 1,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }} />
          )}
        </div>
      </div>

      {/* ── SECTION 3: Kotak Sumber ── */}
      {(isExpanded || isCapturing) && (
        <div style={{
          padding: isCapturing ? "0.95rem 1.2rem" : "1rem 1.1rem",
          background: c.accentDim,
          borderRadius: 8,
          border: `1px dashed ${c.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          animation: isCapturing ? "none" : "slideFadeDown 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        }}>
          <div>
            <div style={MR({ fontSize: F.sourceLabel, fontWeight: 700, letterSpacing: "0.1em", color: c.textMuted, textTransform: "uppercase", marginBottom: "0.25rem" })}>
              Sumber Referensi
            </div>
            <div style={MR({ fontSize: F.sourceName, fontWeight: 800, color: c.accent })}>
              {card.source.name}
            </div>
          </div>
          {!isCapturing && (
            card.source.url !== "#"
              ? <a
                  href={card.source.url} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={MR({ fontSize: "0.68rem", fontWeight: 700, color: c.bg, background: c.accent, padding: "0.5rem 1.1rem", borderRadius: 6, textDecoration: "none", transition: "transform 0.2s" })}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Buka Link <i className="ri-external-link-line" />
                </a>
              : <span style={MR({ fontSize: "0.62rem", fontWeight: 600, color: c.textMuted })}>Internal SOVR</span>
          )}
        </div>
      )}

      {/* ── SECTION 4: Footer — domain kiri, tombol kanan ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "0.6rem",
        borderTop: `1px solid ${c.border}`,
      }}>
        {/* Domain brand — selalu ada di kiri */}
        <span style={MR({
          fontSize: F.domainBrand,
          fontWeight: 800,
          color: isCapturing ? c.accent : c.textMuted,
          letterSpacing: "0.04em",
          opacity: isCapturing ? 1 : 0.7,
        })}>
          {domain}
        </span>

        {isCapturing ? null : (
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative" }} onMouseLeave={() => setShowShare(false)}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowShare(!showShare); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: showShare ? c.accent : "transparent", border: `1px solid ${showShare ? c.accent : c.border}`, color: showShare ? c.bg : c.textMuted, cursor: "pointer", transition: "all 0.2s" }}
              >
                <i className="ri-share-forward-line" style={{ fontSize: "1rem" }} />
              </button>
              {showShare && (
                <div style={{ position: "absolute", bottom: "calc(100% + 6px)", right: 0, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "0.35rem", display: "flex", flexDirection: "column", gap: 2, minWidth: 168, boxShadow: theme === "dark" ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.09)", zIndex: 20, animation: "slideUp 0.18s ease forwards", transformOrigin: "bottom right" }}>
                  <button onClick={handleCopyLink} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "0.55rem 0.75rem", background: "transparent", border: "none", fontFamily: "'Manrope', sans-serif", fontSize: "0.73rem", fontWeight: 700, color: c.text, cursor: "pointer", borderRadius: 6, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = c.accentDim} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <i className="ri-link" style={{ color: c.textMuted, fontSize: "0.95rem" }} /> Copy Link Berita
                  </button>
                  <button onClick={handleDownloadImage} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "0.55rem 0.75rem", background: "transparent", border: "none", fontFamily: "'Manrope', sans-serif", fontSize: "0.73rem", fontWeight: 700, color: c.text, cursor: "pointer", borderRadius: 6, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = c.accentDim} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <i className="ri-instagram-line" style={{ color: c.textMuted, fontSize: "0.95rem" }} /> Download (IG/WA)
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: isExpanded ? c.accent : "transparent", border: `1px solid ${c.border}`, color: isExpanded ? c.bg : c.accent, cursor: "pointer", transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)" }}
            >
              <i className="ri-arrow-down-s-line" style={{ fontSize: "1.15rem", transform: isExpanded ? "rotate(-180deg)" : "rotate(0)", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}