// --- AWAL KODE: src/components/Ads.tsx ---
import { T } from "../theme";

export function InlineAdBanner({ theme }: { theme: string }) {
  const c = T[theme as keyof typeof T];
  
  const adLink = "https://monetag.com/?ref_id=zZ8f";
  const adImage = "https://monetag.com/wp-content/uploads/2025/06/monetag-twitter-case-main.png";

return (
    <div className="sovr-ad-container">
      <style>{`
        .sovr-ad-container {
          margin: 1.25rem 0;
          animation: smoothFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .sovr-ad-card {
          display: flex;
          flex-direction: column;
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)'};
          border: 1px solid ${c.border};
          border-radius: 20px;
          padding: 0.5rem;
          text-decoration: none;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease;
          will-change: transform;
        }
        
        .sovr-ad-card:hover {
          transform: translateY(-3px);
          border-color: ${c.accent};
        }
        
        .sovr-ad-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 21 / 9;
          border-radius: 14px;
          overflow: hidden;
          background: ${c.accentDim};
          flex-shrink: 0;
        }
        
        .sovr-ad-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }
        
        .sovr-ad-card:hover .sovr-ad-img {
          transform: scale(1.05);
        }
        
        .sovr-ad-content {
          display: flex;
          flex-direction: column;
          padding: 0.75rem 0.5rem 0.25rem 0.5rem;
          gap: 0.5rem;
        }
        
        .sovr-ad-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${c.textMuted};
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .sovr-ad-badge::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${c.accent};
        }
        
        .sovr-ad-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: ${c.text};
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        
        .sovr-ad-desc {
          font-family: 'Manrope', sans-serif;
          font-size: 0.8rem;
          color: ${c.textSub};
          margin: 0;
          line-height: 1.5;
          font-weight: 500;
        }
        
        .sovr-ad-cta {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
          color: ${c.text};
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
        }
        
        .sovr-ad-card:hover .sovr-ad-cta {
          background: ${c.text};
          color: ${c.bg};
        }

        @media (min-width: 768px) {
          .sovr-ad-card {
            flex-direction: row;
            align-items: center;
            gap: 1.25rem;
          }
          .sovr-ad-img-wrapper {
            width: 220px;
            aspect-ratio: 16 / 9;
            height: auto;
          }
          .sovr-ad-content {
            padding: 0.5rem 1rem 0.5rem 0;
            flex: 1;
          }
          .sovr-ad-title {
            font-size: 1.2rem;
          }
        }
      `}</style>

      <div style={{ marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.55rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: c.textMuted }}>
          Advertisement
        </span>
      </div>

      <a href={adLink} target="_blank" rel="noopener noreferrer" className="sovr-ad-card">
        <div className="sovr-ad-img-wrapper">
          <img src={adImage} alt="Sponsored Partner" className="sovr-ad-img" loading="lazy" />
        </div>
        
        <div className="sovr-ad-content">
          {/* Teks Bahasa Indonesia Dimulai dari sini */}
          <span className="sovr-ad-badge">Sponsor Resmi</span>
          <h4 className="sovr-ad-title">Ubah Trafik Menjadi Profit</h4>
          <p className="sovr-ad-desc">
            Maksimalkan pendapatan dari website Anda. Ubah setiap klik menjadi penghasilan nyata dengan teknologi monetisasi pintar berbasis AI.
          </p>
          
          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "0.25rem" }}>
             <div className="sovr-ad-cta">
              <span>Start Earning</span>
              <i className="ri-arrow-right-up-line" style={{ fontSize: "0.9rem", marginLeft: "6px" }} />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}