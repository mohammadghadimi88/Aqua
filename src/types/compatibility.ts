import { LanguageCode } from './fish';

export type CompatibilityStatus = 'compatible' | 'caution' | 'incompatible';

export type ConflictCategory = 
  | 'water_type' 
  | 'predation' 
  | 'fin_nipping' 
  | 'ph_mismatch' 
  | 'temp_mismatch' 
  | 'aggression' 
  | 'territory' 
  | 'invert_danger';

export interface PairwiseReason {
  category: ConflictCategory;
  severity: 'danger' | 'warning' | 'info';
  title: Record<LanguageCode, string>;
  detail: Record<LanguageCode, string>;
}

export interface PairwiseResult {
  fish1Id: string;
  fish2Id: string;
  status: CompatibilityStatus;
  score: number; // 0 - 100
  reasons: PairwiseReason[];
}

export interface TankWarning {
  severity: 'danger' | 'warning' | 'info';
  fishIds: string[];
  title: Record<LanguageCode, string>;
  message: Record<LanguageCode, string>;
}

export interface TankAnalysis {
  overallScore: number; // 0 - 100
  overallStatus: CompatibilityStatus;
  pairResults: Map<string, PairwiseResult>;
  pairwiseList: PairwiseResult[];
  warnings: TankWarning[];
  minRecommendedTankSizeLiters: number;
  waterTypeHarmony: 'all_freshwater' | 'all_saltwater' | 'mixed_conflict';
  safePhRange: { min: number; max: number; isCompatible: boolean };
  safeTempRangeC: { min: number; max: number; isCompatible: boolean };
}
