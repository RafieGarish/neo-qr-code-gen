'use client';

import React from 'react';
import {
  Link as LinkIcon,
  Wifi,
  FileText,
  UserCheck,
  Mail,
  MessageSquare,
  Coins,
  Eye,
  EyeOff,
} from 'lucide-react';
import { QRContentType, WifiData, VCardData, EmailData, SmsData, CryptoData } from '@/types/qr';

interface ContentFormProps {
  activeType: QRContentType;
  onTypeChange: (type: QRContentType) => void;
  url: string;
  setUrl: (v: string) => void;
  text: string;
  setText: (v: string) => void;
  wifi: WifiData;
  setWifi: React.Dispatch<React.SetStateAction<WifiData>>;
  vcard: VCardData;
  setVcard: React.Dispatch<React.SetStateAction<VCardData>>;
  email: EmailData;
  setEmail: React.Dispatch<React.SetStateAction<EmailData>>;
  sms: SmsData;
  setSms: React.Dispatch<React.SetStateAction<SmsData>>;
  crypto: CryptoData;
  setCrypto: React.Dispatch<React.SetStateAction<CryptoData>>;
}

const TABS: Array<{ id: QRContentType; label: string; icon: React.ElementType; color: string }> = [
  { id: 'url', label: 'URL / Link', icon: LinkIcon, color: '#00F0FF' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, color: '#A3E635' },
  { id: 'text', label: 'Plain Text', icon: FileText, color: '#FFE500' },
  { id: 'vcard', label: 'Contact (vCard)', icon: UserCheck, color: '#F472B6' },
  { id: 'email', label: 'Email', icon: Mail, color: '#FB923C' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, color: '#C084FC' },
  { id: 'crypto', label: 'Pay / Crypto', icon: Coins, color: '#38BDF8' },
];

