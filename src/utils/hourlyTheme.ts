export interface HourlyThemeConfig {
  id: 'bleu' | 'orange' | 'jaune';
  name: string;
  fontName: string;
  fontFamily: string;
  timeRange: string;
  className: string;
  colorHex: string;
}

export function getHourlyThemeConfig(date: Date = new Date()): HourlyThemeConfig {
  const hour = date.getHours();

  if (hour >= 0 && hour < 8) {
    return {
      id: 'bleu',
      name: 'Bleu',
      fontName: 'Alex Brush',
      fontFamily: "'Alex Brush', cursive, sans-serif",
      timeRange: '00h - 08h',
      className: 'theme-bleu',
      colorHex: '#1877F2',
    };
  }

  if (hour >= 8 && hour < 16) {
    return {
      id: 'orange',
      name: 'Orange',
      fontName: 'Calligraffiti',
      fontFamily: "'Calligraffiti', cursive, sans-serif",
      timeRange: '08h - 16h',
      className: 'theme-orange',
      colorHex: '#FF7900',
    };
  }

  return {
    id: 'jaune',
    name: 'Jaune',
    fontName: 'Lovers Quarrel',
    fontFamily: "'Lovers Quarrel', cursive, sans-serif",
    timeRange: '16h - 00h',
    className: 'theme-jaune',
    colorHex: '#FFCC00',
  };
}
