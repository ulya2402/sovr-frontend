export default async function handler(req, res) {
  const path = req.query.path || ""; 
  
  let title = "SOVR — Insight In Second";
  let desc = "Pembaruan seputar ekosistem AI, Market, Web3, dan Teknologi Terkini dengan kurasi eksklusif.";
  let image = "https://via.placeholder.com/1200x630/383838/f7f7f7.png?text=SOVR.+Insight";

  try {
    if (path.startsWith('feed/')) {
      const slug = path.split('/')[1];
      const apiRes = await fetch("https://backend-sovr.botgampang123.workers.dev/api/articles");
      const articles = await apiRes.json();
      const article = articles.find(a => (a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) === slug);
      
      if (article) {
        title = article.title;
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
    } else if (path.startsWith('vault')) {
      const slug = path.split('/')[1];
      
      if (slug) {
        const apiRes = await fetch("https://backend-sovr.botgampang123.workers.dev/api/vault");
        const tools = await apiRes.json();
        const tool = tools.find(t => (t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) === slug);
        
        if (tool) {
          title = `${tool.name} — SOVR Vault`;
          const toolDesc = tool.description || tool.desc || "Direktori Alat AI & Kripto terbaik.";
          desc = toolDesc.substring(0, 150) + "...";
          if (tool.image_url || tool.image) {
            image = tool.image_url || tool.image;
          }
        } else {
          title = "Direktori Alat AI & Kripto — SOVR";
          desc = "Kumpulan alat AI dan platform Web3 terbaik yang dikurasi khusus untuk produktivitas Anda.";
        }
      } else {
        title = "Direktori Alat AI & Kripto — SOVR";
        desc = "Kumpulan alat AI dan platform Web3 terbaik yang dikurasi khusus untuk produktivitas Anda.";
      }
    }
  } catch (error) {
    console.error("Failed to fetch data for bot preview:", error);
  }

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
      <p>Mengarahkan ke halaman SOVR... <a href="/${path}">Klik di sini jika tidak dialihkan otomatis.</a></p>
      <script>window.location.replace("/${path}");</script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.send(html);
}