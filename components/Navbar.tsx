'use client';

import React from 'react';
import { QrCode, Sparkles, History, RotateCcw, Zap } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onRandomPreset: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export function Navbar({ onReset, onRandomPreset, onOpenHistory, historyCount }: NavbarProps) {
  return (
    <header className="w-full border-b-[3px] border-black bg-[#FFE500] px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0px_0px_#000]">
            <QrCode className="h-6 w-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                NEOBRUTAL // QR
              </span>
              <span className="hidden rounded-none border-2 border-black bg-[#00F0FF] px-2 py-0.5 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] sm:inline-block">
                PRO V1.0
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-black/80">
              High-contrast vibrant QR generator & vector exporter
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onRandomPreset}
            id="random-style-btn"
            title="Surprise me with a random neobrutal style"
            className="flex items-center gap-1.5 border-2 border-black bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <Sparkles className="h-4 w-4 text-black" />
            <span className="hidden sm:inline">Surprise</span>
          </button>

          <button
            onClick={onOpenHistory}
            id="history-btn"
            className="relative flex items-center gap-1.5 border-2 border-black bg-[#A3E635] px-2.5 py-1.5 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <History className="h-4 w-4 text-black" />
            <span>Saved</span>
            {historyCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-black bg-black text-[10px] font-black text-white">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            id="reset-btn"
            title="Reset to default settings"
            className="flex items-center gap-1 border-2 border-black bg-[#FF5376] px-2.5 py-1.5 sm:px-3 sm:py-2 font-mono text-xs sm:text-sm font-black text-white shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
