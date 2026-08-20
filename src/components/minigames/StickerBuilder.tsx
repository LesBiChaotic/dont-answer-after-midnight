import React, { useState } from 'react';
import { Moon, Sparkles, Coffee, Radio, Flame, Lamp, Heart, Copy, Check } from 'lucide-react';

const STICKER_ICONS = [
  { id: 'moon', icon: Moon, name: 'Midnight Moon' },
  { id: 'star', icon: Sparkles, name: 'Night Star' },
  { id: 'coffee', icon: Coffee, name: 'Moka Brew' },
  { id: 'radio', icon: Radio, name: 'Tower Beacon' },
  { id: 'flame', icon: Flame, name: 'Low Ember' },
  { id: 'lamp', icon: Lamp, name: 'Desk Glow' },
  { id: 'heart', icon: Heart, name: 'Quiet Heart' },
];

const BADGE_COLORS = [
  { name: 'Indigo', bg: 'bg-ah-surface-2', border: 'border-indigo-500', text: 'text-ah-text' },
  { name: 'Slate', bg: 'bg-slate-900/80', border: 'border-slate-500', text: 'text-ah-text' },
  { name: 'Emerald', bg: 'bg-ah-surface-2', border: 'border-emerald-500', text: 'text-ah-text' },
  { name: 'Amber', bg: 'bg-ah-surface-2', border: 'border-amber-500', text: 'text-ah-text' },
  { name: 'Rose', bg: 'bg-rose-950/80', border: 'border-rose-500', text: 'text-rose-300' },
];

export const StickerBuilder: React.FC = () => {
  const [selectedIconId, setSelectedIconId] = useState('moon');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [stickerLabel, setStickerLabel] = useState('STILL AWAKE');
  const [copied, setCopied] = useState(false);

  const activeIcon = STICKER_ICONS.find((i) => i.id === selectedIconId) || STICKER_ICONS[0];
  const activeColor = BADGE_COLORS[selectedColorIdx];
  const IconComponent = activeIcon.icon;

  const handleCopySticker = () => {
    navigator.clipboard.writeText(`[STICKER:${activeIcon.name} - "${stickerLabel}"]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4 bg-ah-surface border border-ah-border rounded-3xl space-y-4 select-none">
      <div className="flex items-center justify-between border-b border-ah-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-ah-text">Nocturnal Mood Sticker Creator</h3>
        </div>
      </div>

      {/* Preview Area */}
      <div className="py-6 flex flex-col items-center justify-center bg-ah-canvas/60 border border-ah-border/60 rounded-2xl">
        <div
          className={`px-4 py-3 rounded-2xl border flex items-center gap-3 shadow-lg ${activeColor.bg} ${activeColor.border} ${activeColor.text}`}
        >
          <IconComponent className="w-6 h-6 shrink-0" />
          <span className="font-mono text-xs font-bold tracking-wider">{stickerLabel || 'NIGHT MOOD'}</span>
        </div>
      </div>

      {/* Label Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-ah-muted uppercase tracking-wider">
          Sticker Caption
        </label>
        <input
          type="text"
          maxLength={20}
          value={stickerLabel}
          onChange={(e) => setStickerLabel(e.target.value)}
          placeholder="e.g. STILL AWAKE, QUIET HOURS..."
          className="w-full px-3 py-2 bg-ah-surface-2 border border-ah-border focus:border-brand-500 rounded-xl text-xs text-ah-text outline-none"
        />
      </div>

      {/* Icon Selector */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-ah-muted uppercase tracking-wider">
          Badge Symbol
        </label>
        <div className="flex flex-wrap gap-2">
          {STICKER_ICONS.map((item) => {
            const ItemIcon = item.icon;
            const isSelected = selectedIconId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIconId(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-center min-h-touch min-w-touch transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-ah-text border-brand-500 ring-2 ring-brand-500/50'
                    : 'bg-ah-surface-2 text-ah-muted border-ah-border hover:text-ah-text'
                }`}
                title={item.name}
              >
                <ItemIcon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-ah-muted uppercase tracking-wider">
          Palette Accent
        </label>
        <div className="flex gap-2">
          {BADGE_COLORS.map((col, idx) => (
            <button
              key={col.name}
              type="button"
              onClick={() => setSelectedColorIdx(idx)}
              className={`flex-1 py-2 px-1 rounded-xl border text-[11px] font-medium min-h-touch ${col.bg} ${col.border} ${col.text} ${
                selectedColorIdx === idx ? 'ring-2 ring-brand-400' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </div>

      {/* Copy Sticker Button */}
      <button
        type="button"
        onClick={handleCopySticker}
        className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-touch active:scale-95 transition-transform"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span>Sticker Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy Sticker Tag</span>
          </>
        )}
      </button>
    </div>
  );
};
