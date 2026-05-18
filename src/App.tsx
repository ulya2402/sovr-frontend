import { useState, useEffect } from "react";
import { T, FILTERS, FMAP } from "./theme";
import { Navbar, Ticker, Hero } from "./components/Layout";
import { Card, EditorCard } from "./components/Cards";

// --- PEREDAM KEJUT FORMAT WAKTU ---
function formatTime(createdAt: string, publishedDate: string) {
  if (!createdAt) return publishedDate;
  
  try {
    // Memperbaiki format spasi SQLite menjadi format standar ISO (T)
    const safeDateStr = createdAt.includes('T') ? createdAt : createdAt.replace(' ', 'T');
    const date = new Date(safeDateStr + 'Z'); 
    
    // Jika tanggal tetap invalid setelah dikonversi, fallback ke tanggal tulisan manual
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
  } catch (error) {
    return publishedDate;
  }
}

function EditorSection({ theme, articles }: any) {
  const c = T[theme];
  const picks = articles.filter((a: any) => a.featured);
  
  const [vis, setVis] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVis(true)); return () => cancelAnimationFrame(id); }, []);

  if (picks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: c.textMuted, fontFamily: "'Space Mono',monospace" }}>
        Belum ada berita Pilihan Editor saat ini.
      </div>
    );
  }

  return (
    <div style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
      <div style={{ textAlign: "center", padding: "2.5rem 0 2.75rem", marginBottom: "2.5rem", position: "relative", borderBottom: `1px solid ${c.edBorder}` }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 60, height: 3, borderRadius: 2, background: `linear-gradient(90deg,transparent,${c.amber},transparent)` }} />
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: c.amber, marginBottom: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><span style={{ width: 22, height: 1, background: c.amber, opacity: 0.5 }} />Kurasi Tim Editorial<span style={{ width: 22, height: 1, background: c.amber, opacity: 0.5 }} /></div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(2.2rem,6vw,3.2rem)", fontWeight: 300, fontStyle: "italic", color: c.text, lineHeight: 1.15, marginBottom: "0.7rem" }}>Pilihan <span style={{ color: c.amber }}>Editor</span></h2>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 300, fontSize: "0.82rem", color: c.textMuted, letterSpacing: "0.02em" }}>Artikel terkurasi — dipilih langsung oleh tim redaksi SOVR.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: "1.5rem" }}><div style={{ width: 36, height: 1, background: `linear-gradient(to right,transparent,${c.amber}50)` }} /><i className="ri-award-line" style={{ fontSize: "0.75rem", color: c.amber, opacity: 0.6 }} /><div style={{ width: 36, height: 1, background: `linear-gradient(to left,transparent,${c.amber}50)` }} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: c.textMuted }}>{picks.length} artikel terpilih</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ri-award-fill" style={{ fontSize: "0.7rem", color: c.amber, opacity: 0.6 }} /><span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.52rem", color: c.textMuted }}>Semua kategori</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {picks.map((card: any, i: number) => <EditorCard key={card.id} card={card} theme={theme} idx={i} />)}
      </div>
      <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${c.edBorder}` }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.5rem", letterSpacing: "0.2em", color: c.textMuted, textTransform: "uppercase" }}>— Akhir Pilihan Editor —</span>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [filter, setFilter] = useState("Semua");
  const [mainTab, setMainTab] = useState("Feed");
  const [articles, setArticles] = useState<any[]>([]);
  
  // --- PERUBAHAN 1: MENAMBAHKAN STATE PENAMPUNG DATA API ---
  const [tickerData, setTickerData] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;

  const c = T[theme];

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [filter, mainTab]);

  // --- PERUBAHAN 2: MEMANGGIL API TICKER SECARA TERPUSAT (CUMA 1 KALI) ---
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
              
              // Mengambil nama utama domain (menghindari sub-domain seperti 'news.' atau 'blog.')
              let rawName = parts[0];
              if (["news", "blog", "en", "id"].includes(rawName) && parts.length > 1) {
                rawName = parts[1];
              }
              
              // Mengubah huruf pertama menjadi kapital (Contoh: "coindesk" -> "Coindesk")
              cleanName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            }
          } catch (urlError) {
            console.log("URL Parser Ignore", urlError);
          }

          return {
            id: item.id,
            tag: item.tag || "Insight",
            cat: item.category || "market",
            featured: item.featured === 1, 
            icon: item.source_logo || "ri-newspaper-line",
            title: item.title || "Untitled",
            body: item.body || "",
            author: item.author || "Admin",
            time: formatTime(item.created_at, item.published_date),
            source: {
              name: cleanName,    // Memakai nama yang sudah dibersihkan
              domain: cleanName,  // Memakai nama yang sudah dibersihkan
              url: item.source_url || "#",
              logo: item.source_logo || "ri-newspaper-line",
              publishDate: item.published_date
            }
          };
        });
        setArticles(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("[Fetch API Error]", err);
        setLoading(false);
      });
  }, []);

  const filtered = articles.filter(card => filter === "Semua" || card.cat === FMAP[filter]);
  const displayedArticles = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} filter={filter} setFilter={setFilter} mainTab={mainTab} setMainTab={setMainTab} />
      
      {/* --- PERUBAHAN 3: MEMASUKKAN tickerData KE KOMPONEN --- */}
      <Ticker theme={theme} tickerData={tickerData} />
      <Hero theme={theme} tickerData={tickerData} />
      
      <section id="feed" style={{ background: c.bg, minHeight: "60vh", transition: "background 0.4s" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
          {mainTab === "Feed" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: c.textMuted, textTransform: "uppercase" }}>Update Terbaru</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.54rem", color: c.textMuted }}>{filtered.length} entri</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.75rem" }}>
                {FILTERS.map(f => <button key={f} onClick={() => setFilter(f)} style={{ fontFamily: "'Space Mono',monospace", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: filter === f ? c.amber : c.textMuted, background: filter === f ? c.amberDim : "transparent", border: `1px solid ${filter === f ? c.amber + "40" : c.border}`, borderRadius: 100, padding: "0.28rem 0.85rem", cursor: "pointer", transition: "all 0.2s" }}>{f}</button>)}
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {loading ? (
                  <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Space Mono',monospace" }}>Memuat insight...</p>
                ) : displayedArticles.length === 0 ? (
                  <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Space Mono',monospace" }}>Belum ada artikel untuk kategori ini.</p>
                ) : (
                  displayedArticles.map((card, i) => <Card key={card.id} card={card} theme={theme} idx={i} />)
                )}
              </div>

              {hasMore && !loading && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "2.5rem" }}>
                  <button 
                    onClick={() => setVisibleCount(prev => prev + itemsPerPage)} 
                    style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Space Mono',monospace", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: c.textMuted, background: c.glass, backdropFilter: "blur(12px)", border: `1px solid ${c.border}`, borderRadius: 12, padding: "0.75rem 2rem", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = c.amber; e.currentTarget.style.borderColor = c.amber + "40"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.borderColor = c.border; }}
                  >
                    Muat Lebih Banyak <i className="ri-arrow-down-line" style={{ fontSize: "0.85rem" }} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EditorSection theme={theme} articles={articles} />
          )}
        </div>
      </section>
    </>
  );
}