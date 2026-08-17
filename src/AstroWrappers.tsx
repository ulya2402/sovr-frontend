// --- AWAL PERUBAHAN FULL FILE: src/AstroWrappers.tsx ---
import { useState, useEffect } from "react";
import { navigate } from "astro:transitions/client";
import { Navbar, Footer } from "./components/Layout";
import { PerspectiveCard, PerspectiveReader } from "./components/Perspective";
import { VaultGrid, VaultDetail } from "./components/Vault";
import { slugify } from "./App";
import { T, FILTERS, FMAP } from "./theme";

function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sovr_theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    // Sinkronisasi paksa jika terjadi Hydration Mismatch dari Server
    const localTheme = localStorage.getItem('sovr_theme') || 'light';
    if (theme !== localTheme) setThemeState(localTheme);
    
    const syncTheme = () => setThemeState(localStorage.getItem('sovr_theme') || 'light');
    window.addEventListener('theme-changed', syncTheme);
    document.addEventListener('astro:after-swap', syncTheme);
    return () => {
      window.removeEventListener('theme-changed', syncTheme);
      document.removeEventListener('astro:after-swap', syncTheme);
    };
  }, [theme]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('sovr_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('theme-changed'));
  };

  return { theme, setTheme };
}

const forceNav = (tabName: string) => {
  if (tabName === "Feed") navigate("/");
  else if (tabName === "Pilihan Editor") navigate("/editor-picks");
  else if (tabName === "Vault") navigate("/vault");
  else if (tabName === "Perspectives") navigate("/perspectives");
};

