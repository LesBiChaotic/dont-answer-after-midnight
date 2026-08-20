import React, { useState } from 'react';
import { AvatarConfig } from '../../types';
import { Avatar } from '../common/Avatar';
import { DEFAULT_AVATAR } from '../../data/seed';
import { Check, Sparkles } from 'lucide-react';

interface AvatarBuilderProps {
  initialConfig?: AvatarConfig;
  onSave: (config: AvatarConfig) => void;
  onCancel?: () => void;
}

type TabType = 'skin' | 'hair' | 'face' | 'accessories' | 'clothes' | 'style';

const SKIN_TONES = [
  { label: 'Fair', value: '#f5d0c5' },
  { label: 'Warm Light', value: '#ffd1b3' },
  { label: 'Medium', value: '#e0ac69' },
  { label: 'Tan', value: '#c68642' },
  { label: 'Deep Warm', value: '#8d5524' },
  { label: 'Deep Dark', value: '#4a2c17' },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'buzz', label: 'Buzzcut' },
  { id: 'messy', label: 'Messy' },
  { id: 'curls', label: 'Curls' },
  { id: 'bob', label: 'Bob Cut' },
  { id: 'dreads', label: 'Locs' },
];

const HAIR_COLORS = [
  { label: 'Black', value: '#18181b' },
  { label: 'Dark Brown', value: '#3f2212' },
  { label: 'Chestnut', value: '#78350f' },
  { label: 'Auburn', value: '#991b1b' },
  { label: 'Blonde', value: '#d97706' },
  { label: 'Silver', value: '#94a3b8' },
  { label: 'Midnight Blue', value: '#1e3a8a' },
];

const EYE_TYPES = [
  { id: 'normal', label: 'Normal' },
  { id: 'tired', label: 'Tired / Late' },
  { id: 'wide', label: 'Alert' },
  { id: 'narrow', label: 'Focus' },
];

const MOOD_TYPES = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'calm', label: 'Calm' },
  { id: 'exhausted', label: 'Exhausted' },
  { id: 'pensive', label: 'Pensive' },
  { id: 'smirk', label: 'Subtle Smirk' },
  { id: 'curious', label: 'Curious' },
];

const FACIAL_HAIR_TYPES = [
  { id: 'none', label: 'Clean' },
  { id: 'stubble', label: 'Stubble' },
  { id: 'beard', label: 'Beard' },
  { id: 'mustache', label: 'Mustache' },
];

const GLASSES_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'classic', label: 'Classic' },
  { id: 'thin', label: 'Thin Metal' },
  { id: 'round', label: 'Round' },
];

const HEAD_COVERINGS = [
  { id: 'none', label: 'None' },
  { id: 'beanie', label: 'Beanie' },
  { id: 'cap', label: 'Baseball Cap' },
];

const PIERCINGS_TYPES = [
  { id: 'none', label: 'None' },
  { id: 'ear_single', label: 'Single Earring' },
  { id: 'ear_double', label: 'Double Earring' },
  { id: 'nose', label: 'Nose Stud' },
];

const TOP_TYPES = [
  { id: 'tshirt', label: 'T-Shirt' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'sweater', label: 'Knit Sweater' },
  { id: 'collared', label: 'Collared Shirt' },
  { id: 'jacket', label: 'Jacket' },
];

const TOP_COLORS = [
  { label: 'Slate Dark', value: '#334155' },
  { label: 'Midnight Blue', value: '#1e293b' },
  { label: 'Indigo', value: '#3730a3' },
  { label: 'Forest', value: '#14532d' },
  { label: 'Burgundy', value: '#881337' },
  { label: 'Charcoal', value: '#18181b' },
];

const BACKGROUNDS = [
  { id: 'slate', label: 'Slate' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'noir', label: 'Noir' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'amber', label: 'Amber' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'crimson', label: 'Crimson' },
];

const ACCENTS = [
  { id: 'none', label: 'None' },
  { id: 'signal_dot', label: 'Signal Dot' },
  { id: 'halo', label: 'Subtle Halo' },
  { id: 'analog', label: 'Analog Scanlines' },
];

