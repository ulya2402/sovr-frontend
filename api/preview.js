// FULL KODE: sovr-frontend-main/api/preview.js
export default async function handler(req, res) {
  // Menangkap path url yang sedang dibagikan (misal: feed/judul-artikel)
  const path = req.query.path || ""; 
  
  let title = "SOVR. | Portal Informasi Masa Depan";
  let desc = "Pembaruan seputar ekosistem AI, Market, Web3, dan Teknologi Terkini dengan kurasi eksklusif.";
  let image = "https://via.placeholder.com/1200x630/383838/f7f7f7.png?text=SOVR.+Insight"; // Gambar default jika tidak ada

  try {
    if (path.startsWith('feed/')) {
      const slug = path.split('/')[1];
      const apiRes = await fetch("https://backend-sovr.botgampang123.workers.dev/api/articles");
      const articles = await apiRes.json();
      const article = articles.find(a => (a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) === slug);
      
      if (article) {
        title = article.title;
        // Bersihkan teks dari tag HTML bawaan Telegram dan potong 150 karakter untuk deskripsi
        desc = article.body.replace(/<[^>]+>/g, '').substring(0, 150) + "...";
        if (article.source_logo && article.source_logo.startsWith("http")) {
          image = article.source_logo;
        }
      }
    } else if (path.startsWith('perspectives/')) {
      const slug = path.split('/')[1];
      const apiRes = await fetch("https://backend-sovr.botgampang123.workers.dev/api/perspectives");
      const perspectives = await apiRes.json();
      const article = perspectives.find(p => (p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) === slug);
      
      if (article) {
        title = article.title;
        desc = article.body.replace(/<[^>]+>/g, '').substring(0, 150) + "...";
        if (article.image_url) {
          image = article.image_url;
        }
      }
    }
  } catch (error) {
    console.error("Gagal mengambil data untuk preview bot:", error);
  }

  // Merender HTML statis yang SANGAT disukai Bot Telegram/Twitter
  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      
      <meta property="og:type" content="article">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${image}">
      <meta property="og:site_name" content="SOVR.">
      
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${desc}">
      <meta name="twitter:image" content="${image}">
    </head>
    <body>
      <p>Mengarahkan ke artikel SOVR... <a href="/${path}">Klik jika tidak berpindah otomatis.</a></p>
      <script>window.location.replace("/${path}");</script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Cache super cepat di Edge Network Vercel
  res.send(html);
}