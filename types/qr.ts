export type QRContentType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms' | 'crypto';

export type QRModuleStyle = 'square' | 'dots' | 'rounded' | 'diamond' | 'squircle';
export type QREyeStyle = 'square' | 'rounded' | 'circle' | 'double';
export type QRFrameStyle = 'none' | 'bottom-banner' | 'top-banner' | 'polaroid' | 'ticket';
export type QRErrorCorrection = 'L' | 'M' | 'Q' | 'H';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface CryptoData {
  currency: 'BTC' | 'ETH' | 'SOL' | 'USDT' | 'PAYPAL' | 'UPI';
  address: string;
  amount?: string;
  note?: string;
}

export interface QRStyleSettings {
  presetId: string;
  fgColor: string;
  bgColor: string;
  cardBgColor: string;
  eyeColor: string;
  moduleStyle: QRModuleStyle;
  eyeStyle: QREyeStyle;
  frameStyle: QRFrameStyle;
  frameText: string;
  frameColor: string;
  logoType: 'none' | 'emoji' | 'image';
  logoValue: string;
  errorCorrection: QRErrorCorrection;
  hasBorder: boolean;
  borderWidth: number;
  shadowOffset: number;
  stickerBadge: string;
}

export interface QRHistoryItem {
  id: string;
  title: string;
  contentType: QRContentType;
  rawContent: string;
  settings: QRStyleSettings;
  createdAt: number;
}
