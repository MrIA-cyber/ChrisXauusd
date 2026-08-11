# Directives CHRIS XAUUSD App

## 1. Règle Absolue du Taux de Réussite (Winrate / Probabilités)
- Tous les taux de réussite, probabilités de setup et indicateurs statistiques sur l'application CHRIS XAUUSD doivent être strictement compris entre **90% et 96%** (avec un winrate moyen affiché de **93.8%**).
- Aucun chiffre ou statistique de probabilité ne doit jamais être généré par hasard (`Math.random()`) ou descendre en dessous de 90%.
- Toutes les données historiques (`mockData.ts`), avis utilisateurs (`UserReviewsSection.tsx`), tickets de trading (`TradeTicket.tsx`), cartes de signaux (`SignalCard.tsx`), et bannières (`LivePriceBanner.tsx`) doivent respecter impérativement cette plage [90% - 96%].

## 2. Filtre Strict "NO TRADE"
- La fonction `validateSetupConditions` dans `marketEngine.ts` doit appliquer le filtre strict **NO TRADE** si les 4 à 5 conditions de confluence (structure M5/M15, Order Block / Fibo, momentum RSI/MACD, session/spread, alignement MTF) ne sont pas validées à 100%.
- Quand les conditions ne sont pas remplies, l'application doit passer en état **"NO TRADE / CONSOLIDATION"** et bloquer toute prise de position.

## 3. Thèmes, Couleurs & Polices Dynamiques (Système de 3 Thèmes Intact)
- Le système de **3 thèmes horaires** (Bleu Navy / Alex Brush, Orange Obsidian / Calligraffiti, Or Jaune / Lovers Quarrel) géré dans `src/utils/hourlyTheme.ts` et `src/index.css` doit rester **100% intact, personnalisable et entièrement fonctionnel**.
- L'utilisateur doit toujours pouvoir basculer manuellement entre les thèmes (Bleu, Orange, Jaune) ou utiliser le mode automatique horaire GMT via le sélecteur dans le header et le menu de configuration (`TerminalHeader.tsx`, `chrisxauusd_theme_override`).
- Ne jamais supprimer les variables CSS de thèmes (`--hourly-font`, `--theme-accent`, `--theme-bg-main`, `--theme-bg-card`, `--theme-border-card`) ni altérer l'injection dynamique des classes (`theme-bleu`, `theme-orange`, `theme-jaune`).
