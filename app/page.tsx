'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { ContentForm } from '@/components/ContentForm';
import { StyleCustomizer } from '@/components/StyleCustomizer';
import { QRPreview } from '@/components/QRPreview';
import { HistoryModal } from '@/components/HistoryModal';
import {
  QRContentType,
  QRStyleSettings,
  WifiData,
  VCardData,
  EmailData,
  SmsData,
  CryptoData,
  QRHistoryItem,
} from '@/types/qr';
import { encodeQRContent, NEOBRUTALISM_PRESETS, PRESET_EMOJIS } from '@/lib/qr-generator';

const DEFAULT_SETTINGS: QRStyleSettings = {
  presetId: 'cyber-yellow',
  fgColor: '#000000',
  bgColor: '#FFE500',
  cardBgColor: '#FFFFFF',
  eyeColor: '#000000',
  moduleStyle: 'square',
  eyeStyle: 'square',
  frameStyle: 'bottom-banner',
  frameText: 'SCAN ME',
  frameColor: '#FFE500',
  logoType: 'emoji',
  logoValue: '⚡',
  errorCorrection: 'H',
  hasBorder: true,
  borderWidth: 3,
  shadowOffset: 6,
  stickerBadge: 'FEATURED',
};

export default function Home() {
  // Content States
  const [activeType, setActiveType] = useState<QRContentType>('url');
  const [url, setUrl] = useState('https://google.com');
  const [text, setText] = useState('Neobrutalism: Bold borders, hard shadows, high contrast!');
  const [wifi, setWifi] = useState<WifiData>({
    ssid: 'Cyberpunk_HQ',
    password: 'SuperSecretPassword!2026',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcard, setVcard] = useState<VCardData>({
    firstName: 'Nova',
    lastName: 'Vance',
    phone: '+1 415-555-0199',
    email: 'nova@neostudio.design',
    company: 'NeoBrutal Lab',
    title: 'Creative Technologist',
    website: 'https://neostudio.design',
    address: '88 Market St, San Francisco, CA',
  });
  const [email, setEmail] = useState<EmailData>({
    email: 'hello@neostudio.design',
    subject: 'Project Collaboration',
    body: 'Hi team, let’s build something bold together!',
  });
  const [sms, setSms] = useState<SmsData>({
    phone: '+14155550199',
    message: 'Meet at the corner coffee shop at 3 PM.',
  });
  const [crypto, setCrypto] = useState<CryptoData>({
    currency: 'BTC',
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    amount: '0.015',
  });

  // Style Settings
  const [settings, setSettings] = useState<QRStyleSettings>(DEFAULT_SETTINGS);

  // History & Storage
  const [history, setHistory] = useState<QRHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('neobrutal_qr_history');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    return [];
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save history to localStorage
  const persistHistory = (newHistory: QRHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('neobrutal_qr_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  };

  // Encoded content
  const encodedContent = useMemo(() => {
    return encodeQRContent(activeType, {
      url,
      text,
      wifi,
      vcard,
      email,
      sms,
      crypto,
    });
  }, [activeType, url, text, wifi, vcard, email, sms, crypto]);

  // Apply a preset palette
  const handleApplyPreset = useCallback((presetId: string) => {
    const p = NEOBRUTALISM_PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    setSettings((prev) => ({
      ...prev,
      presetId: p.id,
      fgColor: p.fgColor,
      bgColor: p.bgColor,
      cardBgColor: p.cardBgColor,
      eyeColor: p.eyeColor,
      frameColor: p.frameColor,
    }));
  }, []);

  // Random preset generator
  const handleRandomPreset = useCallback(() => {
    const randomPreset = NEOBRUTALISM_PRESETS[Math.floor(Math.random() * NEOBRUTALISM_PRESETS.length)];
    const moduleShapes: QRStyleSettings['moduleStyle'][] = ['square', 'rounded', 'dots', 'diamond', 'squircle'];
    const eyeStyles: QRStyleSettings['eyeStyle'][] = ['square', 'rounded', 'circle', 'double'];
    const frames: QRStyleSettings['frameStyle'][] = ['none', 'bottom-banner', 'top-banner', 'polaroid', 'ticket'];
    const randomEmoji = PRESET_EMOJIS[Math.floor(Math.random() * PRESET_EMOJIS.length)];

    setSettings({
      presetId: randomPreset.id,
      fgColor: randomPreset.fgColor,
      bgColor: randomPreset.bgColor,
      cardBgColor: randomPreset.cardBgColor,
      eyeColor: randomPreset.eyeColor,
      frameColor: randomPreset.frameColor,
      moduleStyle: moduleShapes[Math.floor(Math.random() * moduleShapes.length)],
      eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
      frameStyle: frames[Math.floor(Math.random() * frames.length)],
      frameText: 'SCAN ME',
      logoType: 'emoji',
      logoValue: randomEmoji,
      errorCorrection: 'H',
      hasBorder: true,
      borderWidth: 3,
      shadowOffset: 6,
      stickerBadge: 'NEO',
    });
  }, []);

  // Reset to default
  const handleReset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setActiveType('url');
    setUrl('https://google.com');
  }, []);

  // Save current item to history
  const handleSaveToHistory = useCallback(() => {
    let title = 'QR Code';
    switch (activeType) {
      case 'url':
        title = url.replace(/^https?:\/\//, '').split('/')[0] || 'Link';
        break;
      case 'wifi':
        title = `Wi-Fi: ${wifi.ssid}`;
        break;
      case 'text':
        title = text.slice(0, 24);
        break;
      case 'vcard':
        title = `${vcard.firstName} ${vcard.lastName}`.trim() || 'Contact';
        break;
      case 'email':
        title = `Email: ${email.email}`;
        break;
      case 'sms':
        title = `SMS: ${sms.phone}`;
        break;
      case 'crypto':
        title = `${crypto.currency} Payment`;
        break;
    }

    const newItem: QRHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      contentType: activeType,
      rawContent: encodedContent,
      settings: { ...settings },
      createdAt: Date.now(),
    };

    persistHistory([newItem, ...history.slice(0, 49)]); // Keep up to 50
  }, [activeType, url, wifi, text, vcard, email, sms, crypto, encodedContent, settings, history]);

  // Restore item from history
  const handleRestoreItem = useCallback((item: QRHistoryItem) => {
    setActiveType(item.contentType);
    setSettings(item.settings);
    if (item.contentType === 'url') setUrl(item.rawContent);
    if (item.contentType === 'text') setText(item.rawContent);
  }, []);

  const handleDeleteHistoryItem = useCallback(
    (id: string) => {
      persistHistory(history.filter((i) => i.id !== id));
    },
    [history]
  );

  const handleClearAllHistory = useCallback(() => {
    persistHistory([]);
  }, []);

  return (
    <div className="h-screen bg-[#FFFDF5] text-black selection:bg-[#FFE500] selection:text-black">
      {/* Top Banner Marquee */}
      <div className="overflow-hidden border-b-2 border-black bg-black py-1.5 text-white">
        <div className="flex animate-marquee whitespace-nowrap font-mono text-xs font-black uppercase tracking-wider">
          <span className="mx-4">⚡ NEOBRUTALISM QR CODE STUDIO</span>
          <span className="mx-4 text-[#FFE500]">★ ZERO WATERMARKS</span>
          <span className="mx-4">⚡ 100% PRIVATE CLIENT-SIDE GENERATION</span>
          <span className="mx-4 text-[#00F0FF]">★ ULTRA HD PNG & VECTOR SVG</span>
          <span className="mx-4">⚡ CUSTOM STICKER FRAMES & BADGES</span>
          <span className="mx-4 text-[#A3E635]">★ LIVE PAYLOAD VERIFICATION</span>
          <span className="mx-4">⚡ NEOBRUTALISM QR CODE STUDIO</span>
          <span className="mx-4 text-[#FFE500]">★ ZERO WATERMARKS</span>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        onReset={handleReset}
        onRandomPreset={handleRandomPreset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Input Forms & Style Customizer (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step 1: Payload / Data Content */}
            <ContentForm
              activeType={activeType}
              onTypeChange={setActiveType}
              url={url}
              setUrl={setUrl}
              text={text}
              setText={setText}
              wifi={wifi}
              setWifi={setWifi}
              vcard={vcard}
              setVcard={setVcard}
              email={email}
              setEmail={setEmail}
              sms={sms}
              setSms={setSms}
              crypto={crypto}
              setCrypto={setCrypto}
            />

            {/* Step 2: Styling & Frame Customizer */}
            <StyleCustomizer
              settings={settings}
              setSettings={setSettings}
              onApplyPreset={handleApplyPreset}
            />
          </div>

          {/* Right Column: Sticky Live Preview & Instant Export (5 cols) */}
          <div className="lg:col-span-5">
            <QRPreview
              content={encodedContent}
              contentType={activeType}
              settings={settings}
              onSaveToHistory={handleSaveToHistory}
            />
          </div>
        </div>

        {/* Neobrutalist Info & Spec Cards */}
        <section className="mt-12 border-[3px] border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
          <div className="border-b-2 border-black pb-3">
            <h3 className="font-mono text-base sm:text-lg font-black uppercase text-black">
              Neobrutalism Design Specifications & Capabilities
            </h3>
            <p className="font-mono text-xs text-black/70">
              Built with mathematical high contrast, stark solid borders, and zero-compression vector paths.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border-2 border-black bg-[#FEF08A] p-3 shadow-[3px_3px_0px_0px_#000]">
              <span className="block font-mono text-xs font-black uppercase text-black">
                1. Vector SVG Export
              </span>
              <p className="mt-1 font-mono text-xs text-black/80">
                Exports clean geometric rects and circles. Ready for laser cutting, stickers, screen printing, merchandise, and vector editors.
              </p>
            </div>

            <div className="border-2 border-black bg-[#BAE6FD] p-3 shadow-[3px_3px_0px_0px_#000]">
              <span className="block font-mono text-xs font-black uppercase text-black">
                2. Reed-Solomon Resilience
              </span>
              <p className="mt-1 font-mono text-xs text-black/80">
                High Error Correction (30%) guarantees complete readability even when centered badges, custom logos, or stickers are applied.
              </p>
            </div>

            <div className="border-2 border-black bg-[#BBF7D0] p-3 shadow-[3px_3px_0px_0px_#000]">
              <span className="block font-mono text-xs font-black uppercase text-black">
                3. Client-Side Privacy
              </span>
              <p className="mt-1 font-mono text-xs text-black/80">
                Your Wi-Fi passwords, contact details, and links never touch an external server. Everything is synthesized directly in browser memory.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onRestore={handleRestoreItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
