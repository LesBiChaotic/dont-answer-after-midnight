import { ThemeMode, FontChoice } from '../types';

const DEVICE_FONT_STACK = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const AFTERHOURS_FONT_STACK = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  const metaThemeColor = document.getElementById('theme-color-meta');

  const deviceIsDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  const resolvedMode: Exclude<ThemeMode, 'device'> =
    mode === 'device' ? (deviceIsDark ? 'dark' : 'light') : mode;
  const isDark = resolvedMode !== 'light';

  root.dataset.theme = resolvedMode;

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', getThemeColor(resolvedMode));
    }
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', getThemeColor(resolvedMode));
    }
  }
}

function getThemeColor(mode: Exclude<ThemeMode, 'device'>): string {
  const colors: Record<Exclude<ThemeMode, 'device'>, string> = {
    dark: '#11101A',
    light: '#F7F2F7',
    'dead-signal': '#071522',
    'archive-amber': '#17120B',
    'crt-green': '#07110B',
    'blood-moon': '#17090D',
    'something-wrong': '#ECE9DF',
  };
  return colors[mode];
}

export function applyFont(font: FontChoice): void {
  const root = document.documentElement;
  if (font === 'device') {
    root.style.setProperty('--app-font-family', DEVICE_FONT_STACK);
    root.classList.add('font-device');
    root.classList.remove('font-afterhours-brand');
  } else {
    root.style.setProperty('--app-font-family', AFTERHOURS_FONT_STACK);
    root.classList.add('font-afterhours-brand');
    root.classList.remove('font-device');
  }
}

export function setupSystemThemeListener(onSystemChange: () => void): () => void {
  if (!window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const listener = () => {
    onSystemChange();
  };

  mediaQuery.addEventListener('change', listener);
  return () => mediaQuery.removeEventListener('change', listener);
}
