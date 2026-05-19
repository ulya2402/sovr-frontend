import { useState } from "react";
import { T } from "../theme";
import { slugify } from "../App";

const MR = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'Manrope', sans-serif",
  ...extra,
});

// ==========================================
// 1. VAULT CARD (GRID VIEW)
// ==========================================
function VaultCard({ tool, theme, onClick }: any) {
  const c = T[theme];
  return (
    <div 
      onClick={onClick}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 20,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
      }}
      onMouseEnter={e => { 
        e.currentTarget.style.borderColor = c.accent; 
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 12px 30px ${theme === 'dark' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)'}`;
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.borderColor = c.border; 
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <img 
          src={tool.logo} 
          alt={tool.name} 
          style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: `1px solid ${c.border}`, background: c.accentDim }} 
          onError={(e: any) => { e.target.src = "https://via.placeholder.com/52?text=AI"; }} 
        />
        <div style={MR({ fontSize: "0.6rem", fontWeight: 800, color: c.accent, background: c.accentDim, padding: "0.4rem 0.75rem", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 })}>
          {tool.category}
        </div>
      </div>
      
      <div>
        <h3 style={MR({ fontSize: "1.15rem", fontWeight: 800, color: c.text, margin: "0 0 0.4rem 0", letterSpacing: "-0.02em" })}>
          {tool.name}
        </h3>
        <p style={MR({ fontSize: "0.82rem", color: c.textSub, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", opacity: 0.8 })}>
          {tool.description}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem", gap: 12 }}>
        <span style={MR({ display: "flex", alignItems: "center", fontSize: "0.65rem", fontWeight: 700, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", overflow: "hidden", whiteSpace: "nowrap" })}>
          <i className="ri-global-line" style={{ marginRight: 4, flexShrink: 0 }} /> 
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tool.platform}</span>
        </span>
        <span style={MR({ fontSize: "0.7rem", fontWeight: 800, color: c.text, flexShrink: 0 })}>
          {tool.pricing}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 2. VAULT GRID (DENGAN FILTER KATEGORI)
// ==========================================
export function VaultGrid({ tools, theme }: any) {
  const c = T[theme];
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Chat", "Agent", "Productivity", "Image", "Video", "Other"];

  const filteredTools = activeCategory === "Semua" 
    ? tools 
    : tools?.filter((t: any) => t.category?.toLowerCase() === activeCategory.toLowerCase());

  const handleOpenDetail = (tool: any) => {
    const slug = slugify(tool.name);
    const newUrl = `/vault/${slug}`; 
    window.history.pushState({ path: newUrl }, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ animation: "fadeIn 0.6s ease-out" }}>
      <div style={{ textAlign: "center", padding: "0 0 2rem" }}>
        <h2 style={MR({ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", fontWeight: 800, color: c.text, letterSpacing: "-0.04em", margin: 0, textTransform: "uppercase" })}>
          Vault<span style={{ color: c.accent }}>.</span>
        </h2>
        <p style={MR({ fontWeight: 600, fontSize: "0.95rem", color: c.textSub, opacity: 0.6, marginTop: "0.5rem" })}>
          Discover AI tools that matter.
        </p>
      </div>

      <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div className="hide-scroll" style={{ width: "100%", overflowX: "auto", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: 10, width: "max-content", margin: "0 auto", padding: "0 2px" }}>
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              style={MR({ 
                fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", 
                color: activeCategory === cat ? c.bg : c.textMuted, 
                background: activeCategory === cat ? c.accent : "transparent", 
                border: `1px solid ${activeCategory === cat ? c.accent : c.border}`, 
                borderRadius: 100, padding: "0.5rem 1.25rem", cursor: "pointer", transition: "all 0.2s",
                whiteSpace: "nowrap"
              })}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {!filteredTools || filteredTools.length === 0 ? (
        <div style={MR({ textAlign: "center", padding: "4rem 0", color: c.textMuted, fontWeight: 600 })}>Kategori ini masih kosong.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {filteredTools.map((tool: any, i: number) => (
            <div key={tool.id} style={{ animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s both` }}>
               {/* 🔥 FIX: Mengirim seluruh data tool, bukan hanya id */}
               <VaultCard tool={tool} theme={theme} onClick={() => handleOpenDetail(tool)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. VAULT DETAIL (HALAMAN KHUSUS + RELATED TOOLS)
// ==========================================
export function VaultDetail({ tool, allTools, theme }: any) {
  const c = T[theme];

  const handleBack = () => {
    window.history.pushState({}, '', '/vault'); 
    window.dispatchEvent(new Event('popstate'));
    
    setTimeout(() => {
      const feedEl = document.getElementById("feed");
      if (feedEl) {
        const y = feedEl.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 150); // Jeda agar tidak bertabrakan dengan render Hero
  };

  // 🔥 PERBAIKAN: Jeda mulus untuk related tools
  const handleOpenRelated = (tool: any) => {
    const slug = slugify(tool.name);
    const newUrl = `/vault/${slug}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
    
    setTimeout(() => {
      const feedEl = document.getElementById("feed");
      if (feedEl) {
        const y = feedEl.getBoundingClientRect().top + window.scrollY - 40;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };
  
  if (!tool) return null;

  const relatedTools = allTools 
    ? allTools.filter((t: any) => t.category === tool.category && t.id !== tool.id).slice(0, 2) 
    : [];

  return (
    <div style={{ animation: "fadeIn 0.5s ease", maxWidth: 720, margin: "0 auto", padding: "1rem 0 8rem" }}>
      
      <button 
        onClick={handleBack} 
        style={MR({ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: c.textMuted, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", padding: "0.5rem 0", marginBottom: "3rem", transition: "all 0.2s" })}
        onMouseEnter={e => { e.currentTarget.style.color = c.accent; e.currentTarget.style.transform = "translateX(-4px)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = c.textMuted; e.currentTarget.style.transform = "translateX(0)"; }}
      >
        <i className="ri-arrow-left-s-line" style={{ fontSize: "1.2rem" }} /> Back to Vault
      </button>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24, marginBottom: "4rem" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -10, background: c.accent, opacity: 0.1, filter: "blur(20px)", borderRadius: "50%" }} />
          <img 
            src={tool.logo} alt={tool.name} 
            style={{ position: "relative", width: 100, height: 100, borderRadius: 28, border: `1px solid ${c.border}`, objectFit: "cover", background: c.bg }} 
            onError={(e: any) => { e.target.src = "https://via.placeholder.com/100?text=AI"; }} 
          />
        </div>
        
        <div>
          <h1 style={MR({ fontSize: "2.8rem", fontWeight: 800, color: c.text, margin: "0 0 0.75rem 0", letterSpacing: "-0.03em", lineHeight: 1 })}>
            {tool.name}
          </h1>
          <p style={MR({ fontSize: "1.1rem", color: c.textSub, margin: 0, maxWidth: 550, lineHeight: 1.6, opacity: 0.8 })}>
            {tool.description}
          </p>
        </div>

        <a 
          href={tool.url} target="_blank" rel="noreferrer" 
          style={MR({ display: "inline-flex", alignItems: "center", gap: 10, background: c.accent, color: c.bg, fontSize: "0.9rem", fontWeight: 800, padding: "1rem 2.5rem", borderRadius: 100, textDecoration: "none", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", boxShadow: `0 10px 20px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}` })}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 15px 30px ${theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 10px 20px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`; }}
        >
          Open Web App <i className="ri-external-link-line" />
        </a>
      </div>

      <div style={{ 
        display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", gap: "1rem", 
        background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", 
        borderRadius: 24, border: `1px solid ${c.border}`, padding: "2rem 1rem", marginBottom: "4rem"
      }}>
        {[
          { label: "Category", value: tool.category, icon: "ri-apps-2-line" },
          { label: "Platform", value: tool.platform, icon: "ri-shield-flash-line" },
          { label: "Pricing", value: tool.pricing, icon: "ri-vip-diamond-line" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, flex: "1 1 0px", minWidth: 100 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: c.bg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.04)", marginBottom: 4 }}>
              <i className={item.icon} style={{ fontSize: "1.2rem", color: c.accent }} />
            </div>
            <span style={MR({ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: c.textMuted })}>{item.label}</span>
            <span style={MR({ fontSize: "0.9rem", fontWeight: 800, color: c.text, lineHeight: 1.4, wordBreak: "break-word" })}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h3 style={MR({ fontSize: "0.8rem", fontWeight: 800, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: 8 })}>
          <i className="ri-magic-line" style={{ color: c.accent, fontSize: "1.1rem" }} /> Key Features
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tool.summary.split(',').map((point: string, i: number) => (
            <div 
              key={i} 
              style={{ 
                display: "flex", alignItems: "center", gap: 14, 
                background: theme === "dark" ? "rgba(255,255,255,0.03)" : c.bg, 
                border: `1px solid ${c.border}`,
                borderRadius: 16, padding: "1rem 1.25rem",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
                boxShadow: "0 2px 10px rgba(0,0,0,0.01)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = c.accent;
                e.currentTarget.style.transform = "translateX(6px)";
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'}`;
                const iconBox = e.currentTarget.querySelector('.summary-icon-box') as HTMLElement;
                if (iconBox) iconBox.style.transform = "scale(1.15) rotate(10deg)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = c.border;
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.01)";
                const iconBox = e.currentTarget.querySelector('.summary-icon-box') as HTMLElement;
                if (iconBox) iconBox.style.transform = "scale(1) rotate(0deg)";
              }}
            >
              <div className="summary-icon-box" style={{ width: 32, height: 32, borderRadius: 10, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                <i className="ri-sparkling-fill" style={{ color: c.accent, fontSize: "1rem" }} />
              </div>
              <p style={MR({ fontSize: "0.95rem", color: c.text, margin: 0, fontWeight: 700, lineHeight: 1.4 })}>
                {point.trim()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {relatedTools.length > 0 && (
        <div style={{ marginTop: "5rem", paddingTop: "3.5rem", borderTop: `1px dashed ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "2rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.accent }} />
            <h3 style={MR({ fontSize: "1.4rem", fontWeight: 800, color: c.text, margin: 0, letterSpacing: "-0.02em" })}>
              More in <span style={{ color: c.accent }}>{tool.category}</span>
            </h3>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {relatedTools.map((rTool: any, i: number) => (
              <div key={rTool.id} style={{ animation: `fadeIn 0.5s ease ${i * 0.1}s both` }}>
                {/* 🔥 FIX: Mengirim seluruh data tool, bukan hanya id */}
                <VaultCard tool={rTool} theme={theme} onClick={() => handleOpenRelated(rTool)} />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}