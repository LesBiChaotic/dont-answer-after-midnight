import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArchive } from '../context/ArchiveContext';
import { TopBar } from '../components/layout/TopBar';
import { BottomNav } from '../components/layout/BottomNav';
import { Database, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

const getEraStyle = (era: string) => {
  switch (era) {
    case '2001':
      return {
        badgeBg: 'bg-[#182238] border-[#3D8A69]/40 text-[#69C49A]',
        cardBorder: 'border-[#3D8A69]/30 hover:border-[#69C49A]',
        accent: 'text-[#69C49A]',
      };
    case '2004':
      return {
        badgeBg: 'bg-[#162734] border-[#57C7C1]/40 text-[#57C7C1]',
        cardBorder: 'border-[#57C7C1]/30 hover:border-[#57C7C1]',
        accent: 'text-[#57C7C1]',
      };
    case '2008':
      return {
        badgeBg: 'bg-[#291B3D] border-[#B979FF]/40 text-[#B979FF]',
        cardBorder: 'border-[#B979FF]/30 hover:border-[#B979FF]',
        accent: 'text-[#B979FF]',
      };
    case '2013':
      return {
        badgeBg: 'bg-[#2E1E28] border-[#F0A06D]/40 text-[#F0A06D]',
        cardBorder: 'border-[#F0A06D]/30 hover:border-[#F0A06D]',
        accent: 'text-[#F0A06D]',
      };
    case '2018':
      return {
        badgeBg: 'bg-[#251B38] border-[#B58AF4]/40 text-[#B58AF4]',
        cardBorder: 'border-[#B58AF4]/30 hover:border-[#B58AF4]',
        accent: 'text-[#B58AF4]',
      };
    default:
      return {
        badgeBg: 'bg-[#211C30] border-[#8197FF]/40 text-[#8197FF]',
        cardBorder: 'border-[#8197FF]/30 hover:border-[#8197FF]',
        accent: 'text-[#8197FF]',
      };
  }
};

export const ArchiveBrowserPage: React.FC = () => {
  const navigate = useNavigate();
  const { platforms, continuityRecords, readableMode, toggleReadableMode } = useArchive();

  return (
    <div className="flex-1 flex flex-col app-viewport bg-[#11101A] text-[#F4EEF8] pb-20">
      <TopBar
        title="Legacy Archives"
        subtitle="Historical Platform Partitions"
        actions={
          <button
            type="button"
            onClick={toggleReadableMode}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border min-h-touch flex items-center gap-1.5 transition-all active:scale-95 ${
              readableMode
                ? 'bg-gradient-to-r from-[#8197FF] to-[#B979FF] text-[#11101A] border-transparent font-bold shadow-xs'
                : 'bg-[#191625] text-[#91819A] border-[#2E2742] hover:text-[#F4EEF8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{readableMode ? 'Reader: ON' : 'Reader: OFF'}</span>
          </button>
        }
      />

      {/* Continuity Anomaly Alert Banner if records exist */}
      {continuityRecords.length > 0 && (
        <div className="mx-3 mt-3 p-3.5 bg-[#252B3C]/80 border border-[#3E4663] rounded-2xl flex items-start gap-2.5 text-xs text-[#8FA9FF] shadow-sm">
          <AlertCircle className="w-4 h-4 text-[#8FA9FF] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-white">Archive Continuity Indexes Active</span>
            <p className="text-[11px] text-[#C9B9D2] leading-relaxed">
              {continuityRecords.length} historical anomaly records cross-referenced across mounted platform eras.
            </p>
          </div>
        </div>
      )}

      {/* Eras List */}
      <main className="flex-1 overflow-y-auto p-3 space-y-3">
        <h2 className="text-[11px] font-semibold text-[#91819A] uppercase tracking-wider px-1 font-mono">
          Mounted Platform Partitions (2001 – 2026)
        </h2>

        {platforms.map((platform) => {
          const style = getEraStyle(platform.era);
          return (
            <div
              key={platform.id}
              onClick={() => navigate(`/archive/${platform.era}`)}
              className={`p-4 bg-[#191625] hover:bg-[#211C30] border ${style.cardBorder} rounded-2xl cursor-pointer transition-all active:scale-[0.99] space-y-2.5 shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${style.badgeBg} border flex items-center justify-center font-mono font-bold text-sm shadow-inner`}>
                    {platform.era}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">
                      {platform.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-[#91819A] font-mono mt-0.5">
                      <span className={style.accent}>{platform.codeName}</span>
                      <span>•</span>
                      <span>{platform.yearRange}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-[#91819A]" />
              </div>

              <p className="text-xs text-[#C9B9D2] leading-relaxed">
                {platform.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-[#91819A] pt-2 border-t border-[#2E2742]/50 font-mono">
                <div className="flex items-center gap-1.5">
                  <Database className={`w-3.5 h-3.5 ${style.accent}`} />
                  <span>{platform.recordCount} indexed logs</span>
                </div>
                <span className="text-[#69C49A] text-[10px] font-semibold">READ_ONLY_MOUNT</span>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
};
