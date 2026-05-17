export const T: Record<string, any> = {
  dark: {
    bg: "#0d0d0f", surface: "#121214", surface2: "#18181c",
    glass: "rgba(18,18,20,0.8)", border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.13)", text: "#f0ece4",
    textSub: "rgba(240,236,228,0.42)", textMuted: "rgba(240,236,228,0.2)",
    amber: "#d4a853", amberDim: "rgba(212,168,83,0.1)", amberGlow: "rgba(212,168,83,0.06)",
    green: "#5fbf85", red: "#d96b6b", blue: "#6b9fd4",
    edBg: "#110f0a", edSurface: "#181410", edBorder: "rgba(212,168,83,0.15)",
  },
  light: {
    bg: "#fdf9f3", surface: "#fffdf8", surface2: "#f5f0e8",
    glass: "rgba(253,249,243,0.88)", border: "rgba(60,40,10,0.08)",
    borderHover: "rgba(60,40,10,0.18)", text: "#1a1510",
    textSub: "rgba(26,21,16,0.48)", textMuted: "rgba(26,21,16,0.25)",
    amber: "#b8891e", amberDim: "rgba(184,137,30,0.1)", amberGlow: "rgba(184,137,30,0.05)",
    green: "#2e8f5a", red: "#c04545", blue: "#3a6fa8",
    edBg: "#fdf5e4", edSurface: "#faf0d8", edBorder: "rgba(184,137,30,0.2)",
  },
};

export const TAG: Record<string, any> = {
  ai: { dark: { bg: "rgba(107,159,212,0.12)", color: "#6b9fd4", bar: "#6b9fd4" }, light: { bg: "rgba(58,111,168,0.1)", color: "#2a5a9a", bar: "#3a6fa8" } },
  kripto: { dark: { bg: "rgba(212,168,83,0.12)", color: "#d4a853", bar: "#d4a853" }, light: { bg: "rgba(184,137,30,0.1)", color: "#9a6e10", bar: "#b8891e" } },
  market: { dark: { bg: "rgba(95,191,133,0.1)", color: "#5fbf85", bar: "#5fbf85" }, light: { bg: "rgba(46,143,90,0.1)", color: "#1e6b40", bar: "#2e8f5a" } },
  defi: { dark: { bg: "rgba(180,140,220,0.1)", color: "#c49de0", bar: "#c49de0" }, light: { bg: "rgba(130,80,180,0.1)", color: "#7040b0", bar: "#9060d0" } },
};

export const FILTERS = ["Semua", "Kripto", "AI", "Market", "DeFi"];
export const FMAP: Record<string, string> = { Semua: "all", Kripto: "kripto", AI: "ai", Market: "market", DeFi: "defi" };

export const TICKERS = [
  { n: "BTC", p: "$98,240", c: "+2.4%", u: true }, { n: "ETH", p: "$3,812", c: "-0.8%", u: false },
  { n: "SOL", p: "$187.40", c: "+5.1%", u: true }, { n: "BNB", p: "$612.30", c: "+1.2%", u: true },
  { n: "AVAX", p: "$43.80", c: "+7.3%", u: true }, { n: "ADA", p: "$0.721", c: "-1.5%", u: false },
  { n: "LINK", p: "$18.60", c: "+2.8%", u: true }, { n: "NEAR", p: "$6.45", c: "+4.1%", u: true },
];