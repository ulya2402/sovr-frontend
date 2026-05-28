// --- AWAL PERUBAHAN: src/components/Author.tsx ---
import { T } from "../theme";
import { Card } from "./Cards";
import { PerspectiveCard } from "./Perspective";
import { slugify } from "../App";

function SocialLink({ icon, url, theme }: { icon: string; url: string; theme: string }) {
  const c = T[theme];
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: "10px", // Squircle yang lebih presisi
        background: "transparent",
        color: c.textMuted,
        textDecoration: "none",
        border: `1px solid ${c.border}`,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, background-color, border-color, color, box-shadow",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = c.bg;
        e.currentTarget.style.background = c.text;
        e.currentTarget.style.borderColor = c.text;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = theme === 'dark' ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = c.textMuted;
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <i className={icon} style={{ fontSize: "1.05rem" }} />
    </a>
  );
}

export function AuthorProfile({ author, articles, perspectives, theme }: any) {
  const c = T[theme];

  const handlePerspectiveClick = (title: string) => {
    window.history.pushState({}, '', `/perspectives/${slugify(title)}`);
    window.dispatchEvent(new Event('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="ap-wrapper">
      <style>{`
        @keyframes smoothFadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .ap-wrapper {
          display: flex;
          flex-direction: column;
          animation: smoothFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          padding-bottom: 2rem;
          
          /* PERBAIKAN: Jarak atas dan pembatasan lebar agar presisi */
          margin-top: 2rem; 
          max-width: 760px; 
          margin-left: auto;
          margin-right: auto;
          width: 100%;
        }

        /* --- Header Profil --- */
        .ap-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid ${c.border};
        }

        .ap-top {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (min-width: 640px) {
          .ap-top {
            flex-direction: row;
            align-items: center;
          }
        }

        /* --- Efek Ring Avatar --- */
        .ap-avatar-box {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          padding: 3px;
          border: 1px dashed ${c.border};
          flex-shrink: 0;
          transition: border-color 0.4s;
        }
        
        .ap-avatar-box:hover {
          border-color: ${c.accent};
        }

        .ap-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: ${c.accentDim};
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ap-avatar-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* --- Tipografi Header --- */
        .ap-title-box {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .ap-role {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: ${c.accent};
        }

        .ap-name {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.2rem);
          font-weight: 800;
          color: ${c.text};
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .ap-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: ${c.textMuted};
          margin-top: 6px;
        }

        .ap-bio {
          font-family: 'Manrope', sans-serif;
          font-size: 0.95rem;
          color: ${c.textSub};
          line-height: 1.65;
          font-weight: 500;
          max-width: 100%;
          margin: 0;
        }

        .ap-socials {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.2rem;
        }

        /* --- Body Konten --- */
        .ap-section {
          margin-bottom: 3.5rem;
          animation: smoothFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ap-section-head {
          margin-bottom: 1.5rem;
        }

        .ap-eyebrow {
          font-family: 'Manrope', sans-serif;
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: ${c.accent};
          display: block;
          margin-bottom: 0.25rem;
        }

        .ap-section-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: ${c.text};
          margin: 0;
          letter-spacing: -0.02em;
        }

        .ap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .ap-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
      `}</style>

      {/* --- HEADER PENULIS --- */}
      <header className="ap-header">
        <div className="ap-top">
          <div className="ap-avatar-box">
            <div className="ap-avatar-inner">
              {author.avatar_url ? (
                <img src={author.avatar_url} alt={author.name} />
              ) : (
                <i className="ri-user-smile-line" style={{ fontSize: "2rem", color: c.textMuted }} />
              )}
            </div>
          </div>
          
          <div className="ap-title-box">
            <span className="ap-role">Author Profile</span>
            <h1 className="ap-name">{author.name}<span style={{ color: c.accent }}>.</span></h1>
            <div className="ap-stats">
              <span><i className="ri-book-open-line" style={{ marginRight: 4 }}/> {perspectives.length} Perspectives.</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span><i className="ri-flashlight-line" style={{ marginRight: 4 }}/> {articles.length} Feeds</span>
            </div>
          </div>
        </div>

        {author.bio ? (
          <p className="ap-bio">{author.bio}</p>
        ) : (
          <p className="ap-bio" style={{ fontStyle: "italic", color: c.textMuted }}>Penulis ini belum menambahkan biografinya.</p>
        )}

        <div className="ap-socials">
          {author.twitter   && <SocialLink icon="ri-twitter-x-line"  url={author.twitter}   theme={theme} />}
          {author.linkedin  && <SocialLink icon="ri-linkedin-fill"   url={author.linkedin}  theme={theme} />}
          {author.instagram && <SocialLink icon="ri-instagram-line"  url={author.instagram} theme={theme} />}
          {author.facebook  && <SocialLink icon="ri-facebook-circle-fill" url={author.facebook}  theme={theme} />}
          {author.telegram  && <SocialLink icon="ri-telegram-fill"   url={author.telegram}  theme={theme} />}
          {author.threads   && <SocialLink icon="ri-threads-line"    url={author.threads}   theme={theme} />}
        </div>
      </header>

      {/* --- DAFTAR ARTIKEL --- */}
      <main>
        {perspectives.length > 0 && (
          <section className="ap-section" style={{ animationDelay: "100ms" }}>
            <div className="ap-section-head">
              <span className="ap-eyebrow">Editorial</span>
              <h3 className="ap-section-title">Deep Dives</h3>
            </div>
            <div className="ap-grid">
              {perspectives.map((art: any) => (
                <PerspectiveCard key={art.id} article={art} theme={theme} onClick={() => handlePerspectiveClick(art.title)} />
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="ap-section" style={{ animationDelay: "200ms", marginBottom: 0 }}>
            <div className="ap-section-head">
              <span className="ap-eyebrow">Market & Tech</span>
              <h3 className="ap-section-title">Feed Updates</h3>
            </div>
            <div className="ap-list">
              {articles.map((card: any, i: number) => (
                <Card key={card.id} card={card} theme={theme} idx={i} />
              ))}
            </div>
          </section>
        )}

        {/* --- EMPTY STATE --- */}
        {articles.length === 0 && perspectives.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", border: `1px dashed ${c.border}`, borderRadius: 20, background: c.accentDim, animationDelay: "100ms" }}>
            <i className="ri-folder-open-line" style={{ fontSize: "2.5rem", color: c.textMuted, margin: "0 auto 1rem auto", display: "block" }} />
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.95rem", color: c.textSub, fontWeight: 600 }}>
              Belum ada rekam jejak publikasi dari penulis ini.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
// --- BATAS PERUBAHAN ---