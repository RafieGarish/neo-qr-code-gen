'use client';

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  Copy,
  Check,
  BookmarkPlus,
  ExternalLink,
  ShieldCheck,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { QRStyleSettings, QRContentType } from '@/types/qr';
import { renderQRToCanvas, generateQRSVG, parseQRPayload } from '@/lib/qr-generator';

interface QRPreviewProps {
  content: string;
  contentType: QRContentType;
  settings: QRStyleSettings;
  onSaveToHistory: () => void;
}

export function QRPreview({ content, contentType, settings, onSaveToHistory }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [exportScale, setExportScale] = useState<number>(2); // 1 = 360, 2 = 720, 4 = 1440
  const [includeFrameInExport, setIncludeFrameInExport] = useState<boolean>(true);
  const [previewZoom, setPreviewZoom] = useState<number>(1);
  const [isRendering, setIsRendering] = useState(false);

  // Render QR code to canvas whenever content or settings change
  useEffect(() => {
    if (!canvasRef.current || !content) return;
    setIsRendering(true);

    renderQRToCanvas(canvasRef.current, content, settings, {
      exportScale: 1, // Preview scale
      includeFrame: true,
    })
      .catch((err) => {
        console.error('Failed to render QR Code:', err);
      })
      .finally(() => {
        setIsRendering(false);
      });
  }, [content, settings]);

  const parsed = parseQRPayload(content);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFE500', '#00F0FF', '#FF5376', '#A3E635', '#000000'],
      });
    } catch {
      // safe fallback if not supported
    }
  };

  // Download PNG file
  const handleDownloadPNG = async () => {
    if (!content) return;

    // Create a temporary off-screen canvas for high-resolution render
    const offscreenCanvas = document.createElement('canvas');
    await renderQRToCanvas(offscreenCanvas, content, settings, {
      exportScale: exportScale,
      includeFrame: includeFrameInExport,
    });

    const dataUrl = offscreenCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `neobrutal-qr-${Date.now()}-${exportScale * 360}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    triggerConfetti();
  };

  // Download SVG Vector file
  const handleDownloadSVG = () => {
    if (!content) return;
    const svgString = generateQRSVG(content, settings);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neobrutal-qr-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    triggerConfetti();
  };

  // Copy PNG image to clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      const offscreenCanvas = document.createElement('canvas');
      await renderQRToCanvas(offscreenCanvas, content, settings, {
        exportScale: 2,
        includeFrame: includeFrameInExport,
      });

      offscreenCanvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setCopied(true);
          triggerConfetti();
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Fallback if clipboard item write fails in iframe
          setCopiedPayload(true);
          navigator.clipboard.writeText(content);
          setTimeout(() => setCopiedPayload(false), 2000);
        }
      });
    } catch {
      setCopiedPayload(true);
      navigator.clipboard.writeText(content);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  // Copy raw payload text
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(content);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-5 lg:sticky lg:top-6">
      {/* The Showcase Stage */}
      <div className="relative border-[3px] border-black bg-[#F8FAFC] p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
        {/* Angled Yellow Tape Decor */}
        <div className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 -rotate-2 border-2 border-black bg-[#FFE500] px-4 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]">
          ★ LIVE PREVIEW ★
        </div>

        {/* Zoom & View Controls */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Stage</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPreviewZoom((z) => Math.max(0.7, z - 0.1))}
              id="zoom-out-btn"
              title="Zoom out"
              className="border border-black bg-white p-1 shadow-[1px_1px_0px_0px_#000] hover:bg-slate-100"
            >
              <ZoomOut className="h-3.5 w-3.5 text-black" />
            </button>
            <span className="font-mono text-[11px] font-bold px-1 text-black">
              {Math.round(previewZoom * 100)}%
            </span>
            <button
              onClick={() => setPreviewZoom((z) => Math.min(1.4, z + 0.1))}
              id="zoom-in-btn"
              title="Zoom in"
              className="border border-black bg-white p-1 shadow-[1px_1px_0px_0px_#000] hover:bg-slate-100"
            >
              <ZoomIn className="h-3.5 w-3.5 text-black" />
            </button>
            <button
              onClick={() => setPreviewZoom(1)}
              id="zoom-reset-btn"
              title="Reset Zoom"
              className="border border-black bg-white p-1 shadow-[1px_1px_0px_0px_#000] hover:bg-slate-100 ml-1"
            >
              <Maximize2 className="h-3.5 w-3.5 text-black" />
            </button>
          </div>
        </div>

        {/* Canvas Display Container */}
        <div className="flex min-h-[360px] items-center justify-center overflow-auto rounded-none border-2 border-dashed border-black/40 bg-white p-4">
          <div
            style={{
              transform: `scale(${previewZoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="flex items-center justify-center"
          >
            <canvas
              ref={canvasRef}
              id="qr-preview-canvas"
              className="max-h-[460px] max-w-full object-contain"
            />
          </div>
        </div>

        {/* Export Configuration Bar */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 border-2 border-black bg-[#FEF08A] p-3 shadow-[3px_3px_0px_0px_#000]">
          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-black">
              Export Resolution
            </label>
            <div className="mt-1 flex gap-1">
              {[
                { label: '512px', scale: 1.42 },
                { label: '1024px', scale: 2.84 },
                { label: '2048px (HD)', scale: 5.68 },
              ].map((res) => (
                <button
                  key={res.label}
                  type="button"
                  onClick={() => setExportScale(res.scale)}
                  className={`flex-1 border border-black py-1 font-mono text-[11px] font-bold transition-all ${
                    exportScale === res.scale
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-amber-100'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-black">
              Export Layout Mode
            </label>
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                onClick={() => setIncludeFrameInExport(true)}
                className={`flex-1 border border-black py-1 font-mono text-[11px] font-bold transition-all ${
                  includeFrameInExport ? 'bg-black text-white' : 'bg-white text-black hover:bg-amber-100'
                }`}
              >
                With Badge / Frame
              </button>
              <button
                type="button"
                onClick={() => setIncludeFrameInExport(false)}
                className={`flex-1 border border-black py-1 font-mono text-[11px] font-bold transition-all ${
                  !includeFrameInExport ? 'bg-black text-white' : 'bg-white text-black hover:bg-amber-100'
                }`}
              >
                Raw QR Only
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {/* Download PNG */}
          <button
            type="button"
            id="download-png-btn"
            onClick={handleDownloadPNG}
            className="flex items-center justify-center gap-1.5 border-2 border-black bg-[#A3E635] px-3 py-2.5 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>PNG Image</span>
          </button>

          {/* Download Vector SVG */}
          <button
            type="button"
            id="download-svg-btn"
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-1.5 border-2 border-black bg-[#00F0FF] px-3 py-2.5 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <FileCode className="h-4 w-4 stroke-[2.5]" />
            <span>Vector SVG</span>
          </button>

          {/* Copy Image / Text */}
          <button
            type="button"
            id="copy-image-btn"
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-1.5 border-2 border-black bg-[#F472B6] px-3 py-2.5 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 stroke-[2.5]" />
                <span>Copy Image</span>
              </>
            )}
          </button>

          {/* Save to Storage */}
          <button
            type="button"
            id="save-qr-btn"
            onClick={() => {
              onSaveToHistory();
              triggerConfetti();
            }}
            className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 border-2 border-black bg-[#FFE500] px-4 py-2.5 font-mono text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <BookmarkPlus className="h-4 w-4 stroke-[2.5]" />
            <span>Save to Favorites / History</span>
          </button>
        </div>
      </div>

      {/* Integrated Live Scanner & Payload Decoder Tester */}
      <div className="border-[3px] border-black bg-white p-4 shadow-[5px_5px_0px_0px_#000]">
        <div className="mb-2 flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-black stroke-[2.5]" />
            <h3 className="font-mono text-xs sm:text-sm font-black uppercase text-black">
              Scanner Verification & Decoder
            </h3>
          </div>
          <span className="font-mono text-[10px] font-black uppercase bg-[#00F0FF] border border-black px-1.5 py-0.5">
            {parsed.type}
          </span>
        </div>

        <div className="space-y-2 bg-[#F1F5F9] border-2 border-black p-2.5">
          <div className="font-mono text-xs font-black text-black break-words">
            {parsed.summary}
          </div>

          <div className="grid grid-cols-1 gap-1 text-[11px] font-mono text-black/80">
            {Object.entries(parsed.details).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-2 border-b border-black/10 pb-0.5">
                <span className="font-bold">{key}:</span>
                <span className="font-mono truncate max-w-[200px]" title={val}>
                  {val}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {parsed.actionUrl && (
              <a
                href={parsed.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border border-black bg-black px-2 py-1 font-mono text-[11px] font-bold text-white hover:bg-neutral-800"
              >
                <span>Test Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <button
              type="button"
              onClick={handleCopyPayload}
              className="flex items-center gap-1 border border-black bg-white px-2 py-1 font-mono text-[11px] font-bold text-black hover:bg-[#FFE500]"
            >
              {copiedPayload ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copiedPayload ? 'Copied' : 'Copy Raw Data'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