export const AvatarBuilder: React.FC<AvatarBuilderProps> = ({
  initialConfig = DEFAULT_AVATAR,
  onSave,
  onCancel,
}) => {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabType>('skin');

  const updateConfig = (updates: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const randomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].value;
    const randomHair = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)].id as AvatarConfig['hair'];
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].value;
    const randomEyes = EYE_TYPES[Math.floor(Math.random() * EYE_TYPES.length)].id as AvatarConfig['eyes'];
    const randomMood = MOOD_TYPES[Math.floor(Math.random() * MOOD_TYPES.length)].id as AvatarConfig['mood'];
    const randomGlasses = GLASSES_TYPES[Math.floor(Math.random() * GLASSES_TYPES.length)].id as AvatarConfig['glasses'];
    const randomTop = TOP_TYPES[Math.floor(Math.random() * TOP_TYPES.length)].id as AvatarConfig['top'];
    const randomTopColor = TOP_COLORS[Math.floor(Math.random() * TOP_COLORS.length)].value;
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id as AvatarConfig['background'];

    setConfig({
      ...config,
      skinTone: randomSkin,
      hair: randomHair,
      hairColor: randomHairColor,
      eyes: randomEyes,
      mood: randomMood,
      glasses: randomGlasses,
      top: randomTop,
      topColor: randomTopColor,
      background: randomBg,
    });
  };

  return (
    <div className="flex flex-col h-full bg-ah-canvas text-ah-text">
      {/* Sticky Top Avatar Live Preview */}
      <div className="flex flex-col items-center justify-center p-4 bg-ah-surface/90 backdrop-blur-md border-b border-ah-border shrink-0">
        <div className="relative">
          <Avatar config={config} size="xl" />
          <button
            type="button"
            onClick={randomize}
            className="absolute -top-1 -right-1 p-2 bg-brand-600 hover:bg-brand-500 text-ah-text rounded-full shadow-lg min-w-touch min-h-touch flex items-center justify-center transition-transform active:scale-95"
            title="Randomize"
            aria-label="Randomize Avatar"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-ah-muted">Live Vector Avatar Preview</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-none border-b border-ah-border bg-ah-surface shrink-0 px-2">
        {[
          { id: 'skin', label: 'Skin' },
          { id: 'hair', label: 'Hair' },
          { id: 'face', label: 'Face' },
          { id: 'accessories', label: 'Details' },
          { id: 'clothes', label: 'Clothes' },
          { id: 'style', label: 'Style' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-3 py-3 text-xs font-medium whitespace-nowrap min-h-touch border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-400 font-semibold'
                : 'border-transparent text-ah-muted hover:text-ah-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Options Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* SKIN TAB */}
        {activeTab === 'skin' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Skin Tone</h3>
            <div className="grid grid-cols-3 gap-3">
              {SKIN_TONES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateConfig({ skinTone: item.value })}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left min-h-touch transition-all ${
                    config.skinTone === item.value
                      ? 'border-brand-500 bg-brand-950/30 ring-1 ring-brand-500'
                      : 'border-ah-border bg-ah-surface-2 hover:border-ah-muted'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: item.value }}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HAIR TAB */}
        {activeTab === 'hair' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Hair Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {HAIR_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateConfig({ hair: style.id as AvatarConfig['hair'] })}
                  className={`p-3 rounded-xl border text-center text-xs font-medium min-h-touch transition-all ${
                    config.hair === style.id
                      ? 'border-brand-500 bg-brand-950/30 text-brand-300 ring-1 ring-brand-500'
                      : 'border-ah-border bg-ah-surface-2 text-ah-text'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Hair Color</h3>
            <div className="grid grid-cols-3 gap-2">
              {HAIR_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => updateConfig({ hairColor: color.value })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium min-h-touch ${
                    config.hairColor === color.value
                      ? 'border-brand-500 bg-brand-950/30'
                      : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: color.value }} />
                  <span className="truncate">{color.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FACE TAB */}
        {activeTab === 'face' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Eyes & Focus</h3>
            <div className="grid grid-cols-2 gap-2">
              {EYE_TYPES.map((eye) => (
                <button
                  key={eye.id}
                  type="button"
                  onClick={() => updateConfig({ eyes: eye.id as AvatarConfig['eyes'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.eyes === eye.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {eye.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Facial Hair</h3>
            <div className="grid grid-cols-2 gap-2">
              {FACIAL_HAIR_TYPES.map((fh) => (
                <button
                  key={fh.id}
                  type="button"
                  onClick={() => updateConfig({ facialHair: fh.id as AvatarConfig['facialHair'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.facialHair === fh.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {fh.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ACCESSORIES TAB */}
        {activeTab === 'accessories' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Glasses</h3>
            <div className="grid grid-cols-2 gap-2">
              {GLASSES_TYPES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => updateConfig({ glasses: g.id as AvatarConfig['glasses'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.glasses === g.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Headwear</h3>
            <div className="grid grid-cols-3 gap-2">
              {HEAD_COVERINGS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => updateConfig({ headCovering: h.id as AvatarConfig['headCovering'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.headCovering === h.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Piercings</h3>
            <div className="grid grid-cols-2 gap-2">
              {PIERCINGS_TYPES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateConfig({ piercings: p.id as AvatarConfig['piercings'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.piercings === p.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CLOTHES TAB */}
        {activeTab === 'clothes' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Top Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {TOP_TYPES.map((top) => (
                <button
                  key={top.id}
                  type="button"
                  onClick={() => updateConfig({ top: top.id as AvatarConfig['top'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.top === top.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {top.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Top Color</h3>
            <div className="grid grid-cols-3 gap-2">
              {TOP_COLORS.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onClick={() => updateConfig({ topColor: col.value })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium min-h-touch ${
                    config.topColor === col.value ? 'border-brand-500 bg-brand-950/30' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: col.value }} />
                  <span className="truncate">{col.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted">Expression / Mood</h3>
            <div className="grid grid-cols-3 gap-2">
              {MOOD_TYPES.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => updateConfig({ mood: mood.id as AvatarConfig['mood'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.mood === mood.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Background Atmosphere</h3>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => updateConfig({ background: bg.id as AvatarConfig['background'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.background === bg.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-wider font-semibold text-ah-muted pt-2">Atmospheric Accent</h3>
            <div className="grid grid-cols-2 gap-2">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => updateConfig({ accent: acc.id as AvatarConfig['accent'] })}
                  className={`p-3 rounded-xl border text-xs font-medium min-h-touch ${
                    config.accent === acc.id ? 'border-brand-500 bg-brand-950/30 text-brand-300' : 'border-ah-border bg-ah-surface-2'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-ah-surface border-t border-ah-border flex gap-3 shrink-0">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-ah-border text-ah-muted hover:text-ah-text font-medium text-sm min-h-touch active:bg-ah-surface-2"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() => onSave(config)}
          className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-ah-text font-medium text-sm min-h-touch flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
        >
          <Check className="w-4 h-4" />
          Save Avatar
        </button>
      </div>
    </div>
  );
};
