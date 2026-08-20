import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from '../../components/layout/TopBar';
import { Moon, Sun, Laptop, Type, Check } from 'lucide-react';
import { ThemeMode, FontChoice } from '../../types';

export const AppearanceSettings: React.FC = () => {
  const { settings, setTheme, setFont } = useSettings();

  const themes: { id: ThemeMode; label: string; icon: typeof Moon; desc: string }[] = [
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: Moon,
      desc: 'Nocturnal deep navy & slate palette',
    },
    {
      id: 'light',
      label: 'Light Mode',
      icon: Sun,
      desc: 'Refined warm neutral daytime layout',
    },
    {
      id: 'device',
      label: 'Use Device Setting',
      icon: Laptop,
      desc: 'Automatically matches system preferences',
    },
  ];

  const fonts: { id: FontChoice; label: string; stack: string; desc: string }[] = [
    {
      id: 'afterhours',
      label: 'Afterhours Sans',
      stack: 'Inter / Custom Modern Sans',
      desc: 'Balanced digital typography optimized for dark interfaces',
    },
    {
      id: 'device',
      label: 'Device Font (system-ui)',
      stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      desc: 'Authentic native platform font directly from your operating system',
    },
  ];

  return (
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text">
      <TopBar showBack title="Appearance & Font" subtitle="Theme & Typography" />

      <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-md mx-auto w-full">
        {/* THEME SELECTION */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-semibold text-night-muted uppercase tracking-wider px-1">
            Color Palette & Theme
          </h2>

          <div className="space-y-2">
            {themes.map((item) => {
              const Icon = item.icon;
              const isSelected = settings.theme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 min-h-touch transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-night-card border-brand-500 ring-1 ring-brand-500/50 shadow-xs'
                      : 'bg-night-surface border-night-border hover:bg-night-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-night-card border border-night-border text-night-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                      <div className="text-[11px] text-night-muted leading-tight">{item.desc}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* TYPOGRAPHY SELECTION */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-semibold text-night-muted uppercase tracking-wider px-1">
            Typography Engine
          </h2>

          <div className="space-y-2">
            {fonts.map((item) => {
              const isSelected = settings.font === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFont(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 min-h-touch transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'bg-night-card border-brand-500 ring-1 ring-brand-500/50 shadow-xs'
                      : 'bg-night-surface border-night-border hover:bg-night-card'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-night-card border border-night-border text-night-muted'
                      }`}
                    >
                      <Type className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                      <div className="text-[10px] text-brand-300 font-mono truncate">{item.stack}</div>
                      <div className="text-[11px] text-night-muted leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
