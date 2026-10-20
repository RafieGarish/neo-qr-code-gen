import QRCode from 'qrcode';
import { QRStyleSettings, WifiData, VCardData, EmailData, SmsData, CryptoData, QRContentType } from '@/types/qr';

export const NEOBRUTALISM_PRESETS: Array<{
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
  cardBgColor: string;
  eyeColor: string;
  frameColor: string;
  tag: string;
}> = [
  {
    id: 'cyber-yellow',
    name: 'Cyber Lemon',
    fgColor: '#000000',
    bgColor: '#FFE500',
    cardBgColor: '#FFFFFF',
    eyeColor: '#000000',
    frameColor: '#FFE500',
    tag: 'Classic Brutalist',
  },
  {
    id: 'acid-mint',
    name: 'Acid Mint',
    fgColor: '#121212',
    bgColor: '#86EFAC',
    cardBgColor: '#FAFAFA',
    eyeColor: '#059669',
    frameColor: '#86EFAC',
    tag: 'High Energy',
  },
  {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    fgColor: '#000000',
    bgColor: '#38BDF8',
    cardBgColor: '#FFFFFF',
    eyeColor: '#0284C7',
    frameColor: '#38BDF8',
    tag: 'Digital Neo',
  },
  {
    id: 'bubblegum-punch',
    name: 'Bubblegum',
    fgColor: '#0F172A',
    bgColor: '#F472B6',
    cardBgColor: '#FFF1F2',
    eyeColor: '#DB2777',
    frameColor: '#F472B6',
    tag: 'Vibrant Pop',
  },
  {
    id: 'tangerine-blaze',
    name: 'Tangerine',
    fgColor: '#000000',
    bgColor: '#FB923C',
    cardBgColor: '#FFF7ED',
    eyeColor: '#C2410C',
    frameColor: '#FB923C',
    tag: 'Punchy Warm',
  },
  {
    id: 'lilac-punk',
    name: 'Lilac Punk',
    fgColor: '#000000',
    bgColor: '#C084FC',
    cardBgColor: '#FAF5FF',
    eyeColor: '#7E22CE',
    frameColor: '#C084FC',
    tag: 'Retro Rave',
  },
  {
    id: 'monolith-ink',
    name: 'Monolith Ink',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    cardBgColor: '#F4F4F5',
    eyeColor: '#000000',
    frameColor: '#000000',
    tag: 'Monochrome',
  },
  {
    id: 'obsidian-glow',
    name: 'Obsidian Glow',
    fgColor: '#FFE500',
    bgColor: '#18181B',
    cardBgColor: '#27272A',
    eyeColor: '#FFE500',
    frameColor: '#FFE500',
    tag: 'Dark Modern',
  },
];

export const PRESET_EMOJIS = [
  '⚡', '🚀', '☕', '🖤', '🌐', '📶', '💬', '🍕',
  '💎', '🎯', '🎧', '💰', '🔥', '⭐', '✨', '👾',
];

