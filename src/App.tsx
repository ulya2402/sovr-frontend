import { useState, useEffect } from "react";
import { T, FILTERS, FMAP } from "./theme";
import { Card, EditorCard } from "./components/Cards";
import { PerspectiveCard, PerspectiveReader } from "./components/Perspective";
import { VaultGrid, VaultDetail } from "./components/Vault";
import { Navbar, Ticker, Hero, Footer } from "./components/Layout"; 
import { LegalPage } from "./components/Legal"; 
import { PromptOfTheDay } from "./components/PromptOfTheDay";
import { AuthorProfile } from "./components/Author";


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
// --- AWAL PERUBAHAN: Komponen InlinePerspectives ---
// --- AWAL PERUBAHAN: src/App.tsx (Komponen InlinePerspectives) ---
// --- AWAL PERUBAHAN: src/App.tsx (Komponen InlinePerspectives) ---
function InlinePerspectives({ perspectives, theme }: any) {
  const c = T[theme];
  const latest = perspectives.slice(0, 3);
  if (latest.length === 0) return null;

  const hero = latest[0];
  const others = latest.slice(1);

  return (
    <div style={{ margin: "1rem 0", padding: 0 }}>
      <div style={{ marginBottom: "0.25rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.accent }}>Baca Juga</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
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
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
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
              <span style={{ fontSize: "0.65rem", color: c.textMuted }}> </span>
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
                  setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
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

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => {
              window.history.pushState({}, '', `/perspectives`);
              window.dispatchEvent(new Event('popstate'));
              setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
            }}
            style={{
              display: "flex", alignItems: "center", gap: 8, fontFamily: "'Manrope', sans-serif",
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: c.bg,
              background: c.text,
              border: `1px solid ${c.text}`,
              borderRadius: 100, padding: "0.75rem 2rem", cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Jelajahi Semua Deep Dives <i className="ri-arrow-right-line" style={{ fontSize: "0.9rem" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
// --- BATAS PERUBAHAN ---

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
        Dapatkan <span style={{ color: c.accent }}>Berita Terbaru</span>
      </h3>
      
      <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: c.textSub, margin: 0, lineHeight: 1.6, maxWidth: 380, position: "relative", zIndex: 1 }}>
        Gabung ke channel telegram kami untuk pembaruan seputar AI dan Kripto.
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
          Gabung Sekarang <i className="ri-arrow-right-line" style={{ fontSize: "0.95rem" }} />
        </button>
      </div>

      <span style={{ fontSize: "0.6rem", color: c.textMuted, fontWeight: 600, marginTop: "0.85rem", position: "relative", zIndex: 1 }}>
        Gabung Sekarang.
      </span>
    </div>
  );
}
// --- BATAS PERUBAHAN ---
// --- AWAL PERUBAHAN: Komponen InlineEditorPicks Baru ---
// --- AWAL PERUBAHAN: Kembalikan EditorSection dan letakkan InlineEditorPicks ---

// 1. Komponen Inline Pilihan Editor (yang muncul disela-sela Feed)
// --- AWAL PERUBAHAN: Desain Baru Komponen InlineEditorPicks ---
function InlineEditorPicks({ articles, theme }: any) {
  const c = T[theme];
  const picks = articles.slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <div style={{ margin: "1rem 0", padding: 0 }}>
      <div style={{ marginBottom: "0.75rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.accent }}>Kurasi Khusus</span>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: c.text, margin: "0.2rem 0 0 0", letterSpacing: "-0.02em" }}>
          Editor's Spotlight.
        </h3>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {picks.map((p: any, index: number) => (
          <div 
            key={p.id} 
            onClick={() => {
              window.history.pushState({}, '', `/feed/${slugify(p.title)}`);
              window.dispatchEvent(new Event('popstate'));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ 
              background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', 
              border: `1px solid ${c.border}`, borderRadius: 16, padding: "1.25rem", 
              cursor: "pointer", position: "relative", overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.borderColor = c.accent; 
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.borderColor = c.border; 
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ position: "absolute", top: -10, right: -10, fontSize: "4rem", fontWeight: 900, color: c.textMuted, opacity: 0.1, pointerEvents: "none", fontFamily: "'Manrope', sans-serif" }}>
              0{index + 1}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
              <i className={p.icon || "ri-flashlight-fill"} style={{ color: c.accent, fontSize: "0.9rem" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: c.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.tag}</span>
            </div>
            <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: c.text, margin: "0 0 0.5rem 0", lineHeight: 1.4, position: "relative", zIndex: 1 }}>
              {p.title}
            </h4>
            <span style={{ fontSize: "0.7rem", color: c.textSub, fontWeight: 600, display: "block", position: "relative", zIndex: 1 }}>{p.source.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Pembaruan InlineVaultPromo
// --- AWAL PERUBAHAN: Desain Vault Promo Aesthetic & Premium ---
function InlineVaultPromo({ tools, theme }: any) {
  const c = T[theme];
  const featured = tools.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <div style={{ margin: "1rem 0", padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.4rem" }}>
            <i className="ri-box-3-fill" style={{ color: c.accent, fontSize: "0.9rem" }}></i>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.accent }}>The Vault</span>
          </div>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: c.text, margin: 0, letterSpacing: "-0.02em" }}>
            Curated Tools<span style={{ color: c.accent }}>.</span>
          </h3>
        </div>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textMuted }}>Featured</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {featured.map((tool: any) => {
          const isFree = tool.pricing?.toLowerCase().includes('free');
          
          return (
            <div 
              key={tool.id} 
              onClick={() => {
                window.history.pushState({}, '', `/vault/${slugify(tool.name)}`);
                window.dispatchEvent(new Event('popstate'));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                padding: "1.25rem",
                background: theme === 'dark' ? 'rgba(255,255,255,0.015)' : '#ffffff',
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = c.accent;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = theme === 'dark' ? '0 12px 30px -10px rgba(0,0,0,0.4)' : '0 12px 30px -10px rgba(0,0,0,0.08)';
                const arrow = e.currentTarget.querySelector('.vault-arrow') as HTMLElement;
                if (arrow) {
                  arrow.style.background = c.accent;
                  arrow.style.color = theme === 'dark' ? '#000000' : '#ffffff';
                  arrow.style.transform = "rotate(45deg) scale(1.1)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = c.border;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                const arrow = e.currentTarget.querySelector('.vault-arrow') as HTMLElement;
                if (arrow) {
                  arrow.style.background = c.accentDim;
                  arrow.style.color = c.accent;
                  arrow.style.transform = "rotate(0deg) scale(1)";
                }
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, border: `1px solid ${c.border}`, overflow: "hidden", flexShrink: 0, marginRight: "1rem", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img 
                  src={tool.logo} alt={tool.name} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e: any) => { e.target.src = "https://via.placeholder.com/48?text=AI"; }} 
                />
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h4 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.05rem", fontWeight: 800, color: c.text, margin: 0, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tool.name}
                  </h4>
                  <span style={{ fontSize: "0.55rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.15rem 0.4rem", borderRadius: 6, background: isFree ? 'rgba(46, 204, 113, 0.15)' : c.accentDim, color: isFree ? '#2ecc71' : c.accent }}>
                    {tool.pricing || "Paid"}
                  </span>
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", color: c.textSub, fontWeight: 500, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tool.category}
                </p>
              </div>

              <div 
                className="vault-arrow"
                style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <i className="ri-arrow-right-up-line" style={{ fontSize: "1rem" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SmoothReveal({ children, delay = 0 }: any) {
  return (
    <div 
      style={{ 
        /* Menggunakan @keyframes murni dari CSS, bukan state React */
        animation: `smoothFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both`,
        animationDelay: `${delay}ms`,
        willChange: "opacity, transform" // Perintah paksa ke GPU agar tidak lag
      }}
    >
      {/* Inject Keyframes (Browser sangat pintar menangani ini tanpa beban) */}
      <style>{`
        @keyframes smoothFadeUp {
          0% { opacity: 0; transform: translateY(35px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}
// --- BATAS PERUBAHAN ---

// --- AWAL PERUBAHAN: src/App.tsx (Fungsi EditorSection) ---
function EditorSection({ theme, articles }: any) {
  const c = T[theme];
  const picks = articles.filter((a: any) => a.featured);

  if (picks.length === 0) {
    return <div style={{ textAlign: "center", padding: "4rem 0", color: c.textMuted, fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}>Belum ada berita Pilihan Editor saat ini.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SmoothReveal delay={0}>
        <div style={{ textAlign: "center", padding: "2.5rem 0", marginBottom: "2rem", borderBottom: `1px solid ${c.border}` }}>
          <h2 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: c.text, lineHeight: 1.15, marginBottom: "0.5rem", letterSpacing: "-0.03em", textTransform: "uppercase" }}>Editorial <span style={{ color: c.textMuted }}>Picks</span></h2>
          <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 500, fontSize: "0.9rem", color: c.textSub, letterSpacing: "0.01em" }}>Feed pilihan dari tim redaksi SOVR.</p>
        </div>
      </SmoothReveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {picks.map((card: any, i: number) => (
          <SmoothReveal key={card.id} delay={150 + (i * 75)}>
            <div id={`article-${card.id}`}>
              <EditorCard card={card} theme={theme} idx={i} />
            </div>
          </SmoothReveal>
        ))}
      </div>

      <SmoothReveal delay={150 + (picks.length * 75)}>
        <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${c.border}` }}>
          <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: c.textMuted, textTransform: "uppercase" }}>End of Curation</span>
        </div>
      </SmoothReveal>
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
  const [prompts, setPrompts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [visibleCount, setVisibleCount] = useState(3);
  const itemsPerPage = 5;
  
  // State Router URL
  const [currentVaultSlug, setCurrentVaultSlug] = useState<string | null>(null); 
  const [targetArticleSlug, setTargetArticleSlug] = useState<string | null>(null);
  const [currentLegalSlug, setCurrentLegalSlug] = useState<string | null>(null);
  const [currentAuthorSlug, setCurrentAuthorSlug] = useState<string | null>(null);
  
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
    fetch("https://backend-sovr.botgampang123.workers.dev/api/prompts")
      .then(res => res.json()).then(data => setPrompts(Array.isArray(data) ? data : [])).catch(() => {});
    fetch("https://backend-sovr.botgampang123.workers.dev/api/authors")
      .then(res => res.json()).then(data => setAuthors(Array.isArray(data) ? data : [])).catch(() => {});
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

  // 1. Reader Halaman Penuh + Tambah View
  useEffect(() => {
    if (currentPerspectiveSlug && perspectives.length > 0) {
      const found = perspectives.find(p => slugify(p.title) === currentPerspectiveSlug);
      if (found) {
         setActivePerspective(found);
         
         fetch(`https://backend-sovr.botgampang123.workers.dev/api/perspectives?id=${found.id}`)
           .then(res => res.json())
           .then(data => setActivePerspective(data))
           .catch(() => {}); 
      }
    } else {
      setActivePerspective(null);
    }
  }, [currentPerspectiveSlug, perspectives]);

  // 2. Efek untuk mengganti Judul Tab Browser
  useEffect(() => {
    if (currentPerspectiveSlug && activePerspective) {
      document.title = `${activePerspective.title} | SOVR. Perspectives`;
    } else if (targetArticleSlug && articles.length > 0) {
      const targetArticle = articles.find(a => slugify(a.title) === targetArticleSlug);
      if (targetArticle) {
        document.title = `${targetArticle.title} | SOVR.`;
      } else {
        document.title = "SOVR. | Portal Informasi AI & Kripto";
      }
    } else {
      document.title = "SOVR. | Portal Informasi AI & Kripto";
    }
  }, [currentPerspectiveSlug, activePerspective, targetArticleSlug, articles]);
  // URL Router / Mesin State
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);

      const resetAll = () => {
        setCurrentVaultSlug(null); setTargetArticleSlug(null);
        setCurrentLegalSlug(null); setCurrentPerspectiveSlug(null);
        setCurrentAuthorSlug(null);
      };

      if (['about', 'privacy-policy', 'contact'].includes(segments[0])) {
        resetAll(); setMainTab(segments[0]); setCurrentLegalSlug(segments[0]);
      } else if (segments[0] === 'vault') {
        resetAll(); setMainTab('Vault'); setCurrentVaultSlug(segments[1] || null); 
      } else if (segments[0] === 'perspectives') {
        resetAll(); setMainTab('Perspectives'); setCurrentPerspectiveSlug(segments[1] || null);
      } else if (segments[0] === 'editor-picks') {
        resetAll(); setMainTab('Pilihan Editor'); setTargetArticleSlug(segments[1] || null); 
      } else if (segments[0] === 'author') {
        resetAll(); setMainTab('Author'); setCurrentAuthorSlug(segments[1] || null);
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
      
      {mainTab === "Feed" && !currentVaultSlug && !currentLegalSlug && !currentPerspectiveSlug && <Ticker theme={theme} tickerData={tickerData} />}
      {mainTab === "Feed" && !currentVaultSlug && !currentLegalSlug && !currentPerspectiveSlug && <Hero theme={theme} tickerData={tickerData} />}
      
      {/* PERHATIKAN: minHeight dihapus dan diganti dengan flex: 1 */}
      <section id="feed" style={{ background: c.bg, flex: 1, transition: "background 0.4s" }}>
        
        <style>{`
          .app-container {
            margin: 0 auto;
            padding: 4rem 1.5rem 6rem;
            transition: max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .app-container.standard { max-width: 680px; }
          .app-container.wide { max-width: 800px; }
          .app-container.desktop-feed { max-width: 680px; }
          
          .feed-wrapper {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .feed-main {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .feed-sidebar {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          
          @media (min-width: 1024px) {
            .app-container.desktop-feed {
              max-width: 1140px; 
              padding-top: 5rem;
            }
            .feed-wrapper {
              display: grid;
              grid-template-columns: minmax(0, 1fr) 340px;
              gap: 3.5rem;
              align-items: start;
            }
            .feed-sidebar {
              position: sticky;
              top: 100px;
              padding-left: 3.5rem;
              border-left: 1px dashed ${c.border}; 
            }
            .mobile-divider {
              display: none !important;
            }
          }
        `}</style>

        <div className={`app-container ${(currentVaultSlug || currentLegalSlug || currentPerspectiveSlug || currentAuthorSlug) ? "wide" : (mainTab === "Feed" ? "desktop-feed" : "standard")}`}>
          
          {currentLegalSlug ? (
            <LegalPage type={currentLegalSlug} theme={theme} />
          ) : currentAuthorSlug ? (
            <AuthorProfile 
              author={authors.find(a => a.slug === currentAuthorSlug) || { name: currentAuthorSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), slug: currentAuthorSlug }} 
              articles={articles.filter(a => slugify(a.author) === currentAuthorSlug)} 
              perspectives={perspectives.filter(p => slugify(p.author) === currentAuthorSlug)} 
              theme={theme} 
            />
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
                setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
              }} 
            />          
          ) : currentVaultSlug ? (
            <VaultDetail tool={vaultTools.find(t => slugify(t.name) === currentVaultSlug)} allTools={vaultTools} theme={theme} />
         ) : mainTab === "Perspectives" ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <SmoothReveal delay={0}>
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
              </SmoothReveal>

              <SmoothReveal delay={75}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem" }}>
                  {FILTERS.map(f => <button key={f} onClick={() => setPCat(f)} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: pCat === f ? c.bg : c.textMuted, background: pCat === f ? c.accent : "transparent", border: `1px solid ${pCat === f ? c.accent : c.border}`, borderRadius: 100, padding: "0.35rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>{f}</button>)}
                </div>
              </SmoothReveal>

              <div key={`${pCat}-${pSort}`} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {perspectives.length === 0 ? (
                  <p style={{ color: c.textMuted, gridColumn: "1/-1", textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Belum ada artikel Perspectives untuk kategori ini.</p>
                ) : (
                  perspectives.map((art, i) => (
                    <SmoothReveal key={art.id} delay={150 + (i * 75)}>
                      <PerspectiveCard 
                        article={art} theme={theme} 
                        onClick={() => {
                          window.history.pushState({}, '', `/perspectives/${slugify(art.title)}`);
                          window.dispatchEvent(new Event('popstate'));
                          setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
                        }} 
                      />
                    </SmoothReveal>
                  ))
                )}
              </div>
            </div>
          ) : mainTab === "Vault" ? (
            <VaultGrid tools={vaultTools} theme={theme} />
          ) : mainTab === "Feed" ? (
            <div className="feed-wrapper">
              
              <div className="feed-main">
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.1em", color: c.text, textTransform: "uppercase" }}>Live Feed</span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: c.textMuted }}>{filtered.length} entries</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2rem" }}>
                    {FILTERS.map(f => <button key={f} onClick={() => { setFilter(f); setVisibleCount(3); }} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: filter === f ? c.bg : c.textMuted, background: filter === f ? c.accent : "transparent", border: `1px solid ${filter === f ? c.accent : c.border}`, borderRadius: 100, padding: "0.35rem 1rem", cursor: "pointer", transition: "all 0.2s" }}>{f}</button>)}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {loading ? (
                      <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Syncing data...</p>
                    ) : displayedArticles.length === 0 ? (
                      <p style={{ color: c.textMuted, textAlign: "center", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>Belum ada card untuk kategori ini.</p>
                    ) : (
                      displayedArticles.map((card, i) => {
                        const isNewBatch = i >= 3;
                        const delayTime = isNewBatch ? ((i - 3) % itemsPerPage) * 75 : 0; 
                        return (
                          <SmoothReveal key={card.id} delay={delayTime}>
                            <div id={`article-${card.id}`}>
                              <Card card={card} theme={theme} idx={i} />
                            </div>
                          </SmoothReveal>
                        );
                      })
                    )}
                  </div>
                </div>

                {hasMore && !loading && (
                  <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0 1rem 0" }}>
                    <button 
                      onClick={() => setVisibleCount(prev => prev + itemsPerPage)}
                      style={{ 
                        display: "flex", alignItems: "center", gap: 8, fontFamily: "'Manrope', sans-serif", 
                        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", 
                        color: c.bg, 
                        background: c.text, 
                        border: `1px solid ${c.text}`, 
                        borderRadius: 100, padding: "0.75rem 2rem", cursor: "pointer", transition: "all 0.2s" 
                      }}
                      onMouseEnter={e => { 
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => { 
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Tampilkan Feed Lainnya <i className="ri-arrow-down-line" style={{ fontSize: "0.9rem" }} />
                    </button>
                  </div>
                )}

                {perspectives.length > 0 && (
                  <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: `1px solid ${c.border}` }}>
                    <InlinePerspectives perspectives={perspectives} theme={theme} />
                  </div>
                )}

                {prompts.length > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "center", margin: "0.3rem 0" }}>
                      <div style={{ width: "40px", height: "4px", background: c.border, borderRadius: "2px" }} />
                    </div>
                    <div>
                      <PromptOfTheDay prompts={prompts} theme={theme} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", margin: "0.3rem 0" }}>
                      <div style={{ width: "40px", height: "4px", background: c.border, borderRadius: "2px" }} />
                    </div>
                  </>
                )}
              </div>

              

              <div className="feed-sidebar">
                {articles.some((a: any) => a.featured) && (
                  <InlineEditorPicks articles={articles.filter((a: any) => a.featured)} theme={theme} />
                )}

                {articles.some((a: any) => a.featured) && vaultTools.some((t: any) => t.featured === 1) && (
                  <div className="mobile-divider" style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                    <div style={{ width: "40px", height: "4px", background: c.border, borderRadius: "2px" }} />
                  </div>
                )}

                {vaultTools.some((t: any) => t.featured === 1) && (
                  <InlineVaultPromo tools={vaultTools.filter((t: any) => t.featured === 1)} theme={theme} />
                )}

                <div className="mobile-divider" style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                  <div style={{ width: "40px", height: "4px", background: c.border, borderRadius: "2px" }} />
                </div>

                <InlineNewsletter theme={theme} />
              </div>

            </div>
          ) : (
            <EditorSection theme={theme} articles={articles} />
          )}
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
}