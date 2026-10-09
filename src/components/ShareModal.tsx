import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  MessageSquare, 
  ExternalLink 
} from 'lucide-react';
import { FishSpecies, LanguageCode } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpecies: FishSpecies[];
  currentLang: LanguageCode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  selectedSpecies,
  currentLang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the shareable URL
  const fishIds = selectedSpecies.map((s) => s.id).join(',');
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = fishIds ? `${baseUrl}?fish=${encodeURIComponent(fishIds)}` : baseUrl;

  const shareTitle = UI_TEXT.appTitle[currentLang];
  const shareText = currentLang === 'fa'
    ? `بررسی سازگاری ${selectedSpecies.length} گونه ماهی آکواریومی من در آکوا‌مچ:\n${selectedSpecies.map(s => s.name[currentLang]).join('، ')}`
    : `Check out my aquarium fish compatibility build (${selectedSpecies.length} species) on AquaMatch!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled or share unsupported
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {UI_TEXT.shareModalTitle[currentLang]}
            </h3>
            <p className="text-xs text-slate-400">
              {selectedSpecies.length} {currentLang === 'fa' ? 'گونه انتخاب شده' : 'species selected'}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {UI_TEXT.shareDesc[currentLang]}
        </p>

        {/* Link Box */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="w-full bg-transparent text-xs text-slate-300 px-2 py-1 focus:outline-none truncate font-mono select-all"
          />
          <button
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-sm'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{currentLang === 'fa' ? 'کپی شد' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{UI_TEXT.copyLink[currentLang]}</span>
              </>
            )}
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 transition-all text-xs font-bold gap-1.5 text-center"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 text-sky-400 transition-all text-xs font-bold gap-1.5 text-center"
          >
            <Send className="w-5 h-5 text-sky-400" />
            <span>Telegram</span>
          </a>

          {/* Twitter / X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700 text-slate-200 transition-all text-xs font-bold gap-1.5 text-center"
          >
            <span className="text-base font-black">𝕏</span>
            <span>Twitter / X</span>
          </a>
        </div>

        {/* Native Mobile Share if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer mb-2"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>{UI_TEXT.shareNative[currentLang]}</span>
          </button>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {UI_TEXT.close[currentLang]}
          </button>
        </div>
      </div>
    </div>
  );
};
