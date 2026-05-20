import { useState, useEffect } from "react";
import { T, FILTERS, FMAP } from "./theme";
// --- AWAL PERUBAHAN: src/App.tsx (Baris Import Atas) ---
import { Card, EditorCard } from "./components/Cards";
import { PerspectiveCard, PerspectiveReader } from "./components/Perspective";
// --- BATAS PERUBAHAN ---
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
                    <div id={`article-${card.id}`} key={card.id}>
                      <Card card={card} theme={theme} idx={i} />
                    </div>
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