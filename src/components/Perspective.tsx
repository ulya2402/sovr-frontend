// --- AWAL PERUBAHAN ---
import { T } from "../theme";

export function PerspectiveCard({ article, theme, onClick }: any) {
  const c = T[theme];
  return (
    <div
      onClick={onClick}
      style={{
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.transform = "translateY(-4px)"; 
        const img = e.currentTarget.querySelector('img');
        if(img) img.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.transform = "translateY(0)"; 
        const img = e.currentTarget.querySelector('img');
        if(img) img.style.transform = "scale(1)";
      }}
    >
      <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 16, overflow: "hidden", background: c.accentDim, position: "relative" }}>
        {article.image_url ? (
          <img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
        ) : (
          <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", color: c.textMuted }}>
            <i className="ri-image-line" style={{ fontSize: "2rem" }} />
          </div>
        )}
        <div style={{ position: "absolute", top: 12, left: 12, background: c.bg, color: c.text, padding: "0.35rem 0.8rem", borderRadius: 100, fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {article.category}
        </div>
        <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#fff", padding: "0.35rem 0.7rem", borderRadius: 8, fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ri-bar-chart-2-fill" /> {article.views}
        </div>
      </div>
      <div>
        {/* PERBAIKAN 1: Flexbox Presisi pada Baris Tanggal & Penulis di Halaman Depan */}
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", color: c.textMuted, fontWeight: 700, marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center" }}>
          <span>{article.published_date}</span>
          <span style={{ margin: "0 8px", opacity: 0.5 }}>•</span>
         <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Oleh&nbsp;<span style={{ color: c.accent }}>{article.author}</span>
          </span>
        </div>
        
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.2rem", color: c.text, fontWeight: 800, lineHeight: 1.35, margin: "0 0 0.5rem 0", letterSpacing: "-0.01em" }}>
          {article.title}
        </h3>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: c.textSub, lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {article.body ? article.body.replace(/<[^>]+>/g, '') : ''}
        </p>
      </div>
    </div>
  );
}

export function PerspectiveReader({ article, allArticles = [], theme, onBack, onNavigate }: any) {
  const c = T[theme];
  if (!article) return null;

  const relatedArticles = allArticles
    .filter((a: any) => a.category === article.category && a.id !== article.id)
    .slice(0, 2);

  const formatBody = (text: string) => {
    if (!text) return "";
    let html = text;
    if (!html.includes("<p>") && !html.includes("<br>")) {
       html = html.replace(/\n/g, "<br/>");
    }
    html = html.replace(/<table/g, '<div class="table-wrapper"><table');
    html = html.replace(/<\/table>/g, '</table></div>');
    return html;
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <style>{`
        .p-content { font-family: 'Manrope', sans-serif; font-size: 1.05rem; color: ${c.textSub}; line-height: 1.75; font-weight: 400; }
        .p-content p { margin: 0 0 1.2rem 0; }
        .p-content h2, .p-content h3 { color: ${c.text}; margin: 2rem 0 1rem 0; font-weight: 800; letter-spacing: -0.01em; line-height: 1.3; }
        .p-content h2 { font-size: 1.5rem; }
        .p-content h3 { font-size: 1.25rem; }
        .p-content a { color: ${c.accent}; text-decoration: underline; text-underline-offset: 4px; font-weight: 600; }
        
        .p-content ul, .p-content ol { margin: 0 0 1.2rem 0; padding-left: 1.5rem; }
        .p-content li { margin-bottom: 0.4rem; }
        .p-content blockquote { border-left: 4px solid ${c.accent}; margin: 1.8rem 0; padding: 0.8rem 0 0.8rem 1.2rem; font-size: 1.15rem; font-style: italic; color: ${c.text}; background: ${c.accentDim}; border-radius: 0 8px 8px 0; }
        
        .table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 1.8rem 0; border: 1px solid ${c.border}; border-radius: 8px; }
        .p-content table { width: 100%; border-collapse: collapse; min-width: 550px; }
        .p-content th, .p-content td { border-bottom: 1px solid ${c.border}; border-right: 1px solid ${c.border}; padding: 0.85rem 1.2rem; text-align: left; font-size: 0.95rem; }
        .p-content th:last-child, .p-content td:last-child { border-right: none; }
        .p-content tr:last-child td { border-bottom: none; }
        .p-content th { background: ${c.accentDim}; color: ${c.text}; font-weight: 700; }
        .p-content tr:nth-child(even) { background: ${c.bg === "#f7f7f7" ? "rgba(0,0,0,0.015)" : "rgba(255,255,255,0.02)"}; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: "2rem", paddingTop: "0.2rem" }}>
        <button
          onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: c.textMuted, fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", padding: "0.5rem 0", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.2s", lineHeight: 1 }}
          onMouseEnter={(e) => e.currentTarget.style.color = c.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = c.textMuted}
        >
          <i className="ri-arrow-left-line" style={{ fontSize: "1rem" }} /> Kembali
        </button>
      </div>

      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: c.accentDim, color: c.accent, padding: "0.4rem 1rem", borderRadius: 100, fontFamily: "'Manrope', sans-serif", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
          {article.category}
        </span>
        <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: c.text, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.02em", margin: "0 0 1.2rem 0" }}>
          {article.title}
        </h1>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", color: c.textMuted, fontWeight: 600, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 16 }}>
           <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ri-quill-pen-line" style={{ fontSize: "0.9rem" }} /> {article.author}</span>
           <span>•</span>
           <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ri-calendar-line" style={{ fontSize: "0.9rem" }} /> {article.published_date}</span>
           <span>•</span>
           <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i className="ri-eye-line" style={{ fontSize: "0.9rem" }} /> {article.views} Dilihat</span>
        </div>
      </div>

      {article.image_url && (
         <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: "1.5rem", border: `1px solid ${c.border}` }}>
           <img src={article.image_url} alt={article.title} style={{ width: "100%", maxHeight: "45vh", objectFit: "cover", display: "block" }} />
         </div>
      )}

      <div
        className="p-content"
        dangerouslySetInnerHTML={{ __html: formatBody(article.body) }}
      />

      {/* PERBAIKAN 2: Jarak atas dipangkas dari 4rem menjadi 1.5rem (Rapat ke teks akhir) */}
      {relatedArticles.length > 0 && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${c.border}` }}>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.2rem", color: c.text, fontWeight: 800, marginBottom: "1.2rem", letterSpacing: "-0.01em" }}>
            Baca Juga
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {relatedArticles.map((rel: any) => (
              <PerspectiveCard 
                key={rel.id} 
                article={rel} 
                theme={theme} 
                onClick={() => onNavigate && onNavigate(rel.title)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* PERBAIKAN 3: Jarak garis akhir dipangkas menjadi 2rem agar pas dan natural */}
      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: `1px solid ${c.border}`, textAlign: "center" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: c.textMuted, textTransform: "uppercase" }}>End of Perspective</span>
      </div>
    </div>
  );
}
// --- BATAS PERUBAHAN ---