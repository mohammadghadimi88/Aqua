import React from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { LanguageCode } from '../types/fish';
import { TankPreset, TANK_PRESETS } from '../data/presets';
import { UI_TEXT } from '../utils/i18n';

interface PresetBarProps {
  currentLang: LanguageCode;
  onSelectPreset: (preset: TankPreset) => void;
  activePresetId?: string | null;
}

export const PresetBar: React.FC<PresetBarProps> = ({
  currentLang,
  onSelectPreset,
  activePresetId,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-y border-slate-800/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0 me-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{UI_TEXT.presetsTitle[currentLang]}</span>
        </div>

        <div className="flex items-center gap-2">
          {TANK_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 border flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border-slate-700/60'
                }`}
                title={preset.description[currentLang]}
              >
                <span>{preset.name[currentLang]}</span>
                <span className="text-[10px] opacity-70 px-1.5 py-0.2 rounded-full bg-black/20">
                  {preset.speciesIds.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
