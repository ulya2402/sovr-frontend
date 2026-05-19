import { T } from "../theme";

const MR = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: "'Manrope', sans-serif",
  ...extra,
});

export function LegalPage({
  type,
  theme,
}: {
  type: string;
  theme: string;
}) {
  const c = T[theme];

  const getContent = () => {
    switch (type) {
      case "about":
        return {
          label: "Discovery",
          title: "The Intelligence Hub",
          desc: "SOVR adalah platform kurasi informasi masa depan yang dirancang untuk mereka yang menghargai kecepatan, akurasi, dan estetika tinggi.",
          content: [
            {
              h: "Visi Kami",
              p: "Menjadi jembatan antara kompleksitas teknologi dan kemudahan akses informasi bagi generasi digital yang bergerak cepat.",
            },
            {
              h: "Kurasi Manusia",
              p: "Di SOVR, kami tidak hanya mengandalkan algoritma mentah. Setiap berita pilihan editor dikurasi langsung oleh tim analis untuk memastikan kualitas narasi, kedalaman sudut pandang, dan kebebasan dari bias informasi.",
            },
          ],
          icon: "ri-focus-3-line",
        };

      case "privacy-policy":
        return {
          label: "Security",
          title: "Privacy Protocol",
          desc: "Kami percaya bahwa privasi bukanlah sebuah opsi atau fitur tambahan, melainkan hak asasi mendasar di dalam ruang digital.",
          content: [
            {
              h: "Data Anonim & Minimasi",
              p: "Sistem SOVR dirancang untuk meminimalisir pelacakan jejak digital. Kami tidak mengumpulkan data pribadi yang tidak diperlukan, dan kami berkomitmen 100% untuk tidak pernah menjual data Anda kepada pihak ketiga.",
            },
            {
              h: "Penyimpanan Preferensi (Cookies)",
              p: "Kami hanya memanfaatkan penyimpanan lokal (cookie esensial) untuk mengingat preferensi tema Anda (Light atau Dark Mode). Tidak ada cookie pelacakan iklan lintas situs yang tertanam di platform kami.",
            },
          ],
          icon: "ri-shield-flash-line",
        };

      case "contact":
        return {
          label: "Connection",
          title: "Get In Touch",
          desc: "Punya ide kolaborasi gila, kritik membangun, atau sekadar ingin menyapa? Pintu digital kami selalu terbuka untuk Anda.",
          content: [],
          icon: "ri-chat-smile-3-line",
        };

      default:
        return {
          label: "",
          title: "",
          desc: "",
          content: [],
          icon: "",
        };
    }
  };

  const data = getContent();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 680,
        margin: "0 auto",
        padding:
          "clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 1.5rem) 5rem",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          textAlign: "left",
          marginBottom: "clamp(2.2rem, 6vw, 3.5rem)",
          animation:
            "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        <div
          style={MR({
            display: "inline-flex",
            alignItems: "center",
            gap: 8,

            background: c.accentDim,
            color: c.accent,

            padding: "0.48rem 0.95rem",
            borderRadius: 100,

            fontSize: "clamp(0.68rem, 1.8vw, 0.74rem)",
            fontWeight: 800,

            textTransform: "uppercase",
            letterSpacing: "0.12em",

            marginBottom: "1.25rem",
          })}
        >
          <i className={data.icon} />
          {data.label}
        </div>

        <h1
          style={MR({
            fontSize: "clamp(2.2rem, 7vw, 3.4rem)",
            fontWeight: 800,
            color: c.text,

            lineHeight: 1.08,
            letterSpacing: "-0.04em",

            margin: "0 0 1rem 0",

            textWrap: "balance",
          })}
        >
          {data.title}
          <span style={{ color: c.accent }}>.</span>
        </h1>

        <p
          style={MR({
            fontSize: "clamp(0.98rem, 3vw, 1.08rem)",
            color: c.textSub,

            lineHeight: 1.72,
            fontWeight: 500,

            maxWidth: 560,

            opacity: 0.92,
            margin: 0,

            textWrap: "pretty",
          })}
        >
          {data.desc}
        </p>
      </header>

      {/* CONTENT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          gap: "clamp(1.8rem, 5vw, 2.6rem)",

          animation:
            "fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both",
        }}
      >
        {data.content.map((item, i) => (
          <section
            key={i}
            style={{
              borderLeft: `2px solid ${c.border}`,
              paddingLeft: "clamp(1rem, 3vw, 1.25rem)",
            }}
          >
            <h2
              style={MR({
                fontSize: "clamp(1rem, 2.4vw, 1.08rem)",
                fontWeight: 800,

                color: c.text,

                margin: "0 0 0.55rem 0",

                letterSpacing: "-0.01em",
              })}
            >
              {item.h}
            </h2>

            <p
              style={MR({
                fontSize: "clamp(0.96rem, 2.8vw, 1rem)",
                color: c.textSub,

                lineHeight: 1.82,
                fontWeight: 500,

                opacity: 0.9,
                margin: 0,

                textWrap: "pretty",
              })}
            >
              {item.p}
            </p>
          </section>
        ))}

        {/* CONTACT GRID */}
        {type === "contact" && (
          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",

              gap: 16,
            }}
          >
            {[
              {
                label: "Email Support",
                val: "hello@sovr.news",
                icon: "ri-mail-line",
                href: "mailto:hello@sovr.news",
              },
              {
                label: "Telegram Hub",
                val: "@sovr_official",
                icon: "ri-telegram-line",
                href: "https://t.me/sovr_official",
              },
              {
                label: "Twitter / X",
                val: "@sovr_news",
                icon: "ri-twitter-x-line",
                href: "https://x.com/sovr_news",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "none",

                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",

                  minHeight: 140,

                  background:
                    theme === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.015)",

                  padding: "1.35rem",

                  borderRadius: 20,
                  border: `1px solid ${c.border}`,

                  transition:
                    "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",

                  boxSizing: "border-box",

                  willChange: "transform",
                  WebkitTapHighlightColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.borderColor = c.accent;
                    e.currentTarget.style.transform =
                      "translateY(-4px)";
                    e.currentTarget.style.background =
                      theme === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.025)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = c.border;
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.background =
                    theme === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.015)";
                }}
              >
                <div>
                  <i
                    className={item.icon}
                    style={{
                      color: c.accent,
                      fontSize: "1.2rem",

                      marginBottom: "0.9rem",

                      display: "block",
                    }}
                  />

                  <span
                    style={MR({
                      display: "block",

                      fontSize:
                        "clamp(0.68rem, 1.8vw, 0.72rem)",

                      fontWeight: 800,

                      textTransform: "uppercase",

                      color: c.textMuted,

                      letterSpacing: "0.06em",

                      marginBottom: 5,
                    })}
                  >
                    {item.label}
                  </span>
                </div>

                <span
                  style={MR({
                    fontSize: "0.94rem",
                    fontWeight: 700,

                    color: c.text,

                    overflowWrap: "break-word",

                    lineHeight: 1.5,
                  })}
                >
                  {item.val}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "clamp(4rem, 8vw, 5.5rem)",

          paddingTop: "1.5rem",

          borderTop: `1px solid ${c.border}`,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          flexWrap: "wrap",
          rowGap: 10,

          animation: "fadeIn 0.8s ease 0.4s both",
        }}
      >
        <span
          style={MR({
            fontSize: "clamp(0.68rem, 1.8vw, 0.72rem)",

            fontWeight: 700,

            textTransform: "uppercase",

            color: c.textMuted,

            letterSpacing: "0.03em",
          })}
        >
          Last Updated: May 2026
        </span>

        <span
          style={MR({
            fontSize: "clamp(0.68rem, 1.8vw, 0.72rem)",

            fontWeight: 700,

            textTransform: "uppercase",

            color: c.textMuted,

            letterSpacing: "0.03em",
          })}
        >
          SOVR HQ
        </span>
      </footer>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0,20px,0);
          }

          to {
            opacity: 1;
            transform: translate3d(0,0,0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}