export function ContentForm({
  activeType,
  onTypeChange,
  url,
  setUrl,
  text,
  setText,
  wifi,
  setWifi,
  vcard,
  setVcard,
  email,
  setEmail,
  sms,
  setSms,
  crypto,
  setCrypto,
}: ContentFormProps) {
  const [showWifiPassword, setShowWifiPassword] = React.useState(false);

  return (
    <div className="border-[3px] border-black bg-white p-4 sm:p-5 shadow-[5px_5px_0px_0px_#000]">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center border-2 border-black bg-[#FFE500] font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000]">
            1
          </span>
          <h2 className="font-mono text-base sm:text-lg font-black uppercase text-black">
            Payload / Data Input
          </h2>
        </div>
        <span className="font-mono text-xs font-bold uppercase bg-black text-white px-2 py-0.5">
          Type: {activeType}
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-select-${tab.id}`}
              type="button"
              onClick={() => onTypeChange(tab.id)}
              style={{ backgroundColor: isActive ? tab.color : '#FFFFFF' }}
              className={`flex items-center justify-center gap-1.5 border-2 border-black px-2 py-2 font-mono text-xs font-black text-black transition-all ${
                isActive
                  ? 'translate-x-0.5 translate-y-0.5 shadow-[1px_1px_0px_0px_#000]'
                  : 'shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000]'
              }`}
            >
              <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Inputs */}
      <div className="space-y-4">
        {/* URL Mode */}
        {activeType === 'url' && (
          <div className="space-y-2">
            <label htmlFor="url-input" className="block font-mono text-xs font-black uppercase text-black">
              Target Website URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com/landing"
                className="w-full border-2 border-black bg-white px-3 py-2.5 font-mono text-sm text-black shadow-[3px_3px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="font-mono text-[11px] font-bold text-black/70 mr-1">Quick Add:</span>
              {['https://', 'https://github.com/', 'https://x.com/', 'https://instagram.com/'].map((prefix) => (
                <button
                  key={prefix}
                  type="button"
                  onClick={() => setUrl(prefix)}
                  className="border border-black bg-[#F4F4F5] px-2 py-0.5 font-mono text-[11px] font-bold text-black shadow-[1px_1px_0px_0px_#000] hover:bg-[#FFE500]"
                >
                  {prefix}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wi-Fi Mode */}
        {activeType === 'wifi' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="wifi-ssid" className="block font-mono text-xs font-black uppercase text-black">
                  Network SSID (Name)
                </label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={wifi.ssid}
                  onChange={(e) => setWifi((prev) => ({ ...prev, ssid: e.target.value }))}
                  placeholder="e.g. CyberCafe_Guest"
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[3px_3px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="wifi-encryption" className="block font-mono text-xs font-black uppercase text-black">
                  Security Encryption
                </label>
                <select
                  id="wifi-encryption"
                  value={wifi.encryption}
                  onChange={(e) =>
                    setWifi((prev) => ({ ...prev, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' }))
                  }
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[3px_3px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>

            {wifi.encryption !== 'nopass' && (
              <div>
                <label htmlFor="wifi-password" className="block font-mono text-xs font-black uppercase text-black">
                  Wi-Fi Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="wifi-password"
                    type={showWifiPassword ? 'text' : 'password'}
                    value={wifi.password}
                    onChange={(e) => setWifi((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter network password"
                    className="w-full border-2 border-black bg-white px-3 py-2 pr-10 font-mono text-sm text-black shadow-[3px_3px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black/70 hover:text-black"
                  >
                    {showWifiPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 pt-1">
              <input
                type="checkbox"
                checked={wifi.hidden}
                onChange={(e) => setWifi((prev) => ({ ...prev, hidden: e.target.checked }))}
                className="h-4 w-4 border-2 border-black accent-black"
              />
              <span className="font-mono text-xs font-bold text-black">Hidden SSID (Network is not broadcasting)</span>
            </label>
          </div>
        )}

        {/* Text Mode */}
        {activeType === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="text-input" className="block font-mono text-xs font-black uppercase text-black">
                Plain Text Message or Note
              </label>
              <span className="font-mono text-[11px] font-bold text-black/70">
                {text.length} characters
              </span>
            </div>
            <textarea
              id="text-input"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type any message, secret note, event details, instructions..."
              className="w-full border-2 border-black bg-white p-3 font-mono text-sm text-black shadow-[3px_3px_0px_0px_#000] focus:bg-[#FFFBEB] focus:outline-none"
            />
          </div>
        )}

        {/* Contact (vCard) Mode */}
        {activeType === 'vcard' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="vcard-fname" className="block font-mono text-xs font-black uppercase text-black">
                First Name
              </label>
              <input
                id="vcard-fname"
                type="text"
                value={vcard.firstName}
                onChange={(e) => setVcard((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="Alex"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vcard-lname" className="block font-mono text-xs font-black uppercase text-black">
                Last Name
              </label>
              <input
                id="vcard-lname"
                type="text"
                value={vcard.lastName}
                onChange={(e) => setVcard((p) => ({ ...p, lastName: e.target.value }))}
                placeholder="Brutalist"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vcard-phone" className="block font-mono text-xs font-black uppercase text-black">
                Phone Number
              </label>
              <input
                id="vcard-phone"
                type="tel"
                value={vcard.phone}
                onChange={(e) => setVcard((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+1 555-0199"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vcard-email" className="block font-mono text-xs font-black uppercase text-black">
                Email Address
              </label>
              <input
                id="vcard-email"
                type="email"
                value={vcard.email}
                onChange={(e) => setVcard((p) => ({ ...p, email: e.target.value }))}
                placeholder="alex@studio.design"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vcard-company" className="block font-mono text-xs font-black uppercase text-black">
                Company / Studio
              </label>
              <input
                id="vcard-company"
                type="text"
                value={vcard.company}
                onChange={(e) => setVcard((p) => ({ ...p, company: e.target.value }))}
                placeholder="Neobrutal Studio"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vcard-title" className="block font-mono text-xs font-black uppercase text-black">
                Job Title
              </label>
              <input
                id="vcard-title"
                type="text"
                value={vcard.title}
                onChange={(e) => setVcard((p) => ({ ...p, title: e.target.value }))}
                placeholder="Lead Designer"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Email Mode */}
        {activeType === 'email' && (
          <div className="space-y-3">
            <div>
              <label htmlFor="email-recipient" className="block font-mono text-xs font-black uppercase text-black">
                Recipient Email
              </label>
              <input
                id="email-recipient"
                type="email"
                value={email.email}
                onChange={(e) => setEmail((p) => ({ ...p, email: e.target.value }))}
                placeholder="team@example.com"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email-subject" className="block font-mono text-xs font-black uppercase text-black">
                Pre-filled Subject
              </label>
              <input
                id="email-subject"
                type="text"
                value={email.subject}
                onChange={(e) => setEmail((p) => ({ ...p, subject: e.target.value }))}
                placeholder="Collaboration Inquiry"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email-body" className="block font-mono text-xs font-black uppercase text-black">
                Pre-filled Message Body
              </label>
              <textarea
                id="email-body"
                rows={3}
                value={email.body}
                onChange={(e) => setEmail((p) => ({ ...p, body: e.target.value }))}
                placeholder="Hello team, I would love to connect..."
                className="mt-1 w-full border-2 border-black bg-white p-3 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* SMS Mode */}
        {activeType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label htmlFor="sms-phone" className="block font-mono text-xs font-black uppercase text-black">
                Phone Number
              </label>
              <input
                id="sms-phone"
                type="tel"
                value={sms.phone}
                onChange={(e) => setSms((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+15550199"
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="sms-message" className="block font-mono text-xs font-black uppercase text-black">
                Pre-filled SMS Message
              </label>
              <textarea
                id="sms-message"
                rows={3}
                value={sms.message}
                onChange={(e) => setSms((p) => ({ ...p, message: e.target.value }))}
                placeholder="Hey! RSVP YES for the meetup tonight!"
                className="mt-1 w-full border-2 border-black bg-white p-3 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Crypto / Payment Mode */}
        {activeType === 'crypto' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="crypto-currency" className="block font-mono text-xs font-black uppercase text-black">
                  Payment Network / Type
                </label>
                <select
                  id="crypto-currency"
                  value={crypto.currency}
                  onChange={(e) =>
                    setCrypto((p) => ({ ...p, currency: e.target.value as CryptoData['currency'] }))
                  }
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="PAYPAL">PayPal.me</option>
                  <option value="UPI">UPI Payment (India)</option>
                </select>
              </div>
              <div>
                <label htmlFor="crypto-amount" className="block font-mono text-xs font-black uppercase text-black">
                  Amount (Optional)
                </label>
                <input
                  id="crypto-amount"
                  type="text"
                  value={crypto.amount || ''}
                  onChange={(e) => setCrypto((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.05 or 25"
                  className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label htmlFor="crypto-address" className="block font-mono text-xs font-black uppercase text-black">
                Wallet Address or Username / ID
              </label>
              <input
                id="crypto-address"
                type="text"
                value={crypto.address}
                onChange={(e) => setCrypto((p) => ({ ...p, address: e.target.value }))}
                placeholder={crypto.currency === 'PAYPAL' ? 'username' : '0x71C... or 1A1z...'}
                className="mt-1 w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm shadow-[3px_3px_0px_0px_#000] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
