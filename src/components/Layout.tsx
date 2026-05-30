import { useState, useEffect, useRef } from "react";
import { T } from "../theme";

// --- AWAL PERUBAHAN ---
export function Hero({ theme, articles = [], perspectives = [] }: any) {
  const c = T[theme];
  const [now, setNow] = useState(new Date());
  const [activeCard, setActiveCard] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const heroFeatures = perspectives && perspectives.length > 0
    ? perspectives.slice(0, 6).map((p: any) => ({ ...p, _type: 'perspective' }))
    : [];

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).toUpperCase();

  const slugify = (text: string) =>
    text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

  const featuredArts = articles ? articles.filter((a: any) => a.featured) : [];
  const regularArts  = articles ? articles.filter((a: any) => !a.featured) : [];
  const availableArts = [...featuredArts, ...regularArts].slice(0, 5).map((a: any) => {
    let icon = "ri-flashlight-line";
    if (a.cat === "ai")    icon = "ri-sparkling-2-line";
    if (a.cat === "kripto") icon = "ri-coin-line";
    if (a.cat === "defi")  icon = "ri-swap-line";
    return { ...a, _type: 'article', _icon: icon, _cat: a.tag || a.category };
  });

  const handleCardClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (!item) return;
    const path = item._type === 'perspective'
      ? `/perspectives/${slugify(item.title)}`
      : `/feed/${slugify(item.title)}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
  };

  const scrollToCard = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActiveCard(idx);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveCard(closest);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [heroFeatures.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - track.offsetLeft;
    dragScrollLeft.current = track.scrollLeft;
    track.style.cursor = 'grabbing';
  };
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    track.scrollLeft = dragScrollLeft.current - (x - dragStartX.current);
  };
  
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  };

  const isDark = theme === 'dark';
  const totalCards = heroFeatures.length;
  const activeFeature = heroFeatures[activeCard] || null;

  return (
    <section style={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      background: c.bg,
      paddingTop: 56,
      paddingBottom: 0,
      overflow: "hidden"
    }}>
      <style>{`
        @keyframes hFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }

        .ai-neural-grid {
          position: absolute;
          inset: 0;
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, ${c.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${c.border} 1px, transparent 1px);
          opacity: ${isDark ? 0.15 : 0.3};
          mask-image: radial-gradient(circle at 50% 10%, black 0%, transparent 60%);
          -webkit-mask-image: radial-gradient(circle at 50% 10%, black 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .ambient-core-1 {
          position: absolute;
          top: -10%; left: 50%;
          transform: translateX(-50%);
          width: 70vw; height: 70vw;
          background: radial-gradient(circle, ${c.accent}15 0%, transparent 60%);
          filter: blur(80px);
          z-index: 0;
          pointer-events: none;
          animation: pulseGlow 8s ease-in-out infinite;
        }

        .h-root {
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          padding: 0 clamp(1rem, 4vw, 2.5rem) 1rem;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .h-masthead {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: clamp(2rem, 6vh, 4.5rem) 0 1.5rem;
          border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          gap: 0.8rem;
          animation: hFadeUp 0.55s ease both;
        }

        .h-logo {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(4.5rem, 15vw, 9.5rem);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.05em;
          margin: 0;
          color: ${c.text};
        }

        .h-logo-dot { color: ${c.accent}; }

        .h-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .h-tagline {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(1rem, 2vw, 1.25rem);
          font-weight: 800;
          color: ${c.textSub};
          margin: 0;
          letter-spacing: -0.01em;
        }

        .h-cats {
          font-family: 'Space Mono', monospace;
          font-size: clamp(0.55rem, 1.2vw, 0.65rem);
          font-weight: 700;
          letter-spacing: 0.1em;
          color: ${c.textMuted};
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .h-cats-highlight {
          color: ${c.accent};
        }

        .h-live-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0.75rem 0;
          border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
          animation: hFadeUp 0.55s 0.06s ease both;
        }

        .h-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${c.accent};
          animation: hBlink 1.4s infinite;
          flex-shrink: 0;
        }

        .h-live-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: ${c.accent};
          text-transform: uppercase;
        }

        .h-body {
          display: grid;
          grid-template-columns: 1fr;
          animation: hFadeUp 0.6s 0.1s ease both;
        }

        @media (min-width: 900px) {
          .h-body {
            grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
            align-items: start;
          }
        }

        .h-carousel-col {
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          min-width: 0;
        }

        @media (min-width: 900px) {
          .h-carousel-col {
            padding: 2rem 2.5rem 2rem 0;
            border-right: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
          }
        }

        .h-carousel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
          gap: 0.75rem;
        }

        .h-carousel-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${c.textMuted};
        }

        .h-carousel-drag-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          color: ${c.textMuted};
          letter-spacing: 0.1em;
          padding: 0.35rem 0.8rem;
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
          border-radius: 100px;
          background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
          user-select: none;
        }

        .h-track {
          display: flex;
          align-items: stretch;
          gap: 1.25rem;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          cursor: grab;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .h-track::-webkit-scrollbar { display: none; }
        .h-track:active { cursor: grabbing; }

        .h-slide {
          flex: 0 0 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          cursor: pointer;
          height: auto;
        }

        .h-slide-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: ${c.accentDim};
          border-radius: 4px;
          flex-shrink: 0;
        }

        .h-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        .h-slide:hover .h-slide-img { transform: scale(1.04); }

        .h-slide-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #fff;
          background: ${c.accent};
          padding: 0.22rem 0.6rem;
          z-index: 2;
          pointer-events: none;
        }

        .h-slide-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .h-slide-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: ${c.accent};
          text-transform: uppercase;
        }

        .h-slide-sep {
          color: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'};
          font-size: 0.6rem;
        }

        .h-slide-name {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: ${c.textMuted};
          text-transform: uppercase;
        }

        .h-slide-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(1.4rem, 3.5vw, 2.1rem);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: ${c.text};
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.2s;
        }

        .h-slide:hover .h-slide-title { color: ${c.accent}; }

        .h-slide-deck {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.88rem, 1.7vw, 1rem);
          font-weight: 500;
          line-height: 1.65;
          color: ${c.textSub};
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .h-static-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.25rem;
          margin-top: 1.25rem;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
        }

        .h-read-more {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${c.text};
          text-decoration: none;
          border-bottom: 2px solid ${c.accent};
          padding-bottom: 2px;
          transition: gap 0.2s, color 0.2s;
          cursor: pointer;
        }
        
        .h-read-more:hover { gap: 9px; color: ${c.accent}; }

        .h-dots {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .h-dot {
          height: 3px;
          border-radius: 2px;
          background: ${isDark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.12)'};
          cursor: pointer;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s;
          width: 18px;
          border: none;
          padding: 0;
        }
        
        .h-dot.h-dot-active {
          width: 32px;
          background: ${c.accent};
        }

        .h-sidebar {
          display: flex;
          flex-direction: column;
          min-width: 0;
          border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
        }

        @media (min-width: 900px) {
          .h-sidebar {
            border-top: none;
            padding-left: 2.5rem;
          }
        }

        .h-sidebar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem 0 0.9rem;
          border-bottom: 2px solid ${c.text};
        }

        .h-sidebar-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: ${c.text};
          text-transform: uppercase;
        }

        .h-sidebar-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: ${c.accent};
          text-decoration: none;
          text-transform: uppercase;
          border-bottom: 1px solid ${c.accent};
          padding-bottom: 1px;
          transition: opacity 0.2s;
        }
        
        .h-sidebar-link:hover { opacity: 0.65; }

        .h-news-item {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 0 0.9rem;
          padding: 1.1rem 0;
          border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.045)'};
          cursor: pointer;
          align-items: start;
        }

        .h-news-item:last-child { border-bottom: none; }
        .h-news-item:hover .h-news-title { color: ${c.accent}; }

        .h-news-num {
          font-family: 'Manrope', sans-serif;
          font-size: 1.7rem;
          font-weight: 900;
          line-height: 1;
          color: ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)'};
          letter-spacing: -0.05em;
          user-select: none;
          padding-top: 3px;
        }

        .h-news-inner {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .h-news-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .h-news-cat {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.17rem 0.45rem;
          background: ${c.accentDim};
          color: ${c.accent};
          border-radius: 2px;
        }

        .h-news-time {
          font-family: 'Space Mono', monospace;
          font-size: 0.5rem;
          font-weight: 700;
          color: ${c.textMuted};
          letter-spacing: 0.06em;
        }

        .h-news-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(0.9rem, 1.8vw, 1rem);
          font-weight: 800;
          line-height: 1.4;
          color: ${c.text};
          margin: 0;
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hero-end-line {
          width: 48px;
          height: 4px;
          background: ${c.accent};
          border-radius: 10px;
          margin: 3.5rem auto 0.5rem auto;
          box-shadow: 0 0 15px ${c.accent}80;
          animation: hFadeUp 0.8s 0.2s ease both;
        }
      `}</style>

      <div className="ai-neural-grid" />
      <div className="ambient-core-1" />

      <div className="h-root">

        <div className="h-masthead">
          <h1 className="h-logo">
            SOVR<span className="h-logo-dot">.</span>
          </h1>
          <div className="h-meta">
            <p className="h-tagline">Insight In Second.</p>
            <p className="h-cats">
              {dateStr} <span style={{ margin: '0 4px', color: c.border }}>|</span> <span className="h-cats-highlight">AI · WEB3 · KRIPTO</span>
            </p>
          </div>
        </div>

        <div className="h-live-strip">
          <span className="h-live-dot" />
          <span className="h-live-label">Live Update</span>
        </div>

        <div className="h-body">

          <div className="h-carousel-col">
            <div className="h-carousel-header">
              <span className="h-carousel-label">Perspectives</span>
              {totalCards > 1 && (
                <div className="h-carousel-drag-hint">
                  <i className="ri-arrow-left-right-line" /> GESER
                </div>
              )}
            </div>

            {heroFeatures.length > 0 ? (
              <>
                <div
                  className="h-track"
                  ref={trackRef}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                >
                  {heroFeatures.map((feat: any, idx: number) => (
                    <div
                      key={`slide-${idx}`}
                      className="h-slide"
                      onClick={(e) => handleCardClick(feat, e)}
                    >
                      <div className="h-slide-img-wrap">
                        <img
                          src={feat.image_url || `https://via.placeholder.com/900x506?text=SOVR`}
                          alt={feat.title}
                          className="h-slide-img"
                          draggable={false}
                        />
                        <span className="h-slide-badge">DEEP DIVE</span>
                      </div>

                      <div className="h-slide-author">
                        <span className="h-slide-tag">Perspectives</span>
                        <span className="h-slide-sep">·</span>
                        <span className="h-slide-name">{feat.author}</span>
                      </div>

                      <h2 className="h-slide-title">{feat.title}</h2>

                      {feat.excerpt && (
                        <p className="h-slide-deck">{feat.excerpt}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-static-footer">
                  <span 
                    className="h-read-more" 
                    onClick={(e) => activeFeature && handleCardClick(activeFeature, e)}
                  >
                    Baca Selengkapnya <i className="ri-arrow-right-line" />
                  </span>

                  {totalCards > 1 && (
                    <div className="h-dots">
                      {heroFeatures.map((_: any, i: number) => (
                        <button
                          key={i}
                          className={`h-dot ${i === activeCard ? 'h-dot-active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); scrollToCard(i); }}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 360,
                color: c.textMuted,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem"
              }}>
                Sinkronisasi Database...
              </div>
            )}
          </div>

          <div className="h-sidebar">
            <div className="h-sidebar-head">
              <span className="h-sidebar-label">Kilas Cepat</span>
              <a href="#feed" className="h-sidebar-link">Lihat Semua →</a>
            </div>

            {availableArts.length > 0 ? availableArts.map((item: any, i: number) => (
              <div key={i} className="h-news-item" onClick={(e) => handleCardClick(item, e)}>
                <div className="h-news-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="h-news-inner">
                  <div className="h-news-meta">
                    <span className="h-news-cat">{item._cat}</span>
                    <span className="h-news-time">{item.time || item.published_date}</span>
                  </div>
                  <h3 className="h-news-title">{item.title}</h3>
                </div>
              </div>
            )) : (
              <div style={{
                padding: "2rem 0",
                color: c.textMuted,
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 600
              }}>
                Memuat berita terkini...
              </div>
            )}
          </div>

        </div>
        
        <div className="hero-end-line" />

      </div>
    </section>
  );
}
// --- BATAS PERUBAHAN ---

export function Ticker({ theme, tickerData }: any) {
  const c = T[theme];
  const coins = tickerData?.coins || [];

  if (coins.length === 0) {
    return (
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 199, background: c.bg, borderBottom: `1px solid ${c.border}`, padding: "0.5rem 0", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "26.5px" }}>
        <style>{`@keyframes loadingBarSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }`}</style>
        <div style={{ width: 100, height: 2, background: c.border, borderRadius: 2, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "40%", background: c.accent, borderRadius: 2, animation: "loadingBarSlide 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)" }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 199, background: c.bg, borderBottom: `1px solid ${c.border}`, padding: "0.45rem 0", overflow: "hidden", display: "flex" }}>
      <style>{`@keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .ticker-track { display: flex; width: max-content; animation: scrollTicker 25s linear infinite; } .ticker-track:hover { animation-play-state: paused; }`}</style>
      <div className="ticker-track">
        {[...coins, ...coins, ...coins, ...coins].map((coin, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 2.5rem", borderRight: `1px solid ${c.border}` }}>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: c.textMuted, letterSpacing: "0.05em" }}>{coin.pair}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", color: c.text, fontWeight: 800, letterSpacing: "-0.01em" }}>${coin.price}</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: coin.isUp ? c.up : c.down, display: "flex", alignItems: "center" }}>
              <i className={coin.isUp ? "ri-arrow-right-up-line" : "ri-arrow-right-down-line"} style={{ fontSize: "0.8rem", marginRight: 2 }} />
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- AWAL PERUBAHAN 2: src/components/Layout.tsx ---
// --- AWAL PERUBAHAN: src/components/Layout.tsx ---
export function Navbar({ theme, setTheme, mainTab }: any) {
  const c = T[theme];
  
  const handleTabClick = (tabName: string) => {
    let newPath = "/";
    if (tabName === "Feed") newPath = "/feed";
    if (tabName === "Pilihan Editor") newPath = "/editor-picks";
    if (tabName === "Vault") newPath = "/vault";
    if (tabName === "Perspectives") newPath = "/perspectives";

    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    
    setTimeout(() => {
      if (tabName !== "Feed") {
        // Halaman Perspectives, Vault, Pilihan Editor: Langsung diam di paling atas layar
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Khusus Feed: Scroll turun sedikit melewati Hero
        const feedEl = document.getElementById("feed");
        if (feedEl) {
          const y = feedEl.getBoundingClientRect().top + window.scrollY - 40;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }, 50);
  };

  return (
    <nav className="nav-container" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", background: c.glass, backdropFilter: "blur(20px)", borderBottom: `1px solid ${c.border}` }}>
      
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", width: 70 }}>
        <a href="/" onClick={(e) => { e.preventDefault(); handleTabClick("Feed"); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", color: c.text, textDecoration: "none" }}>SOVR<span style={{ color: c.accent }}>.</span></a>
      </div>
      
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "2px" }}>
        {["Feed", "Pilihan Editor", "Vault"].map(tab => (
          <button 
            key={tab} 
            onClick={() => handleTabClick(tab)}
            style={{ 
              fontFamily: "'Manrope', sans-serif", fontSize: "clamp(0.55rem, 2.5vw, 0.65rem)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: mainTab === tab ? c.accent : c.textMuted, background: "transparent", border: "none", padding: "0.4rem 0.5rem", cursor: "pointer", transition: "color 0.2s", position: "relative", whiteSpace: "nowrap" 
            }}
          >
            {tab}
            {mainTab === tab && <span style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 2, background: c.accent, borderRadius: 2 }} />}
          </button>
        ))}
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14, width: 90 }}>
        <div className="live-text" style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: c.accent }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, display: "inline-block", animation: "blink 2s ease infinite" }} />
          <span style={{ display: "none" }} className="mobile-show">LIVE</span>
        </div>
        
        <button 
          onClick={() => handleTabClick("Perspectives")} 
          style={{ background: "transparent", border: `1px solid ${mainTab === "Perspectives" ? c.accent : c.border}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: mainTab === "Perspectives" ? c.accent : c.textMuted, transition: "all 0.2s" }} 
          title="Perspectives (Blog)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
  <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
</svg>


        </button>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "transparent", border: `1px solid ${c.border}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.accent, fontSize: "0.9rem", transition: "all 0.2s" }}>
          <i className={theme === "dark" ? "ri-sun-fill" : "ri-moon-fill"} />
        </button>
      </div>

    </nav>
  );
}
// --- BATAS PERUBAHAN ---

export function Footer({ theme }: { theme: string }) {
  const c = T[theme];
  
  const handleFooterClick = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    
    // Auto-scroll ke paling atas layar
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ borderTop: `1px solid ${c.border}`, background: c.bg, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        
        {/* Link Navigasi Legal */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "About", path: "/about" },
            { label: "Privacy Policy", path: "/privacy-policy" },
            { label: "Contact", path: "/contact" }
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => handleFooterClick(item.path)}
              style={{
                fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.05em", textTransform: "uppercase", background: "transparent",
                border: "none", color: c.textMuted, cursor: "pointer", transition: "color 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = c.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Hak Cipta */}
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 600, color: c.textMuted, opacity: 0.6 }}>
          © {new Date().getFullYear()} SOVR. All rights reserved.
        </span>

      </div>
    </footer>
  );
}