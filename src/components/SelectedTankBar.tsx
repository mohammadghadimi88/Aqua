import React from 'react';
import { X, Trash2, Fish, AlertCircle, Droplets, Waves } from 'lucide-react';
import { FishSpecies, LanguageCode } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface SelectedTankBarProps {
  selectedSpecies: FishSpecies[];
  currentLang: LanguageCode;
  onRemoveFish: (id: string) => void;
  onClearAll: () => void;
  onOpenDetails: (species: FishSpecies) => void;
}

export const SelectedTankBar: React.FC<SelectedTankBarProps> = ({
  selectedSpecies,
  currentLang,
  onRemoveFish,
  onClearAll,
  onOpenDetails,
}) => {
  if (selectedSpecies.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
          <Fish className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-slate-200 mb-1">
          {UI_TEXT.selectedTankTitle[currentLang]} (0)
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {UI_TEXT.emptyTankNotice[currentLang]}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-black text-xs">
            {selectedSpecies.length}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {UI_TEXT.selectedTankTitle[currentLang]}
            </h3>
            <span className="text-[11px] text-slate-400">
              {selectedSpecies.length === 1
                ? UI_TEXT.singleFishNotice[currentLang]
                : UI_TEXT.showingSpeciesCount[currentLang].replace('{count}', selectedSpecies.length.toString())}
            </span>
          </div>
        </div>

        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{UI_TEXT.clearAll[currentLang]}</span>
        </button>
      </div>

      {/* Selected Fish Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {selectedSpecies.map((species) => {
          const isMarine = species.waterType === 'saltwater';
          return (
            <div
              key={species.id}
              className="group flex items-center gap-2 pl-2 pr-1 py-1 sm:pl-3 sm:pr-1.5 sm:py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm"
            >
              {/* Colored Dot & Water Icon */}
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: species.colorHex }}
                title={species.category}
              />

              <button
                onClick={() => onOpenDetails(species)}
                className="text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors text-start cursor-pointer"
                title={species.scientificName}
              >
                {species.name[currentLang]}
              </button>

              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                isMarine 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isMarine ? 'Salt' : 'Fresh'}
              </span>

              <button
                onClick={() => onRemoveFish(species.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Remove from tank"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
