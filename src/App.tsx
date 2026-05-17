import { useState, useEffect } from "react";
import { T, FILTERS, FMAP } from "./theme";
import { Navbar, Ticker, Hero } from "./components/Layout";
import { Card, EditorCard } from "./components/Cards";

function EditorSection({ theme, articles }: any) {
  const c = T[theme];
  const picks = articles.slice(0, 2);
  const [vis, setVis] = useState(false);
  useEffect(() => { const id = requestAnimationFrame(() => setVis(true)); return () => cancelAnimationFrame(id); }, []);

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
  const [loading, setLoading] = useState(true);
  const c = T[theme];

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/articles")
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((item: any) => ({
          id: item.id,
          tag: item.tag,
          cat: item.category,
          featured: false,
          icon: item.category === "ai" ? "ri-sparkling-2-line" : item.category === "kripto" ? "ri-coin-line" : "ri-newspaper-line",
          title: item.title,
          body: item.body,
          author: item.author,
          time: "Baru saja",
          source: {
            name: item.source_name,
            domain: new URL(item.source_url).hostname.replace('www.', ''),
            url: item.source_url,
            logo: item.source_logo,
            publishDate: item.published_date
          }
        }));
        setArticles(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("[Fetch API Error]", err);
        setLoading(false);
      });
  }, []);

  const filtered = articles.filter(card => filter === "Semua" || card.cat === FMAP[filter]);

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} filter={filter} setFilter={setFilter} mainTab={mainTab} setMainTab={setMainTab} />
      <Ticker theme={theme} />
      <Hero theme={theme} />
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
                ) : (
                  filtered.map((card, i) => <Card key={card.id} card={card} theme={theme} idx={i} />)
                )}
              </div>
            </>
          ) : (
            <EditorSection theme={theme} articles={articles} />
          )}
        </div>
      </section>
    </>
  );
}