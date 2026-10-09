import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ShieldAlert, 
  ArrowRightLeft,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react';
import { FishSpecies, LanguageCode } from '../types/fish';
import { PairwiseResult, CompatibilityStatus } from '../types/compatibility';
import { UI_TEXT } from '../utils/i18n';

interface CompatibilityMatrixProps {
  selectedSpecies: FishSpecies[];
  pairwiseMap: Map<string, PairwiseResult>;
  pairwiseList: PairwiseResult[];
  currentLang: LanguageCode;
  onOpenDetails: (species: FishSpecies) => void;
}

export const CompatibilityMatrix: React.FC<CompatibilityMatrixProps> = ({
  selectedSpecies,
  pairwiseMap,
  pairwiseList,
  currentLang,
  onOpenDetails,
}) => {
  const [activePair, setActivePair] = useState<{
    f1: FishSpecies;
    f2: FishSpecies;
    result: PairwiseResult;
  } | null>(null);

  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  if (selectedSpecies.length < 2) {
    return null;
  }

  const getStatusBg = (status: CompatibilityStatus) => {
    switch (status) {
      case 'compatible':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30';
      case 'caution':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30';
      case 'incompatible':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30';
    }
  };

  const getStatusIcon = (status: CompatibilityStatus, sizeClass = "w-4 h-4") => {
    switch (status) {
      case 'compatible':
        return <CheckCircle2 className={`${sizeClass} text-emerald-400`} />;
      case 'caution':
        return <AlertTriangle className={`${sizeClass} text-amber-400`} />;
      case 'incompatible':
        return <XCircle className={`${sizeClass} text-rose-400`} />;
    }
  };

  const getStatusText = (status: CompatibilityStatus) => {
    switch (status) {
      case 'compatible':
        return UI_TEXT.compatibleStatus[currentLang];
      case 'caution':
        return UI_TEXT.cautionStatus[currentLang];
      case 'incompatible':
        return UI_TEXT.incompatibleStatus[currentLang];
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-4 sm:p-6 transition-all">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {UI_TEXT.compatibilityMatrix[currentLang]}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {UI_TEXT.matrixSubtitle[currentLang]}
          </p>
        </div>

        {/* Legend & Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {UI_TEXT.compatibleStatus[currentLang]}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              {UI_TEXT.cautionStatus[currentLang]}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              {UI_TEXT.incompatibleStatus[currentLang]}
            </span>
          </div>

          {/* Toggle between Matrix & List view */}
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'matrix' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Matrix View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewMode === 'cards' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Pairwise List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-2 text-start text-xs font-bold text-slate-400 border-b border-slate-800 min-w-[130px]">
                  {currentLang === 'fa' ? 'گونه‌های انتخابی' : 'Selected Species'}
                </th>
                {selectedSpecies.map((colFish) => (
                  <th
                    key={colFish.id}
                    className="p-2 text-xs font-semibold text-slate-300 border-b border-slate-800 min-w-[70px] max-w-[100px] truncate"
                    title={colFish.name[currentLang]}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: colFish.colorHex }}
                      />
                      <span className="truncate w-full text-[11px]">
                        {colFish.name[currentLang]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedSpecies.map((rowFish, rowIndex) => (
                <tr key={rowFish.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                  {/* Row Header */}
                  <td className="p-2 text-start text-xs font-semibold text-slate-200 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: rowFish.colorHex }}
                      />
                      <span className="truncate max-w-[120px]">{rowFish.name[currentLang]}</span>
                    </div>
                  </td>

                  {/* Matrix Cells */}
                  {selectedSpecies.map((colFish, colIndex) => {
                    if (rowIndex === colIndex) {
                      // Self cell
                      return (
                        <td key={colFish.id} className="p-1.5">
                          <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-center text-slate-600 text-[10px] font-mono">
                            —
                          </div>
                        </td>
                      );
                    }

                    const key = `${rowFish.id}__${colFish.id}`;
                    const res = pairwiseMap.get(key);

                    if (!res) {
                      return (
                        <td key={colFish.id} className="p-1.5">
                          <div className="w-10 h-10 mx-auto rounded-xl bg-slate-800/20 text-slate-500 flex items-center justify-center">
                            ?
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={colFish.id} className="p-1.5">
                        <button
                          onClick={() => setActivePair({ f1: rowFish, f2: colFish, result: res })}
                          className={`w-10 h-10 mx-auto rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-110 active:scale-95 shadow-sm ${getStatusBg(
                            res.status
                          )}`}
                          title={`${rowFish.name[currentLang]} ↔ ${colFish.name[currentLang]}: ${getStatusText(res.status)}`}
                        >
                          {getStatusIcon(res.status, 'w-4 h-4')}
                          <span className="text-[9px] font-bold mt-0.5 opacity-80">
                            {res.score}%
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* PAIRWISE CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pairwiseList.map((res) => {
            const f1 = selectedSpecies.find(s => s.id === res.fish1Id);
            const f2 = selectedSpecies.find(s => s.id === res.fish2Id);
            if (!f1 || !f2) return null;

            return (
              <div
                key={`${res.fish1Id}__${res.fish2Id}`}
                onClick={() => setActivePair({ f1, f2, result: res })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:border-slate-600 shadow-sm ${getStatusBg(
                  res.status
                )}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span>{f1.name[currentLang]}</span>
                    <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                    <span>{f2.name[currentLang]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(res.status, 'w-4 h-4')}
                    <span className="text-xs font-bold">{res.score}%</span>
                  </div>
                </div>

                {res.reasons.length > 0 ? (
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {res.reasons[0].detail[currentLang]}
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-300">
                    {currentLang === 'fa' ? 'سازگاری طبیعی و کامل، بدون تضاد پارامتری یا رفتاری.' : 'Natural harmony with matching water chemistry and behavior.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* POPUP MODAL FOR CELL INSPECTION */}
      {activePair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 overflow-hidden">
            {/* Top Close Button */}
            <button
              onClick={() => setActivePair(null)}
              className="absolute top-4 end-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* Modal Title & Pair Info */}
            <div className="flex items-center gap-3 mb-4 pe-8">
              <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700">
                {getStatusIcon(activePair.result.status, 'w-6 h-6')}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                  <span>{activePair.f1.name[currentLang]}</span>
                  <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                  <span>{activePair.f2.name[currentLang]}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${getStatusBg(activePair.result.status)}`}>
                    {getStatusText(activePair.result.status)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {currentLang === 'fa' ? 'نمره همزیستی:' : 'Score:'} {activePair.result.score}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Scientific Breakdown */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pe-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {UI_TEXT.scientificMatrixReasoning[currentLang]}
              </h4>

              {activePair.result.reasons.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed">
                  {currentLang === 'fa' 
                    ? 'این دو گونه سازگاری بسیار بالایی دارند. شرایط دمایی، اسیدیته آب (pH)، خلق‌وخو و سطوح شنای آن‌ها در هماهنگی مطلوب قرار دارد.' 
                    : 'These two species exhibit excellent biological compatibility. Their temperature, pH requirements, swimming levels, and social behaviors harmonize.'}
                </div>
              ) : (
                activePair.result.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      reason.severity === 'danger'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        : reason.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {reason.severity === 'danger' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{reason.title[currentLang]}</span>
                    </div>
                    <p className="text-slate-300 opacity-90">
                      {reason.detail[currentLang]}
                    </p>
                  </div>
                ))
              )}

              {/* Water Specs Comparison Mini-Table */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <p className="font-bold text-slate-200 mb-1">{activePair.f1.name[currentLang]}</p>
                    <p className="text-slate-400 text-[11px]">pH: {activePair.f1.minPh} - {activePair.f1.maxPh}</p>
                    <p className="text-slate-400 text-[11px]">Temp: {activePair.f1.minTempC}° - {activePair.f1.maxTempC}°C</p>
                    <p className="text-slate-400 text-[11px]">{activePair.f1.adultSizeCm} cm • {activePair.f1.temperament}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <p className="font-bold text-slate-200 mb-1">{activePair.f2.name[currentLang]}</p>
                    <p className="text-slate-400 text-[11px]">pH: {activePair.f2.minPh} - {activePair.f2.maxPh}</p>
                    <p className="text-slate-400 text-[11px]">Temp: {activePair.f2.minTempC}° - {activePair.f2.maxTempC}°C</p>
                    <p className="text-slate-400 text-[11px]">{activePair.f2.adultSizeCm} cm • {activePair.f2.temperament}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActivePair(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              >
                {UI_TEXT.close[currentLang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
