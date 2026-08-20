import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArchive } from '../context/ArchiveContext';
import { TopBar } from '../components/layout/TopBar';
import { LegacyEra } from '../types';
import { BookOpen, ArrowLeft } from 'lucide-react';

export const ArchiveEraPage: React.FC = () => {
  const { era } = useParams<{ era: string }>();
  const navigate = useNavigate();
  const { getPlatformByEra, getMessagesByEra, readableMode, toggleReadableMode } = useArchive();

  const currentEra = (era || '2001') as LegacyEra;
  const platform = getPlatformByEra(currentEra);
  const messages = getMessagesByEra(currentEra);

  if (!platform) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#11101A] text-[#F4EEF8] app-viewport">
        <h2 className="text-base font-semibold mb-1">Archive Era Not Found</h2>
        <p className="text-xs text-[#91819A] mb-4">The requested partition index is not mounted.</p>
        <button
          type="button"
          onClick={() => navigate('/archive')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#191625] border border-[#2E2742] text-xs font-medium text-[#F4EEF8]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Archives</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col app-viewport bg-[#11101A] text-[#F4EEF8]">
      {/* Top Header */}
      <TopBar
        showBack
        title={platform.title}
        subtitle={`${platform.yearRange} • ${platform.codeName}`}
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
            <span>{readableMode ? 'Standard Reader' : 'Vintage Era UI'}</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* READABLE MODE */}
        {readableMode ? (
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="p-3 bg-[#211C30] border border-[#8197FF]/30 rounded-xl text-xs text-[#8197FF]">
              <span className="font-semibold">Standard Reader Enabled:</span> High-contrast uniform typography for comfortable reading.
            </div>

            {messages.map((msg) => (
              <article
                key={msg.id}
                className="p-4 bg-[#191625] border border-[#2E2742] rounded-2xl space-y-2 select-text shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-[#91819A] border-b border-[#2E2742]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{msg.senderDisplayName}</span>
                    <span className="text-[11px] text-[#8197FF]">@{msg.senderHandle}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#91819A]">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-[#F4EEF8] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <div className="text-[10px] text-[#91819A] font-mono pt-1">
                  Thread: {msg.threadTitle}
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* AUTHENTIC PERIOD ERA STYLES */
          <div className="space-y-4 max-w-xl mx-auto select-text font-mono">
            {/* 2001 Midnight Board (Inky Blue + Phosphor Hints) */}
            {currentEra === '2001' && (
              <div className="bg-[#0F1626] border-2 border-[#243352] rounded-xl p-3 text-[#CBD5E1] space-y-3 shadow-lg">
                <div className="bg-[#18233C] p-2.5 border border-[#314368] text-center rounded-lg">
                  <div className="text-xs font-bold text-[#69C49A] tracking-widest uppercase">
                    === MIDNIGHT BOARD v2.1 [CGI/PERL] ===
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">DIAL-UP RELAY NODE #1 // 2400-33600 BPS OK</div>
                </div>

                {messages.map((msg, i) => (
                  <table key={msg.id} className="w-full text-xs border border-[#243352] bg-[#121B2F] mb-2 rounded overflow-hidden">
                    <thead>
                      <tr className="bg-[#1C2A47] text-[#94A3B8] text-[10px]">
                        <th className="p-1.5 text-left border-r border-[#243352] w-28">AUTHOR</th>
                        <th className="p-1.5 text-left">
                          POST #{String(i + 1).padStart(4, '0')} • {msg.timestamp}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-[#243352] align-top text-[11px] bg-[#0E1524]">
                          <div className="font-bold text-[#69C49A]">{msg.senderDisplayName}</div>
                          <div className="text-[10px] text-[#64748B]">@{msg.senderHandle}</div>
                          <div className="text-[9px] text-[#F0A06D] mt-2">SYS_MEMBER #0{i + 12}</div>
                        </td>
                        <td className="p-2.5 align-top text-[12px] leading-relaxed text-[#F1F5F9]">
                          {msg.content}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* 2004 Lantern IRC (Aqua + Silver) */}
            {currentEra === '2004' && (
              <div className="bg-[#0B151C] border border-[#1C3342] rounded-2xl p-3.5 text-[#57C7C1] font-mono text-xs space-y-2 shadow-lg">
                <div className="border-b border-[#1C3342] pb-2 text-[11px] text-[#57C7C1]">
                  *** Connected to irc.lantern-net.org:6667
                  <br />
                  *** Topic for #lantern-lounge: "Keep the beacon lit | Quiet hours mode +m after 02:00"
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="py-0.5 leading-relaxed">
                    <span className="text-[#C9B9D2]/60 mr-2">[{msg.timestamp.split('T')[1]?.slice(0, 5) || '02:00'}]</span>
                    {msg.content.startsWith('***') ? (
                      <span className="text-[#F0A06D] italic">{msg.content}</span>
                    ) : (
                      <>
                        <span className="font-bold text-[#57C7C1] mr-1.5">&lt;{msg.senderHandle}&gt;</span>
                        <span className="text-[#F4EEF8]">{msg.content}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 2008 Hushrooms (Glossy Violet + Sky Blue Web 2.0) */}
            {currentEra === '2008' && (
              <div className="bg-[#150F24] border border-[#3E2563] rounded-2xl p-3.5 text-[#B979FF] font-mono text-xs space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#3E2563] pb-2 text-[10px] text-[#8197FF]">
                  <span className="font-bold tracking-wider">NODE: 0x88F2-ALPHA-MESH</span>
                  <span className="bg-[#2A1847] px-2 py-0.5 rounded-full text-[#B979FF]">PROTOCOL: HUSH-P2P</span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-[#201438] border border-[#482A75] rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-[10px] text-[#8197FF]">
                      <span className="font-bold">SIG: @{msg.senderHandle}</span>
                      <span className="text-[#C9B9D2]">{msg.timestamp}</span>
                    </div>
                    <p className="text-[12px] text-[#F4EEF8] leading-relaxed font-sans">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 2013 Nitewire (Coral + Indigo Early Mobile) */}
            {currentEra === '2013' && (
              <div className="bg-[#1A1424] border border-[#452D5A] rounded-3xl p-3.5 space-y-3 font-sans shadow-lg">
                <div className="bg-[#2B1D3D] p-3 rounded-2xl flex items-center justify-between text-xs text-white shadow-xs">
                  <span className="font-bold text-[#F0A06D]">Nitewire Stream</span>
                  <span className="text-[10px] bg-[#5676C8] text-white px-2.5 py-0.5 rounded-full font-bold">v3.2</span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-[#241736] border border-[#3D2557] rounded-2xl space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F0A06D]">{msg.senderDisplayName}</span>
                      <span className="text-[10px] text-[#91819A] font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#F4EEF8] leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 2018 Beta Prototype (Deep Plum + Lavender) */}
            {currentEra === '2018' && (
              <div className="bg-[#14101F] border border-[#2B1E3D] rounded-3xl p-4 space-y-3 font-sans shadow-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#B58AF4] border-b border-[#2B1E3D] pb-2">
                  <span>AFTERHOURS SPA BETA v0.9 (LOCAL CACHE)</span>
                </div>

                {messages.map((msg) => (
                  <div key={msg.id} className="p-3.5 bg-[#1C142B] border border-[#392454] rounded-2xl space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F4EEF8]">{msg.senderDisplayName}</span>
                      <span className="text-[10px] text-[#91819A] font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#C9B9D2] leading-relaxed">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
