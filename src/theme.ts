export const FILTERS = ["Semua", "Market", "AI", "Kripto", "DeFi"];
export const FMAP: any = { "Market": "market", "AI": "ai", "Kripto": "kripto", "DeFi": "defi" };

// MENGGUNAKAN PALET MINIMALIS ANDA
// ["f7f7f7","383838","a0a0a0","6f6f6f","d7d7d7","bdbdbd","888888","555555"]

export const T: any = {
  light: {
    bg: "#f7f7f7",
    text: "#383838",
    textSub: "#555555",
    textMuted: "#888888",
    border: "#d7d7d7",
    edBorder: "#bdbdbd",
    glass: "rgba(247, 247, 247, 0.85)",
    accent: "#383838", // Warna aksen di mode terang adalah gelap
    accentDim: "rgba(56, 56, 56, 0.06)",
    up: "#383838", // Harga naik (gelap pekat)
    down: "#a0a0a0" // Harga turun (abu-abu pudar)
  },
  dark: {
    bg: "#383838",
    text: "#f7f7f7",
    textSub: "#d7d7d7",
    textMuted: "#a0a0a0",
    border: "#6f6f6f",
    edBorder: "#555555",
    glass: "rgba(56, 56, 56, 0.85)",
    accent: "#f7f7f7", // Warna aksen di mode gelap adalah putih
    accentDim: "rgba(247, 247, 247, 0.08)",
    up: "#f7f7f7", // Harga naik (putih terang)
    down: "#888888" // Harga turun (abu-abu gelap)
  }
};