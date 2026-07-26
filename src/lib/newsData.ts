import { NewsArticle } from '../types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: "Pourquoi l'Or (XAU/USD) est l'actif reine des Scalpers en 2026",
    summary: "Découvrez les dynamiques macroéconomiques, l'impact des banques centrales et la volatilité intraday exceptionnelle qui font de l'Or le marché n°1 pour le scalping M1/M5.",
    content: `
L'or (XAU/USD) demeure le métal précieux le plus liquide et le plus réactif au monde. Pour les traders en court terme et scalpers, il offre des opportunités de mouvement rapides (souvent 30 à 100 pips en quelques minutes) durant les sessions de Londres et de New York.

### Les Facteurs Clés qui Dictent le Cours de l'Or :
1. **Les Taux d'Intérêt Réels & La Réserve Fédérale (FED) :** L'or ne versant aucun rendement intrinsèque (coupon ou dividende), toute perspective de baisse des taux américains rend l'or plus attractif par rapport au Dollar américain.
2. **L'Indice Dollar (DXY) :** L'or étant libellé en USD, toute faiblesse du billet vert propulse le cours du XAU/USD vers le haut (corrélation inverse forte).
3. **Achats Records des Banques Centrales :** La Banque de Chine (PBoC), la Banque d'Inde et plusieurs banques centrales émergentes accumulent des centaines de tonnes de lingots d'or pour diversifier leurs réserves de change.
4. **Volatilité Géopolitique :** En période de tensions diplomatiques ou de conflits mondiaux, l'or joue son rôle historique de **valeur refuge ultime**.
    `,
    category: 'MACRO',
    categoryLabel: 'Macroéconomie & Or',
    date: '26 Juillet 2026',
    readTime: '4 min',
    author: 'Analyse Macro XAU Terminal',
    tags: ['XAU/USD', 'Banques Centrales', 'Inflation', 'FED', 'Volatilité'],
  },
  {
    id: 'art-2',
    title: 'Le Guide Ultime du Scalping M1/M5 sur XAU/USD : Les Règles d\'Or',
    summary: 'Comprendre la mécanique du scalping haute fréquence, la gestion stricte du risque par lot, et la différence fondamentale avec le Swing Trading.',
    content: `
Le scalping consiste à exécuter des transactions de très courte durée (de quelques secondes à 15 minutes) pour capter de petites variations de prix avec un volume adapté et un risque parfaitement maîtrisé.

### Les 4 Piliers du Scalping sur l'Or :
- **1. La Discipline du Stop Loss Strict :** Sur l'or, un mouvement de spike peut balayer un compte sans SL. Chaque ticket émis sur notre terminal inclut obligatoirement un Stop Loss prédéfini.
- **2. Le Ratio Risque / Rendement (R:R) Minimum 1:1.50 :** Pour maintenir une rentabilité constante, vos gains moyens doivent dépasser vos pertes. Viser 30 à 50 pips de gain pour 20 pips de risque est une norme saine.
- **3. Le Calcul Précis du Lotage (Risk Management) :** Ne risquez jamais plus de 1% à 2% de votre capital sur un seul scalp. Utilisez notre calculateur de risque intégré pour déterminer la taille de lot exacte selon votre balance en FCFA ou USD.
- **4. Scalping vs Swing Trading :** Contrairement au Swing Trader qui garde ses positions des jours durant en subissant les coûts de Swap nocturne, le Scalper ferme toutes ses positions avant la fin de session et ne subit aucun risque overnight.
    `,
    category: 'SCALPING_GUIDE',
    categoryLabel: 'Pédagogie Scalping',
    date: '25 Juillet 2026',
    readTime: '6 min',
    author: 'Formateur Senior Trading',
    tags: ['Guide Scalping', 'Gestion du Risque', 'Stop Loss', 'Ratio RR', 'M1/M5'],
  },
  {
    id: 'art-3',
    title: 'Analyse Technique du Jour : Pivot à $2,385, Résistance Clé à $2,400',
    summary: 'Cartographie technique du XAU/USD pour la session de New York. Niveaux d\'entrée institutionnels, zones de liquidité et supports d\'acheteurs.',
    content: `
La dynamique actuelle du XAU/USD montre une consolidation acheteuse au-dessus du niveau pivot des $2,385.00. Les carnets d'ordres institutionnels indiquent une accumulation de buy-stops sous $2,374.

### Niveaux Récents à Surveiller :
- **Résistance R1 :** $2,398.80 – $2,400.00 (Zone psychologique majeure)
- **Point Pivot Neutre :** $2,385.50
- **Support S1 :** $2,374.10 (Zone de rejet des paires d'acheteurs)
- **Recommandation Scalp :** Privilégier les réintégrations au-dessus du VWAP en session de Londres/NY avec confirmation de bougies de rejet M1/M5.
    `,
    category: 'ANALYSIS',
    categoryLabel: 'Analyse Technique',
    date: '26 Juillet 2026',
    readTime: '3 min',
    author: 'Chief Technical Analyst',
    tags: ['Analyse Technique', 'Niveaux Pivot', 'Support', 'Résistance', 'VWAP'],
  },
  {
    id: 'art-4',
    title: 'Success Story : Comment les Fonds Quantitatifs Exploite les Kassas d\'Or en 2026',
    summary: 'Retour sur les stratégies de trading algorithmique et d\'arbitrage de spreads qui ont permis aux traders institutionnels de réaliser des performances historiques sur le bullion.',
    content: `
En 2026, l'industrie des hedge funds a enregistré des profits records sur les matières premières, tirés par la hausse soutenue et les micro-cassures de l'or.

Les modèles algorithmiques quantitatifs exploitent les anomalies d'exécution à haute fréquence (HFT) autour des annonces de chiffres d'emploi américains (NFP) et d'inflation (CPI). 

Ces données démontrent que les traders individuels dotés d'outils de détection de signaux en temps réel et respectant des règles d'exécution rigoureuses parviennent à s'aligner sur les flux de trésorerie institutionnels.
    `,
    category: 'STORIES',
    categoryLabel: 'Actualités & Performance',
    date: '24 Juillet 2026',
    readTime: '5 min',
    author: 'Éditorial Finance Mondiale',
    tags: ['Hedge Funds', 'Institutional Flow', 'NFP', 'CPI', 'Performance'],
  },
];
