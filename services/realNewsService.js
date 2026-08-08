import axios from 'axios';

/**
 * Clean HTML tags from RSS descriptions
 */
function cleanText(rawText = '') {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Format date string into relative time or localized French format
 */
function formatDate(pubDateStr) {
  try {
    const d = new Date(pubDateStr);
    if (isNaN(d.getTime())) return 'Récemment';

    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));

    if (diffMin < 60) {
      return `Il y a ${Math.max(1, diffMin)} min`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return `Il y a ${diffHours} h`;
    }
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (err) {
    return 'Récemment';
  }
}

/**
 * Fetch live real financial news via RSS feeds
 */
export async function fetchLiveMarketNews() {
  const rssUrls = [
    'https://news.google.com/rss/search?q=XAUUSD+Or+cours+Fed+Forex+Trading&hl=fr&gl=FR&ceid=FR:fr',
    'https://news.google.com/rss/search?q=Gold+price+XAUUSD+Fed+inflation&hl=en-US&gl=US&ceid=US:en',
  ];

  const articles = [];

  for (const url of rssUrls) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 6000,
      });

      const xmlData = response.data || '';
      
      // Parse <item> elements using Regex
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match;

      while ((match = itemRegex.exec(xmlData)) !== null) {
        const itemContent = match[1];

        const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(itemContent);
        const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemContent);
        const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemContent);
        const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/i.exec(itemContent);

        const rawTitle = titleMatch ? titleMatch[1] : '';
        const rawLink = linkMatch ? linkMatch[1] : '';
        const rawPubDate = pubDateMatch ? pubDateMatch[1] : '';
        const rawSource = sourceMatch ? sourceMatch[1] : 'Source Financière Directe';

        const title = cleanText(rawTitle);
        if (!title || articles.some((a) => a.title === title)) continue;

        // Categorize article dynamically
        let category = 'MACRO';
        let categoryLabel = 'Macroéconomie & Or';

        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('analyse') || lowerTitle.includes('support') || lowerTitle.includes('résistance') || lowerTitle.includes('chart') || lowerTitle.includes('technique')) {
          category = 'ANALYSIS';
          categoryLabel = 'Analyse Technique Live';
        } else if (lowerTitle.includes('fed') || lowerTitle.includes('inflation') || lowerTitle.includes('cpi') || lowerTitle.includes('taux') || lowerTitle.includes('nfp')) {
          category = 'MACRO';
          categoryLabel = 'Macroéconomie FED';
        } else if (lowerTitle.includes('scalp') || lowerTitle.includes('trading') || lowerTitle.includes('forex') || lowerTitle.includes('broker')) {
          category = 'SCALPING_GUIDE';
          categoryLabel = 'Marché & Trading';
        } else {
          category = 'STORIES';
          categoryLabel = 'Actualités Marché En Direct';
        }

        articles.push({
          id: `live-news-${articles.length + 1}-${Date.now()}`,
          title: title,
          summary: `Fil d'actualité en direct répertorié par ${cleanText(rawSource)}. Cliquez sur le bouton pour consulter l'analyse complète source.`,
          content: `Titre original : ${title}\nSource officielle : ${cleanText(rawSource)}\n\nL'actualité financière en direct impacte le marché du XAU/USD (Or) et l'indice Dollar DXY. Les mouvements en découlant directement influencent le momentum en unité de temps M1/M5.`,
          category: category,
          categoryLabel: categoryLabel,
          date: formatDate(rawPubDate),
          readTime: '2 min',
          author: cleanText(rawSource),
          sourceUrl: cleanText(rawLink),
          isLiveReal: true,
          tags: ['Actualité Réelle', 'Live Market', 'XAU/USD', cleanText(rawSource).split(' ')[0]],
        });

        if (articles.length >= 10) break;
      }

    } catch (err) {
      console.warn(`[RealNewsService] Erreur lors de la récupération RSS depuis ${url}:`, err.message);
    }

    if (articles.length >= 8) break;
  }

  return articles;
}
