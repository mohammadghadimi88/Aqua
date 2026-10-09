import React from 'react';
import { 
  Fish, 
  Languages, 
  Moon, 
  Sun, 
  Share2, 
  RotateCcw, 
  Thermometer, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  useFahrenheit: boolean;
  onToggleUnit: () => void;
  selectedCount: number;
  onResetTank: () => void;
  onOpenShare: () => void;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  useFahrenheit,
  onToggleUnit,
  selectedCount,
  onResetTank,
  onOpenShare,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-sky-400 text-white shadow-lg shadow-cyan-500/20">
              <Fish className="w-6 h-6 transform -rotate-12 transition-transform hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-300 bg-clip-text text-transparent">AquaMatch</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <ShieldCheck className="w-3 h-3 me-1" />
                  {currentLang === 'fa' ? 'نسخه علمی و معتبر' : 'Scientific Edition'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block max-w-lg truncate">
                {UI_TEXT.subtitle[currentLang]}
              </p>
            </div>
          </div>

          {/* Controls Bar: Units, Share, Reset, Theme, Language */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Unit Toggle °C / °F */}
            <button
              onClick={onToggleUnit}
              title={useFahrenheit ? 'Switch to Celsius (°C)' : 'Switch to Fahrenheit (°F)'}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/70 transition-all cursor-pointer"
            >
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>{useFahrenheit ? '°F / Gal' : '°C / Lit'}</span>
            </button>

            {/* Share Tank Button */}
            <button
              onClick={onOpenShare}
              title={UI_TEXT.shareTank[currentLang]}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/40 transition-all cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{UI_TEXT.shareTank[currentLang]}</span>
              {selectedCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-cyan-500 text-slate-950 font-black">
                  {selectedCount}
                </span>
              )}
            </button>

            {/* Reset Tank */}
            {selectedCount > 0 && (
              <button
                onClick={onResetTank}
                title={UI_TEXT.clearAll[currentLang]}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              className="p-2 rounded-xl text-slate-300 hover:text-yellow-400 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="appearance-none cursor-pointer bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 pe-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 hover:bg-slate-700/80 transition-all"
                title="Select Language"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-slate-400">
                <Languages className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
