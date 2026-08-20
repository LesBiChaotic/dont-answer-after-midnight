import { ThemeMode, FontChoice } from '../types';

const DEVICE_FONT_STACK = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const AFTERHOURS_FONT_STACK = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  const metaThemeColor = document.getElementById('theme-color-meta');

  let isDark = false;
  if (mode === 'dark') {
    isDark = true;
  } else if (mode === 'light') {
    isDark = false;
  } else if (mode === 'device') {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0c0d12');
    }
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#f8f9fa');
    }
  }
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
