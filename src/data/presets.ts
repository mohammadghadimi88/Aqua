import { LanguageCode } from '../types/fish';

export interface TankPreset {
  id: string;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  speciesIds: string[];
  waterType: 'freshwater' | 'saltwater' | 'mixed';
  badgeColor: string;
}

export const TANK_PRESETS: TankPreset[] = [
  {
    id: 'amazon_peaceful',
    name: {
      fa: 'جامعه صلح‌جوی استوایی آمازون',
      en: 'Peaceful Amazon Tropical Community',
      es: 'Comunidad Tropical Pacífica del Amazonas',
      de: 'Friedliche Amazonas-Pflanzengemeinschaft',
      fr: 'Communauté Paisible d\'Amazonie',
      ar: 'مجتمع الأمازون الاستوائي المسالم',
      tr: 'Barışçıl Amazon Tropikal Karma Akvaryumu',
    },
    description: {
      fa: 'ترکیب ایده‌آل و پایدار از ماهیان صلح‌جو برای تانک‌های گیاهی با رنگ‌آمیزی فوق‌العاده',
      en: 'Ideal balanced community of peaceful schooling fish and bottom cleaners for planted aquariums',
      es: 'Comunidad equilibrada de peces pacíficos y limpiadores de fondo',
      de: 'Harmonische Gesellschaft aus Schwarmfischen und friedlichen Bodenbewohnern',
      fr: 'Communauté harmonieuse de poissons de banc et de fond pacifiques',
      ar: 'مزيج مثالي ومتوازن من أسماك الأسراب المسالمة ومنظفات القاع',
      tr: 'Bitkili akvaryumlar için barışçıl sürü balıkları ve dip temizleyicilerinden dengeli bir karma',
    },
    speciesIds: ['neon_tetra', 'harlequin_rasbora', 'corydoras', 'bristlenose_pleco', 'dwarf_gourami'],
    waterType: 'freshwater',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    id: 'malawi_cichlids',
    name: {
      fa: 'بیوتوپ صخره‌ای سیچلایدهای مالاوی',
      en: 'Lake Malawi African Cichlids',
      es: 'Cíclidos del Lago Malaui',
      de: 'Malawisee Felsenbiotop',
      fr: 'Cichlidés du Lac Malawi',
      ar: 'سيكليد بحيرة ملاوي الصخرية',
      tr: 'Malavi Gölü Kayalık Cikletleri',
    },
    description: {
      fa: 'ماهیان سرسخت و درخشان نیازمند آب قلیایی سخت و صخره‌های فراوان',
      en: 'Hardy and colorful African cichlids requiring hard alkaline water and rock caves',
      es: 'Cíclidos africanos llamativos para acuarios de roca con pH alcalino',
      de: 'Farbintensive Felsenbarsche für hartes, alkalisches Wasser',
      fr: 'Cichlidés africains éclatants pour bac rocheux à pH élevé',
      ar: 'أسماك سيكليد ملونة وقوية تتطلب مياهاً كلسية قلوية وديكوراً صخرياً',
      tr: 'Yüksek pH ve sert su isteyen, bol kayalık alan seven renkli Afrika cikletleri',
    },
    speciesIds: ['african_cichlid_yellow_lab', 'african_cichlid_red_zebra'],
    waterType: 'freshwater',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    id: 'nano_planted',
    name: {
      fa: 'نانو پلنت (میگو و ریزماهی)',
      en: 'Nano Planted & Shrimp Biotope',
      es: 'Nano Acuario Plantado con Gambas',
      de: 'Nano-Aquascape mit Zwerggarnelen',
      fr: 'Nano Bac Planté & Crevettes',
      ar: 'نانو نباتي مع الروبيان الصغير',
      tr: 'Nano Bitkili & Karides Akvaryumu',
    },
    description: {
      fa: 'ترکیب بی‌نقص و امن برای آکواریوم‌های کوچک و تانک‌های میگو ردچری',
      en: '100% shrimp-safe micro-ecosystem with algae grazers and gentle nano fish',
      es: 'Microecosistema seguro para gambas con peces pacíficos diminutos',
      de: 'Garnelenfreundliches Minibiotop mit sanften Zwergfischen',
      fr: 'Micro-écosystème sûr pour les crevettes avec micro-poissons',
      ar: 'بيئة مصغرة آمنة 100% للروبيان مع أسماك نانو ناعمة',
      tr: 'Karidesler için %100 güvenli, yosun yiyicili nano akvaryum kombinasyonu',
    },
    speciesIds: ['cherry_shrimp', 'otocinclus', 'harlequin_rasbora', 'kuhli_loach'],
    waterType: 'freshwater',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  },
  {
    id: 'tropical_reef',
    name: {
      fa: 'ریف آب شور و دلقک‌ماهی (نمو)',
      en: 'Tropical Marine Reef Community',
      es: 'Comunidad de Arrecife Marino',
      de: 'Tropische Meerwasser-Riffgemeinschaft',
      fr: 'Communauté Récifale Marine',
      ar: 'مجتمع الشعاب البحرية المرجانية',
      tr: 'Tropikal Deniz Resif Akvaryumu',
    },
    description: {
      fa: 'ماهیان ریف سیف و میگوی کلینر مناسب آکواریوم‌های آب شور با مرجان',
      en: 'Reef-safe marine species with clownfish, royal gramma, and cleaner shrimp',
      es: 'Peces marinos seguros para corales y gamba limpiadora simbiótica',
      de: 'Riffsichere Meeresfische mit Putzergarnele und Clownfisch',
      fr: 'Espèces marines compatibles coraux avec poisson-clown et crevette',
      ar: 'أسماك بحرية آمنة للمرجان مع سمكة المهرج وروبيان التنظيف',
      tr: 'Palyaço balığı, royal gramma ve doktor karidesli resif uyumlu deniz akvaryumu',
    },
    speciesIds: ['clownfish', 'royal_gramma', 'cleaner_shrimp', 'green_chromis', 'banggai_cardinal'],
    waterType: 'saltwater',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  {
    id: 'danger_clash_demo',
    name: {
      fa: 'نمونه ناسازگار و پرخطر (شکارچی و طعمه)',
      en: 'High Conflict & Predation Danger (Demo)',
      es: 'Ejemplo de Incompatibilidad y Depredación',
      de: 'Unverträgliches Risikobecken (Demo)',
      fr: 'Démonstration de Conflit & Prédation',
      ar: 'نموذج تعارض وخطر افتراس (تجريبي)',
      tr: 'Uyumsuz ve Tehlikeli Karma (Örnek)',
    },
    description: {
      fa: 'برای نمایش نحوه شناسایی خطرات: ترکیب اسکار، نئون، گوپی و گلدفیش سردابی!',
      en: 'Demonstrates conflict detection: predatory Oscar, tiny tetras, coldwater goldfish, and fin nippers',
      es: 'Demuestra la detección de riesgos: depredadores con presas y peces de agua fría',
      de: 'Zeigt die Konflikterkennung: Raubfisch mit Zwergfischen und Kaltwasserfisch',
      fr: 'Démontre la détection des conflits : prédateur vorace, petits poissons et eau froide',
      ar: 'لتوضيح تحذيرات النظام: جمع الأوسكار المفترس مع النيون والغوبي والغولد فيش البارد',
      tr: 'Sistem uyarılarını görmek için: Avcı oscar, küçük neon, lepistes ve soğuk su japon balığı',
    },
    speciesIds: ['oscar', 'neon_tetra', 'fancy_goldfish', 'tiger_barb'],
    waterType: 'freshwater',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
];
