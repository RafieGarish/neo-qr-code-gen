'use client';

import React from 'react';
import { X, Trash2, ArrowUpRight, Clock, QrCode } from 'lucide-react';
import { QRHistoryItem } from '@/types/qr';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QRHistoryItem[];
  onRestore: (item: QRHistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistoryModal({
  isOpen,
  onClose,
  items,
  onRestore,
  onDelete,
  onClearAll,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl border-[3px] border-black bg-white p-5 shadow-[8px_8px_0px_0px_#FFE500]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-[#FFE500] shadow-[2px_2px_0px_0px_#000]">
              <QrCode className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-black uppercase text-black">
                Saved QR Archives ({items.length})
              </h2>
              <p className="font-mono text-xs text-black/70">
                Stored in local cache. Instant 1-click restore.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="close-history-btn"
            className="border-2 border-black bg-[#FF5376] p-1.5 text-white shadow-[2px_2px_0px_0px_#000] hover:bg-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="my-4 max-h-[60vh] space-y-2.5 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-yellow-100 shadow-[3px_3px_0px_0px_#000]">
                <Clock className="h-8 w-8 text-black/80" />
              </div>
              <p className="mt-3 font-mono text-sm font-black uppercase text-black">
                No Saved QR Codes Yet
              </p>
              <p className="mt-1 font-mono text-xs text-black/60 max-w-xs">
                Click &quot;Save to Favorites&quot; on any generated QR code to store and revisit it later.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-black bg-[#F8FAFC] p-3 shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-[#FFFBEB]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="border border-black bg-[#00F0FF] px-1.5 py-0.5 font-mono text-[10px] font-black uppercase text-black">
                      {item.contentType}
                    </span>
                    <span className="font-mono text-xs font-black text-black truncate max-w-[280px]">
                      {item.title}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-black/70 truncate max-w-sm">
                    {item.rawContent}
                  </p>
                  <span className="block font-mono text-[10px] text-black/50">
                    Saved on {new Date(item.createdAt).toLocaleDateString()} at{' '}
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 border-2 border-black bg-[#A3E635] px-2.5 py-1.5 font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_#000] hover:bg-lime-400 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span>Load</span>
                    <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    title="Delete item"
                    className="border-2 border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] hover:bg-rose-100 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="flex items-center justify-between border-t-2 border-black pt-3">
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 border border-black bg-neutral-100 px-2.5 py-1 font-mono text-xs font-bold text-black hover:bg-rose-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onClose}
              className="border-2 border-black bg-black px-4 py-1.5 font-mono text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_#FFE500]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
