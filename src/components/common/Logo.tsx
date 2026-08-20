import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', box: 'w-7 h-7', text: 'text-xs', star: 2 },
    md: { icon: 'w-8 h-8', box: 'w-9 h-9', text: 'text-sm', star: 2.5 },
    lg: { icon: 'w-12 h-12', box: 'w-14 h-14', text: 'text-xl', star: 3.5 },
    xl: { icon: 'w-16 h-16', box: 'w-20 h-20', text: 'text-2xl', star: 4.5 },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official AFTERHOURS Badge: Deep Plum with Luminous Lilac Arcs & Center Star */}
      <div
        className={`${current.box} rounded-2xl bg-gradient-to-br from-[#2D1B4E] to-[#141122] border border-[#6E45C7]/40 shadow-lg shadow-[#6E45C7]/20 flex items-center justify-center relative shrink-0`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={current.icon}
        >
          {/* Primary Speech Arc 1 (Top Left) */}
          <path
            d="M8 17C8 11.4772 12.4772 7 18 7C22.4183 7 26.1667 9.85601 27.4648 13.8427"
            stroke="#B979FF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Primary Speech Arc 2 (Bottom Right) */}
          <path
            d="M28 19C28 24.5228 23.5228 29 18 29C13.5817 29 9.83327 26.144 8.53516 22.1573"
            stroke="#8197FF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Overlapping Return Tails (Continuity) */}
          <path
            d="M8.5 22.2L6.5 24.5C6.1 24.9 6.8 25.5 7.2 25.1L9.6 23.1"
            stroke="#8197FF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M27.5 13.8L29.5 11.5C29.9 11.1 29.2 10.5 28.8 10.9L26.4 12.9"
            stroke="#B979FF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Midnight Star / Continuity Pivot Dot */}
          <circle cx="18" cy="18" r={current.star} fill="#F0A06D" />
          <circle cx="18" cy="18" r={current.star * 1.8} fill="#F0A06D" opacity="0.25" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif font-bold tracking-tight text-white ${current.text} leading-none`}>
            AFTERHOURS
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-[10px] text-[#8197FF] font-mono tracking-wider pt-0.5">
              NOCTURNAL SANCTUARY
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};