// Helper to encode content into QR string format
export function encodeQRContent(
  type: QRContentType,
  data: {
    url?: string;
    text?: string;
    wifi?: WifiData;
    vcard?: VCardData;
    email?: EmailData;
    sms?: SmsData;
    crypto?: CryptoData;
  }
): string {
  switch (type) {
    case 'url': {
      const raw = data.url?.trim() || 'https://example.com';
      if (/^[a-zA-Z]+:\/\//i.test(raw)) {
        return raw;
      }
      return `https://${raw}`;
    }
    case 'text':
      return data.text || 'Hello Neobrutalism!';
    case 'wifi': {
      const { ssid = 'My-WiFi', password = '', encryption = 'WPA', hidden = false } = data.wifi || {};
      // WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<PASSWORD>;H:<true|false>;;
      const cleanSsid = ssid.replace(/([\\;,:"])/g, '\\$1');
      const cleanPass = password.replace(/([\\;,:"])/g, '\\$1');
      return `WIFI:S:${cleanSsid};T:${encryption};P:${cleanPass};H:${hidden ? 'true' : 'false'};;`;
    }
    case 'vcard': {
      const v = data.vcard || {
        firstName: 'Alex',
        lastName: 'Brutalist',
        phone: '+1 555-0199',
        email: 'alex@design.studio',
        company: 'Neo Studio',
        title: 'Lead Designer',
        website: 'https://design.studio',
        address: '123 Bold Ave, Cyber City',
      };
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName};${v.firstName};;;`,
        `FN:${v.firstName} ${v.lastName}`.trim(),
        v.company ? `ORG:${v.company}` : '',
        v.title ? `TITLE:${v.title}` : '',
        v.phone ? `TEL;TYPE=CELL:${v.phone}` : '',
        v.email ? `EMAIL:${v.email}` : '',
        v.website ? `URL:${v.website}` : '',
        v.address ? `ADR;TYPE=WORK:;;${v.address};;;;` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }
    case 'email': {
      const e = data.email || { email: 'hello@example.com', subject: 'Inquiry', body: 'Hi there,' };
      const query = new URLSearchParams();
      if (e.subject) query.set('subject', e.subject);
      if (e.body) query.set('body', e.body);
      const qStr = query.toString();
      return `mailto:${e.email}${qStr ? `?${qStr}` : ''}`;
    }
    case 'sms': {
      const s = data.sms || { phone: '+15550199', message: 'Hello from Neobrutalism QR!' };
      return `smsto:${s.phone}:${s.message}`;
    }
    case 'crypto': {
      const c = data.crypto || { currency: 'BTC', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' };
      switch (c.currency) {
        case 'BTC':
          return `bitcoin:${c.address}${c.amount ? `?amount=${c.amount}` : ''}`;
        case 'ETH':
          return `ethereum:${c.address}${c.amount ? `?value=${c.amount}` : ''}`;
        case 'SOL':
          return `solana:${c.address}${c.amount ? `?amount=${c.amount}` : ''}`;
        case 'PAYPAL':
          return `https://paypal.me/${c.address}${c.amount ? `/${c.amount}` : ''}`;
        case 'UPI':
          return `upi://pay?pa=${c.address}&pn=Recipient${c.amount ? `&am=${c.amount}` : ''}&cu=INR`;
        default:
          return c.address;
      }
    }
    default:
      return 'https://example.com';
  }
}

// Decode and format payload for human preview verification
export function parseQRPayload(content: string): {
  type: string;
  summary: string;
  details: Record<string, string>;
  actionUrl?: string;
} {
  if (content.startsWith('WIFI:')) {
    const ssidMatch = content.match(/S:([^;]+)/);
    const typeMatch = content.match(/T:([^;]+)/);
    const passMatch = content.match(/P:([^;]+)/);
    const hiddenMatch = content.match(/H:([^;]+)/);
    return {
      type: 'Wi-Fi Network',
      summary: `SSID: ${ssidMatch ? ssidMatch[1] : 'Unknown'}`,
      details: {
        Network: ssidMatch ? ssidMatch[1] : 'Hidden',
        Security: typeMatch ? typeMatch[1] : 'WPA',
        Password: passMatch ? passMatch[1] : '(None)',
        Hidden: hiddenMatch && hiddenMatch[1] === 'true' ? 'Yes' : 'No',
      },
    };
  }

  if (content.startsWith('BEGIN:VCARD')) {
    const fnMatch = content.match(/FN:([^\n\r]+)/);
    const telMatch = content.match(/TEL[^:]*:([^\n\r]+)/);
    const emailMatch = content.match(/EMAIL:([^\n\r]+)/);
    const orgMatch = content.match(/ORG:([^\n\r]+)/);
    return {
      type: 'Contact Card (vCard)',
      summary: fnMatch ? fnMatch[1] : 'Contact',
      details: {
        Name: fnMatch ? fnMatch[1] : 'Unknown',
        Phone: telMatch ? telMatch[1] : 'N/A',
        Email: emailMatch ? emailMatch[1] : 'N/A',
        Company: orgMatch ? orgMatch[1] : 'N/A',
      },
    };
  }

  if (content.startsWith('mailto:')) {
    const email = content.replace('mailto:', '').split('?')[0];
    return {
      type: 'Email',
      summary: email,
      details: { Recipient: email },
      actionUrl: content,
    };
  }

  if (content.startsWith('smsto:') || content.startsWith('sms:')) {
    const parts = content.replace(/^sms(to)?:/, '').split(':');
    return {
      type: 'SMS Message',
      summary: parts[0] || 'Phone',
      details: {
        Phone: parts[0] || '',
        Message: parts.slice(1).join(':') || '',
      },
    };
  }

  if (content.startsWith('bitcoin:') || content.startsWith('ethereum:') || content.startsWith('solana:') || content.startsWith('upi://')) {
    return {
      type: 'Payment / Crypto',
      summary: content.split('?')[0],
      details: { RawURI: content },
    };
  }

  if (/^https?:\/\//i.test(content)) {
    return {
      type: 'Website Link',
      summary: content,
      details: { URL: content },
      actionUrl: content,
    };
  }

  return {
    type: 'Plain Text',
    summary: content.slice(0, 60) + (content.length > 60 ? '...' : ''),
    details: { Content: content },
  };
}

// Check if a cell is part of the 3 finder pattern eyes
function isFinderPattern(r: number, c: number, size: number): boolean {
  // Top-left finder: 0..6, 0..6 (plus 1 quiet border: 0..7, 0..7)
  if (r <= 7 && c <= 7) return true;
  // Top-right finder: 0..7, (size - 8)..size - 1
  if (r <= 7 && c >= size - 8) return true;
  // Bottom-left finder: (size - 8)..size - 1, 0..7
  if (r >= size - 8 && c <= 7) return true;
  return false;
}

// Check if a cell is in the center logo area
function isCenterLogoArea(r: number, c: number, size: number, logoRadiusModules: number): boolean {
  if (logoRadiusModules <= 0) return false;
  const center = (size - 1) / 2;
  return Math.abs(r - center) <= logoRadiusModules && Math.abs(c - center) <= logoRadiusModules;
}

// Render QR code to Canvas
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  content: string,
  settings: QRStyleSettings,
  options: {
    exportScale?: number; // default 1 (e.g. 512, 1024, 2048)
    includeFrame?: boolean; // whether to draw the frame/badge
  } = {}
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const errorCorrection = settings.logoType !== 'none' ? 'H' : settings.errorCorrection;
  const qr = QRCode.create(content, { errorCorrectionLevel: errorCorrection });
  const moduleCount = qr.modules.size;

  // Layout sizing
  const exportScale = options.exportScale || 1;
  const baseQRSize = 360 * exportScale;
  const quietZone = 24 * exportScale;
  const innerQRSize = baseQRSize - quietZone * 2;
  const moduleSize = innerQRSize / moduleCount;

  // Frame heights and paddings
  const includeFrame = options.includeFrame ?? (settings.frameStyle !== 'none');
  let topExtra = 0;
  let bottomExtra = 0;
  let cardPadding = 20 * exportScale;

  if (includeFrame) {
    switch (settings.frameStyle) {
      case 'bottom-banner':
        bottomExtra = 64 * exportScale;
        break;
      case 'top-banner':
        topExtra = 64 * exportScale;
        break;
      case 'polaroid':
        topExtra = 24 * exportScale;
        bottomExtra = 84 * exportScale;
        cardPadding = 28 * exportScale;
        break;
      case 'ticket':
        topExtra = 48 * exportScale;
        bottomExtra = 60 * exportScale;
        cardPadding = 24 * exportScale;
        break;
      default:
        break;
    }
  }

  const canvasWidth = baseQRSize + cardPadding * 2;
  const canvasHeight = baseQRSize + cardPadding * 2 + topExtra + bottomExtra;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // If card has background / borders
  const qrX = cardPadding + quietZone;
  const qrY = cardPadding + topExtra + quietZone;

  // Draw Card Container
  if (includeFrame && settings.frameStyle !== 'none') {
    // Neobrutalist Shadow
    if (settings.shadowOffset > 0) {
      const shadowDist = settings.shadowOffset * exportScale;
      ctx.fillStyle = '#000000';
      ctx.fillRect(shadowDist, shadowDist, canvasWidth - shadowDist, canvasHeight - shadowDist);
    }

    // Card Fill
    ctx.fillStyle = settings.cardBgColor || '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0), canvasHeight - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0));

    // Card Border
    if (settings.hasBorder) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = (settings.borderWidth || 3) * exportScale;
      ctx.strokeRect(
        ctx.lineWidth / 2,
        ctx.lineWidth / 2,
        canvasWidth - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0) - ctx.lineWidth,
        canvasHeight - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0) - ctx.lineWidth
      );
    }

    // Draw Frame Banners
    drawFrameHeaderOrFooter(ctx, settings, canvasWidth - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0), canvasHeight - (settings.shadowOffset > 0 ? settings.shadowOffset * exportScale : 0), topExtra, bottomExtra, exportScale);
  }

  // Draw QR background inside its area
  const qrBgX = cardPadding;
  const qrBgY = cardPadding + topExtra;
  ctx.fillStyle = settings.bgColor;
  ctx.fillRect(qrBgX, qrBgY, baseQRSize, baseQRSize);

  // Border around QR inner block
  if (includeFrame && settings.hasBorder) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * exportScale;
    ctx.strokeRect(qrBgX, qrBgY, baseQRSize, baseQRSize);
  }

  // Determine logo bounds in modules
  const logoRadius = settings.logoType !== 'none' ? Math.floor(moduleCount * 0.16) : 0;

  // Render QR Modules
  ctx.fillStyle = settings.fgColor;

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (isFinderPattern(r, c, moduleCount)) continue; // Eyes handled separately
      if (isCenterLogoArea(r, c, moduleCount, logoRadius)) continue;

      if (qr.modules.get(r, c)) {
        const x = qrX + c * moduleSize;
        const y = qrY + r * moduleSize;
        drawModule(ctx, x, y, moduleSize, settings.moduleStyle, settings.fgColor);
      }
    }
  }

  // Render the 3 Finder Pattern Eyes
  const eyeCoords = [
    { r: 0, c: 0 },
    { r: 0, c: moduleCount - 7 },
    { r: moduleCount - 7, c: 0 },
  ];

  for (const { r, c } of eyeCoords) {
    const eyeX = qrX + c * moduleSize;
    const eyeY = qrY + r * moduleSize;
    const eyeSize = 7 * moduleSize;
    drawFinderEye(ctx, eyeX, eyeY, eyeSize, moduleSize, settings.eyeStyle, settings.eyeColor || settings.fgColor, settings.bgColor);
  }

  // Render Center Logo / Emoji / Sticker
  if (settings.logoType !== 'none') {
    const centerSize = (logoRadius * 2 + 1) * moduleSize;
    const centerX = qrX + ((moduleCount - 1) / 2 - logoRadius) * moduleSize;
    const centerY = qrY + ((moduleCount - 1) / 2 - logoRadius) * moduleSize;

    await drawCenterBadge(ctx, centerX, centerY, centerSize, settings, exportScale);
  }
}

