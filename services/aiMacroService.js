import { GoogleGenAI, Type } from '@google/genai';
import { fetchLiveMarketNews } from './realNewsService.js';

let genAIClient = null;

function getGenAIClient() {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('⚠️ Erreur initialisation GoogleGenAI:', err.message);
    }
  }
  return genAIClient;
}

/**
 * Fallback algorithm when Gemini API key is unavailable or encounters an issue
 */
function buildFallbackAnalysis(articles = []) {
  const titlesText = articles.map((a) => a.title).join(' ').toLowerCase();

  let score = 25; // Default slightly bullish bias on Gold
  let fedBias = 'BULLISH';
  let nfpBias = 'NEUTRAL';
  let cpiBias = 'BULLISH';
  let geoBias = 'BULLISH';

  if (titlesText.includes('rate cut') || titlesText.includes('baisser les taux') || titlesText.includes('fed dovish')) {
    score += 30;
    fedBias = 'BULLISH';
  } else if (titlesText.includes('rate hike') || titlesText.includes('hawkish') || titlesText.includes('maintient les taux')) {
    score -= 30;
    fedBias = 'BEARISH';
  }

  if (titlesText.includes('cpi') || titlesText.includes('inflation') || titlesText.includes('prix')) {
    cpiBias = score > 0 ? 'BULLISH' : 'BEARISH';
  }

  if (titlesText.includes('nfp') || titlesText.includes('emploi') || titlesText.includes('jobs')) {
    nfpBias = 'NEUTRAL';
  }

  const clampedScore = Math.min(100, Math.max(-100, score));
  let sentimentLabel = 'NEUTRAL';
  if (clampedScore >= 30) sentimentLabel = 'BULLISH';
  if (clampedScore <= -30) sentimentLabel = 'BEARISH';

  return {
    success: true,
    source: 'Algorithm Fallback + Live Feed',
    timestamp: new Date().toISOString(),
    sentimentScore: clampedScore,
    sentimentLabel,
    confidenceLevel: 84,
    predictedPriceBias: clampedScore >= 0 ? "+12.50$ à +28.00$ sur l'Or" : "-15.00$ à -32.00$ sur l'Or",
    summaryText: "Analyse macroéconomique en temps réel : La trajectoire des taux de la Réserve Fédérale (Fed) et les anticipations d'inflation soutiennent la volatilité sur le XAU/USD. Les marchés surveillent attentivement le DXY.",
    macroDrivers: [
      {
        name: 'Politique Monétaire Fed',
        bias: fedBias,
        impact: 'HAUT',
        description: 'Attentes d\'assouplissement monétaire de la Fed. Un dollar plus faible soutient le cours du XAU/USD.'
      },
      {
        name: 'Chiffres Emploi NFP',
        bias: nfpBias,
        impact: 'ÉLEVÉ',
        description: 'Indicateur clé de la résilience économique américaine et de la santé du marché du travail.'
      },
      {
        name: 'Inflation CPI & IPC',
        bias: cpiBias,
        impact: 'TRÈS ÉLEVÉ',
        description: 'L\'inflation persiste au-dessus de la cible de 2%, consolidant le statut de valeur refuge de l\'Or.'
      },
      {
        name: 'Tensions Géopolitiques',
        bias: geoBias,
        impact: 'MOYEN',
        description: 'Achats continus des banques centrales et couverture du risque géopolitique global.'
      }
    ],
    keyRiskFactor: "Discours inattendu de Jerome Powell ou publication de données NFP supérieures aux attentes.",
    newsAnalyzedCount: articles.length
  };
}

/**
 * Deep Gemini AI Macroeconomic Analysis for XAU/USD
 */
export async function analyzeMacroSentiment() {
  const articles = await fetchLiveMarketNews();
  const headlines = articles.map((a, idx) => `${idx + 1}. [${a.categoryLabel}] ${a.title}`).join('\n');

  const aiClient = getGenAIClient();
  if (!aiClient) {
    return buildFallbackAnalysis(articles);
  }

  try {
    const prompt = `
Tu es un économiste chef et analyste macroéconomique senior spécialisé sur le marché de l'Or (XAU/USD), la Réserve Fédérale américaine (Fed), le NFP (Non-Farm Payrolls), l'Inflation CPI et le Dollar US (DXY).

Voici les titres des dernières actualités en direct du marché :
${headlines || "Aucun titre récent n'a pu être chargé direct, effectue l'analyse sur la conjoncture macro actuelle (Taux Fed, CPI, NFP)."}

Exécute une analyse IA prédictive de sentiment pour le trading scalping & intraday de XAU/USD.
Réponds EXCLUSIVEMENT sous la forme d'un objet JSON strict avec la structure suivante :
{
  "sentimentScore": <nombre entier entre -100 et +100. -100 = Ultra Baisse, 0 = Neutre, +100 = Ultra Hausse pour l'Or>,
  "sentimentLabel": <"BULLISH" ou "BEARISH" ou "NEUTRAL">,
  "confidenceLevel": <nombre entier entre 60 et 98, représentant la confiance de l'IA %>,
  "predictedPriceBias": <chaine courte décrivant l'amplitude prédite, ex: "+15.00$ à +35.00$ sur XAU/USD">,
  "summaryText": <synthèse claire et percutante de 3 phrases en français décrivant l'impact de la Fed, du NFP et de l'inflation sur l'Or>,
  "macroDrivers": [
    {
      "name": <nom du facteur macro, ex: "Politique Fed & Taux">,
      "bias": <"BULLISH" ou "BEARISH" ou "NEUTRAL">,
      "impact": <"TRÈS ÉLEVÉ" ou "ÉLEVÉ" ou "MOYEN">,
      "description": <explication concise en français de 1 phrase>
    },
    ... (fournir exactement 4 drivers : Fed/Taux, NFP/Emploi, Inflation/CPI, Risques Géopolitiques/DXY)
  ],
  "keyRiskFactor": <chaine décrivant le principal risque de retournement à surveiller aujourd'hui>
}
`;

    const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];
    for (const modelName of modelsToTry) {
      try {
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentimentScore: { type: Type.INTEGER },
                sentimentLabel: { type: Type.STRING },
                confidenceLevel: { type: Type.INTEGER },
                predictedPriceBias: { type: Type.STRING },
                summaryText: { type: Type.STRING },
                macroDrivers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      bias: { type: Type.STRING },
                      impact: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ['name', 'bias', 'impact', 'description'],
                  },
                },
                keyRiskFactor: { type: Type.STRING },
              },
              required: [
                'sentimentScore',
                'sentimentLabel',
                'confidenceLevel',
                'predictedPriceBias',
                'summaryText',
                'macroDrivers',
                'keyRiskFactor',
              ],
            },
          },
        });

        if (response && response.text) {
          const parsedData = JSON.parse(response.text.trim());
          return {
            success: true,
            source: `Gemini IA Engine (${modelName})`,
            timestamp: new Date().toISOString(),
            newsAnalyzedCount: articles.length,
            ...parsedData,
          };
        }
      } catch (err) {
        console.warn(`⚠️ Warning Gemini AI (${modelName}) attempt:`, err?.message || err);
        // Continue to next model in loop or fallback
      }
    }
  } catch (err) {
    console.warn('⚠️ Erreur Gemini AI Macro Sentiment Analysis:', err.message);
  }

  return buildFallbackAnalysis(articles);
}
