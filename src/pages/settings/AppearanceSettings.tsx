import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from '../../components/layout/TopBar';
import { Moon, Sun, Laptop, Type, Check, Radio, Archive, Terminal, Eclipse, TriangleAlert } from 'lucide-react';
import { ThemeMode, FontChoice } from '../../types';

export const AppearanceSettings: React.FC = () => {
  const { settings, setTheme, setFont } = useSettings();

  const themes: { id: ThemeMode; label: string; icon: typeof Moon; desc: string; swatches: string[] }[] = [
    {
      id: 'dark',
      label: 'Midnight Plum',
      icon: Moon,
      desc: 'The canonical nocturnal plum network',
      swatches: ['#11101A', '#B979FF', '#8197FF'],
    },
    {
      id: 'light',
      label: 'Lavender Dawn',
      icon: Sun,
      desc: 'A fully connected soft editorial light mode',
      swatches: ['#F7F2F7', '#6E45C7', '#3F9B9A'],
    },
    {
      id: 'dead-signal',
      label: 'Dead Signal Blue',
      icon: Radio,
      desc: 'Cold relay towers and submerged frequencies',
      swatches: ['#071522', '#65C7F2', '#4DD5D0'],
    },
    {
      id: 'archive-amber',
      label: 'Archive Amber',
      icon: Archive,
      desc: 'Old paper, warm terminals, and sealed records',
      swatches: ['#17120B', '#E6A85B', '#E2B45E'],
    },
    {
      id: 'crt-green',
      label: 'CRT Green',
      icon: Terminal,
      desc: 'Phosphor glow from a machine left running',
      swatches: ['#07110B', '#64E57F', '#57D6B1'],
    },
    {
      id: 'blood-moon',
      label: 'Blood Moon',
      icon: Eclipse,
      desc: 'Velvet red alerts and bruised shadows',
      swatches: ['#17090D', '#E45B72', '#D06BAE'],
    },
    {
      id: 'something-wrong',
      label: 'Something Is Wrong',
      icon: TriangleAlert,
      desc: 'Bright, polite, and observably incorrect',
      swatches: ['#ECE9DF', '#5E66FF', '#BD3F65'],
    },
    {
      id: 'device',
      label: 'Use Device Setting',
      icon: Laptop,
      desc: 'Automatically chooses Midnight Plum or Lavender Dawn',
      swatches: ['#11101A', '#F7F2F7', '#8197FF'],
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
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text">
      <TopBar showBack title="Appearance & Font" subtitle="Theme & Typography" />

      <main className="flex-1 overflow-y-auto p-4 space-y-6 max-w-md mx-auto w-full">
        {/* THEME SELECTION */}
        <div className="space-y-3">
          <h2 className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider px-1">
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
                      ? 'bg-ah-surface-2 border-brand-500 ring-1 ring-brand-500/50 shadow-xs'
                      : 'bg-ah-surface border-ah-border hover:bg-ah-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-brand-600 text-ah-text'
                          : 'bg-ah-surface-2 border border-ah-border text-ah-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ah-text">{item.label}</div>
                      <div className="text-[11px] text-ah-muted leading-tight">{item.desc}</div>
                      <div className="mt-2 flex gap-1" aria-hidden="true">
                        {item.swatches.map((color) => (
                          <span key={color} className="h-2.5 w-6 rounded-full border border-ah-border" style={{ backgroundColor: color }} />
                        ))}
                      </div>
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
          <h2 className="text-[11px] font-semibold text-ah-muted uppercase tracking-wider px-1">
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
                      ? 'bg-ah-surface-2 border-brand-500 ring-1 ring-brand-500/50 shadow-xs'
                      : 'bg-ah-surface border-ah-border hover:bg-ah-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-brand-600 text-ah-text'
                          : 'bg-ah-surface-2 border border-ah-border text-ah-muted'
                      }`}
                    >
                      <Type className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-ah-text">{item.label}</div>
                      <div className="text-[10px] text-brand-300 font-mono truncate">{item.stack}</div>
                      <div className="text-[11px] text-ah-muted leading-tight mt-0.5">{item.desc}</div>
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
