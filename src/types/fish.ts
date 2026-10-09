export type LanguageCode = 'fa' | 'en' | 'es' | 'de' | 'fr' | 'ar' | 'tr';

export type WaterType = 'freshwater' | 'saltwater';

export type Temperament = 'peaceful' | 'semi-aggressive' | 'aggressive';

export type CareLevel = 'easy' | 'moderate' | 'difficult' | 'expert';

export type DietType = 'omnivore' | 'carnivore' | 'herbivore';

export type SwimmingLevel = 'top' | 'mid' | 'bottom' | 'all';

export interface FishSpecies {
  id: string;
  name: Record<LanguageCode, string>;
  scientificName: string;
  waterType: WaterType;
  family: string;
  origin: Record<LanguageCode, string>;
  temperament: Temperament;
  careLevel: CareLevel;
  diet: DietType;
  swimmingLevel: SwimmingLevel;
  minTankSizeLiters: number;
  adultSizeCm: number;
  minTempC: number;
  maxTempC: number;
  minPh: number;
  maxPh: number;
  schooling: boolean; // Needs groups of 5-6+
  finNipper?: boolean;
  longFins?: boolean;
  predator?: boolean;
  invertSafe: boolean; // Safe with small shrimp / invertebrates
  reefSafe?: boolean; // For saltwater corals
  category: string;
  colorHex: string;
  description: Record<LanguageCode, string>;
}
