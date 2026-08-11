export type HourlyThemeId = 'bleu' | 'orange' | 'jaune';
export type ThemeOverrideMode = 'auto' | HourlyThemeId;

export interface HourlyThemeConfig {
  id: HourlyThemeId;
  name: string;
  fontName: string;
  fontFamily: string;
  timeRange: string;
  className: string;
  colorHex: string;
  motto: string;
}

export const ALL_THEMES: Record<HourlyThemeId, HourlyThemeConfig> = {
  bleu: {
    id: 'bleu',
    name: 'Bleu Navy',
    fontName: 'Alex Brush',
    fontFamily: "'Alex Brush', cursive, sans-serif",
    timeRange: '00h - 08h',
    className: 'theme-bleu',
    colorHex: '#1877F2',
    motto: "Session Nocturne • Élégance Alex Brush",
  },
  orange: {
    id: 'orange',
    name: 'Orange Obsidian',
    fontName: 'Calligraffiti',
    fontFamily: "'Calligraffiti', cursive, sans-serif",
    timeRange: '08h - 16h',
    className: 'theme-orange',
    colorHex: '#FF7900',
    motto: "Session Londres/NY • Puissance Calligraffiti",
  },
  jaune: {
    id: 'jaune',
    name: 'Or Jaune',
    fontName: 'Lovers Quarrel',
    fontFamily: "'Lovers Quarrel', cursive, sans-serif",
    timeRange: '16h - 00h',
    className: 'theme-jaune',
    colorHex: '#FFCC00',
    motto: "Session Clôture • Prestige Lovers Quarrel",
  },
};

export function getHourlyThemeConfig(
  overrideMode: ThemeOverrideMode = 'auto',
  date: Date = new Date()
): HourlyThemeConfig {
  if (overrideMode !== 'auto' && ALL_THEMES[overrideMode]) {
    return ALL_THEMES[overrideMode];
  }

  const hour = date.getHours();

  if (hour >= 0 && hour < 8) {
    return ALL_THEMES.bleu;
  }

  if (hour >= 8 && hour < 16) {
    return ALL_THEMES.orange;
  }

  return ALL_THEMES.jaune;
}

