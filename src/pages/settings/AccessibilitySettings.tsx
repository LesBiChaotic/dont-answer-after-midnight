import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { TopBar } from '../../components/layout/TopBar';
import { Move, SunMedium, MessageSquareText } from 'lucide-react';

export const AccessibilitySettings: React.FC = () => {
  const { settings, updateAccessibilitySettings } = useSettings();
  const acc = settings.accessibility;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-night-bg text-night-text">
      <TopBar showBack title="Accessibility" subtitle="Visual & Motion Comfort" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Font Scaling */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-3">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-white">Font Size Scaling</h3>
            <p className="text-[11px] text-night-muted">Adjust text sizing throughout the interface</p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {(['small', 'medium', 'large'] as const).map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => updateAccessibilitySettings({ fontSizeScale: scale })}
                className={`py-3 rounded-xl border text-xs font-semibold capitalize min-h-touch transition-all ${
                  acc.fontSizeScale === scale
                    ? 'bg-brand-600 border-brand-500 text-white shadow-xs'
                    : 'bg-night-card border-night-border text-night-muted hover:text-white'
                }`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-night-surface border border-night-border rounded-3xl overflow-hidden divide-y divide-night-border/50 text-xs">
          {/* Reduce Motion */}
          <div className="p-4 flex items-center justify-between min-h-touch">
            <div className="flex items-center gap-3">
              <Move className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-white font-medium">Reduce Motion</div>
                <div className="text-[11px] text-night-muted">Minimize pulse & bounce animations</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={acc.reduceMotion}
              onChange={(e) => updateAccessibilitySettings({ reduceMotion: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 bg-night-card border-night-border focus:ring-brand-500"
            />
          </div>

          {/* High Contrast */}
          <div className="p-4 flex items-center justify-between min-h-touch">
            <div className="flex items-center gap-3">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-white font-medium">High Contrast Outlines</div>
                <div className="text-[11px] text-night-muted">Strengthen UI borders and text legibility</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={acc.highContrast}
              onChange={(e) => updateAccessibilitySettings({ highContrast: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 bg-night-card border-night-border focus:ring-brand-500"
            />
          </div>

          {/* Screen Reader Hints */}
          <div className="p-4 flex items-center justify-between min-h-touch">
            <div className="flex items-center gap-3">
              <MessageSquareText className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-white font-medium">Enhanced ARIA Hints</div>
                <div className="text-[11px] text-night-muted">Extra descriptive labels for screen readers</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={acc.screenReaderHints}
              onChange={(e) => updateAccessibilitySettings({ screenReaderHints: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 bg-night-card border-night-border focus:ring-brand-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
