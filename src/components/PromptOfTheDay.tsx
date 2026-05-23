import { useState } from "react";
import { T } from "../theme";

export function PromptOfTheDay({ prompts, theme }: any) {
  const c = T[theme];
  const [visibleCount, setVisibleCount] = useState(3);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!prompts || prompts.length === 0) return null;

  const visiblePrompts = prompts.slice(0, visibleCount);
  const hasMore = visibleCount < prompts.length;

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ margin: "1rem 0", padding: 0 }}>
      <style>{`
        .prompt-scroll-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; 
        }
        .prompt-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .prompt-card {
          scroll-snap-align: start;
          flex: 0 0 85%;
          max-width: 360px;
        }
        @media (min-width: 768px) {
          .prompt-scroll-container {
            flex-wrap: wrap;
            overflow-x: visible;
          }
          .prompt-card {
            flex: 1 1 calc(50% - 0.75rem);
            max-width: none;
          }
        }
        .prompt-code-container::-webkit-scrollbar {
          width: 4px;
        }
        .prompt-code-container::-webkit-scrollbar-thumb {
          background: ${c.border};
          border-radius: 4px;
        }
      `}</style>

      <div style={{ marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.accent }}>Inspirasi Visual</span>
        <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: c.text, margin: "0.2rem 0 0 0", letterSpacing: "-0.02em" }}>
          Prompt of the Day<span style={{ color: c.accent }}>.</span>
        </h3>
      </div>

      <div className="prompt-scroll-container">
        {visiblePrompts.map((p: any, i: number) => (
          <div 
            key={p.id} 
            className="prompt-card"
            style={{ 
              background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', 
              border: `1px solid ${c.border}`, 
              borderRadius: 20, 
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              animation: `slideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s both`,
              transition: "transform 0.3s, border-color 0.3s"
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
            <div style={{ width: "100%", height: 200, position: "relative", background: c.accentDim }}>
              <img 
                src={p.image_url} 
                alt={`Prompt ${p.ai_model}`} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "0.4rem 0.8rem", borderRadius: 100, display: "flex", alignItems: "center", gap: 6 }}>
                <i className="ri-robot-2-line" style={{ color: "#ffffff", fontSize: "0.8rem" }} />
                <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.05em" }}>{p.ai_model}</span>
              </div>
            </div>

            <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Prompt Text</span>
                  <span style={{ color: c.border, fontSize: "0.6rem" }}>•</span>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.6rem", fontWeight: 700, color: c.textMuted }}>{p.published_date}</span>
                </div>
                <button 
                  onClick={() => handleCopy(p.id, p.prompt_text)}
                  style={{ 
                    background: copiedId === p.id ? c.accent : "transparent", 
                    border: `1px solid ${copiedId === p.id ? c.accent : c.border}`, 
                    color: copiedId === p.id ? c.bg : c.text, 
                    padding: "0.3rem 0.75rem", 
                    borderRadius: 8, 
                    fontFamily: "'Manrope', sans-serif", 
                    fontSize: "0.65rem", 
                    fontWeight: 700, 
                    cursor: "pointer", 
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}
                >
                  <i className={copiedId === p.id ? "ri-check-line" : "ri-file-copy-line"} />
                  {copiedId === p.id ? "Copied" : "Copy"}
                </button>
              </div>
              
              <div 
                className="prompt-code-container"
                style={{ 
                  background: theme === 'dark' ? '#1a1a1a' : '#2d2d2d', 
                  borderRadius: 12, 
                  padding: "1rem", 
                  flex: 1,
                  maxHeight: 120,
                  overflowY: "auto"
                }}
              >
                <code style={{ 
                  fontFamily: "'Space Mono', monospace", 
                  fontSize: "0.75rem", 
                  lineHeight: 1.6, 
                  color: "#e6e6e6", 
                  wordBreak: "break-word" 
                }}>
                  {p.prompt_text}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0 0 0" }}>
          <button 
            onClick={() => setVisibleCount(prev => prev + 3)} 
            style={{ 
              display: "flex", alignItems: "center", gap: 8, fontFamily: "'Manrope', sans-serif", 
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", 
              color: c.text, background: "transparent", border: `1px solid ${c.border}`, 
              borderRadius: 100, padding: "0.75rem 2rem", cursor: "pointer", transition: "all 0.2s" 
            }} 
            onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent; }} 
            onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; }}
          >
            Tampilkan Prompt Lainnya <i className="ri-arrow-down-line" style={{ fontSize: "0.9rem" }} />
          </button>
        </div>
      )}
    </div>
  );
}