import { useState, useEffect } from "react";
import { T } from "../theme";

export function Hero({ theme, tickerData, articles = [], perspectives = [] }: any) {
  const c = T[theme];
  const [now, setNow] = useState(new Date());

  useEffect(() => { 
    const t = setInterval(() => setNow(new Date()), 1000); 
    return () => clearInterval(t); 
  }, []);

  const heroFeatures = perspectives && perspectives.length > 0 
    ? perspectives.slice(0, 4).map((p: any) => ({ ...p, _type: 'perspective' })) 
    : [];

  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
  const btc = tickerData?.coins?.find((coin: any) => coin.symbol === "BTC") || { price: "...", change: "...", isUp: true };
  const eth = tickerData?.coins?.find((coin: any) => coin.symbol === "ETH") || { price: "...", change: "...", isUp: true };
  const fng = tickerData?.fng || { value: "...", classification: "MEMUAT" };
  
  const statCards = [
    { label: "BTC/USD", val: `$${btc.price}`, ch: btc.change, up: btc.isUp },
    { label: "ETH/USD", val: `$${eth.price}`, ch: eth.change, up: eth.isUp },
    { label: "MARKET SENTIMEN", val: fng.value, ch: fng.classification.toUpperCase(), up: fng.classification.toLowerCase().includes("greed") }
  ];

  const slugify = (text: string) => text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
  
  const featuredArts = articles ? articles.filter((a: any) => a.featured) : [];
  const regularArts = articles ? articles.filter((a: any) => !a.featured) : [];
  const availableArts = [...featuredArts, ...regularArts].slice(0, 3).map((a: any) => {
    let icon = "ri-flashlight-line";
    if (a.cat === "ai") icon = "ri-sparkling-2-line";
    if (a.cat === "kripto") icon = "ri-coin-line";
    if (a.cat === "defi") icon = "ri-swap-line";
    return { ...a, _type: 'article', _icon: icon, _cat: a.tag || a.category };
  });

  const handleCardClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    if (!item) return;
    const path = item._type === 'perspective' ? `/perspectives/${slugify(item.title)}` : `/feed/${slugify(item.title)}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  };

  return (
    <section style={{ position: "relative", display: "flex", flexDirection: "column", background: c.bg, paddingTop: 56, overflow: "hidden", minHeight: "100vh" }}>
      <style>{`
        @keyframes cyberFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .clamped-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ai-neural-grid {
          position: absolute;
          inset: 0;
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, ${c.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${c.border} 1px, transparent 1px);
          opacity: ${theme === 'dark' ? 0.15 : 0.3};
          mask-image: radial-gradient(circle at 50% 10%, black 0%, transparent 70%);
          -webkit-mask-image: radial-gradient(circle at 50% 10%, black 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ambient-core-1 {
          position: absolute;
          top: -10%; left: -10%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, ${c.accent}20 0%, transparent 60%);
          filter: blur(80px);
          z-index: 0;
          pointer-events: none;
          animation: pulseGlow 8s ease-in-out infinite;
        }

        .ambient-core-2 {
          position: absolute;
          bottom: 10%; right: -10%;
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 0%, transparent 60%);
          filter: blur(60px);
          z-index: 0;
          pointer-events: none;
        }
        
        .hero-dashboard {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: clamp(3rem, 7vh, 5rem) 1.5rem 4rem;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          z-index: 2;
          gap: clamp(2rem, 5vh, 3.5rem);
        }

        .ai-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          animation: cyberFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.4rem 1rem;
          border: 1px solid ${c.border};
          border-radius: 100px;
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          backdrop-filter: blur(10px);
          width: fit-content;
        }

        .holographic-logo {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(4rem, 14vw, 8.5rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          margin: 0;
          background: linear-gradient(135deg, ${c.text} 30%, ${c.accent} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 12px ${c.accent}30);
        }

        .ai-desc {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.2rem);
          color: ${c.textSub};
          font-weight: 500;
          line-height: 1.6;
          margin: 0;
          max-width: 600px;
        }

        .terminal-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: cyberFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }

        .carousel-viewport {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .carousel-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          padding: 1rem 0.5rem 3rem 0.5rem;
          margin: 0 -0.5rem;
        }

        .carousel-track::-webkit-scrollbar {
          height: 6px;
        }
        .carousel-track::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          border-radius: 100px;
        }
        .carousel-track::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
          border-radius: 100px;
        }
        .carousel-track::-webkit-scrollbar-thumb:hover {
          background: ${c.accent};
        }

        .glass-card {
          flex: 0 0 100%;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          background: ${theme === 'dark' ? 'rgba(20,20,20,0.4)' : 'rgba(255,255,255,0.6)'};
          border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          position: relative;
        }

        .glass-card:hover {
          border-color: ${c.accent};
          transform: translateY(-5px);
          box-shadow: 0 20px 40px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)'}, 
                      0 0 0 1px ${c.accent}40 inset;
        }

        .vision-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background: ${c.accentDim};
          border-radius: 24px 24px 0 0;
        }

        .vision-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .glass-card:hover .vision-img {
          transform: scale(1.05);
        }

        .card-hud-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, ${theme === 'dark' ? '#0a0a0a' : '#ffffff'} 0%, transparent 100%);
          opacity: 0.8;
          z-index: 10;
          pointer-events: none;
        }

        .glass-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 12;
          margin-top: -3rem; 
        }

        .intel-panel {
          display: flex;
          flex-direction: column;
          border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          border-radius: 24px;
          background: ${theme === 'dark' ? 'rgba(20,20,20,0.4)' : 'rgba(255,255,255,0.6)'};
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .intel-header {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        }

        .intel-item {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .intel-item:last-child {
          border-bottom: none;
        }

        .intel-item:hover {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          padding-left: 2.25rem;
        }

        .intel-item:hover .intel-title {
          color: ${c.accent};
        }

        .btn-feed-link {
          padding: 1.25rem 1.75rem;
          text-align: center;
          text-decoration: none;
          color: ${c.text};
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
          border-top: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
          transition: all 0.3s ease;
        }

        .btn-feed-link:hover {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
          color: ${c.accent};
          letter-spacing: 0.15em;
        }

        .crypto-dock {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          animation: cyberFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .dock-pill {
          flex: 1;
          min-width: 200px;
          background: ${theme === 'dark' ? 'rgba(20,20,20,0.5)' : 'rgba(255,255,255,0.7)'};
          border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          border-radius: 20px;
          padding: 1.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          transition: transform 0.3s, border-color 0.3s;
        }

        .dock-pill:hover {
          transform: translateY(-3px);
          border-color: ${c.accent};
        }

        @media (min-width: 1024px) {
          .terminal-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
            gap: 2rem;
            align-items: stretch;
          }
          .glass-card {
            height: 100%;
          }
          .vision-img-wrapper {
            aspect-ratio: auto;
            flex: 1;
            min-height: 380px;
          }
        }
      `}</style>

      <div className="ai-neural-grid" />
      <div className="ambient-core-1" />
      <div className="ambient-core-2" />

      <div className="hero-dashboard">
        <div className="ai-header">
          <div className="status-badge">
            <span style={{ width: "6px", height: "6px", background: c.accent, borderRadius: "50%", animation: "pulseGlow 1.5s infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: c.textMuted }}>
              {dateStr}
            </span>
          </div>
          
          <div>
            <h1 className="holographic-logo">SOVR.</h1>
            <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.4rem)", fontWeight: 800, color: c.text, lineHeight: "1.1", letterSpacing: "-0.02em", margin: "0.5rem 0 1rem 0" }}>
              Insight In <span style={{ color: c.accent }}>Second.</span>
            </h2>
            <p className="ai-desc">
              Portal Media masa depan. Dapatkan analisis mendalam seputar AI, Web3, dan Kripto.
            </p>
          </div>
        </div>

        <div className="terminal-grid">
          
          <div className="carousel-viewport">
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 0.5rem" }}>
              <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: c.text, letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>
                Perspectives.
              </h4>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: c.textMuted, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: "4px" }}>
                GESER <i className="ri-arrow-right-line" />
              </span>
            </div>

            <div className="carousel-track">
              {heroFeatures.length > 0 ? (
                heroFeatures.map((feat: any, idx: number) => (
                  <div key={`feat-${idx}`} className="glass-card" onClick={(e) => handleCardClick(feat, e)}>
                    <div className="vision-img-wrapper">
                      <img 
                        src={feat.image_url || `https://via.placeholder.com/800x450?text=SOVR+Deep+Dive`} 
                        alt={feat.title} 
                        className="vision-img"
                      />
                      <div className="card-hud-overlay" />
                    </div>
                    
                    <div className="glass-content">
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: c.bg, background: c.text, padding: "0.3rem 0.8rem", borderRadius: "100px" }}>
                          REPORT
                        </span>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 800, color: c.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {feat.author}
                        </span>
                      </div>
                      
                      <h3 className="clamped-title" style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.4rem)", fontWeight: 800, color: c.text, lineHeight: "1.25", letterSpacing: "-0.02em", margin: 0 }}>
                        {feat.title}
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem", color: c.textMuted, fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
                  Sinkronisasi Database...
                </div>
              )}
            </div>
          </div>

          <div className="intel-panel">
            <div className="intel-header">
              <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", fontWeight: 700, color: c.text, letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>
                News Feed
              </h4>
            </div>
            
            {availableArts.map((item: any, i: number) => (
              <div key={i} className="intel-item" onClick={(e) => handleCardClick(item, e)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "8px", background: c.accentDim }}>
                     <i className={item._icon} style={{ color: c.accent, fontSize: "0.95rem" }} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: c.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {item._cat}
                  </span>
                  <span style={{ color: c.border, fontSize: "0.6rem" }}>|</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: c.textMuted }}>{item.time || item.published_date}</span>
                </div>
                <h4 className="intel-title" style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: c.text, margin: 0, lineHeight: "1.45", transition: "color 0.2s" }}>
                  {item.title}
                </h4>
              </div>
            ))}
            
            <a href="#feed" className="btn-feed-link">
              Buka Semua Feed &rarr;
            </a>
          </div>
        </div>

        <div className="crypto-dock">
          {statCards.map((s: any, index: number) => (
            <div key={`stat-${index}`} className="dock-pill">
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: c.textMuted }}>
                {s.label}
              </span>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.4rem", color: c.text, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.val}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: 700, color: s.up ? c.up : c.down, background: s.up ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent', padding: "0.25rem 0.6rem", borderRadius: "100px" }}>
                  <i className={s.up ? "ri-arrow-right-up-line" : "ri-arrow-right-down-line"} /> {s.ch}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

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