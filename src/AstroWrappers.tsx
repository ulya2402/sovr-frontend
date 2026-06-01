// --- AWAL PERUBAHAN FULL FILE: src/AstroWrappers.tsx ---
import { useState, useEffect } from "react";
// 🔥 IMPOR ROUTER CLIENT ASTRO
import { navigate } from "astro:transitions/client"; 
import { Navbar, Footer } from "./components/Layout";
import { PerspectiveCard, PerspectiveReader } from "./components/Perspective";
import { VaultGrid, VaultDetail } from "./components/Vault";
import { slugify } from "./App";
import { T } from "./theme";

function useTheme() {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sovr_theme') || 'light';
    setThemeState(saved);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('sovr_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, setTheme, mounted };
}

// --- AWAL PERUBAHAN: src/AstroWrappers.tsx ---
const forceNav = (tabName: string) => {
  if (tabName === "Feed") navigate("/");
  else if (tabName === "Pilihan Editor") navigate("/editor-picks"); // <-- Pastikan ini mengarah ke /editor-picks
  else if (tabName === "Vault") navigate("/vault");
  else if (tabName === "Perspectives") navigate("/perspectives");
};
// --- BATAS PERUBAHAN ---

export function PerspectivesIndexPage({ perspectives }: { perspectives: any[] }) {
  const { theme, setTheme, mounted } = useTheme();
  if (!mounted) return null; 
  const c = T[theme];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: c.bg }}>
      <Navbar theme={theme} setTheme={setTheme} mainTab="Perspectives" onNavigate={forceNav} />
      <section style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        <style>{`
          .app-container { margin: 0 auto; padding: 4rem 1.5rem 6rem; transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
          .app-container.standard { max-width: 680px; }
          @media (min-width: 1024px) { .app-container.standard { padding-top: 5rem; } }
        `}</style>
        <div className="app-container standard">
          <div style={{ paddingTop: "2.5rem", marginBottom: "2.5rem" }}>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", color: c.text }}>Perspectives.</h1>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: c.textSub }}>Membahas teknologi dari sudut pandang manusia</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {perspectives.map((art: any) => (
              <PerspectiveCard key={art.id} article={art} theme={theme} onClick={() => { navigate(`/perspectives/${slugify(art.title)}`); }} />
            ))}
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}

export function PerspectiveReaderPage({ post, allPosts }: { post: any, allPosts: any[] }) {
  const { theme, setTheme, mounted } = useTheme();
  if (!mounted) return null;
  const c = T[theme];

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
              article={post} 
              allArticles={allPosts} 
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
  const { theme, setTheme, mounted } = useTheme();
  if (!mounted) return null;
  const c = T[theme];

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
            <VaultGrid tools={tools} theme={theme} />
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}

export function VaultDetailPage({ tool, allTools }: { tool: any, allTools: any[] }) {
  const { theme, setTheme, mounted } = useTheme();
  if (!mounted) return null;
  const c = T[theme];

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
            <VaultDetail tool={tool} allTools={allTools} theme={theme} />
          </div>
        </div>
      </section>
      <Footer theme={theme} />
    </div>
  );
}
// --- BATAS PERUBAHAN FULL FILE ---