// Draw individual module
function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: string,
  fgColor: string
) {
  ctx.fillStyle = fgColor;
  const padding = size * 0.04;
  const s = size - padding * 2;
  const mx = x + padding;
  const my = y + padding;

  switch (style) {
    case 'dots': {
      ctx.beginPath();
      ctx.arc(mx + s / 2, my + s / 2, s / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      const radius = s * 0.35;
      ctx.beginPath();
      ctx.roundRect(mx, my, s, s, radius);
      ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.beginPath();
      ctx.moveTo(mx + s / 2, my);
      ctx.lineTo(mx + s, my + s / 2);
      ctx.lineTo(mx + s / 2, my + s);
      ctx.lineTo(mx, my + s / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'squircle': {
      const radius = s * 0.48;
      ctx.beginPath();
      ctx.roundRect(mx, my, s, s, radius);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(mx, my, s, s);
      break;
    }
  }
}

// Draw Finder Pattern Eye
function drawFinderEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  moduleSize: number,
  eyeStyle: string,
  color: string,
  bgColor: string
) {
  ctx.save();

  if (eyeStyle === 'circle') {
    // Outer circle
    const center = x + size / 2;
    const centerY = y + size / 2;
    const outerR = size / 2;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(center, centerY, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Middle background circle
    const midR = outerR - moduleSize;
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(center, centerY, midR, 0, Math.PI * 2);
    ctx.fill();

    // Inner center circle
    const innerR = 1.5 * moduleSize;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(center, centerY, innerR, 0, Math.PI * 2);
    ctx.fill();
  } else if (eyeStyle === 'rounded') {
    // Outer rounded square
    const outerRadius = moduleSize * 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, outerRadius);
    ctx.fill();

    // Inner background gap
    const midOffset = moduleSize;
    const midSize = size - 2 * moduleSize;
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x + midOffset, y + midOffset, midSize, midSize, moduleSize);
    ctx.fill();

    // Center pupil
    const pupilOffset = 2 * moduleSize;
    const pupilSize = 3 * moduleSize;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + pupilOffset, y + pupilOffset, pupilSize, pupilSize, moduleSize * 0.6);
    ctx.fill();
  } else if (eyeStyle === 'double') {
    // Neobrutalist bold double border
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    // Cutout
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, size - 2 * moduleSize, size - 2 * moduleSize);

    // Inner accent rim
    ctx.strokeStyle = color;
    ctx.lineWidth = moduleSize * 0.35;
    ctx.strokeRect(x + moduleSize * 1.5, y + moduleSize * 1.5, size - 3 * moduleSize, size - 3 * moduleSize);

    // Center solid block
    ctx.fillStyle = color;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  } else {
    // Classic Sharp Square Brutalist
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = bgColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, size - 2 * moduleSize, size - 2 * moduleSize);

    ctx.fillStyle = color;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  }

  ctx.restore();
}