// --- AWAL PERUBAHAN: src/AstroWrappers.tsx ---
export function PerspectivesIndexPage({ perspectives }: { perspectives: any[] }) {
  const { theme, setTheme } = useTheme();
  const [pSort, setPSort] = useState("latest");
  const [pCat, setPCat] = useState("Semua");
  const [liveData, setLiveData] = useState(perspectives);
  const [displayedPerspectives, setDisplayedPerspectives] = useState(perspectives);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetch(`https://backend-sovr.botgampang123.workers.dev/api/perspectives?sort=${pSort}`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setLiveData(data);
      })
      .catch(err => console.error("Internal Fetch Error:", err));
  }, [pSort]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      let filtered = [...liveData];
      
      if (pCat !== "Semua") {
        const mappedCat = FMAP[pCat] || pCat.toLowerCase();
        filtered = filtered.filter(p => p.category?.toLowerCase() === mappedCat);
      }
      
      if (pSort === "latest") {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (pSort === "top") {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      }
      
      setDisplayedPerspectives(filtered);
      setIsAnimating(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [pCat, pSort, liveData]);

  const c = T[theme as keyof typeof T];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab="Perspectives" onNavigate={forceNav} />
      <section style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        <style>{`
          .app-container { margin: 0 auto; padding: 4rem 1.5rem 6rem; transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .app-container.standard { max-width: 680px; }
          @media (min-width: 1024px) { .app-container.standard { padding-top: 5rem; } }
          
          .grid-transition {
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .grid-hidden {
            opacity: 0;
            transform: translateY(15px);
          }
          .grid-visible {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
        <div className="app-container standard">
          <div style={{ paddingTop: "2.5rem", marginBottom: "2.5rem" }}>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", color: c.text }}>Perspectives.</h1>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: c.textSub }}>Membahas teknologi dari sudut pandang manusia</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setPCat(f)}
                  style={{
                    fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: pCat === f ? c.bg : c.textMuted,
                    background: pCat === f ? c.accent : "transparent",
                    border: `1px solid ${pCat === f ? c.accent : c.border}`,
                    borderRadius: 100, padding: "0.35rem 1rem", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, background: c.accentDim, padding: 4, borderRadius: 8 }}>
              <button onClick={() => setPSort("latest")} style={{ fontFamily: "'Manrope', sans-serif", border: "none", background: pSort === "latest" ? c.accent : "transparent", color: pSort === "latest" ? c.bg : c.textMuted, fontSize: "0.65rem", fontWeight: 700, padding: "0.4rem 0.8rem", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s" }}>Latest</button>
              <button onClick={() => setPSort("top")} style={{ fontFamily: "'Manrope', sans-serif", border: "none", background: pSort === "top" ? c.accent : "transparent", color: pSort === "top" ? c.bg : c.textMuted, fontSize: "0.65rem", fontWeight: 700, padding: "0.4rem 0.8rem", borderRadius: 6, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s" }}>Top Readers</button>
            </div>
          </div>
          <div className={`grid-transition ${isAnimating ? 'grid-hidden' : 'grid-visible'}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {displayedPerspectives.length === 0 ? (
              <p style={{ color: c.textMuted, gridColumn: "1/-1", textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Belum ada artikel Perspectives untuk kategori ini.</p>
            ) : (
              displayedPerspectives.map((art: any) => (
                <PerspectiveCard key={art.id} article={art} theme={theme} onClick={() => { navigate(`/perspectives/${slugify(art.title)}`); }} />
              ))
            )}
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}

export function PerspectiveReaderPage({ post, allPosts }: { post: any, allPosts: any[] }) {
  const { theme, setTheme } = useTheme();
  const [livePost, setLivePost] = useState(post);
  const [liveAllPosts, setLiveAllPosts] = useState(allPosts);
  const c = T[theme as keyof typeof T];

  useEffect(() => {
    fetch(`https://backend-sovr.botgampang123.workers.dev/api/perspectives?id=${post.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !Array.isArray(data)) setLivePost(data);
      })
      .catch(err => console.error("Internal Fetch Error:", err));

    fetch("https://backend-sovr.botgampang123.workers.dev/api/perspectives?sort=latest")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLiveAllPosts(data);
      })
      .catch(err => console.error("Internal Fetch Error:", err));
  }, [post.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab="Perspectives" onNavigate={forceNav} />
      <section style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        <style>{`
          .app-container { margin: 0 auto; padding: 4rem 1.5rem 6rem; transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .app-container.wide { max-width: 800px; }
          @media (min-width: 1024px) { .app-container.wide { padding-top: 5rem; } }
        `}</style>
        <div className="app-container wide">
          <div style={{ paddingTop: "2rem" }}>
            <PerspectiveReader
                article={livePost}
                allArticles={liveAllPosts}
                theme={theme}
                onBack={() => { navigate('/perspectives'); }}
                onNavigate={(title: string) => { navigate(`/perspectives/${slugify(title)}`); }}
            />
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}

export function VaultPage({ tools }: { tools: any[] }) {
  const { theme, setTheme } = useTheme();
  const [liveTools, setLiveTools] = useState(tools);
  const c = T[theme as keyof typeof T];

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/vault")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLiveTools(data);
      })
      .catch(err => console.error("Internal Fetch Error:", err));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab="Vault" onNavigate={forceNav} />
      <section style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        <style>{`
          .app-container { margin: 0 auto; padding: 4rem 1.5rem 6rem; transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .app-container.ultra { max-width: 1140px; }
          @media (min-width: 1024px) { .app-container.ultra { padding-top: 5rem; } }
        `}</style>
        <div className="app-container ultra">
          <div style={{ paddingTop: "2rem" }}>
            <VaultGrid tools={liveTools} theme={theme} />
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}

export function VaultDetailPage({ tool, allTools }: { tool: any, allTools: any[] }) {
  const { theme, setTheme } = useTheme();
  const [liveTool, setLiveTool] = useState(tool);
  const [liveAllTools, setLiveAllTools] = useState(allTools);
  const c = T[theme as keyof typeof T];

  useEffect(() => {
    fetch("https://backend-sovr.botgampang123.workers.dev/api/vault")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
           setLiveAllTools(data);
           const updatedTool = data.find(t => slugify(t.name) === slugify(tool.name));
           if(updatedTool) setLiveTool(updatedTool);
        }
      })
      .catch(err => console.error("Internal Fetch Error:", err));
  }, [tool.name]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab="Vault" onNavigate={forceNav} />
      <section style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        <style>{`
          .app-container { margin: 0 auto; padding: 4rem 1.5rem 6rem; transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .app-container.wide { max-width: 800px; }
          @media (min-width: 1024px) { .app-container.wide { padding-top: 5rem; } }
        `}</style>
        <div className="app-container wide">
          <div style={{ paddingTop: "2rem" }}>
            <VaultDetail tool={liveTool} allTools={liveAllTools} theme={theme} />
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}
// --- BATAS PERUBAHAN ---

