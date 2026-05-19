import { useState, useEffect, useRef } from "react";
import { T } from "../theme";

export function Hero({ theme, tickerData }: any) {
  const c = T[theme];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  
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
  
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const btc = tickerData?.coins?.find((c: any) => c.symbol === "BTC") || { price: "...", change: "...", isUp: true };
  const eth = tickerData?.coins?.find((c: any) => c.symbol === "ETH") || { price: "...", change: "...", isUp: true };
  const fng = tickerData?.fng || { value: "...", classification: "Memuat" };

  const statCards = [
    { label: "Bitcoin", val: `$${btc.price}`, ch: btc.change, up: btc.isUp, icon: "ri-btc-line" },
    { label: "Sentimen", val: fng.value, ch: fng.classification, up: fng.classification.toLowerCase().includes("greed"), icon: "ri-pulse-line" },
    { label: "Ethereum", val: `$${eth.price}`, ch: eth.change, up: eth.isUp, icon: "ri-eth-line" }
  ];

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 2rem 3rem", overflow: "hidden", background: c.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      
      <div style={{ position: "absolute", top: 80, right: "4%", zIndex: 2, background: c.glass, backdropFilter: "blur(10px)", border: `1px solid ${c.border}`, borderRadius: 8, padding: "0.6rem 1.25rem", textAlign: "right" }}>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: c.accent, letterSpacing: "0.05em" }}>{timeStr}</div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 600, color: c.textMuted, letterSpacing: "0.08em", marginTop: 2, textTransform: "uppercase" }}>{dateStr}</div>
      </div>

      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 700, animation: "heroIn 1s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
        <div style={{ marginBottom: "1rem", lineHeight: 1 }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(5rem, 15vw, 10rem)", fontWeight: 800, color: c.text, letterSpacing: "-0.04em", textTransform: "uppercase" }}>SOVR<span style={{ color: c.accent }}>.</span></span>
        </div>
        
        {/* PERUBAHAN: Tagline dikembalikan */}
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", fontWeight: 500, color: c.textSub, marginBottom: "3.5rem", letterSpacing: "0.02em" }}>Insight in Seconds.</p>
        
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 120 }}>
              <i className={s.icon} style={{ fontSize: "1.2rem", color: c.textMuted }} />
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.1rem", color: c.text, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.val}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", color: s.up ? c.up : c.down }}>{s.ch}</span>
              <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.15em", color: c.textMuted, textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </div>
        
        {/* PERUBAHAN: Tombol Explore diganti Baca Insight */}
        <a href="#feed" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: c.bg, textDecoration: "none", background: c.accent, padding: "0.85rem 2.5rem", borderRadius: 100, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Baca Insight <i className="ri-arrow-down-line" style={{ fontSize: "0.9rem" }} /></a>
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

export function Navbar({ theme, setTheme, mainTab, setMainTab }: any) {
  const c = T[theme];
  
  const handleTabClick = (tabName: string) => {
    let newPath = "/";
    if (tabName === "Feed") newPath = "/feed";
    if (tabName === "Pilihan Editor") newPath = "/editor-picks";
    if (tabName === "Vault") newPath = "/vault";

    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    
    // Langsung tembak ke area konten bawah, tidak ada pengecualian untuk Vault!
    const feedEl = document.getElementById("feed");
    if (feedEl) {
      const y = feedEl.getBoundingClientRect().top + window.scrollY - 40;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="nav-container" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", background: c.glass, backdropFilter: "blur(20px)", borderBottom: `1px solid ${c.border}` }}>
      
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", width: 70 }}>
        {/* Logo diklik akan kembali ke root (/) */}
        <a href="/" onClick={(e) => { e.preventDefault(); handleTabClick("Feed"); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", color: c.text, textDecoration: "none" }}>SOVR<span style={{ color: c.accent }}>.</span></a>
      </div>
      
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "2px" }}>
        {["Feed", "Pilihan Editor", "Vault"].map(tab => (
          <button 
            key={tab} 
            onClick={() => handleTabClick(tab)} // <-- PANGGIL FUNGSI SEO DI SINI
            style={{ 
              fontFamily: "'Manrope', sans-serif", fontSize: "clamp(0.55rem, 2.5vw, 0.65rem)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: mainTab === tab ? c.accent : c.textMuted, background: "transparent", border: "none", padding: "0.4rem 0.5rem", cursor: "pointer", transition: "color 0.2s", position: "relative", whiteSpace: "nowrap" 
            }}
          >
            {tab}
            {mainTab === tab && <span style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 2, background: c.accent, borderRadius: 2 }} />}
          </button>
        ))}
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, width: 70 }}>
        <div className="live-text" style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.1em", color: c.accent }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, display: "inline-block", animation: "blink 2s ease infinite" }} />
          <span style={{ display: "none" }} className="mobile-show">LIVE</span>
        </div>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: "transparent", border: `1px solid ${c.border}`, borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.accent, fontSize: "0.9rem", transition: "all 0.2s" }}>
          <i className={theme === "dark" ? "ri-sun-fill" : "ri-moon-fill"} />
        </button>
      </div>

    </nav>
  );
}