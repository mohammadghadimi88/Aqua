import React from 'react';
import { 
  X, 
  Droplet, 
  Thermometer, 
  Box, 
  Compass, 
  Utensils, 
  Gauge, 
  Layers, 
  Users, 
  Scissors, 
  ShieldCheck, 
  Sparkles,
  Waves
} from 'lucide-react';
import { FishSpecies, LanguageCode } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface CareGuideModalProps {
  species: FishSpecies | null;
  onClose: () => void;
  currentLang: LanguageCode;
  useFahrenheit: boolean;
  isInTank: boolean;
  onToggleTank: (species: FishSpecies) => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({
  species,
  onClose,
  currentLang,
  useFahrenheit,
  isInTank,
  onToggleTank,
}) => {
  if (!species) return null;

  const isMarine = species.waterType === 'saltwater';

  const cToF = (c: number) => Math.round((c * 9) / 5 + 32);
  const lToGal = (l: number) => Math.round(l * 0.264172);

  const displayTankSize = useFahrenheit
    ? `${lToGal(species.minTankSizeLiters)} ${UI_TEXT.gallons[currentLang]}`
    : `${species.minTankSizeLiters} ${UI_TEXT.liters[currentLang]}`;

  const displayTemp = useFahrenheit
    ? `${cToF(species.minTempC)}°F - ${cToF(species.maxTempC)}°F`
    : `${species.minTempC}°C - ${species.maxTempC}°C`;

  const getDietLabel = () => {
    switch (species.diet) {
      case 'omnivore':
        return UI_TEXT.omnivore[currentLang];
      case 'carnivore':
        return UI_TEXT.carnivore[currentLang];
      case 'herbivore':
        return UI_TEXT.herbivore[currentLang];
    }
  };

  const getSwimmingLabel = () => {
    switch (species.swimmingLevel) {
      case 'top':
        return UI_TEXT.top[currentLang];
      case 'mid':
        return UI_TEXT.mid[currentLang];
      case 'bottom':
        return UI_TEXT.bottom[currentLang];
      case 'all':
        return UI_TEXT.allLevels[currentLang];
    }
  };

  const getTemperamentLabel = () => {
    switch (species.temperament) {
      case 'peaceful':
        return UI_TEXT.peaceful[currentLang];
      case 'semi-aggressive':
        return UI_TEXT.semiAggressive[currentLang];
      case 'aggressive':
        return UI_TEXT.aggressive[currentLang];
    }
  };

  const getCareBadgeColor = () => {
    switch (species.careLevel) {
      case 'easy':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'difficult':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'expert':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
              style={{ backgroundColor: species.colorHex }}
            >
              <span className="text-lg font-black">{species.name.en.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isMarine ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {isMarine ? UI_TEXT.saltwater[currentLang] : UI_TEXT.freshwater[currentLang]}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCareBadgeColor()}`}>
                  {UI_TEXT[species.careLevel][currentLang]}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {species.name[currentLang]}
              </h3>
              <p className="text-xs text-slate-400 italic font-serif">
                {species.scientificName} • {species.family}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Scientific Bio / Description */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            {species.description[currentLang]}
          </div>

          {/* Environmental Matrix */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {UI_TEXT.careLevelTitle[currentLang]}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* pH Range */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>pH</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  {species.minPh} - {species.maxPh}
                </span>
              </div>

              {/* Temperature */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLang === 'fa' ? 'دما' : 'Temp'}</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">
                  {displayTemp}
                </span>
              </div>

              {/* Min Tank Size */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Box className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentLang === 'fa' ? 'حداقل تانک' : 'Min Tank'}</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {displayTankSize}
                </span>
              </div>

              {/* Adult Size */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Gauge className="w-3.5 h-3.5 text-purple-400" />
                  <span>{UI_TEXT.adultSize[currentLang]}</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {species.adultSizeCm} cm
                </span>
              </div>
            </div>
          </div>

          {/* Biological & Behavioral Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1">{UI_TEXT.originLabel[currentLang]}</span>
              <span className="font-semibold text-white">{species.origin[currentLang]}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1">{UI_TEXT.diet[currentLang]}</span>
              <span className="font-semibold text-white">{getDietLabel()}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1">{UI_TEXT.swimmingLevel[currentLang]}</span>
              <span className="font-semibold text-white">{getSwimmingLabel()}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
              <span className="text-slate-400 block mb-1">{UI_TEXT.filterByTemperament[currentLang]}</span>
              <span className="font-semibold text-white">{getTemperamentLabel()}</span>
            </div>
          </div>

          {/* Special Traits Badges */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {UI_TEXT.specialTraits[currentLang]}
            </h4>

            <div className="flex flex-wrap gap-2 text-xs">
              {species.schooling && (
                <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.schoolingFish[currentLang]}</span>
                </div>
              )}
              {species.finNipper && (
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.finNipperTrait[currentLang]}</span>
                </div>
              )}
              {species.longFins && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.longFinTrait[currentLang]}</span>
                </div>
              )}
              {species.predator && (
                <div className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.predatorTrait[currentLang]}</span>
                </div>
              )}
              {species.invertSafe ? (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.invertSafeTrait[currentLang]}</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-300 border border-orange-500/30 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{currentLang === 'fa' ? 'تهدید برای میگوها و حلزون‌ها' : 'Not safe with small shrimp'}</span>
                </div>
              )}
              {species.reefSafe && (
                <div className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.reefSafeTrait[currentLang]}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleTank(species)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isInTank
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
            }`}
          >
            {isInTank
              ? (currentLang === 'fa' ? 'حذف از تانک شما' : 'Remove from Tank')
              : UI_TEXT.addToTank[currentLang]}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            {UI_TEXT.close[currentLang]}
          </button>
        </div>
      </div>
    </div>
  );
};
