import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import {
  Palette,
  Volume2,
  Eye,
  Database,
  Shield,
  Smartphone,
  Trophy,
  ChevronRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, toggleDesktopPreview } = useSettings();

  return (
    <div className="flex-1 flex flex-col app-viewport bg-ah-canvas text-ah-text pb-20">
      <TopBar showBack title="Settings" subtitle="System & Preferences" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Settings Navigation Menu */}
        <div className="bg-ah-surface border border-ah-border rounded-3xl overflow-hidden divide-y divide-ah-border/50 text-xs font-medium">
          {/* Appearance */}
          <button
            type="button"
            onClick={() => navigate('/settings/appearance')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-brand-400" />
              <div>
                <div className="text-ah-text font-semibold">Appearance & Typography</div>
                <div className="text-[11px] text-ah-muted capitalize">
                  {settings.theme} theme • {settings.font === 'device' ? 'Device Font' : 'Afterhours Sans'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={() => navigate('/cabinet')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-ah-gold" />
              <div>
                <div className="text-ah-text font-semibold">Night Cabinet & Cosmetics</div>
                <div className="text-[11px] text-ah-muted">Achievements • Profile Frames</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={() => navigate('/settings/sound')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-ah-text font-semibold">Audio & Cues</div>
                <div className="text-[11px] text-ah-muted">
                  {settings.sound.enabled ? 'Enabled' : 'Disabled (Default)'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>

          {/* Accessibility */}
          <button
            type="button"
            onClick={() => navigate('/settings/accessibility')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-ah-text font-semibold">Accessibility & Motion</div>
                <div className="text-[11px] text-ah-muted">
                  Text scale: {settings.accessibility.fontSizeScale}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>

          {/* Data & Storage */}
          <button
            type="button"
            onClick={() => navigate('/settings/data')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-ah-text font-semibold">Data Export & Persistence</div>
                <div className="text-[11px] text-ah-muted">IndexedDB • JSON Export</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>

          {/* Safety */}
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="w-full p-4 flex items-center justify-between hover:bg-ah-surface-2 min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-ah-text font-semibold">Safety & Discretion</div>
                <div className="text-[11px] text-ah-muted">Block & Mute Controls</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-ah-muted" />
          </button>
        </div>

        {/* Developer Frame Toggle */}
        <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-brand-400" />
              <div>
                <div className="font-semibold text-ah-text">Desktop Device Frame</div>
                <div className="text-[11px] text-ah-muted">
                  Simulate 390×844 handset container on desktop
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDesktopPreview}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs min-h-touch transition-colors ${
                settings.desktopPreviewEnabled
                  ? 'bg-brand-600 text-ah-text'
                  : 'bg-ah-surface-2 text-ah-muted border border-ah-border hover:text-ah-text'
              }`}
            >
              {settings.desktopPreviewEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* System Build Info */}
        <div className="p-4 text-center text-[11px] text-ah-muted space-y-1">
          <p className="font-semibold text-ah-text">AFTERHOURS Foundation v1.0.0</p>
          <p>Canonical Viewport 390×844 • GitHub Pages Safe • Standalone PWA</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
