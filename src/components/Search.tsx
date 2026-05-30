import { useState, useEffect, useMemo, useRef } from "react";
import { T } from "../theme";

const slugify = (text: string) => {
  return text ? text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
};

// 🔥 PEMBARUAN 1: Highlight Teks Elegan (Tanpa blok warna yang menutupi teks)
const HighlightText = ({ text, highlight, accentColor }: { text: string, highlight: string, accentColor: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} style={{ 
            color: accentColor, 
            fontWeight: 900, 
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            textDecorationColor: accentColor
          }}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export function Search({ articles = [], vaultTools = [], perspectives = [], theme }: any) {
  const c = T[theme];
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const lastScrollY = useRef(0);

  // 🔥 PEMBARUAN 2: State untuk Animasi Loading (Debounce)
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Efek Debounce: Menunggu user selesai mengetik selama 300ms sebelum mencari
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300); // Waktu tunda 300ms untuk memunculkan loading spinner
    return () => clearTimeout(handler);
  }, [query]);

  // Logic Auto-Hide saat Scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsBtnVisible(false);
      } else {
        setIsBtnVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery("");
      setDebouncedQuery("");
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Menggunakan debouncedQuery agar pencarian sinkron dengan selesainya animasi loading
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    const matches: any[] = [];

    if (filter === "all" || filter === "feed") {
      articles.forEach((a: any) => {
        if (a.title?.toLowerCase().includes(q) || a.body?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)) {
          matches.push({ id: `feed-${a.id}`, type: "Feed", title: a.title, subtitle: a.category || "News", url: `/feed/${slugify(a.title)}`, icon: "ri-newspaper-line" });
        }
      });
    }

    if (filter === "all" || filter === "vault") {
      vaultTools.forEach((t: any) => {
        if (t.name?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q)) {
          matches.push({ id: `vault-${t.id}`, type: "Vault", title: t.name, subtitle: t.category || "Tool", url: `/vault/${slugify(t.name)}`, icon: "ri-box-3-fill" });
        }
      });
    }

    if (filter === "all" || filter === "perspectives") {
      perspectives.forEach((p: any) => {
        if (p.title?.toLowerCase().includes(q) || p.body?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q)) {
          matches.push({ id: `persp-${p.id}`, type: "Perspectives", title: p.title, subtitle: `By ${p.author}`, url: `/perspectives/${slugify(p.title)}`, icon: "ri-quill-pen-line" });
        }
      });
    }

    return matches.slice(0, 15);
  }, [debouncedQuery, filter, articles, vaultTools, perspectives]);

  const handleNavigate = (url: string) => {
    setIsOpen(false);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new Event('popstate'));
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
  };

  return (
    <>
      <style>{`
        /* --- PEMBARUAN 3: Ikon Mengambang Super Minimalis, Bulat, & Animasi Hardware-Accelerated --- */
        .search-trigger {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 9990;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isDark ? "rgba(30, 30, 30, 0.75)" : "rgba(255, 255, 255, 0.75)"};
          color: ${isDark ? "#fff" : "#000"};
          border: 1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          cursor: pointer;
          will-change: transform, opacity; /* Mencegah lag, memaksa GPU bekerja */
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
        }
        
        .search-trigger.visible {
          transform: scale(1) translateY(0);
          opacity: 1;
          box-shadow: ${isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.15)"};
          pointer-events: auto;
        }

        .search-trigger.hidden {
          /* Animasi Mengecil dan Turun secara mulus */
          transform: scale(0.6) translateY(40px);
          opacity: 0;
          pointer-events: none; /* Mencegah kepencet saat menghilang */
        }

        .search-trigger:hover.visible {
          transform: scale(1.08) translateY(-4px);
          background: ${isDark ? "rgba(40, 40, 40, 0.9)" : "rgba(255, 255, 255, 0.9)"};
        }
        
        /* Modal Overlay Tetap Elegan */
        .search-overlay {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; justify-content: center; align-items: flex-start;
          padding: 8vh 1rem 1rem;
        }
        .search-modal {
          position: relative; width: 100%; max-width: 680px;
          background: ${c.bg}; border: 1px solid ${c.border};
          border-radius: 24px;
          display: flex; flex-direction: column;
          height: 80vh; max-height: 600px; 
          box-shadow: ${isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.8)" : "0 25px 50px -12px rgba(0, 0, 0, 0.15)"};
          overflow: hidden;
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* --- DESAIN LOADING SPINNER PREMIUM --- */
        .premium-loader {
          width: 28px;
          height: 28px;
          border: 3px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"};
          border-top-color: ${c.accent};
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
          will-change: transform;
        }

        /* Animasi Kemunculan Hasil Berderet (Staggered) */
        .result-item {
          animation: fadeInSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(10px);
        }

        @media (max-width: 768px) {
          .search-trigger {
            bottom: 24px;
            right: 20px;
          }
          .search-overlay { padding: 0; align-items: stretch; }
          .search-modal {
            max-width: 100%; height: 100dvh !important; max-height: 100dvh !important;
            border-radius: 0; border: none;
            animation: slideUpMobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideUpMobile { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInSlide { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <button 
        className={`search-trigger ${isBtnVisible ? 'visible' : 'hidden'}`} 
        onClick={() => setIsOpen(true)} 
        title="Search (Cmd+K)"
      >
        <i className="ri-search-2-line" style={{ fontSize: "1.4rem" }}></i>
      </button>

      {isOpen && (
        <div className="search-overlay">
          <div 
            onClick={() => setIsOpen(false)}
            style={{ position: "absolute", inset: 0, background: isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(8px)", animation: "fadeIn 0.2s ease-out" }}
          />

          <div className="search-modal">
            
            <div style={{ display: "flex", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: `1px solid ${c.border}` }}>
              <i className="ri-search-line" style={{ fontSize: "1.5rem", color: c.accent, marginRight: "1rem" }}></i>
              <input
                ref={inputRef}
                type="text"
                placeholder="Ketik untuk mencari..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1, border: "none", background: "transparent", outline: "none",
                  fontFamily: "'Manrope', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: c.text
                }}
              />
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: c.accentDim, border: "none", color: c.accent, cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}
              >
                <i className="ri-close-line" style={{ fontSize: "1.2rem" }}></i>
              </button>
            </div>

            <div style={{ padding: "0.75rem 1.5rem", borderBottom: `1px solid ${c.border}`, display: "flex", gap: "0.5rem", overflowX: "auto", scrollbarWidth: "none" }}>
              {[
                { id: "all", label: "Semua" },
                { id: "feed", label: "News Feed" },
                { id: "vault", label: "AI Vault" },
                { id: "perspectives", label: "Perspectives" }
              ].map(f => (
                <button
                  key={f.id}
                  onMouseDown={(e) => e.preventDefault()} 
                  onClick={() => setFilter(f.id)}
                  style={{
                    flexShrink: 0, 
                    whiteSpace: "nowrap", padding: "0.4rem 1rem", borderRadius: "100px", fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", cursor: "pointer", transition: "all 0.2s",
                    background: filter === f.id ? c.text : "transparent",
                    color: filter === f.id ? c.bg : c.textSub,
                    border: `1px solid ${filter === f.id ? c.text : c.border}`
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0", display: "flex", flexDirection: "column" }}>
              {query.trim() === "" ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: c.textMuted, opacity: 0.6 }}>
                  <i className="ri-command-line" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}></i>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", fontWeight: 600 }}>Cari inovasi AI & Kripto terbaru...</span>
                </div>
              ) : isSearching ? (
                // 🔥 ANIMASI LOADING PREMIUM SAAT MENGETIK
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div className="premium-loader"></div>
                </div>
              ) : results.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: c.textMuted }}>
                  <i className="ri-ghost-line" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}></i>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.9rem", fontWeight: 600 }}>Tidak ada hasil untuk "{query}"</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {results.map((res: any, index: number) => (
                    <div
                      key={res.id}
                      className="result-item"
                      onClick={() => handleNavigate(res.url)}
                      style={{
                        display: "flex", alignItems: "center", padding: "1rem 1.5rem", cursor: "pointer", transition: "background 0.2s", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                        animationDelay: `${index * 0.03}s` // Efek hasil muncul berderet (staggered)
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: c.accentDim, color: c.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: "1rem" }}>
                        <i className={res.icon} style={{ fontSize: "1.2rem" }}></i>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ 
                          margin: "0 0 0.2rem 0", fontFamily: "'Manrope', sans-serif", fontSize: "1rem", fontWeight: 800, color: c.text,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" 
                        }}>
                          {/* HIGHLIGHT ELEGAN DI APLIKASIKAN DI SINI */}
                          <HighlightText text={res.title} highlight={debouncedQuery} accentColor={c.accent} />
                        </h4>
                        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: c.textSub, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {res.type} • <HighlightText text={res.subtitle} highlight={debouncedQuery} accentColor={c.accent} />
                        </span>
                      </div>
                      <i className="ri-arrow-right-up-line" style={{ color: c.textMuted, opacity: 0.5, flexShrink: 0 }}></i>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}