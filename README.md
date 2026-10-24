# Neobrutalism QR Code Generator

A browser-based QR code studio for creating bold, customizable QR codes in a neobrutalist style. Enter a link, message, or other supported payload, customize the design, preview it live, then download or copy the result.

## Features

- Generate QR codes for URLs, plain text, Wi-Fi access, vCards, email, SMS, and payment or crypto links.
- Preview changes live as you edit the content and design.
- Start from one of eight color presets, adjust colors, or generate a random style.
- Customize QR modules, finder eyes, error correction, borders, shadows, badges, and frames.
- Add an emoji or upload an image as a center badge.
- Download PNG images at selectable 512, 1024, or 2048 pixel settings, with or without a frame.
- Download a vector SVG, copy the QR image or payload, and save designs to a local history.
- Keep QR generation in the browser. Saved designs are stored in the browser's `localStorage`.

## Tech stack

- [Next.js](https://nextjs.org/) 15 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [`qrcode`](https://www.npmjs.com/package/qrcode) for QR matrix generation
- [Lucide](https://lucide.dev/) icons

## Getting started

### Requirements

- Node.js 20 or newer
- npm

### Install and run

```bash
git clone https://github.com/YOUR_USERNAME/neobrutalism-qr-code-generator.git
cd neobrutalism-qr-code-generator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

No API key or environment variables are needed to run the app.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean the Next.js build output |

## Export notes

PNG export supports the selected frame and uploaded image badge. SVG export produces a vector QR code and supports the palette, module and eye styling, and emoji badge; it does not include frames or uploaded image badges.

## Privacy

QR payloads are generated in the browser and are not sent to an application server. Saved history stays in that browser's local storage, so it is not synced across browsers or devices. Clearing browser storage removes the saved history.

## License

No license file is currently included. Add a `LICENSE` file before publishing if you want to grant others explicit permission to use, modify, and distribute this project.
