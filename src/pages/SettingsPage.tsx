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
  ChevronRight,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, toggleDesktopPreview } = useSettings();

  return (
    <div className="flex-1 flex flex-col app-viewport bg-night-bg text-night-text pb-20">
      <TopBar showBack title="Settings" subtitle="System & Preferences" />

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Settings Navigation Menu */}
        <div className="bg-night-surface border border-night-border rounded-3xl overflow-hidden divide-y divide-night-border/50 text-xs font-medium">
          {/* Appearance */}
          <button
            type="button"
            onClick={() => navigate('/settings/appearance')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-brand-400" />
              <div>
                <div className="text-white font-semibold">Appearance & Typography</div>
                <div className="text-[11px] text-night-muted capitalize">
                  {settings.theme} theme • {settings.font === 'device' ? 'Device Font' : 'Afterhours Sans'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={() => navigate('/settings/sound')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-white font-semibold">Audio & Cues</div>
                <div className="text-[11px] text-night-muted">
                  {settings.sound.enabled ? 'Enabled' : 'Disabled (Default)'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>

          {/* Accessibility */}
          <button
            type="button"
            onClick={() => navigate('/settings/accessibility')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-white font-semibold">Accessibility & Motion</div>
                <div className="text-[11px] text-night-muted">
                  Text scale: {settings.accessibility.fontSizeScale}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>

          {/* Data & Storage */}
          <button
            type="button"
            onClick={() => navigate('/settings/data')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-white font-semibold">Data Export & Persistence</div>
                <div className="text-[11px] text-night-muted">IndexedDB • JSON Export</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>

          {/* Safety */}
          <button
            type="button"
            onClick={() => navigate('/safety')}
            className="w-full p-4 flex items-center justify-between hover:bg-night-card min-h-touch text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-white font-semibold">Safety & Discretion</div>
                <div className="text-[11px] text-night-muted">Block & Mute Controls</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-night-muted" />
          </button>
        </div>

        {/* Developer Frame Toggle */}
        <div className="p-4 bg-night-surface border border-night-border rounded-3xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-brand-400" />
              <div>
                <div className="font-semibold text-white">Desktop Device Frame</div>
                <div className="text-[11px] text-night-muted">
                  Simulate 390×844 handset container on desktop
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDesktopPreview}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs min-h-touch transition-colors ${
                settings.desktopPreviewEnabled
                  ? 'bg-brand-600 text-white'
                  : 'bg-night-card text-night-muted border border-night-border hover:text-white'
              }`}
            >
              {settings.desktopPreviewEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* System Build Info */}
        <div className="p-4 text-center text-[11px] text-night-muted space-y-1">
          <p className="font-semibold text-night-text">AFTERHOURS Foundation v1.0.0</p>
          <p>Canonical Viewport 390×844 • GitHub Pages Safe • Standalone PWA</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
