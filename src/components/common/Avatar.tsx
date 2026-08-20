import React from 'react';
import { AvatarConfig } from '../../types';
import { DEFAULT_AVATAR } from '../../data/seed';

interface AvatarProps {
  config?: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showStatusDot?: boolean;
  status?: 'online' | 'idle' | 'offline' | 'afterhours';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6',
  sm: 'w-9 h-9',
  md: 'w-11 h-11',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
  '2xl': 'w-28 h-28',
};

const BG_GRADIENTS: Record<string, string> = {
  slate: 'from-slate-800 to-slate-950',
  midnight: 'from-indigo-950 via-slate-900 to-black',
  noir: 'from-zinc-900 to-black',
  indigo: 'from-indigo-900 to-slate-900',
  amber: 'from-amber-950 to-stone-900',
  emerald: 'from-emerald-950 to-slate-900',
  crimson: 'from-rose-950 to-slate-900',
};

export const Avatar: React.FC<AvatarProps> = ({
  config = DEFAULT_AVATAR,
  size = 'md',
  showStatusDot = false,
  status = 'offline',
  className = '',
}) => {
  const bgClass = BG_GRADIENTS[config.background] || BG_GRADIENTS.slate;

  // Frame shape
  let frameRadius = 'rounded-full';
  if (config.frame === 'rounded') frameRadius = 'rounded-2xl';
  if (config.frame === 'square') frameRadius = 'rounded-lg';
  if (config.frame === 'minimal') frameRadius = 'rounded-xl';

  return (
    <div className={`relative inline-block select-none shrink-0 ${className}`}>
      <div
        className={`${SIZE_MAP[size]} ${frameRadius} overflow-hidden bg-gradient-to-br ${bgClass} border border-white/10 shadow-inner flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`glow_${config.skinTone.replace('#', '')}`} cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </radialGradient>
          </defs>

          {/* Accent Effects */}
          {config.accent === 'halo' && (
            <circle cx="50" cy="45" r="32" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
          )}
          {config.accent === 'analog' && (
            <path d="M 10 30 L 90 30 M 10 70 L 90 70" stroke="#64748b" strokeWidth="1" opacity="0.3" />
          )}

          {/* Body / Top */}
          <path
            d="M 15 98 C 15 76 30 70 50 70 C 70 70 85 76 85 98 Z"
            fill={config.topColor || '#334155'}
          />

          {/* Outerwear overlay if set */}
          {config.outerwear !== 'none' && (
            <path
              d="M 10 98 C 10 74 25 68 40 70 L 40 98 L 60 98 L 60 70 C 75 68 90 74 90 98 Z"
              fill={config.outerwearColor || '#0f172a'}
              opacity="0.9"
            />
          )}

          {/* Neck */}
          <rect x="42" y="52" width="16" height="20" rx="3" fill={config.skinTone} />

          {/* Face Base */}
          {config.faceShape === 'round' ? (
            <circle cx="50" cy="45" r="22" fill={config.skinTone} />
          ) : config.faceShape === 'square' ? (
            <rect x="29" y="24" width="42" height="42" rx="10" fill={config.skinTone} />
          ) : config.faceShape === 'sharp' ? (
            <polygon points="50,22 72,36 66,66 50,72 34,66 28,36" fill={config.skinTone} />
          ) : (
            // Oval default
            <ellipse cx="50" cy="45" rx="20" ry="24" fill={config.skinTone} />
          )}

          {/* Skin glow shade */}
          <ellipse cx="50" cy="45" rx="20" ry="24" fill={`url(#glow_${config.skinTone.replace('#', '')})`} />

          {/* Eyes & Mood */}
          {config.eyes === 'narrow' ? (
            <g fill={config.eyeColor}>
              <line x1="38" y1="44" x2="45" y2="44" stroke={config.eyeColor} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="55" y1="44" x2="62" y2="44" stroke={config.eyeColor} strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : config.eyes === 'tired' ? (
            <g>
              <circle cx="41" cy="44" r="3.2" fill={config.eyeColor} />
              <circle cx="59" cy="44" r="3.2" fill={config.eyeColor} />
              <path d="M 36 49 Q 41 52 46 49" stroke="#64748b" strokeWidth="1.2" fill="none" opacity="0.7" />
              <path d="M 54 49 Q 59 52 64 49" stroke="#64748b" strokeWidth="1.2" fill="none" opacity="0.7" />
            </g>
          ) : config.eyes === 'wide' ? (
            <g fill={config.eyeColor}>
              <circle cx="41" cy="43" r="4.5" />
              <circle cx="59" cy="43" r="4.5" />
              <circle cx="42" cy="42" r="1.5" fill="#ffffff" />
              <circle cx="60" cy="42" r="1.5" fill="#ffffff" />
            </g>
          ) : (
            // Normal
            <g fill={config.eyeColor}>
              <circle cx="41" cy="44" r="3.5" />
              <circle cx="59" cy="44" r="3.5" />
            </g>
          )}

          {/* Mouth & Mood Expression */}
          {config.mood === 'smirk' ? (
            <path d="M 44 57 Q 52 59 57 54" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : config.mood === 'exhausted' ? (
            <line x1="43" y1="58" x2="57" y2="58" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
          ) : config.mood === 'pensive' ? (
            <path d="M 44 59 Q 50 56 56 59" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            // Neutral / Calm
            <path d="M 44 57 Q 50 60 56 57" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Facial Hair */}
          {config.facialHair === 'stubble' && (
            <path d="M 36 54 Q 50 68 64 54 C 64 64 58 68 50 69 C 42 68 36 64 36 54 Z" fill="#1e293b" opacity="0.25" />
          )}
          {config.facialHair === 'beard' && (
            <path d="M 33 50 C 33 69 40 73 50 73 C 60 73 67 69 67 50 C 62 58 57 60 50 60 C 43 60 38 58 33 50 Z" fill={config.hairColor} />
          )}
          {config.facialHair === 'mustache' && (
            <path d="M 41 53 Q 50 50 59 53 Q 50 56 41 53 Z" fill={config.hairColor} />
          )}

          {/* Hair Styles */}
          {config.hair === 'short' && (
            <path d="M 28 42 C 28 20 40 18 50 18 C 60 18 72 20 72 42 C 68 30 60 26 50 26 C 40 26 32 30 28 42 Z" fill={config.hairColor} />
          )}
          {config.hair === 'buzz' && (
            <ellipse cx="50" cy="30" rx="21" ry="12" fill={config.hairColor} opacity="0.7" />
          )}
          {config.hair === 'messy' && (
            <path d="M 26 40 C 24 24 35 15 50 15 C 65 15 76 24 74 40 C 70 28 65 24 55 24 C 48 24 45 28 40 23 C 35 27 30 32 26 40 Z" fill={config.hairColor} />
          )}
          {config.hair === 'curls' && (
            <g fill={config.hairColor}>
              <circle cx="34" cy="26" r="9" />
              <circle cx="46" cy="21" r="10" />
              <circle cx="58" cy="22" r="10" />
              <circle cx="67" cy="29" r="9" />
              <circle cx="30" cy="36" r="8" />
              <circle cx="70" cy="37" r="8" />
            </g>
          )}
          {config.hair === 'bob' && (
            <path d="M 26 48 C 24 22 36 17 50 17 C 64 17 76 22 74 48 C 72 58 68 62 67 62 C 67 40 60 25 50 25 C 40 25 33 40 33 62 C 32 62 28 58 26 48 Z" fill={config.hairColor} />
          )}
          {config.hair === 'dreads' && (
            <g fill={config.hairColor}>
              <rect x="25" y="24" width="7" height="42" rx="3.5" />
              <rect x="33" y="18" width="7" height="48" rx="3.5" />
              <rect x="41" y="15" width="7" height="30" rx="3.5" />
              <rect x="49" y="15" width="7" height="30" rx="3.5" />
              <rect x="60" y="18" width="7" height="48" rx="3.5" />
              <rect x="68" y="24" width="7" height="42" rx="3.5" />
            </g>
          )}

          {/* Glasses */}
          {config.glasses === 'round' && (
            <g stroke="#38bdf8" strokeWidth="2.5" fill="none">
              <circle cx="41" cy="44" r="8" />
              <circle cx="59" cy="44" r="8" />
              <line x1="49" y1="44" x2="51" y2="44" />
            </g>
          )}
          {config.glasses === 'thin' || config.glasses === 'classic' ? (
            <g stroke="#94a3b8" strokeWidth="2" fill="none">
              <rect x="33" y="38" width="16" height="11" rx="3" />
              <rect x="51" y="38" width="16" height="11" rx="3" />
              <line x1="49" y1="43" x2="51" y2="43" />
            </g>
          ) : null}

          {/* Head Covering */}
          {config.headCovering === 'beanie' && (
            <path d="M 27 34 C 27 16 38 12 50 12 C 62 12 73 16 73 34 L 27 34 Z" fill="#475569" />
          )}
          {config.headCovering === 'cap' && (
            <g fill="#1e293b">
              <path d="M 28 32 C 28 18 38 15 50 15 C 62 15 72 18 72 32 Z" />
              <path d="M 22 32 Q 50 30 78 32 L 84 37 Q 50 35 16 37 Z" />
            </g>
          )}

          {/* Piercings */}
          {config.piercings === 'ear_single' && <circle cx="28" cy="48" r="1.5" fill="#facc15" />}
          {config.piercings === 'ear_double' && (
            <g fill="#facc15">
              <circle cx="28" cy="46" r="1.5" />
              <circle cx="28" cy="50" r="1.5" />
            </g>
          )}
          {config.piercings === 'nose' && <circle cx="47" cy="51" r="1.2" fill="#facc15" />}
        </svg>
      </div>

      {/* Status Dot */}
      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-night-bg ${
            size === 'xs' || size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
          } ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'afterhours'
              ? 'bg-indigo-400'
              : status === 'idle'
              ? 'bg-amber-400'
              : 'bg-zinc-500'
          }`}
        />
      )}
    </div>
  );
};
