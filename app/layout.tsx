import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Neobrutalism QR Code Generator',
  description: 'Generate stylish, high-contrast neobrutalist QR codes with vibrant palettes, custom modules, logos, sticker frames, and SVG/PNG exports.',
  openGraph: {
    title: 'Neobrutalism QR Code Generator',
    description: 'Generate stylish, high-contrast neobrutalist QR codes with vibrant palettes, custom modules, logos, sticker frames, and SVG/PNG exports.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neobrutalism QR Code Generator',
    description: 'Generate stylish, high-contrast neobrutalist QR codes with vibrant palettes, custom modules, logos, sticker frames, and SVG/PNG exports.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
