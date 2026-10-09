import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Droplet, 
  Thermometer, 
  Box, 
  Flame, 
  Sparkles,
  Waves
} from 'lucide-react';
import { TankAnalysis } from '../types/compatibility';
import { FishSpecies, LanguageCode } from '../types/fish';
import { UI_TEXT } from '../utils/i18n';

interface TankSummaryCardProps {
  analysis: TankAnalysis;
  selectedSpecies: FishSpecies[];
  currentLang: LanguageCode;
  useFahrenheit: boolean;
}

export const TankSummaryCard: React.FC<TankSummaryCardProps> = ({
  analysis,
  selectedSpecies,
  currentLang,
  useFahrenheit,
}) => {
  if (selectedSpecies.length === 0) return null;

  // Temperature conversion
  const cToF = (c: number) => Math.round((c * 9) / 5 + 32);
  const lToGal = (l: number) => Math.round(l * 0.264172);

  const displayTankSize = useFahrenheit
    ? `${lToGal(analysis.minRecommendedTankSizeLiters)} ${UI_TEXT.gallons[currentLang]}`
    : `${analysis.minRecommendedTankSizeLiters} ${UI_TEXT.liters[currentLang]}`;

  const displayTempMin = useFahrenheit
    ? `${cToF(analysis.safeTempRangeC.min)}°F`
    : `${analysis.safeTempRangeC.min}°C`;

  const displayTempMax = useFahrenheit
    ? `${cToF(analysis.safeTempRangeC.max)}°F`
    : `${analysis.safeTempRangeC.max}°C`;

  // Status Styling & Texts
  let statusColor = 'from-emerald-500 to-teal-400';
  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  let statusTitle = UI_TEXT.harmony100Title[currentLang];
  let statusIcon = <CheckCircle className="w-6 h-6 text-emerald-400" />;

  if (analysis.overallStatus === 'incompatible') {
    statusColor = 'from-rose-600 to-red-500';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    statusTitle = UI_TEXT.harmonyDangerTitle[currentLang];
    statusIcon = <ShieldAlert className="w-6 h-6 text-rose-400" />;
  } else if (analysis.overallStatus === 'caution') {
    statusColor = 'from-amber-500 to-yellow-400';
    badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    statusTitle = UI_TEXT.harmonyCautionTitle[currentLang];
    statusIcon = <AlertTriangle className="w-6 h-6 text-amber-400" />;
  }

  // Circular progress stroke calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.overallScore / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-5 sm:p-6 transition-all">
      {/* Top Banner with Score Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4 text-center sm:text-start">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
            {statusIcon}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}>
                {analysis.overallStatus === 'compatible' && UI_TEXT.compatibleStatus[currentLang]}
                {analysis.overallStatus === 'caution' && UI_TEXT.cautionStatus[currentLang]}
                {analysis.overallStatus === 'incompatible' && UI_TEXT.incompatibleStatus[currentLang]}
              </span>
              <span className="text-xs text-slate-400">
                {selectedSpecies.length} {currentLang === 'fa' ? 'گونه فعال' : 'Species in Tank'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1">
              {statusTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {analysis.waterTypeHarmony === 'mixed_conflict'
                ? (currentLang === 'fa' ? 'تداخل مهلک آب شور و شیرین شناسایی شد!' : 'Fatal Freshwater & Saltwater mixture detected!')
                : (currentLang === 'fa' ? 'بررسی بیولوژیکی، پارامترها و رفتار گونه‌ها' : 'Biological, parameter & behavioral evaluation')}
            </p>
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-700 ${
                analysis.overallStatus === 'compatible'
                  ? 'text-emerald-500'
                  : analysis.overallStatus === 'caution'
                  ? 'text-amber-500'
                  : 'text-rose-500'
              }`}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white leading-none">
              {analysis.overallScore}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
              {currentLang === 'fa' ? 'سازگاری' : 'Score'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Environmental Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-6">
        {/* Recommended Tank Volume */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {UI_TEXT.recommendedTankSize[currentLang]}
            </span>
            <span className="text-sm sm:text-base font-bold text-white">
              {displayTankSize}
            </span>
          </div>
        </div>

        {/* Safe Temperature Range */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          analysis.safeTempRangeC.isCompatible 
            ? 'bg-slate-800/60 border-slate-700/60' 
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          <div className={`p-2.5 rounded-xl ${
            analysis.safeTempRangeC.isCompatible ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {UI_TEXT.safeTemp[currentLang]}
            </span>
            {analysis.safeTempRangeC.isCompatible ? (
              <span className="text-sm sm:text-base font-bold text-white">
                {displayTempMin} - {displayTempMax}
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400">
                {UI_TEXT.noOverlapWarning[currentLang]}
              </span>
            )}
          </div>
        </div>

        {/* Safe pH Range */}
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          analysis.safePhRange.isCompatible 
            ? 'bg-slate-800/60 border-slate-700/60' 
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          <div className={`p-2.5 rounded-xl ${
            analysis.safePhRange.isCompatible ? 'bg-sky-500/10 text-sky-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">
              {UI_TEXT.safePh[currentLang]}
            </span>
            {analysis.safePhRange.isCompatible ? (
              <span className="text-sm sm:text-base font-bold text-white">
                {analysis.safePhRange.min.toFixed(1)} - {analysis.safePhRange.max.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400">
                {UI_TEXT.noOverlapWarning[currentLang]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Critical Warnings Accordion / Cards */}
      {analysis.warnings.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{currentLang === 'fa' ? 'هشدارها و تضادهای شناسایی شده در تانک' : 'Identified Conflicts & Warnings'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {analysis.warnings.map((warn, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs leading-relaxed"
              >
                <div className="font-bold text-rose-300 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{warn.title[currentLang]}</span>
                </div>
                <p className="text-slate-300 opacity-90 text-[11px]">
                  {warn.message[currentLang]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
