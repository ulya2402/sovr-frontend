import { useState, useEffect, useRef } from "react";
import { T } from "../theme";

// --- AWAL PERUBAHAN: src/components/Layout.tsx (Fungsi Hero - Asymmetric Bento) ---
// --- AWAL PERUBAHAN: src/components/Layout.tsx (Fungsi Hero - Stack 3 Kartu) ---
// --- AWAL PERUBAHAN: src/components/Layout.tsx (Fungsi Hero - Tumpukan Buku Kompak) ---
// --- AWAL PERUBAHAN: src/components/Layout.tsx (Fungsi Hero - Mobile Scroll Parallax) ---
// --- AWAL PERUBAHAN: src/components/Layout.tsx (Fungsi Hero - Anti Lag Version) ---
export function Hero({ theme, tickerData, articles = [], perspectives = [] }: any) {
  const c = T[theme];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  // Animasi Background Canvas
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); let W: number, H: number, raf: number;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    const accentRgb = theme === "dark" ? "247,247,247" : "56,56,56";
    const pts = Array.from({ length: 25 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .15, vy: (Math.random() - .5) * .15, r: Math.random() * 1 + .5, a: Math.random() * .2 + .05 }));
    const draw = () => {
      ctx!.clearRect(0, 0, W, H);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx!.fillStyle = `rgba(${accentRgb},${p.a})`; ctx!.fill(); });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => { const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 120) { ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.strokeStyle = `rgba(${accentRgb},${.03 * (1 - d / 120)})`; ctx!.lineWidth = .5; ctx!.stroke(); } }));
      raf = requestAnimationFrame(draw);
    };
    draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [theme]);

  // Efek Parallax Scroll SUPER SMOOTH (Anti Lag via requestAnimationFrame)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            // Batas maksimal scroll efek mekar (250) agar tidak bablas
            const sy = Math.min(window.scrollY, 250);
            heroRef.current.style.setProperty('--sy', sy.toString());
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const btc = tickerData?.coins?.find((c: any) => c.symbol === "BTC") || { price: "...", change: "...", isUp: true };
  const eth = tickerData?.coins?.find((c: any) => c.symbol === "ETH") || { price: "...", change: "...", isUp: true };
  const fng = tickerData?.fng || { value: "...", classification: "Memuat" };

  const statCards = [
    { label: "Bitcoin", val: `$${btc.price}`, ch: btc.change, up: btc.isUp, icon: "ri-btc-line" },
    { label: "Ethereum", val: `$${eth.price}`, ch: eth.change, up: eth.isUp, icon: "ri-eth-line" },
    { label: "Market Sentimen", val: fng.value, ch: fng.classification, up: fng.classification.toLowerCase().includes("greed"), icon: "ri-pulse-line" }
  ];

  const slugify = (text: string) => text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';

  const topItems: any[] = [];
  if (perspectives && perspectives.length > 0) {
    topItems.push({ ...perspectives[0], _type: 'perspective', _icon: 'ri-book-open-line', _cat: 'Editorial Deep Dive' });
  }
  
  const featuredArts = articles ? articles.filter((a: any) => a.featured) : [];
  const regularArts = articles ? articles.filter((a: any) => !a.featured) : [];
  const availableArts = [...featuredArts, ...regularArts];
  
  for (let i = 0; i < availableArts.length && topItems.length < 3; i++) {
    const a = availableArts[i];
    let icon = "ri-flashlight-line";
    if (a.cat === "ai") icon = "ri-sparkling-2-line";
    if (a.cat === "kripto") icon = "ri-coin-line";
    if (a.cat === "defi") icon = "ri-swap-line";
    topItems.push({ ...a, _type: 'article', _icon: icon, _cat: a.tag || a.category });
  }

  const handleCardClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    const path = item._type === 'perspective' ? `/perspectives/${slugify(item.title)}` : `/feed/${slugify(item.title)}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFeed = (e: React.MouseEvent) => {
    e.preventDefault();
    const feedEl = document.getElementById("feed");
    if (feedEl) {
      window.scrollTo({ top: feedEl.getBoundingClientRect().top - 40, behavior: "smooth" });
    }
  };

  return (
    <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", background: c.bg, paddingTop: 56, overflow: "hidden" }}>
      <style>{`
        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .hero-bento {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          flex: 1;
          padding: 5.5rem 1.5rem 3rem;
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
          z-index: 2;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity;
        }

        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
          will-change: transform, opacity;
          position: relative;
        }

        /* --- STYLING BUKU TERTUMPUK --- */
        .hero-stack-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 420px;
          position: relative;
          will-change: transform;
        }

        .stack-card {
          background: ${theme === 'dark' ? 'rgba(35,35,35,0.92)' : 'rgba(255,255,255,0.92)'};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-radius: 20px;
          padding: 1.5rem;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          position: relative;
          cursor: pointer;
          will-change: transform;
          
          /* OPTIMASI LAG: Hapus transisi 'transform' & 'margin' di mobile agar JS & CSS tidak bentrok! */
          transition: opacity 0.3s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }

        /* Posisi Mekar Berdasarkan Variabel Scroll (--sy) - Mulus menempel di jari pengguna */
        .stack-card:nth-child(1) { 
          z-index: 3; 
          transform: translateY(calc(var(--sy, 0) * -0.05px)) scale(1); 
        }
        .stack-card:nth-child(2) { 
          z-index: 2; margin-top: -110px; 
          transform: translateY(calc(12px + var(--sy, 0) * 0.18px)) scale(0.95); 
          opacity: 0.85; 
        }
        .stack-card:nth-child(3) { 
          z-index: 1; margin-top: -110px; 
          transform: translateY(calc(24px + var(--sy, 0) * 0.4px)) scale(0.90); 
          opacity: 0.6; 
        }

        /* KHUSUS DESKTOP (Ada Kursor Mouse): Kembalikan CSS Transition untuk efek Hover */
        @media (hover: hover) and (pointer: fine) {
          .stack-card {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, margin 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          }

          .hero-stack-container:hover .stack-card:nth-child(1) { transform: translateY(-8px) scale(1) !important; border-color: ${c.accent}; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
          .hero-stack-container:hover .stack-card:nth-child(2) { margin-top: -24px; transform: translateY(0) scale(0.98) !important; opacity: 1; border-color: ${c.accent}; }
          .hero-stack-container:hover .stack-card:nth-child(3) { margin-top: -24px; transform: translateY(0) scale(0.96) !important; opacity: 1; border-color: ${c.accent}; }
        }

        .stack-card:hover .stack-arrow {
          transform: rotate(-45deg);
          color: ${c.accent};
        }

        /* --- STYLING MARKET GRID --- */
        .hero-market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          border-top: 1px solid ${c.border};
          z-index: 2;
        }

        .hero-stat-item {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid ${c.border};
          background: ${theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'};
          backdrop-filter: blur(10px);
        }

        @media (min-width: 1024px) {
          .hero-bento {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
            padding: 0 2rem;
            gap: 5rem;
          }
          .hero-stat-item {
            border-bottom: none;
            border-right: 1px solid ${c.border};
          }
          .hero-stat-item:last-child {
            border-right: none;
          }
        }
      `}</style>

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.4 }} />
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "80vh", background: c.accent, opacity: 0.05, filter: "blur(120px)", borderRadius: "50%", zIndex: 0, pointerEvents: "none" }} />

      <div className="hero-bento">
        <div className="hero-left">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
            <span style={{ width: 8, height: 8, background: c.accent, borderRadius: "50%", animation: "blink 2s infinite" }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: c.textMuted }}>
              {dateStr}
            </span>
          </div>

          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(3.5rem, 9vw, 7.5rem)", fontWeight: 900, color: c.text, lineHeight: 0.9, letterSpacing: "-0.04em", margin: "0 0 1.25rem 0" }}>
            SOVR<span style={{ color: c.accent }}>.</span>
          </h1>
          
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.8rem)", fontWeight: 800, color: c.text, lineHeight: 1.2, letterSpacing: "-0.02em", margin: "0 0 1.5rem 0" }}>
            Insight In <span style={{ color: c.accent }}>Second.</span>
          </h2>

          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.1rem", color: c.textSub, lineHeight: 1.6, fontWeight: 500, margin: "0 0 2.5rem 0", maxWidth: 450 }}>
            Kurasi berita ekosistem AI, Web3, dan teknologi masa depan langsung dari meja redaksi.
          </p>

          <a href="#feed" onClick={scrollToFeed} style={{ 
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, 
            fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", 
            color: c.bg, background: c.text, border: `1px solid ${c.text}`, 
            padding: "1rem 2.2rem", borderRadius: "100px", width: "fit-content", transition: "all 0.3s",
            textDecoration: "none"
          }} 
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 20px ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`; }} 
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            Jelajahi Feed <i className="ri-arrow-down-line" style={{ fontSize: "1.1rem" }} />
          </a>
        </div>

        <div className="hero-right">
          {topItems.length > 0 ? (
            <div className="hero-stack-container">
              {topItems.map((item, i) => (
                <div key={i} className="stack-card" onClick={(e) => handleCardClick(item, e)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.15em", color: item._type === 'perspective' ? c.bg : c.accent, textTransform: "uppercase", background: item._type === 'perspective' ? c.accent : c.accentDim, padding: "0.3rem 0.8rem", borderRadius: "100px" }}>
                      {item._cat}
                    </span>
                    <i className={item._icon} style={{ color: c.textMuted, fontSize: "1.2rem" }} />
                  </div>

                  <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: c.text, lineHeight: 1.35, letterSpacing: "-0.01em", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.title}
                  </h3>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 800, color: c.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.author}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: c.textMuted }}>{item.time || item.published_date}</span>
                    </div>
                    <i className="ri-arrow-right-up-line stack-arrow" style={{ fontSize: "1.1rem", color: c.textMuted, transition: "all 0.3s" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="hero-stack-container" style={{ opacity: 0.5 }}>
              <div className="stack-card">
                <div style={{ height: 20, width: 120, background: c.border, borderRadius: 10, animation: "blink 1.5s infinite" }} />
                <div style={{ height: 30, width: "100%", background: c.border, borderRadius: 10, animation: "blink 1.5s infinite" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Bottom Market Grid --- */}
      <div className="hero-market-grid">
        {statCards.map((s) => (
          <div key={s.label} className="hero-stat-item">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: c.textMuted, textTransform: "uppercase" }}>{s.label}</span>
              <i className={s.icon} style={{ fontSize: "1.1rem", color: c.textMuted }} />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.6rem", color: c.text, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.val}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", fontWeight: 700, color: s.up ? c.up : c.down, background: s.up ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : 'transparent', padding: "4px 8px", borderRadius: "6px" }}>{s.ch}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// --- BATAS PERUBAHAN ---// --- BATAS PERUBAHAN ---

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