// Draw Frame / Banner (Top banner, Bottom banner, Polaroid, Ticket)
function drawFrameHeaderOrFooter(
  ctx: CanvasRenderingContext2D,
  settings: QRStyleSettings,
  width: number,
  height: number,
  topExtra: number,
  bottomExtra: number,
  scale: number
) {
  ctx.save();
  const text = settings.frameText || 'SCAN ME';

  if (settings.frameStyle === 'bottom-banner' && bottomExtra > 0) {
    const bannerY = height - bottomExtra;
    // Banner background pill
    const bannerHeight = bottomExtra - 16 * scale;
    const bannerWidth = width - 40 * scale;
    const bannerX = 20 * scale;

    // Neobrutalist Banner Pill
    ctx.fillStyle = settings.frameColor || '#FFE500';
    ctx.fillRect(bannerX, bannerY + 6 * scale, bannerWidth, bannerHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(bannerX, bannerY + 6 * scale, bannerWidth, bannerHeight);

    // Text
    ctx.fillStyle = '#000000';
    ctx.font = `900 ${Math.round(18 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, bannerY + 6 * scale + bannerHeight / 2);
  } else if (settings.frameStyle === 'top-banner' && topExtra > 0) {
    const bannerHeight = topExtra - 16 * scale;
    const bannerWidth = width - 40 * scale;
    const bannerX = 20 * scale;
    const bannerY = 10 * scale;

    ctx.fillStyle = settings.frameColor || '#FFE500';
    ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3 * scale;
    ctx.strokeRect(bannerX, bannerY, bannerWidth, bannerHeight);

    ctx.fillStyle = '#000000';
    ctx.font = `900 ${Math.round(18 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, bannerY + bannerHeight / 2);
  } else if (settings.frameStyle === 'polaroid') {
    // Tape sticker on top
    const tapeWidth = 90 * scale;
    const tapeHeight = 24 * scale;
    const tapeX = (width - tapeWidth) / 2;
    const tapeY = -4 * scale;

    ctx.save();
    ctx.translate(width / 2, 8 * scale);
    ctx.rotate(-0.04);
    ctx.fillStyle = '#FFE500';
    ctx.fillRect(-tapeWidth / 2, -tapeHeight / 2, tapeWidth, tapeHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(-tapeWidth / 2, -tapeHeight / 2, tapeWidth, tapeHeight);
    ctx.restore();

    // Polaroid Bottom Caption
    const captionY = height - bottomExtra + 28 * scale;
    ctx.fillStyle = '#000000';
    ctx.font = `800 ${Math.round(20 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, captionY);
  } else if (settings.frameStyle === 'ticket') {
    // Top punch hole and barcode simulation
    const punchY = 22 * scale;
    ctx.fillStyle = '#000000';
    ctx.font = `900 ${Math.round(15 * scale)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`★ TICKET № ${Math.floor(Math.random() * 89999 + 10000)} ★`, width / 2, punchY);

    // Bottom banner
    const bottomY = height - bottomExtra + 22 * scale;
    ctx.fillStyle = settings.frameColor || '#FFE500';
    const tagW = width - 48 * scale;
    ctx.fillRect(24 * scale, bottomY - 6 * scale, tagW, 36 * scale);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(24 * scale, bottomY - 6 * scale, tagW, 36 * scale);

    ctx.fillStyle = '#000000';
    ctx.font = `900 ${Math.round(16 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, bottomY + 12 * scale);
  }

  ctx.restore();
}

// Draw Center Logo, Emoji or Custom Image
async function drawCenterBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  settings: QRStyleSettings,
  scale: number
) {
  ctx.save();
  const cx = x + size / 2;
  const cy = y + size / 2;
  const badgeRadius = (size / 2) * 0.95;

  // Badge drop shadow (Neobrutalist)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx + 3 * scale, cy + 3 * scale, badgeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Badge background
  ctx.fillStyle = settings.cardBgColor || '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Badge border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  if (settings.logoType === 'emoji') {
    ctx.font = `${Math.round(size * 0.52)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(settings.logoValue || '⚡', cx, cy + 2 * scale);
  } else if (settings.logoType === 'image' && settings.logoValue) {
    try {
      const img = new Image();
      img.src = settings.logoValue;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => reject();
        }
      });

      // Clip image within circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, badgeRadius - 2 * scale, 0, Math.PI * 2);
      ctx.clip();

      const imgSize = (badgeRadius - 2 * scale) * 2;
      ctx.drawImage(img, cx - imgSize / 2, cy - imgSize / 2, imgSize, imgSize);
      ctx.restore();
    } catch {
      // Fallback to emoji if image fails to render
      ctx.font = `${Math.round(size * 0.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡', cx, cy);
    }
  }

  ctx.restore();
}

// Generate pure SVG string for clean vector download
export function generateQRSVG(content: string, settings: QRStyleSettings): string {
  const errorCorrection = settings.logoType !== 'none' ? 'H' : settings.errorCorrection;
  const qr = QRCode.create(content, { errorCorrectionLevel: errorCorrection });
  const moduleCount = qr.modules.size;

  const baseSize = 400;
  const quietZone = 24;
  const innerSize = baseSize - quietZone * 2;
  const moduleSize = innerSize / moduleCount;

  const qrX = quietZone;
  const qrY = quietZone;
  const logoRadius = settings.logoType !== 'none' ? Math.floor(moduleCount * 0.16) : 0;

  const svgElements: string[] = [];

  // Background rect
  svgElements.push(
    `<rect width="${baseSize}" height="${baseSize}" fill="${settings.bgColor}" stroke="#000000" stroke-width="4"/>`
  );

  // Modules
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (isFinderPattern(r, c, moduleCount)) continue;
      if (isCenterLogoArea(r, c, moduleCount, logoRadius)) continue;

      if (qr.modules.get(r, c)) {
        const x = qrX + c * moduleSize;
        const y = qrY + r * moduleSize;
        const padding = moduleSize * 0.05;
        const s = moduleSize - padding * 2;

        if (settings.moduleStyle === 'dots') {
          svgElements.push(
            `<circle cx="${x + moduleSize / 2}" cy="${y + moduleSize / 2}" r="${s / 2}" fill="${settings.fgColor}"/>`
          );
        } else if (settings.moduleStyle === 'rounded') {
          svgElements.push(
            `<rect x="${x + padding}" y="${y + padding}" width="${s}" height="${s}" rx="${s * 0.35}" fill="${settings.fgColor}"/>`
          );
        } else if (settings.moduleStyle === 'diamond') {
          const cx = x + moduleSize / 2;
          const cy = y + moduleSize / 2;
          const d = s / 2;
          svgElements.push(
            `<polygon points="${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}" fill="${settings.fgColor}"/>`
          );
        } else {
          // Square
          svgElements.push(
            `<rect x="${x + padding}" y="${y + padding}" width="${s}" height="${s}" fill="${settings.fgColor}"/>`
          );
        }
      }
    }
  }

  // Eyes
  const eyeCoords = [
    { r: 0, c: 0 },
    { r: 0, c: moduleCount - 7 },
    { r: moduleCount - 7, c: 0 },
  ];

  for (const { r, c } of eyeCoords) {
    const x = qrX + c * moduleSize;
    const y = qrY + r * moduleSize;
    const size = 7 * moduleSize;

    if (settings.eyeStyle === 'circle') {
      const cx = x + size / 2;
      const cy = y + size / 2;
      svgElements.push(`<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${settings.eyeColor || settings.fgColor}"/>`);
      svgElements.push(`<circle cx="${cx}" cy="${cy}" r="${size / 2 - moduleSize}" fill="${settings.bgColor}"/>`);
      svgElements.push(`<circle cx="${cx}" cy="${cy}" r="${1.5 * moduleSize}" fill="${settings.eyeColor || settings.fgColor}"/>`);
    } else if (settings.eyeStyle === 'rounded') {
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${moduleSize * 2}" fill="${settings.eyeColor || settings.fgColor}"/>`
      );
      svgElements.push(
        `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${size - 2 * moduleSize}" height="${size - 2 * moduleSize}" rx="${moduleSize}" fill="${settings.bgColor}"/>`
      );
      svgElements.push(
        `<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" rx="${moduleSize * 0.6}" fill="${settings.eyeColor || settings.fgColor}"/>`
      );
    } else {
      // Classic Brutalist Square
      svgElements.push(
        `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${settings.eyeColor || settings.fgColor}"/>`
      );
      svgElements.push(
        `<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${size - 2 * moduleSize}" height="${size - 2 * moduleSize}" fill="${settings.bgColor}"/>`
      );
      svgElements.push(
        `<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" fill="${settings.eyeColor || settings.fgColor}"/>`
      );
    }
  }

  // Logo in SVG
  if (settings.logoType === 'emoji') {
    const cx = baseSize / 2;
    const cy = baseSize / 2;
    const badgeR = (logoRadius * moduleSize + moduleSize) * 0.95;
    svgElements.push(
      `<circle cx="${cx + 3}" cy="${cy + 3}" r="${badgeR}" fill="#000000"/>`,
      `<circle cx="${cx}" cy="${cy}" r="${badgeR}" fill="${settings.cardBgColor || '#FFFFFF'}" stroke="#000000" stroke-width="3"/>`,
      `<text x="${cx}" y="${cy + 8}" font-size="${badgeR * 1.1}" text-anchor="middle" dominant-baseline="middle">${settings.logoValue || '⚡'}</text>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseSize} ${baseSize}" width="${baseSize}" height="${baseSize}">
${svgElements.join('\n')}
</svg>`;
}
