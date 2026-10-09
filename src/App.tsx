import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { PresetBar } from './components/PresetBar';
import { SelectedTankBar } from './components/SelectedTankBar';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { TankSummaryCard } from './components/TankSummaryCard';
import { FishSelector } from './components/FishSelector';
import { CareGuideModal } from './components/CareGuideModal';
import { ShareModal } from './components/ShareModal';
import { FISH_DATA } from './data/fishData';
import { TANK_PRESETS, TankPreset } from './data/presets';
import { analyzeTank } from './utils/compatibilityEngine';
import { LanguageCode, FishSpecies } from './types/fish';
import { isRTL, UI_TEXT } from './utils/i18n';
import { ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // 1. Language state (Defaults to 'fa' as requested)
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('aquamatch_lang');
    if (saved && ['fa', 'en', 'es', 'de', 'fr', 'ar', 'tr'].includes(saved)) {
      return saved as LanguageCode;
    }
    return 'fa';
  });

  // 2. Theme state (Dark mode default for rich aquarium look)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aquamatch_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // 3. Temperature & Volume Units (°C/Liters vs °F/Gallons)
  const [useFahrenheit, setUseFahrenheit] = useState<boolean>(() => {
    return localStorage.getItem('aquamatch_units') === 'imperial';
  });

  // 4. Selected Fish IDs (initialized from URL params or default Amazon preset)
  const [selectedFishIds, setSelectedFishIds] = useState<string[]>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fishParam = params.get('fish');
      if (fishParam) {
        const ids = fishParam.split(',').filter((id) => FISH_DATA.some((f) => f.id === id));
        if (ids.length > 0) return ids;
      }
    } catch (e) {
      // ignore
    }
    // Default starting community: Peaceful Amazon
    return ['neon_tetra', 'harlequin_rasbora', 'corydoras', 'bristlenose_pleco'];
  });

  const [activePresetId, setActivePresetId] = useState<string | null>('amazon_peaceful');
  const [detailsSpecies, setDetailsSpecies] = useState<FishSpecies | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Sync RTL and lang attribute on documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.lang = currentLang;
    root.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
    localStorage.setItem('aquamatch_lang', currentLang);
  }, [currentLang]);

  // Sync dark class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('aquamatch_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sync unit preference
  useEffect(() => {
    localStorage.setItem('aquamatch_units', useFahrenheit ? 'imperial' : 'metric');
  }, [useFahrenheit]);

  // Derived selected fish objects
  const selectedSpecies = useMemo(() => {
    return selectedFishIds
      .map((id) => FISH_DATA.find((f) => f.id === id))
      .filter((f): f is FishSpecies => Boolean(f));
  }, [selectedFishIds]);

  const selectedIdsSet = useMemo(() => new Set(selectedFishIds), [selectedFishIds]);

  // Tank Compatibility Analysis calculation
  const tankAnalysis = useMemo(() => {
    return analyzeTank(selectedSpecies);
  }, [selectedSpecies]);

  // Handlers
  const handleToggleFish = (species: FishSpecies) => {
    setActivePresetId(null);
    setSelectedFishIds((prev) => {
      if (prev.includes(species.id)) {
        return prev.filter((id) => id !== species.id);
      } else {
        return [...prev, species.id];
      }
    });
  };

  const handleRemoveFish = (id: string) => {
    setActivePresetId(null);
    setSelectedFishIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearAll = () => {
    setActivePresetId(null);
    setSelectedFishIds([]);
  };

  const handleSelectPreset = (preset: TankPreset) => {
    setActivePresetId(preset.id);
    setSelectedFishIds(preset.speciesIds);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        useFahrenheit={useFahrenheit}
        onToggleUnit={() => setUseFahrenheit(!useFahrenheit)}
        selectedCount={selectedSpecies.length}
        onResetTank={handleClearAll}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Preset Tank Bar */}
      <PresetBar
        currentLang={currentLang}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Selected Fish in Tank */}
        <section aria-label="Selected Fish">
          <SelectedTankBar
            selectedSpecies={selectedSpecies}
            currentLang={currentLang}
            onRemoveFish={handleRemoveFish}
            onClearAll={handleClearAll}
            onOpenDetails={setDetailsSpecies}
          />
        </section>

        {/* Tank Harmony Dashboard & Compatibility Matrix (when 2+ fish are chosen) */}
        {selectedSpecies.length >= 2 && (
          <section className="space-y-6 animate-in fade-in duration-300">
            {/* Overall Tank Harmony Card */}
            <TankSummaryCard
              analysis={tankAnalysis}
              selectedSpecies={selectedSpecies}
              currentLang={currentLang}
              useFahrenheit={useFahrenheit}
            />

            {/* Color-Coded 2D Compatibility Matrix */}
            <CompatibilityMatrix
              selectedSpecies={selectedSpecies}
              pairwiseMap={tankAnalysis.pairResults}
              pairwiseList={tankAnalysis.pairwiseList}
              currentLang={currentLang}
              onOpenDetails={setDetailsSpecies}
            />
          </section>
        )}

        {/* Fish Species Database & Selector */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>
                {currentLang === 'fa' ? 'فهرست جامع ماهیان آکواریومی (آب شیرین و آب شور)' : 'Aquarium Species Directory (Freshwater & Marine)'}
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {FISH_DATA.length} {currentLang === 'fa' ? 'گونه علمی' : 'Species'}
            </span>
          </div>

          <FishSelector
            allSpecies={FISH_DATA}
            selectedIds={selectedIdsSet}
            currentLang={currentLang}
            onToggleFish={handleToggleFish}
            onOpenDetails={setDetailsSpecies}
            useFahrenheit={useFahrenheit}
          />
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 mt-16 py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{UI_TEXT.githubPagesBadge[currentLang]}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {currentLang === 'fa'
              ? 'داده‌های زیستی بر پایه منابع علمی معتبر جهانی (FishBase, SeriouslyFish, LiveAquaria). سازگار با استقرار در GitHub Pages به عنوان برنامه وب سبک و سریع بدون نیاز به سرور.'
              : 'Biological compatibility data grounded in authoritative ichthyological databases (FishBase, SeriouslyFish). GitHub Pages ready client-side architecture.'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            AquaMatch © {new Date().getFullYear()} • Minimal & Ultra-Fast
          </p>
        </div>
      </footer>

      {/* Care Guide Modal */}
      <CareGuideModal
        species={detailsSpecies}
        onClose={() => setDetailsSpecies(null)}
        currentLang={currentLang}
        useFahrenheit={useFahrenheit}
        isInTank={detailsSpecies ? selectedIdsSet.has(detailsSpecies.id) : false}
        onToggleTank={handleToggleFish}
      />

      {/* Social Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        selectedSpecies={selectedSpecies}
        currentLang={currentLang}
      />
    </div>
  );
}
