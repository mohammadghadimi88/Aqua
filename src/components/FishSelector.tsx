import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Check, 
  Droplets, 
  Waves, 
  Info, 
  ShieldCheck, 
  Users, 
  Scissors, 
  Sparkles, 
  Crosshair,
  Gauge
} from 'lucide-react';
import { FishSpecies, LanguageCode, WaterType, Temperament, CareLevel } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface FishSelectorProps {
  allSpecies: FishSpecies[];
  selectedIds: Set<string>;
  currentLang: LanguageCode;
  onToggleFish: (species: FishSpecies) => void;
  onOpenDetails: (species: FishSpecies) => void;
  useFahrenheit: boolean;
}

export const FishSelector: React.FC<FishSelectorProps> = ({
  allSpecies,
  selectedIds,
  currentLang,
  onToggleFish,
  onOpenDetails,
  useFahrenheit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [waterFilter, setWaterFilter] = useState<'all' | WaterType>('all');
  const [temperamentFilter, setTemperamentFilter] = useState<'all' | Temperament>('all');
  const [careFilter, setCareFilter] = useState<'all' | CareLevel>('all');

  const filteredSpecies = useMemo(() => {
    return allSpecies.filter((fish) => {
      // Water filter
      if (waterFilter !== 'all' && fish.waterType !== waterFilter) {
        return false;
      }
      // Temperament filter
      if (temperamentFilter !== 'all' && fish.temperament !== temperamentFilter) {
        return false;
      }
      // Care Level filter
      if (careFilter !== 'all' && fish.careLevel !== careFilter) {
        return false;
      }
      // Search query (Persian, English, Scientific name, Category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameFa = (fish.name.fa || '').toLowerCase();
        const nameEn = (fish.name.en || '').toLowerCase();
        const nameCurrent = (fish.name[currentLang] || '').toLowerCase();
        const sci = fish.scientificName.toLowerCase();
        const cat = fish.category.toLowerCase();
        const family = fish.family.toLowerCase();

        return (
          nameFa.includes(q) ||
          nameEn.includes(q) ||
          nameCurrent.includes(q) ||
          sci.includes(q) ||
          cat.includes(q) ||
          family.includes(q)
        );
      }
      return true;
    });
  }, [allSpecies, waterFilter, temperamentFilter, careFilter, searchQuery, currentLang]);

  const getCareBadge = (level: CareLevel) => {
    switch (level) {
      case 'easy':
        return {
          label: UI_TEXT.easy[currentLang],
          color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'moderate':
        return {
          label: UI_TEXT.moderate[currentLang],
          color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'difficult':
        return {
          label: UI_TEXT.difficult[currentLang],
          color: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        };
      case 'expert':
        return {
          label: UI_TEXT.expert[currentLang],
          color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
    }
  };

  const getTemperamentBadge = (t: Temperament) => {
    switch (t) {
      case 'peaceful':
        return {
          label: UI_TEXT.peaceful[currentLang],
          color: 'text-emerald-400',
        };
      case 'semi-aggressive':
        return {
          label: UI_TEXT.semiAggressive[currentLang],
          color: 'text-amber-400',
        };
      case 'aggressive':
        return {
          label: UI_TEXT.aggressive[currentLang],
          color: 'text-rose-400',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Quick Filter Pills */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UI_TEXT.searchPlaceholder[currentLang]}
              className="w-full bg-slate-950/80 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-2.5 ps-10 border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center px-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Water Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 self-start lg:self-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setWaterFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                waterFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {UI_TEXT.waterTypeAll[currentLang]}
            </button>
            <button
              onClick={() => setWaterFilter('freshwater')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                waterFilter === 'freshwater'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>{UI_TEXT.freshwater[currentLang]}</span>
            </button>
            <button
              onClick={() => setWaterFilter('saltwater')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                waterFilter === 'saltwater'
                  ? 'bg-blue-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>{UI_TEXT.saltwater[currentLang]}</span>
            </button>
          </div>

          {/* Dropdown Filters: Temperament & Care Level */}
          <div className="flex items-center gap-2">
            <select
              value={temperamentFilter}
              onChange={(e) => setTemperamentFilter(e.target.value as any)}
              className="bg-slate-950/80 text-slate-300 text-xs rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">{UI_TEXT.filterByTemperament[currentLang]}: {UI_TEXT.all[currentLang]}</option>
              <option value="peaceful">{UI_TEXT.peaceful[currentLang]}</option>
              <option value="semi-aggressive">{UI_TEXT.semiAggressive[currentLang]}</option>
              <option value="aggressive">{UI_TEXT.aggressive[currentLang]}</option>
            </select>

            <select
              value={careFilter}
              onChange={(e) => setCareFilter(e.target.value as any)}
              className="bg-slate-950/80 text-slate-300 text-xs rounded-xl px-3 py-2 border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">{UI_TEXT.filterByCareLevel[currentLang]}: {UI_TEXT.all[currentLang]}</option>
              <option value="easy">{UI_TEXT.easy[currentLang]}</option>
              <option value="moderate">{UI_TEXT.moderate[currentLang]}</option>
              <option value="difficult">{UI_TEXT.difficult[currentLang]}</option>
              <option value="expert">{UI_TEXT.expert[currentLang]}</option>
            </select>
          </div>
        </div>

        {/* Counter and Filter Feedback */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>{UI_TEXT.showingSpeciesCount[currentLang].replace('{count}', filteredSpecies.length.toString())}</span>
          {(searchQuery || waterFilter !== 'all' || temperamentFilter !== 'all' || careFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setWaterFilter('all');
                setTemperamentFilter('all');
                setCareFilter('all');
              }}
              className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              {currentLang === 'fa' ? 'حذف فیلترها' : 'Clear all filters'}
            </button>
          )}
        </div>
      </div>

      {/* Grid of Fish Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredSpecies.map((fish) => {
          const isSelected = selectedIds.has(fish.id);
          const isMarine = fish.waterType === 'saltwater';
          const careBadge = getCareBadge(fish.careLevel);
          const tempBadge = getTemperamentBadge(fish.temperament);

          return (
            <div
              key={fish.id}
              className={`rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Header: Color Indicator, Water Badge, Care Level */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: fish.colorHex }}
                    />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isMarine 
                        ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {isMarine ? UI_TEXT.saltwater[currentLang] : UI_TEXT.freshwater[currentLang]}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${careBadge.color}`}>
                    {careBadge.label}
                  </span>
                </div>

                {/* Fish Name & Scientific Name */}
                <div className="mb-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {fish.name[currentLang]}
                  </h4>
                  <p className="text-[11px] text-slate-400 italic font-serif truncate">
                    {fish.scientificName}
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">pH:</span>
                    <span className="font-mono font-medium">{fish.minPh} - {fish.maxPh}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{UI_TEXT.safeTemp[currentLang]}:</span>
                    <span className="font-mono font-medium">
                      {useFahrenheit 
                        ? `${Math.round((fish.minTempC * 9) / 5 + 32)}°-${Math.round((fish.maxTempC * 9) / 5 + 32)}°F` 
                        : `${fish.minTempC}°-${fish.maxTempC}°C`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{UI_TEXT.adultSize[currentLang]}:</span>
                    <span className="font-medium">{fish.adultSizeCm} cm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">{UI_TEXT.filterByTemperament[currentLang]}:</span>
                    <span className={`font-semibold ${tempBadge.color}`}>{tempBadge.label}</span>
                  </div>
                </div>

                {/* Trait Tags (Schooling, Nipper, Predator) */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {fish.schooling && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1" title={UI_TEXT.schoolingFish[currentLang]}>
                      <Users className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{currentLang === 'fa' ? 'گله‌زی' : 'School'}</span>
                    </span>
                  )}
                  {fish.finNipper && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1" title={UI_TEXT.finNipperTrait[currentLang]}>
                      <Scissors className="w-2.5 h-2.5 text-rose-400" />
                      <span>{currentLang === 'fa' ? 'باله‌گز' : 'Nipper'}</span>
                    </span>
                  )}
                  {fish.predator && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1" title={UI_TEXT.predatorTrait[currentLang]}>
                      <Crosshair className="w-2.5 h-2.5 text-amber-400" />
                      <span>{currentLang === 'fa' ? 'شکارچی' : 'Predator'}</span>
                    </span>
                  )}
                  {fish.reefSafe && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30" title={UI_TEXT.reefSafeTrait[currentLang]}>
                      Reef Safe
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add/Remove & Care Sheet */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onToggleFish(fish)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 border border-slate-700/80'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{UI_TEXT.inTank[currentLang]}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{UI_TEXT.addToTank[currentLang]}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onOpenDetails(fish)}
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                  title={UI_TEXT.viewDetails[currentLang]}
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpecies.length === 0 && (
        <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-slate-400 text-sm">
            {currentLang === 'fa' ? 'هیچ ماهی منطبق بر جستجوی شما یافت نشد.' : 'No fish found matching your search criteria.'}
          </p>
        </div>
      )}
    </div>
  );
};
