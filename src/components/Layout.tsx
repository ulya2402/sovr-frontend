import { useState, useEffect, useRef } from "react";
import { T, FILTERS } from "../theme";

export function Hero({ theme }: any) {
  const c = T[theme];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); let W: number, H: number, raf: number;
    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    const amber = theme === "dark" ? "200,168,83" : "140,100,20";
    const pts = Array.from({ length: 38 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2, r: Math.random() * 1 + .3, a: Math.random() * .3 + .07 }));
    const draw = () => {
      ctx!.clearRect(0, 0, W, H);
      pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx!.fillStyle = `rgba(${amber},${p.a})`; ctx!.fill(); });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => { const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 110) { ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.strokeStyle = `rgba(${amber},${.04 * (1 - d / 110)})`; ctx!.lineWidth = .5; ctx!.stroke(); } }));
      raf = requestAnimationFrame(draw);
    };
    draw(); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [theme]);
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "90px 2rem 3rem", overflow: "hidden", background: c.bg }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}><div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: theme === "dark" ? "radial-gradient(ellipse,rgba(212,168,83,0.06) 0%,transparent 60%)" : "radial-gradient(ellipse,rgba(184,137,30,0.08) 0%,transparent 60%)", animation: "breathe 8s ease-in-out infinite" }} /></div>
      <div style={{ position: "absolute", top: 80, right: "4%", zIndex: 2, background: c.glass, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${c.border}`, borderRadius: 14, padding: "0.65rem 1rem", textAlign: "right" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.8rem", color: c.amber, letterSpacing: "0.05em" }}>{timeStr}</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.48rem", color: c.textMuted, letterSpacing: "0.06em", marginTop: 2 }}>{dateStr}</div>
      </div>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 700, animation: "heroIn 1s cubic-bezier(0.4,0,0.2,1) both" }}>
        <div style={{ marginBottom: "0.5rem", lineHeight: 1 }}><span style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(5.5rem,15vw,11rem)", fontWeight: 300, color: c.text, letterSpacing: "0.12em", textTransform: "uppercase" }}>S<span style={{ color: c.amber }}>O</span>VR</span><span style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(3rem,8vw,6rem)", color: c.amber, fontWeight: 300 }}>.</span></div>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1rem,2.5vw,1.3rem)", fontStyle: "italic", fontWeight: 300, color: c.textSub, marginBottom: "2.5rem", letterSpacing: "0.03em" }}>Insight in Seconds</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          {[{ label: "Bitcoin", val: "$98,240", ch: "+2.4%", up: true, icon: "ri-coin-line" }, { label: "Fear & Greed", val: "72", ch: "Greed", up: true, icon: "ri-emotion-line" }, { label: "Ethereum", val: "$3,812", ch: "-0.8%", up: false, icon: "ri-donut-chart-line" }].map(s => (
            <div key={s.label} style={{ background: c.glass, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: `1px solid ${c.border}`, borderRadius: 16, padding: "0.85rem 1.3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 115 }}>
              <i className={s.icon} style={{ fontSize: "1.1rem", color: c.amber, opacity: 0.75 }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "1rem", color: c.text, fontWeight: 500 }}>{s.val}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", letterSpacing: "0.08em", color: s.up ? c.green : c.red }}>{s.ch}</span>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.48rem", letterSpacing: "0.1em", color: c.textMuted, textTransform: "uppercase" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <a href="#feed" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Space Mono',monospace", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.amber, textDecoration: "none", background: c.amberDim, backdropFilter: "blur(16px)", border: `1px solid ${c.amber}40`, borderRadius: 12, padding: "0.85rem 2rem", transition: "all 0.25s" }} onMouseEnter={e => { e.currentTarget.style.background = c.amber + "28"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.background = c.amberDim; e.currentTarget.style.transform = "translateY(0)"; }}>Baca Update <i className="ri-arrow-right-line" style={{ fontSize: "0.85rem" }} /></a>
      </div>
      <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2, animation: "fadeIn 2s ease 1s both" }}>
        <div style={{ width: 26, height: 42, borderRadius: 13, border: `1px solid ${c.border}`, display: "flex", justifyContent: "center", paddingTop: 6, background: c.glass, backdropFilter: "blur(8px)" }}><div style={{ width: 3, height: 7, borderRadius: 2, background: c.amber, animation: "scrollDot 2s ease-in-out infinite" }} /></div>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.46rem", letterSpacing: "0.22em", color: c.textMuted, textTransform: "uppercase" }}>scroll</span>
      </div>
    </section>
  );
}

export function Ticker({ theme }: any) {
  const c = T[theme];
  const [coins, setCoins] = useState<any[]>([]);
  const [status, setStatus] = useState("Menghubungkan ke API Kripto...");

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/ticker")
      .then(res => {
        if (!res.ok) throw new Error("Jalur ditolak");
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setCoins(data);
        } else {
          setStatus("Data dari API kosong.");
        }
      })
      .catch(err => {
        console.error("Gagal memuat ticker", err);
        setStatus(`Gagal: ${err.message}`);
      });
  }, []);

  if (coins.length === 0) {
    return (
      // PERUBAHAN: Menambahkan position: "fixed", top: 56, left: 0, right: 0, zIndex: 199
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 199, background: theme === "dark" ? "#110f0d" : "#f8f5f0", borderBottom: `1px solid ${c.border}`, padding: "0.5rem 0", textAlign: "center" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: c.amber }}>
          {status}
        </span>
      </div>
    );
  }

  return (
    // PERUBAHAN: Menambahkan position: "fixed", top: 56, left: 0, right: 0, zIndex: 199
    <div style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 199, background: theme === "dark" ? "#110f0d" : "#f8f5f0", borderBottom: `1px solid ${c.border}`, padding: "0.45rem 0", overflow: "hidden", display: "flex" }}>
      <style>
        {`
          @keyframes scrollTicker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-track {
            display: flex;
            width: max-content;
            animation: scrollTicker 25s linear infinite;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      
      <div className="ticker-track">
        {[...coins, ...coins, ...coins, ...coins].map((coin, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 2rem", borderRight: `1px solid ${c.border}` }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: c.textMuted, letterSpacing: "0.05em" }}>{coin.pair}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.65rem", color: c.text, fontWeight: "bold" }}>${coin.price}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.6rem", color: coin.isUp ? "#10b981" : "#ef4444", display: "flex", alignItems: "center" }}>
              <i className={coin.isUp ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill"} style={{ fontSize: "0.8rem" }} />
              {coin.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Navbar({ theme, setTheme, filter, setFilter, mainTab, setMainTab }: any) {
  const c = T[theme];
  return (
    <nav className="nav-container" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: theme === "dark" ? "rgba(13,13,15,0.9)" : "rgba(253,249,243,0.94)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", borderBottom: `1px solid ${c.border}` }}>
      <a href="#" style={{ fontFamily: "'Fraunces',serif", fontSize: "1.35rem", fontWeight: 400, letterSpacing: "0.18em", color: c.text, textDecoration: "none", textTransform: "uppercase" }}>S<span style={{ color: c.amber }}>O</span>VR<span style={{ color: c.amber, marginLeft: 1 }}>.</span></a>
      
      <div className="nav-center" style={{ display: "flex", alignItems: "center", gap: 2, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        {["Feed", "Pilihan Editor"].map(tab => (
          <button key={tab} onClick={() => setMainTab(tab)} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: mainTab === tab ? c.amber : c.textMuted, background: "transparent", border: "none", padding: "0.3rem 0.9rem", cursor: "pointer", transition: "all 0.2s", position: "relative", whiteSpace: "nowrap" }}>
            {tab}{mainTab === tab && <span style={{ position: "absolute", bottom: -17, left: 0, right: 0, height: 2, borderRadius: 2, background: `linear-gradient(90deg,transparent,${c.amber},transparent)` }} />}
          </button>
        ))}
        {mainTab === "Feed" && <>
          <span className="nav-filters" style={{ width: 1, height: 14, background: c.border, margin: "0 4px" }} />
          {FILTERS.map(f => <button className="nav-filters" key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", letterSpacing: "0.08em", textTransform: "uppercase", color: filter === f ? c.amber : c.textMuted, background: filter === f ? c.amberDim : "transparent", border: `1px solid ${filter === f ? c.amber + "35" : "transparent"}`, borderRadius: 100, padding: "0.25rem 0.72rem", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>{f}</button>)}
        </>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="live-text" style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Space Mono',monospace", fontSize: "0.56rem", letterSpacing: "0.12em", color: c.green }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.green, display: "inline-block", animation: "blink 2s ease infinite" }} />LIVE</div>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: c.amberDim, border: `1px solid ${c.amber}30`, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: c.amber, fontSize: "0.9rem", transition: "all 0.2s", flexShrink: 0 }}><i className={theme === "dark" ? "ri-sun-line" : "ri-moon-line"} /></button>
      </div>
    </nav>
  );
}