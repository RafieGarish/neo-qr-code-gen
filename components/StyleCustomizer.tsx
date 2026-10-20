'use client';

import React, { useRef } from 'react';
import {
  Palette,
  Shapes,
  Eye,
  Smile,
  Upload,
  Layers,
  X,
  Sparkles,
  Square,
  Circle,
  ShieldAlert,
} from 'lucide-react';
import {
  QRStyleSettings,
  QRModuleStyle,
  QREyeStyle,
  QRFrameStyle,
  QRErrorCorrection,
} from '@/types/qr';
import { NEOBRUTALISM_PRESETS, PRESET_EMOJIS } from '@/lib/qr-generator';

interface StyleCustomizerProps {
  settings: QRStyleSettings;
  setSettings: React.Dispatch<React.SetStateAction<QRStyleSettings>>;
  onApplyPreset: (presetId: string) => void;
}

export function StyleCustomizer({ settings, setSettings, onApplyPreset }: StyleCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSettings((prev) => ({
          ...prev,
          logoType: 'image',
          logoValue: reader.result as string,
          errorCorrection: 'H',
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const moduleShapes: Array<{ id: QRModuleStyle; label: string; desc: string }> = [
    { id: 'square', label: 'Square', desc: 'Classic brutalist sharp blocks' },
    { id: 'rounded', label: 'Rounded', desc: 'Curved module edges' },
    { id: 'dots', label: 'Dots', desc: 'Punchy circular modules' },
    { id: 'diamond', label: 'Diamond', desc: '45-degree angled matrix' },
    { id: 'squircle', label: 'Squircle', desc: 'Continuous soft geometry' },
  ];

  const eyeStyles: Array<{ id: QREyeStyle; label: string; desc: string }> = [
    { id: 'square', label: 'Square', desc: 'Stark geometric' },
    { id: 'rounded', label: 'Rounded', desc: 'Smooth outer ring' },
    { id: 'circle', label: 'Circle', desc: 'Concentric eye' },
    { id: 'double', label: 'Double', desc: 'High-impact double border' },
  ];

  const frameOptions: Array<{ id: QRFrameStyle; label: string }> = [
    { id: 'none', label: 'No Frame (Raw)' },
    { id: 'bottom-banner', label: 'Bottom Banner' },
    { id: 'top-banner', label: 'Top Banner' },
    { id: 'polaroid', label: 'Polaroid Card' },
    { id: 'ticket', label: 'Sticker Ticket' },
  ];

  return (
    <div className="space-y-6 border-[3px] border-black bg-white p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center border-2 border-black bg-[#A3E635] font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000]">
            2
          </span>
          <h2 className="font-mono text-base sm:text-lg font-black uppercase text-black">
            Neobrutalist Styling & Frame
          </h2>
        </div>
        <span className="font-mono text-xs font-bold uppercase bg-[#FFE500] border border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_#000]">
          Custom Engine
        </span>
      </div>

      {/* 1. Neobrutalism Preset Palettes */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
          <Palette className="h-3.5 w-3.5" />
          <span>Vibrant Color Presets</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NEOBRUTALISM_PRESETS.map((preset) => {
            const isSelected = settings.presetId === preset.id;
            return (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={`flex flex-col items-start border-2 border-black p-2 text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-black -translate-x-0.5 -translate-y-0.5 shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]'
                }`}
                style={{ backgroundColor: isSelected ? '#FEF08A' : '#FFFFFF' }}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-black text-black">{preset.name}</span>
                  <div className="flex gap-1">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black"
                      style={{ backgroundColor: preset.bgColor }}
                    />
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black"
                      style={{ backgroundColor: preset.fgColor }}
                    />
                  </div>
                </div>
                <span className="mt-1 font-mono text-[10px] text-black/70">{preset.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Pickers */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 border-2 border-black bg-[#F8FAFC] p-3 shadow-[3px_3px_0px_0px_#000]">
        <div>
          <label htmlFor="color-fg" className="block font-mono text-[11px] font-black uppercase text-black">
            Module Color
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="color-fg"
              type="color"
              value={settings.fgColor}
              onChange={(e) =>
                setSettings((p) => ({ ...p, fgColor: e.target.value, presetId: 'custom' }))
              }
              className="h-8 w-10 cursor-pointer border-2 border-black p-0 bg-transparent"
            />
            <span className="font-mono text-xs font-bold uppercase">{settings.fgColor}</span>
          </div>
        </div>

        <div>
          <label htmlFor="color-bg" className="block font-mono text-[11px] font-black uppercase text-black">
            QR Background
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="color-bg"
              type="color"
              value={settings.bgColor}
              onChange={(e) =>
                setSettings((p) => ({ ...p, bgColor: e.target.value, presetId: 'custom' }))
              }
              className="h-8 w-10 cursor-pointer border-2 border-black p-0 bg-transparent"
            />
            <span className="font-mono text-xs font-bold uppercase">{settings.bgColor}</span>
          </div>
        </div>

        <div>
          <label htmlFor="color-eye" className="block font-mono text-[11px] font-black uppercase text-black">
            Corner Eyes
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="color-eye"
              type="color"
              value={settings.eyeColor || settings.fgColor}
              onChange={(e) =>
                setSettings((p) => ({ ...p, eyeColor: e.target.value, presetId: 'custom' }))
              }
              className="h-8 w-10 cursor-pointer border-2 border-black p-0 bg-transparent"
            />
            <span className="font-mono text-xs font-bold uppercase">{settings.eyeColor || settings.fgColor}</span>
          </div>
        </div>

        <div>
          <label htmlFor="color-frame" className="block font-mono text-[11px] font-black uppercase text-black">
            Banner / Badge
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              id="color-frame"
              type="color"
              value={settings.frameColor}
              onChange={(e) =>
                setSettings((p) => ({ ...p, frameColor: e.target.value, presetId: 'custom' }))
              }
              className="h-8 w-10 cursor-pointer border-2 border-black p-0 bg-transparent"
            />
            <span className="font-mono text-xs font-bold uppercase">{settings.frameColor}</span>
          </div>
        </div>
      </div>

      {/* 3. Module & Eye Shape Selectors */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Module Shape */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
            <Shapes className="h-3.5 w-3.5" />
            <span>QR Module Shape</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3">
            {moduleShapes.map((shape) => {
              const isSelected = settings.moduleStyle === shape.id;
              return (
                <button
                  key={shape.id}
                  id={`shape-${shape.id}`}
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, moduleStyle: shape.id }))}
                  className={`border-2 border-black p-2 font-mono text-xs font-black text-black transition-all ${
                    isSelected
                      ? 'bg-[#FFE500] shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white shadow-[1px_1px_0px_0px_#000] hover:bg-slate-50'
                  }`}
                >
                  <div>{shape.label}</div>
                  <div className="text-[9px] font-normal text-black/60 truncate">{shape.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Eye Style */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
            <Eye className="h-3.5 w-3.5" />
            <span>Corner Eye Pattern</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2">
            {eyeStyles.map((eye) => {
              const isSelected = settings.eyeStyle === eye.id;
              return (
                <button
                  key={eye.id}
                  id={`eye-${eye.id}`}
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, eyeStyle: eye.id }))}
                  className={`border-2 border-black p-2 font-mono text-xs font-black text-black transition-all ${
                    isSelected
                      ? 'bg-[#00F0FF] shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                      : 'bg-white shadow-[1px_1px_0px_0px_#000] hover:bg-slate-50'
                  }`}
                >
                  <div>{eye.label}</div>
                  <div className="text-[9px] font-normal text-black/60 truncate">{eye.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Frame & Neobrutalism Badges */}
      <div className="space-y-3 border-2 border-black bg-white p-3 shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
            <Layers className="h-3.5 w-3.5" />
            <span>Card Framing & Sticker Banner</span>
          </label>
          <span className="font-mono text-[11px] font-bold text-black/70">Polaroid / Tape / Tickets</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {frameOptions.map((opt) => {
            const isSelected = settings.frameStyle === opt.id;
            return (
              <button
                key={opt.id}
                id={`frame-${opt.id}`}
                type="button"
                onClick={() => setSettings((p) => ({ ...p, frameStyle: opt.id }))}
                className={`border-2 border-black px-2 py-2 font-mono text-xs font-black text-black transition-all ${
                  isSelected
                    ? 'bg-[#F472B6] shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                    : 'bg-white shadow-[1px_1px_0px_0px_#000] hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {settings.frameStyle !== 'none' && (
          <div className="mt-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <label htmlFor="frame-text" className="block font-mono text-[11px] font-bold uppercase text-black">
                Custom Banner / Caption Text
              </label>
              <input
                id="frame-text"
                type="text"
                value={settings.frameText}
                onChange={(e) => setSettings((p) => ({ ...p, frameText: e.target.value }))}
                placeholder="e.g. SCAN ME, VISIT US, CONNECT NOW"
                maxLength={30}
                className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
              />
            </div>
            <div className="flex items-end gap-1.5">
              {['SCAN ME', 'VISIT US', 'WIFI PASS', 'PAY HERE'].map((quickText) => (
                <button
                  key={quickText}
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, frameText: quickText }))}
                  className="border border-black bg-[#F1F5F9] px-2 py-1.5 font-mono text-[10px] font-bold text-black shadow-[1px_1px_0px_0px_#000] hover:bg-[#FFE500]"
                >
                  {quickText}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Center Icon / Sticker / Logo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
            <Smile className="h-3.5 w-3.5" />
            <span>Center Icon / Logo / Sticker Badge</span>
          </label>
          {settings.logoType !== 'none' && (
            <button
              type="button"
              onClick={() => setSettings((p) => ({ ...p, logoType: 'none', logoValue: '' }))}
              className="flex items-center gap-1 font-mono text-[11px] font-black text-[#EF4444] hover:underline"
            >
              <X className="h-3 w-3" />
              Remove Center Logo
            </button>
          )}
        </div>

        {/* Emoji Row */}
        <div className="flex flex-wrap items-center gap-1.5 border-2 border-black bg-[#F8FAFC] p-2.5 shadow-[2px_2px_0px_0px_#000]">
          <span className="font-mono text-xs font-bold text-black mr-1">Quick Icons:</span>
          {PRESET_EMOJIS.map((emoji) => {
            const isSelected = settings.logoType === 'emoji' && settings.logoValue === emoji;
            return (
              <button
                key={emoji}
                id={`emoji-${emoji}`}
                type="button"
                onClick={() =>
                  setSettings((p) => ({
                    ...p,
                    logoType: 'emoji',
                    logoValue: emoji,
                    errorCorrection: 'H',
                  }))
                }
                className={`flex h-8 w-8 items-center justify-center border-2 border-black text-base transition-all ${
                  isSelected
                    ? 'bg-[#FFE500] shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                    : 'bg-white shadow-[1px_1px_0px_0px_#000] hover:bg-slate-100'
                }`}
              >
                {emoji}
              </button>
            );
          })}
        </div>

        {/* Custom Upload Button */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="logo-upload-input"
          />
          <button
            type="button"
            id="upload-logo-btn"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-slate-50 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#000]"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Custom Image Logo</span>
          </button>

          {settings.logoType === 'image' && settings.logoValue && (
            <div className="flex items-center gap-2 border-2 border-black bg-[#A3E635] px-2 py-1 shadow-[2px_2px_0px_0px_#000]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logoValue}
                alt="Logo preview"
                className="h-6 w-6 rounded-full border border-black object-cover"
              />
              <span className="font-mono text-xs font-black">Active Logo</span>
            </div>
          )}
        </div>
      </div>

      {/* 6. Error Correction & Shadow Depth */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-black/20">
        <div>
          <label htmlFor="error-correction" className="flex items-center gap-1 font-mono text-xs font-black uppercase text-black">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Error Correction (Redundancy)</span>
          </label>
          <select
            id="error-correction"
            value={settings.errorCorrection}
            disabled={settings.logoType !== 'none'}
            onChange={(e) =>
              setSettings((p) => ({ ...p, errorCorrection: e.target.value as QRErrorCorrection }))
            }
            className="mt-1 w-full border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000] disabled:bg-slate-100 disabled:text-black/60 focus:outline-none"
          >
            <option value="L">L - Low (7% recovery)</option>
            <option value="M">M - Medium (15% recovery)</option>
            <option value="Q">Q - Quartile (25% recovery)</option>
            <option value="H">H - High (30% recovery, best for logo)</option>
          </select>
          {settings.logoType !== 'none' && (
            <span className="font-mono text-[10px] text-black/70">
              * Automatically locked to High (30%) when center logo is active.
            </span>
          )}
        </div>

        <div>
          <label htmlFor="shadow-depth" className="block font-mono text-xs font-black uppercase text-black">
            Neobrutalist Drop Shadow
          </label>
          <div className="mt-1 flex items-center gap-2">
            {[0, 4, 8].map((depth) => (
              <button
                key={depth}
                type="button"
                onClick={() => setSettings((p) => ({ ...p, shadowOffset: depth }))}
                className={`flex-1 border-2 border-black py-1.5 font-mono text-xs font-bold transition-all ${
                  settings.shadowOffset === depth
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_#FFE500]'
                    : 'bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-slate-50'
                }`}
              >
                {depth === 0 ? 'Flat (0px)' : `${depth}px Solid`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
