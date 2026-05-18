import { useState, useEffect } from "react";
import { T, FILTERS, FMAP } from "./theme";
import { Navbar, Ticker, Hero } from "./components/Layout";
import { Card, EditorCard } from "./components/Cards";
import { VaultGrid, VaultDetail } from "./components/Vault"; // Import Vault komponen

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
        <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "0.9rem", color: c.textSub, letterSpacing: "0.01em" }}>Analisis dan kurasi mendalam dari tim redaksi SOVR.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {picks.map((card: any, i: number) => <EditorCard key={card.id} card={card} theme={theme} idx={i} />)}
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

  useEffect(() => {
    localStorage.setItem('sovr_theme', theme);
  }, [theme]);

  const [filter, setFilter] = useState("Semua");
  const [mainTab, setMainTab] = useState("Feed");
  const [articles, setArticles] = useState<any[]>([]);
  const [vaultTools, setVaultTools] = useState<any[]>([]); // 🌟 STATE BARU: Vault Data
  const [tickerData, setTickerData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;
  
  const [currentVaultId, setCurrentVaultId] = useState<string | null>(null); // 🌟 STATE BARU: Router Vault
  
  const c = T[theme];

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/ticker")
      .then(res => res.json())
      .then(data => setTickerData(data))
      .catch(err => console.error("Gagal ambil harga", err));
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
            id: item.id,
            tag: item.tag || "Insight",
            cat: item.category || "market",
            featured: item.featured === 1 || item.featured === "1" || item.featured === true || String(item.featured).toLowerCase() === "true", 
            icon: item.source_logo || "ri-newspaper-line",
            title: item.title || "Untitled",
            body: item.body || "",
            author: item.author || "Admin",
            time: formatTime(item.created_at, item.published_date),
            source: { name: cleanName, domain: cleanName, url: item.source_url || "#", logo: item.source_logo || "ri-newspaper-line", publishDate: item.published_date }
          };
        });
        setArticles(mappedData);
        setLoading(false);
      }).catch(() => { setLoading(false); });
  }, []);

  // 🌟 API BARU: Mengambil Data Vault
  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/vault")
      .then(res => res.json())
      .then(data => setVaultTools(data))
      .catch(() => {});
  }, []);

  // 🌟 ROUTER BARU: Membaca perubahan URL untuk Halaman Khusus Vault (SEO)
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      const vaultId = params.get("vault");
      const tabParam = params.get("tab");

      if (vaultId) {
        setCurrentVaultId(vaultId);
      } else {
        setCurrentVaultId(null);
        if (tabParam === "vault") setMainTab("Vault");
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);


  // =========================================================
  // 🔥 PERUBAHAN UTAMA: SISTEM RADAR PELUNCUR (ANTI-GAGAL) 🔥
  // =========================================================
  useEffect(() => {
    if (!loading && articles.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get("id");
      
      if (articleId) {
        const targetArticle = articles.find(a => a.id.toString() === articleId);
        
        if (targetArticle) {
          // 1. Arahkan Tab ke tempat yang benar
          if (targetArticle.featured) {
            setMainTab("Pilihan Editor");
          } else {
            setMainTab("Feed");
            setFilter("Semua");
            const articleIndex = articles.findIndex(a => a.id.toString() === articleId);
            if (articleIndex >= visibleCount) {
              setVisibleCount(articleIndex + 5); 
            }
          }

          // 2. Aktifkan Radar Pencari Elemen!
          let radarCount = 0;
          const radar = setInterval(() => {
            const element = document.getElementById(`article-${articleId}`);
            if (element) {
              // Jika kotak berita ketemu di layar, hentikan radar dan meluncur!
              clearInterval(radar);
              const y = element.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: "smooth" });
              
              // Bersihkan link setelah berhasil mendarat
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            
            // Keamanan: Hentikan radar jika sudah mencari lebih dari 2 detik (20x) agar tidak error
            radarCount++;
            if (radarCount > 20) {
              clearInterval(radar);
            }
          }, 100); // Radar berputar mencari setiap 0.1 detik
        }
      }
    }
  }, [loading, articles]); 
  // =========================================================

  const filtered = articles.filter(card => filter === "Semua" || card.cat === FMAP[filter]);
  const displayedArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Navbar 
        theme={theme} setTheme={setTheme} 
        filter={filter} setFilter={(f: any) => { setFilter(f); setVisibleCount(itemsPerPage); }} 
        // 🌟 UPDATE: Modifikasi reset URL saat ganti tab Navbar agar bersih
        mainTab={mainTab} setMainTab={(t: any) => { 
          setMainTab(t); 
          setCurrentVaultId(null);
          window.history.pushState({}, '', window.location.pathname);
          setVisibleCount(itemsPerPage); 
        }} 
      />
      
      {/* 🌟 UPDATE: Sembunyikan Ticker dan Hero jika sedang membuka Halaman Detail Vault */}
      {!currentVaultId && <Ticker theme={theme} tickerData={tickerData} />}
      {!currentVaultId && <Hero theme={theme} tickerData={tickerData} />}
      
      <section id="feed" style={{ background: c.bg, minHeight: "60vh", transition: "background 0.4s" }}>
        {/* 🌟 UPDATE: Lebar kanvas diubah sedikit jika membuka halaman khusus Vault */}
        <div style={{ maxWidth: currentVaultId ? 800 : 680, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
          
          {/* 🌟 UPDATE: LOGIKA ROUTER TAMPILAN */}
          {currentVaultId ? (
            // 1. Tampilkan Halaman SEO Detail Tool AI
            <VaultDetail 
              tool={vaultTools.find(t => t.id.toString() === currentVaultId)} 
              allTools={vaultTools} 
              theme={theme} 
            />
          ) : mainTab === "Vault" ? (
            // 2. Tampilkan Galeri Vault Grid
            <VaultGrid tools={vaultTools} theme={theme} />
          ) : mainTab === "Feed" ? (
            // 3. Tampilkan Feed Berita Biasa (Persis seperti aslinya)
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
            // 4. Tampilkan Pilihan Editor
            <EditorSection theme={theme} articles={articles} />
          )}
        </div>
      </section>
    </>
  );
}