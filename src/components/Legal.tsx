import { T } from "../theme";

const MR = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'Manrope', sans-serif",
  ...extra,
});

export function LegalPage({ type, theme }: { type: string; theme: string }) {
  const c = T[theme];

  // Konten dinamis berdasarkan rute URL
  const getContent = () => {
    switch (type) {
      case "about":
        return {
          title: "About SOVR",
          subtitle: "The Next-Gen Intelligence Hub.",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          icon: "ri-information-line"
        };
      case "privacy-policy":
        return {
          title: "Privacy Policy",
          subtitle: "Your data. Secured. Period.",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Virtual networks and encrypted spaces. Tempor incididunt ut labore et dolore magna aliqua. Privacy is not an option, it is a fundamental right. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          icon: "ri-shield-keyhole-line"
        };
      case "contact":
        return {
          title: "Contact Us",
          subtitle: "Drop a line. Let's build the future.",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. For partnerships, media inquiries, or technical support, feel free to reach out to our team at any time.",
          icon: "ri-mail-send-line"
        };
      default:
        return { title: "", subtitle: "", body: "", icon: "" };
    }
  };

  const data = getContent();

  return (
    <div style={{ animation: "fadeIn 0.5s ease", maxWidth: 680, margin: "0 auto", padding: "2rem 0 6rem" }}>
      
      {/* Header Halaman Legal */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16, marginBottom: "4rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: c.accentDim, display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, fontSize: "1.5rem" }}>
          <i className={data.icon} />
        </div>
        <div>
          <h1 style={MR({ fontSize: "2.5rem", fontWeight: 800, color: c.text, margin: "0 0 0.5rem 0", letterSpacing: "-0.03em" })}>
            {data.title}<span style={{ color: c.accent }}>.</span>
          </h1>
          <p style={MR({ fontSize: "1rem", color: c.textSub, fontWeight: 600, opacity: 0.6, margin: 0 })}>
            {data.subtitle}
          </p>
        </div>
      </div>

      {/* Box Konten ala Bento Box */}
      <div style={{ background: theme === "dark" ? "rgba(255,255,255,0.02)" : c.bg, border: `1px solid ${c.border}`, borderRadius: 24, padding: "2.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
        <p style={MR({ fontSize: "1rem", color: c.text, lineHeight: 1.8, fontWeight: 500, whiteSpace: "pre-wrap", margin: 0, opacity: 0.9 })}>
          {data.body}
        </p>

        {/* Jika halaman kontak, tambahkan info tambahan yang estetik */}
        {type === "contact" && (
          <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px dashed ${c.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i className="ri-mail-line" style={{ color: c.accent }} />
              <span style={MR({ fontSize: "0.9rem", fontWeight: 700, color: c.text })}>hello@sovr.news</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <i className="ri-telegram-line" style={{ color: c.accent }} />
              <span style={MR({ fontSize: "0.9rem", fontWeight: 700, color: c.text })}>@sovr_official</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}