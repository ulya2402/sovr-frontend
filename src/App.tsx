import { useState, useEffect, Fragment } from "react";
import { T, FILTERS, FMAP } from "./theme";
import { Card, EditorCard } from "./components/Cards";
import { PerspectiveCard, PerspectiveReader } from "./components/Perspective";
import { VaultGrid, VaultDetail } from "./components/Vault";
import { Navbar, Ticker, Hero, Footer } from "./components/Layout"; 
import { LegalPage } from "./components/Legal"; 


// 🔥 TAMBAHAN: Fungsi Slugify untuk mengubah spasi jadi strip di URL
export const slugify = (text: string) => {
  return text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
};

function formatTime(createdAt: string, publishedDate: string) {
  if (!createdAt) return publishedDate;
  try {
    const safeDateStr = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T');
    const date = new Date(safeDateStr + 'Z'); 
    if (isNaN(date.getTime())) return publishedDate;
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      const diffMs = now.getTime() - date.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor(diffMs / (1000 * 60));
      if (hours < 1) return mins < 2 ? "Baru saja" : `${mins} menit lalu`;
      return `${hours} jam lalu`;
    } else if (isYesterday) {
      return "Kemarin";
    } else {
      return publishedDate; 
    }
  } catch (error) { return publishedDate; }
}

// --- AWAL PERUBAHAN: src/App.tsx (Komponen Sisipan Anti-Mainstream) ---
// --- AWAL PERUBAHAN: Komponen InlinePerspectives Kompak ---
// --- AWAL PERUBAHAN: Komponen InlinePerspectives ala Every.to ---
// --- AWAL PERUBAHAN: Komponen InlinePerspectives dengan Eyebrow Text ---
function InlinePerspectives({ perspectives, theme }: any) {
  const c = T[theme];
  const latest = perspectives.slice(0, 3);
  if (latest.length === 0) return null;

  const hero = latest[0];
  const others = latest.slice(1);

  return (
    <div style={{ margin: "0.5rem 0", padding: "1.5rem 0", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ marginBottom: "0.25rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.accent }}>Baca Juga</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: c.text, margin: 0, letterSpacing: "-0.02em" }}>
          Deep Dives<span style={{ color: c.accent }}>.</span>
        </h3>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textMuted }}>Perspectives</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div 
          onClick={() => {
            window.history.pushState({}, '', `/perspectives/${slugify(hero.title)}`);
            window.dispatchEvent(new Event('popstate'));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.75rem" }}
          onMouseEnter={e => {
            const img = e.currentTarget.querySelector('.hero-img') as HTMLElement;
            if (img) img.style.transform = "scale(1.02)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={e => {
            const img = e.currentTarget.querySelector('.hero-img') as HTMLElement;
            if (img) img.style.transform = "scale(1)";
            e.currentTarget.style.opacity = "1";
          }}
        >
          <div style={{ width: "100%", height: 200, borderRadius: 12, overflow: "hidden", background: c.accentDim }}>
            <img 
              className="hero-img"
              src={hero.image_url || `https://via.placeholder.com/600x300?text=SOVR+Perspectives`} 
              alt={hero.title} 
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} 
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: c.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{hero.category}</span>
              <span style={{ fontSize: "0.65rem", color: c.textMuted }}>•</span>
              <span style={{ fontSize: "0.65rem", color: c.textMuted, fontWeight: 600 }}>By {hero.author}</span>
            </div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: c.text, margin: 0, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              {hero.title}
            </h4>
          </div>
        </div>

        {others.length > 0 && <div style={{ height: 1, background: c.border, opacity: 0.6 }} />}

        {others.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {others.map((p: any) => (
              <div 
                key={p.id} 
                onClick={() => {
                  window.history.pushState({}, '', `/perspectives/${slugify(p.title)}`);
                  window.dispatchEvent(new Event('popstate'));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 800, color: c.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.category}</span>
                  <h4 style={{ 
                    fontFamily: "'Manrope', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: c.text, 
                    margin: "0.2rem 0 0.4rem 0", lineHeight: 1.3, letterSpacing: "-0.01em",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" 
                  }}>
                    {p.title}
                  </h4>
                  <span style={{ fontSize: "0.7rem", color: c.textSub, fontWeight: 600 }}>{p.author}</span>
                </div>
                
                <div style={{ width: 100, height: 75, borderRadius: 10, overflow: "hidden", background: c.accentDim, flexShrink: 0 }}>
                  <img 
                    src={p.image_url || `https://via.placeholder.com/150x100?text=SOVR`} 
                    alt={p.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
// --- BATAS PERUBAHAN ---
// --- BATAS PERUBAHAN ---// --- BATAS PERUBAHAN ---

// --- AWAL PERUBAHAN: Komponen InlineVaultPromo Minimalis Premium ---
// --- AWAL PERUBAHAN: Komponen InlineVaultPromo Minimalis Premium ---
// --- AWAL PERUBAHAN: Komponen InlineVaultPromo Presisi Kompak ---
function InlineVaultPromo({ tools, theme }: any) {
  const c = T[theme];
  const featured = tools.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <div style={{ margin: "0.4rem 0", padding: "1.25rem 0", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.15rem", fontWeight: 800, color: c.text, margin: 0, letterSpacing: "-0.02em" }}>
          Editor's Choice <span style={{ color: c.accent }}>.</span>
        </h3>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textMuted }}>Vault Promo</span>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", 
        gap: "0.75rem" 
      }}>
        {featured.map((tool: any) => (
          <div 
            key={tool.id} 
            onClick={() => {
              window.history.pushState({}, '', `/vault/${slugify(tool.name)}`);
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
              border: `1px solid ${c.border}`,
              borderRadius: 14,
              padding: "0.85rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = c.accent;
              e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : c.bg;
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = c.border;
              e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)';
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img 
              src={tool.logo} 
              alt={tool.name} 
              style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${c.border}`, objectFit: "cover", flexShrink: 0 }} 
              onError={(e: any) => { e.target.src = "https://via.placeholder.com/38?text=AI"; }} 
            />
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ 
                fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", fontWeight: 800, color: c.text, 
                margin: "0 0 0.1rem 0", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
              }}>
                {tool.name}
              </h4>
              <p style={{ 
                fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", color: c.textSub, fontWeight: 500,
                margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
              }}>
                {tool.category} <span style={{ opacity: 0.5, margin: "0 2px" }}>•</span> {tool.pricing}
              </p>
            </div>

            <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ri-arrow-right-up-line" style={{ color: c.accent, fontSize: "0.8rem" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// --- BATAS PERUBAHAN ---// --- BATAS PERUBAHAN ---
// --- BATAS PERUBAHAN ---

// --- AWAL PERUBAHAN ---
function InlineNewsletter({ theme }: any) {
  const c = T[theme];
  const targetLink = "https://t.me/channel_telegram_anda"; 

  const handleJoinClick = () => {
    window.open(targetLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ 
      margin: "1rem 0", 
      padding: "2.5rem 1.5rem", 
      background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', 
      border: `1px solid ${c.border}`, 
      borderRadius: 24, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      textAlign: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)", width: 200, height: 200, background: c.accent, opacity: 0.1, filter: "blur(60px)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", position: "relative", zIndex: 1 }}>
        <i className="ri-telegram-line" style={{ color: c.accent, fontSize: "1.5rem" }} />
      </div>
      
      <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.45rem", fontWeight: 800, color: c.text, margin: "0 0 0.5rem 0", letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>
        The Alpha <span style={{ color: c.accent }}>Broadcast.</span>
      </h3>
      
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: c.textSub, margin: 0, lineHeight: 1.6, maxWidth: 380, position: "relative", zIndex: 1 }}>
        Sinyal real-time, alpha setup, market breakdown harian, dan pembaruan AI tercepat langsung di genggaman Anda.
      </p>

      <div style={{ width: "100%", maxWidth: 340, marginTop: "1.5rem", position: "relative", zIndex: 1 }}>
        <button 
          style={{ 
            width: "100%",
            background: c.text, 
            color: c.bg, 
            border: "none", 
            padding: "0.85rem 1.5rem", 
            borderRadius: 100, 
            fontWeight: 800, 
            cursor: "pointer", 
            fontFamily: "'Manrope', sans-serif", 
            fontSize: "0.8rem", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" 
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.background = c.accent;
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = c.text;
            e.currentTarget.style.color = c.bg;
          }}
          onClick={handleJoinClick}
        >
          Masuk ke Channel <i className="ri-arrow-right-line" style={{ fontSize: "0.95rem" }} />
        </button>
      </div>

      <span style={{ fontSize: "0.6rem", color: c.textMuted, fontWeight: 600, marginTop: "0.85rem", position: "relative", zIndex: 1 }}>
        Bergabung dengan komunitas alpha network kami sekarang.
      </span>
    </div>
  );
}
// --- BATAS PERUBAHAN ---
function EditorSection({ theme, articles }: any) {
  const c = T[theme];
  const picks = articles.filter((a: any) => a.featured);
  const [vis, setVis] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVis(true)); return () => cancelAnimationFrame(id); }, []);

  if (picks.length === 0) {
    return <div style={{ textAlign: "center", padding: "4rem 0", color: c.textMuted, fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>Belum ada berita Pilihan Editor saat ini.</div>;
  }

  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div style={{ textAlign: "center", padding: "2.5rem 0", marginBottom: "2rem", borderBottom: `1px solid ${c.border}` }}>
        <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: c.text, lineHeight: 1.15, marginBottom: "0.5rem", letterSpacing: "-0.03em", textTransform: "uppercase" }}>Editorial <span style={{ color: c.textMuted }}>Picks</span></h2>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "0.9rem", color: c.textSub, letterSpacing: "0.01em" }}>Feed pilihan dari tim redaksi SOVR.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {picks.map((card: any, i: number) => (
          <div id={`article-${card.id}`} key={card.id}>
            <EditorCard card={card} theme={theme} idx={i} />
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${c.border}` }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: c.textMuted, textTransform: "uppercase" }}>End of Curation</span>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('sovr_theme');
      if (savedTheme) return savedTheme;
    }
    return "light"; 
  });

  useEffect(() => { localStorage.setItem('sovr_theme', theme); }, [theme]);

  const [filter, setFilter] = useState("Semua");
  const [mainTab, setMainTab] = useState("Feed");
  const [articles, setArticles] = useState<any[]>([]);
  const [vaultTools, setVaultTools] = useState<any[]>([]); 
  const [tickerData, setTickerData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;
  
  // State Router URL
  const [currentVaultSlug, setCurrentVaultSlug] = useState<string | null>(null); 
  const [targetArticleSlug, setTargetArticleSlug] = useState<string | null>(null);
  const [currentLegalSlug, setCurrentLegalSlug] = useState<string | null>(null);
  
  // State Khusus Perspectives
  const [perspectives, setPerspectives] = useState<any[]>([]);
  const [pSort, setPSort] = useState("latest"); 
  const [pCat, setPCat] = useState("Semua");
  const [currentPerspectiveSlug, setCurrentPerspectiveSlug] = useState<string | null>(null);
  const [activePerspective, setActivePerspective] = useState<any>(null);

  const c = T[theme];

  // Fetch Dasar
  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/ticker")
      .then(res => res.json()).then(data => setTickerData(data)).catch(() => {});
    fetch("https://backend-sovr.botgampang123.workers.dev/api/vault")
      .then(res => res.json()).then(data => setVaultTools(data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/articles")
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((item: any) => {
          let cleanName = item.source_name || "SOVR"; 
          try {
            if (item.source_url && item.source_url !== "#" && item.source_url.startsWith("http")) {
              const host = new URL(item.source_url).hostname.replace('www.', '');
              const parts = host.split('.');
              let rawName = parts[0];
              if (["news", "blog", "en", "id"].includes(rawName) && parts.length > 1) { rawName = parts[1]; }
              cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            }
          } catch (urlError) {}

          return {
            id: item.id, tag: item.tag || "Insight", cat: item.category || "market",
            featured: item.featured === 1 || String(item.featured).toLowerCase() === "true", 
            icon: item.source_logo || "ri-newspaper-line", title: item.title || "Untitled",
            body: item.body || "", author: item.author || "Admin",
            time: formatTime(item.created_at, item.published_date),
            source: { name: cleanName, domain: cleanName, url: item.source_url || "#", logo: item.source_logo || "ri-newspaper-line", publishDate: item.published_date }
          };
        });
        setArticles(mappedData); setLoading(false);
      }).catch(() => { setLoading(false); });
  }, []);

  // Fetch API Khusus Perspectives (Top/Latest/Category)
  useEffect(() => {
    let url = `https://backend-sovr.botgampang123.workers.dev/api/perspectives?sort=${pSort}`;
    if (pCat !== "Semua") url += `&category=${FMAP[pCat] || pCat.toLowerCase()}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => setPerspectives(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [pSort, pCat]);

  // Reader Halaman Penuh + Tambah View
  useEffect(() => {
    if (currentPerspectiveSlug && perspectives.length > 0) {
      const found = perspectives.find(p => slugify(p.title) === currentPerspectiveSlug);
      if (found) {
         fetch(`https://backend-sovr.botgampang123.workers.dev/api/perspectives?id=${found.id}`)
           .then(res => res.json())
           .then(data => setActivePerspective(data))
           .catch(() => setActivePerspective(found)); 
      }
    } else {
      setActivePerspective(null);
    }
  }, [currentPerspectiveSlug, perspectives]);

  // URL Router / Mesin State
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);

      const resetAll = () => {
        setCurrentVaultSlug(null); setTargetArticleSlug(null);
        setCurrentLegalSlug(null); setCurrentPerspectiveSlug(null);
      };

      if (['about', 'privacy-policy', 'contact'].includes(segments[0])) {
        resetAll(); setMainTab(segments[0]); setCurrentLegalSlug(segments[0]);
      } else if (segments[0] === 'vault') {
        resetAll(); setMainTab('Vault'); setCurrentVaultSlug(segments[1] || null); 
      } else if (segments[0] === 'perspectives') {
        resetAll(); setMainTab('Perspectives'); setCurrentPerspectiveSlug(segments[1] || null);
      } else if (segments[0] === 'editor-picks') {
        resetAll(); setMainTab('Pilihan Editor'); setTargetArticleSlug(segments[1] || null); 
      } else if (segments[0] === 'feed') {
        resetAll(); setMainTab('Feed'); setTargetArticleSlug(segments[1] || null); 
      } else {
        resetAll(); setMainTab('Feed');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    if (!loading && articles.length > 0 && targetArticleSlug) {
      const targetArticle = articles.find(a => slugify(a.title) === targetArticleSlug);
      if (targetArticle) {
        if (targetArticle.featured) { setMainTab("Pilihan Editor"); } 
        else {
          setMainTab("Feed"); setFilter("Semua");
          const articleIndex = articles.findIndex(a => a.id === targetArticle.id);
          if (articleIndex >= visibleCount) setVisibleCount(articleIndex + 5); 
        }

        let radarCount = 0;
        const radar = setInterval(() => {
          const element = document.getElementById(`article-${targetArticle.id}`);
          if (element) {
            clearInterval(radar); 
            setTimeout(() => { window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: "smooth" }); }, 400);
            setTargetArticleSlug(null); 
          }
          if (++radarCount > 50) { clearInterval(radar); setTargetArticleSlug(null); }
        }, 100); 
      } else { setTargetArticleSlug(null); }
    }
  }, [loading, articles, targetArticleSlug]); 

  const filtered = articles.filter(card => filter === "Semua" || card.cat === FMAP[filter]);
  const displayedArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // --- AWAL PERUBAHAN ---
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab={mainTab} />
      
      {mainTab !== "Perspectives" && !currentVaultSlug && !currentLegalSlug && !currentPerspectiveSlug && <Ticker theme={theme} tickerData={tickerData} />}
      {mainTab !== "Perspectives" && !currentVaultSlug && !currentLegalSlug && !currentPerspectiveSlug && <Hero theme={theme} tickerData={tickerData} />}
      
      {/* PERHATIKAN: minHeight dihapus dan diganti dengan flex: 1 */}
      <section id="feed" style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        {/* Kanvas diperlebar jika membuka Reader atau Vault */}
        <div style={{ maxWidth: (currentVaultSlug || currentLegalSlug || currentPerspectiveSlug) ? 800 : 680, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
          
          {currentLegalSlug ? (
            <LegalPage type={currentLegalSlug} theme={theme} />
          ) : currentPerspectiveSlug && activePerspective ? (
            <PerspectiveReader 
              article={activePerspective} 
              allArticles={perspectives} 
              theme={theme} 
              onBack={() => {
                window.history.pushState({}, '', '/perspectives');
                window.dispatchEvent(new Event('popstate'));
              }}
              onNavigate={(title: string) => {
                window.history.pushState({}, '', `/perspectives/${slugify(title)}`);
                window.dispatchEvent(new Event('popstate'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />          
          ) : currentVaultSlug ? (
            <VaultDetail tool={vaultTools.find(t => slugify(t.name) === currentVaultSlug)} allTools={vaultTools} theme={theme} />
          ) : mainTab === "Perspectives" ? (
            <>
              {/* Header Khusus Perspectives */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.8rem", color: c.text, fontWeight: 800, margin: "0 0 0.5rem 0", letterSpacing: "-0.02em" }}>Perspectives.</h2>
                  <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.8rem", color: c.textSub, margin: 0, fontWeight: 500 }}>Membahas teknologi dari sudut pandang manusia</p>
                </div>
                <div style={{ display: "flex", gap: 8, background: c.accentDim, padding: 4, borderRadius: 8 }}>
                  <button onClick={() => setPSort("latest")} style={{ fontFamily: "'Manrope', sans-serif", border: "none", background: pSort === "latest" ? c.accent : "transparent", color: pSort === "latest" ? c.bg : c.textMuted, fontSize: "0.65rem", fontWeight: 700, padding: "0.4rem 0.8rem", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s" }}>Latest</button>
                  <button onClick={() => setPSort("top")} style={{ fontFamily: "'Manrope', sans-serif", border: "none", background: pSort === "top" ? c.accent : "transparent", color: pSort === "top" ? c.bg : c.textMuted, fontSize: "0.65rem", fontWeight: 700, padding: "0.4rem 0.8rem", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s" }}>Top Readers</button>
                </div>
              </div>

              {/* Filter Kategori Perspectives */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {FILTERS.map(f => <button key={f} onClick={() => setPCat(f)} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: pCat === f ? c.bg : c.textMuted, background: pCat === f ? c.accent : "transparent", border: `1px solid ${pCat === f ? c.accent : c.border}`, borderRadius: 100, padding: "0.35rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>{f}</button>)}
              </div>

              {/* Grid Perspektif (Sistem CSS Auto-Responsive) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {perspectives.length === 0 ? (
                  <p style={{ color: c.textMuted, gridColumn: "1/-1", textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Belum ada artikel Perspectives untuk kategori ini.</p>
                ) : (
                  perspectives.map((art) => (
                    <PerspectiveCard 
                      key={art.id} article={art} theme={theme} 
                      onClick={() => {
                        window.history.pushState({}, '', `/perspectives/${slugify(art.title)}`);
                        window.dispatchEvent(new Event('popstate'));
                      }} 
                    />
                  ))
                )}
              </div>
            </>
          ) : mainTab === "Vault" ? (
            <VaultGrid tools={vaultTools} theme={theme} />
          ) : mainTab === "Feed" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", color: c.text, textTransform: "uppercase" }}>Live Feed</span>
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: c.textMuted }}>{filtered.length} entries</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
                {FILTERS.map(f => <button key={f} onClick={() => { setFilter(f); setVisibleCount(itemsPerPage); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: filter === f ? c.bg : c.textMuted, background: filter === f ? c.accent : "transparent", border: `1px solid ${filter === f ? c.accent : c.border}`, borderRadius: 100, padding: "0.35rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>{f}</button>)}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {loading ? (
                  <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Syncing data...</p>
                ) : displayedArticles.length === 0 ? (
                  <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Belum ada artikel untuk kategori ini.</p>
                ) : (
                  displayedArticles.map((card, i) => (
                    <Fragment key={card.id}>
                      <div id={`article-${card.id}`}>
                        <Card card={card} theme={theme} idx={i} />
                      </div>

                      {i === 2 && perspectives.length > 0 && (
                        <InlinePerspectives perspectives={perspectives} theme={theme} />
                      )}

                      {i === 4 && vaultTools.some((t: any) => t.featured === 1) && (
                        <InlineVaultPromo tools={vaultTools.filter((t: any) => t.featured === 1)} theme={theme} />
                      )}

                      {i === 2 && (
                        <InlineNewsletter theme={theme} />
                      )}
                    </Fragment>
                  ))
                )}
              </div>

              {hasMore && !loading && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                  <button onClick={() => setVisibleCount(prev => prev + itemsPerPage)} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: c.text, background: "transparent", border: `1px solid ${c.border}`, borderRadius: 100, padding: "0.75rem 2rem", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; }} onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; }}>
                    Load More <i className="ri-arrow-down-line" style={{ fontSize: "0.9rem" }} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EditorSection theme={theme} articles={articles} />
          )}
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
}
// --- BATAS PERUBAHAN ---