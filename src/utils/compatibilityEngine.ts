import { FishSpecies, LanguageCode } from '../types/fish';
import { 
  CompatibilityStatus, 
  PairwiseResult, 
  PairwiseReason, 
  TankAnalysis, 
  TankWarning 
} from '../types/compatibility';

export function evaluateFishPair(fish1: FishSpecies, fish2: FishSpecies): PairwiseResult {
  const reasons: PairwiseReason[] = [];
  let score = 100;

  // 1. Water Type Incompatibility (Fatal)
  if (fish1.waterType !== fish2.waterType) {
    reasons.push({
      category: 'water_type',
      severity: 'danger',
      title: {
        fa: 'تضاد نوع آب (آب شیرین و آب شور)',
        en: 'Water Salinity Conflict (Freshwater vs Marine)',
        es: 'Incompatibilidad de Salinidad (Agua Dulce vs Marina)',
        de: 'Salzgehalt-Konflikt (Süßwasser vs Meerwasser)',
        fr: 'Incompatibilité de Salinité (Eau Douce vs Mer)',
        ar: 'تعارض نوع المياه (عذبة مقابل مالحة)',
        tr: 'Su Türü Uyuşmazlığı (Tatlı Su ve Tuzlu Su)',
      },
      detail: {
        fa: `${fish1.name.fa} ماهی ${fish1.waterType === 'freshwater' ? 'آب شیرین' : 'آب شور'} و ${fish2.name.fa} ماهی ${fish2.waterType === 'freshwater' ? 'آب شیرین' : 'آب شور'} است. بقای هر دو در یک تانک از نظر زیستی غیرممکن است.`,
        en: `${fish1.name.en} is ${fish1.waterType} while ${fish2.name.en} is ${fish2.waterType}. They cannot biologically survive in the same water salinity.`,
        es: `${fish1.name.es} es de ${fish1.waterType === 'freshwater' ? 'agua dulce' : 'agua salada'} y ${fish2.name.es} de ${fish2.waterType === 'freshwater' ? 'agua dulce' : 'agua salada'}. No pueden coexistir.`,
        de: `${fish1.name.de} ist ${fish1.waterType === 'freshwater' ? 'Süßwasser' : 'Meerwasser'} und ${fish2.name.de} ist ${fish2.waterType === 'freshwater' ? 'Süßwasser' : 'Meerwasser'}. Nicht vereinbar.`,
        fr: `${fish1.name.fr} vit en ${fish1.waterType === 'freshwater' ? 'eau douce' : 'eau de mer'} et ${fish2.name.fr} en ${fish2.waterType === 'freshwater' ? 'eau douce' : 'eau de mer'}. Coexistence impossible.`,
        ar: `${fish1.name.ar} سمكة ${fish1.waterType === 'freshwater' ? 'مياه عذبة' : 'مياه مالحة'} و${fish2.name.ar} سمكة ${fish2.waterType === 'freshwater' ? 'مياه عذبة' : 'مياه مالحة'}. يستحيل عيشهما معاً.`,
        tr: `${fish1.name.tr} ${fish1.waterType === 'freshwater' ? 'tatlı su' : 'tuzlu su'} ve ${fish2.name.tr} ${fish2.waterType === 'freshwater' ? 'tatlı su' : 'tuzlu su'} balığıdır. Birlikte yaşamaları imkansızdır.`,
      },
    });
    return {
      fish1Id: fish1.id,
      fish2Id: fish2.id,
      status: 'incompatible',
      score: 0,
      reasons,
    };
  }

  // 2. Predation Danger / Size disparity
  const isOnePredator = fish1.predator || fish2.predator;
  const largeFish = fish1.adultSizeCm >= fish2.adultSizeCm ? fish1 : fish2;
  const smallFish = fish1.adultSizeCm < fish2.adultSizeCm ? fish1 : fish2;
  const sizeRatio = largeFish.adultSizeCm / Math.max(smallFish.adultSizeCm, 1);

  if ((isOnePredator && sizeRatio >= 2.2) || sizeRatio >= 4.0) {
    score -= 60;
    reasons.push({
      category: 'predation',
      severity: 'danger',
      title: {
        fa: 'خطر جدی بلعیده شدن و شکار',
        en: 'Severe Predation & Swallowing Risk',
        es: 'Riesgo Severo de Depredación',
        de: 'Hohes Fress- und Verschlingungsrisiko',
        fr: 'Risque Majeur de Prédation',
        ar: 'خطر افتراس وابتلاع حقيقي',
        tr: 'Yutulma ve Avlanma Tehlikesi',
      },
      detail: {
        fa: `${largeFish.name.fa} (اندازه ${largeFish.adultSizeCm} سانتی‌متر) جثه بسیار بزرگتری نسبت به ${smallFish.name.fa} (${smallFish.adultSizeCm} سانتی‌متر) دارد و به عنوان طعمه آن را می‌بلعد.`,
        en: `${largeFish.name.en} (${largeFish.adultSizeCm} cm) is predatory or much larger than ${smallFish.name.en} (${smallFish.adultSizeCm} cm) and will likely swallow it.`,
        es: `${largeFish.name.es} (${largeFish.adultSizeCm} cm) es mucho más grande que ${smallFish.name.es} (${smallFish.adultSizeCm} cm) y lo cazará como presa.`,
        de: `${largeFish.name.de} (${largeFish.adultSizeCm} cm) ist viel größer als ${smallFish.name.de} (${smallFish.adultSizeCm} cm) und wird ihn als Beute ansehen.`,
        fr: `${largeFish.name.fr} (${largeFish.adultSizeCm} cm) est bien plus grand que ${smallFish.name.fr} (${smallFish.adultSizeCm} cm) et le dévorera.`,
        ar: `${largeFish.name.ar} (${largeFish.adultSizeCm} سم) أكبر حجماً بكثير من ${smallFish.name.ar} (${smallFish.adultSizeCm} سم) وسيبتلعها كطعام.`,
        tr: `${largeFish.name.tr} (${largeFish.adultSizeCm} cm), ${smallFish.name.tr} (${smallFish.adultSizeCm} cm) balığından çok büyüktür ve onu avlayacaktır.`,
      },
    });
  } else if (isOnePredator && sizeRatio >= 1.6 && smallFish.adultSizeCm <= 5) {
    score -= 35;
    reasons.push({
      category: 'predation',
      severity: 'warning',
      title: {
        fa: 'احتمال آسیب به ماهیان کوچک‌تر',
        en: 'Risk of Harassment to Small Species',
        es: 'Riesgo de Acoso a Especies Pequeñas',
        de: 'Gefahr für kleinere Fische',
        fr: 'Risque pour les Petites Espèces',
        ar: 'احتمال مضايقة أو مهاجمة الأسماك الصغيرة',
        tr: 'Küçük Balıklar İçin Risk',
      },
      detail: {
        fa: `${largeFish.name.fa} خوی شکارگری دارد و ممکن است نوزادان یا نمونه‌های نابالغ ${smallFish.name.fa} را تعقیب کند.`,
        en: `${largeFish.name.en} possesses hunting instincts and may pick on or devour juveniles of ${smallFish.name.en}.`,
        es: `${largeFish.name.es} tiene instintos depredadores y puede acosar a ${smallFish.name.es}.`,
        de: `${largeFish.name.de} besitzt Raubinstinkte und könnte ${smallFish.name.de} nachstellen.`,
        fr: `${largeFish.name.fr} a un instinct de chasseur et peut s'en prendre à ${smallFish.name.fr}.`,
        ar: `${largeFish.name.ar} تملك غريزة الصيد وقد تطارد صغار ${smallFish.name.ar}.`,
        tr: `${largeFish.name.tr} avcı dürtülere sahiptir ve ${smallFish.name.tr} balığını kovalayabilir.`,
      },
    });
  }

  // 3. Fin Nipping vs Long-finned fish
  const isNipper1 = fish1.finNipper;
  const isNipper2 = fish2.finNipper;
  const hasLongFins1 = fish1.longFins;
  const hasLongFins2 = fish2.longFins;

  if ((isNipper1 && hasLongFins2) || (isNipper2 && hasLongFins1)) {
    const nipper = isNipper1 ? fish1 : fish2;
    const victim = isNipper1 ? fish2 : fish1;
    score -= 40;
    reasons.push({
      category: 'fin_nipping',
      severity: 'danger',
      title: {
        fa: 'حمله و گزیدن باله‌های تزئینی (Fin Nipping)',
        en: 'Fin Nipping Behavior',
        es: 'Morder Aletas Largas',
        de: 'Flossenbeißen / Zerstörung der Schleierflossen',
        fr: 'Grignotage des Nageoires Fragiles',
        ar: 'قضم ومهاجمة الزعانف الطويلة',
        tr: 'Yüzgeç Isırma / Kemirme Davranışı',
      },
      detail: {
        fa: `${nipper.name.fa} به گزیدن باله‌های کشیده علاقه دارد و باله‌های حساس ${victim.name.fa} را زخمی خواهد کرد. این آسیب موجب عفونت‌های قارچی و مرگ می‌شود.`,
        en: `${nipper.name.en} is a notorious fin-nipper and will nip at the delicate, flowing fins of ${victim.name.en}, causing severe stress and fin rot.`,
        es: `${nipper.name.es} tiene tendencia a morder aletas y dañará a ${victim.name.es}, provocando estrés e infecciones.`,
        de: `${nipper.name.de} zupft an Flossen und wird die langen Schleier von ${victim.name.de} verletzen.`,
        fr: `${nipper.name.fr} a tendance à grignoter les nageoires voilées de ${victim.name.fr}, entraînant pourriture et stress.`,
        ar: `${nipper.name.ar} مشهورة بقضم الزعانف وستؤذي زعانف ${victim.name.ar} الانسيابية مما يسبب لها جروحاً والتهابات.`,
        tr: `${nipper.name.tr} yüzgeç kemirmeyi sever ve ${victim.name.tr} balığının hassas yüzgeçlerini ısırarak strese ve hastalığa yol açar.`,
      },
    });
  }

  // 4. Invertebrate Danger (Shrimp vs Fish)
  const isOneInvert = fish1.category === 'Invertebrates' || fish1.category === 'Marine Invertebrates' || fish1.id === 'cherry_shrimp' || fish1.id === 'cleaner_shrimp';
  const isOtherInvert = fish2.category === 'Invertebrates' || fish2.category === 'Marine Invertebrates' || fish2.id === 'cherry_shrimp' || fish2.id === 'cleaner_shrimp';

  if ((isOneInvert && !isOtherInvert && !fish2.invertSafe) || (isOtherInvert && !isOneInvert && !fish1.invertSafe)) {
    const invert = isOneInvert ? fish1 : fish2;
    const fish = isOneInvert ? fish2 : fish1;
    score -= 45;
    reasons.push({
      category: 'invert_danger',
      severity: 'danger',
      title: {
        fa: 'ناامنی برای میگوها و بی‌مهرگان',
        en: 'Invertebrate Safety Threat',
        es: 'Peligro para Invertebrados / Gambas',
        de: 'Gefahr für Wirbellose / Garnelen',
        fr: 'Danger pour Invertébrés et Crevettes',
        ar: 'خطر على الروبيان والقشريات',
        tr: 'Omurgasız ve Karidesler İçin Tehlike',
      },
      detail: {
        fa: `${fish.name.fa} به عنوان شکارچی بی‌مهرگان، میگوی ${invert.name.fa} را مورد حمله قرار داده یا زنده می‌خورد.`,
        en: `${fish.name.en} naturally hunts invertebrates and will prey on ${invert.name.en}.`,
        es: `${fish.name.es} devorará o mutilará a ${invert.name.es}.`,
        de: `${fish.name.de} betrachtet ${invert.name.de} als willkommene Beute.`,
        fr: `${fish.name.fr} considérera ${invert.name.fr} comme une proie naturelle.`,
        ar: `${fish.name.ar} تصطاد القشريات وستقضي على ${invert.name.ar}.`,
        tr: `${fish.name.tr}, ${invert.name.tr} karidesini doğal avı olarak görür ve yer.`,
      },
    });
  }

  // 5. Specific Aggression / Family Rivalry
  // African Cichlids vs peaceful community fish
  const isAfricanCichlid1 = fish1.category === 'African Cichlids';
  const isAfricanCichlid2 = fish2.category === 'African Cichlids';

  if ((isAfricanCichlid1 && !isAfricanCichlid2) || (isAfricanCichlid2 && !isAfricanCichlid1)) {
    const african = isAfricanCichlid1 ? fish1 : fish2;
    const nonAfrican = isAfricanCichlid1 ? fish2 : fish1;
    score -= 45;
    reasons.push({
      category: 'aggression',
      severity: 'danger',
      title: {
        fa: 'پرخاشگری سیچلایدهای دریاچه‌ای آفریقا',
        en: 'African Rift Lake Aggression Clash',
        es: 'Agresividad de Cíclidos del Lago Malaui',
        de: 'Aggression afrikanischer Buntbarsche',
        fr: 'Agressivité des Cichlidés Africains',
        ar: 'شراسة سيكليد البحيرات الأفريقية',
        tr: 'Afrika Cikletlerinin Agresifliği',
      },
      detail: {
        fa: `${african.name.fa} به شدت قلمروطلب است و گونه‌های صلح‌جو مثل ${nonAfrican.name.fa} را مورد ضرب و جرح قرار می‌دهد.`,
        en: `${african.name.en} is extremely territorial and will violently bully peaceful community species like ${nonAfrican.name.en}.`,
        es: `${african.name.es} es muy territorial y acosará violentamente a ${nonAfrican.name.es}.`,
        de: `${african.name.de} ist stark territorial und stresst friedliche Arten wie ${nonAfrican.name.de}.`,
        fr: `${african.name.fr} est très territorial et persécutera des espèces paisibles comme ${nonAfrican.name.fr}.`,
        ar: `${african.name.ar} سمكة شرسة إقليمياً وستهاجم بشدة سمكة مسالمة مثل ${nonAfrican.name.ar}.`,
        tr: `${african.name.tr} oldukça bölgecidir ve ${nonAfrican.name.tr} gibi sakin balıkları şiddetle hırpalar.`,
      },
    });
  }

  // Betta vs Betta or Gourami
  if (fish1.id === 'betta' && fish2.id === 'betta') {
    score -= 80;
    reasons.push({
      category: 'territory',
      severity: 'danger',
      title: {
        fa: 'نزاع مرگبار دو فایتر نر (بتا)',
        en: 'Fatal Betta-Betta Rivalry',
        es: 'Lucha a Muerte entre Bettas',
        de: 'Tödlicher Kampf zweier Kampffische',
        fr: 'Combat Mortel entre Bettas',
        ar: 'نزاع مميت بين أسماك البيتا الذكور',
        tr: 'Beta Balıkları Arasında Ölümcül Dövüş',
      },
      detail: {
        fa: 'دو فایتر نر تا پای مرگ با هم می‌جنگند و هرگز نباید در یک محفظه مشترک قرار داده شوند.',
        en: 'Male Bettas are fiercely combative and will battle each other until death. Keep strictly isolated.',
        es: 'Dos machos Betta lucharán a muerte. Nunca deben compartir acuario.',
        de: 'Zwei Betta-Männchen kämpfen bis zum Tod. Strikte Einzelhaltung erforderlich.',
        fr: 'Deux mâles Betta se battront jusqu\'à la mort. Séparation totale requise.',
        ar: 'ذكور البيتا تتقاتل حتى الموت ويجب عدم جمعها في حوض واحد إطلاقاً.',
        tr: 'İki erkek Beta birbirini öldürene kadar dövüşür, asla bir araya konulmamalıdır.',
      },
    });
  } else if ((fish1.id === 'betta' && fish2.family === 'Osphronemidae') || (fish2.id === 'betta' && fish1.family === 'Osphronemidae')) {
    score -= 30;
    reasons.push({
      category: 'aggression',
      severity: 'warning',
      title: {
        fa: 'حساسیت قلمرویی فایتر به گورامی‌ها',
        en: 'Betta vs Gourami Labyrinth Conflict',
        es: 'Conflicto Betta vs Gourami',
        de: 'Betta vs Fadenfisch Konflikt',
        fr: 'Conflit Betta / Gourami',
        ar: 'حساسية البيتا تجاه الجورامي',
        tr: 'Beta ile Gurami Arasında Bölge Çatışması',
      },
      detail: {
        fa: 'فایترها ماهیان هم‌خانواده مانند گورامی‌ها را به چشم رقیب مستقیم سطحی دیده و ممکن است به آن‌ها حمله کنند.',
        en: 'Bettas frequently mistake gouramis for rival labyrinth fish and may display persistent hostility.',
        es: 'Los Bettas pueden confundir a los gouramis con rivales y atacarlos.',
        de: 'Kampffische verwechseln Fadenfische oft mit Rivalen und greifen an.',
        fr: 'Les Bettas confondent souvent les gouramis avec des rivaux.',
        ar: 'قد تخطئ سمكة البيتا وتعتبر الجورامي منافساً لها في السطح وتهاجمه.',
        tr: 'Betalar benzer labirentli guramileri rakip sanıp saldırabilir.',
      },
    });
  }

  // 6. pH Mismatch
  const overlapPhMin = Math.max(fish1.minPh, fish2.minPh);
  const overlapPhMax = Math.min(fish1.maxPh, fish2.maxPh);

  if (overlapPhMin > overlapPhMax) {
    const gap = (overlapPhMin - overlapPhMax).toFixed(1);
    score -= 40;
    reasons.push({
      category: 'ph_mismatch',
      severity: 'danger',
      title: {
        fa: 'تضاد شدید اسیدیته آب (pH)',
        en: 'Severe pH Parameter Conflict',
        es: 'Conflicto Severo de pH',
        de: 'Schwerer pH-Wert Konflikt',
        fr: 'Conflit Majeur de pH',
        ar: 'تعارض حاد في درجة حموضة الماء (pH)',
        tr: 'Ciddi pH Değeri Çatışması',
      },
      detail: {
        fa: `${fish1.name.fa} نیازمند بازه pH (${fish1.minPh} تا ${fish1.maxPh}) است در حالی که ${fish2.name.fa} به pH (${fish2.minPh} تا ${fish2.maxPh}) نیاز دارد. هیچ نقطه اشتراکی وجود ندارد (اختلاف ${gap}).`,
        en: `${fish1.name.en} requires pH ${fish1.minPh}-${fish1.maxPh}, while ${fish2.name.en} requires pH ${fish2.minPh}-${fish2.maxPh}. No overlapping safe range exists (gap of ${gap}).`,
        es: `${fish1.name.es} requiere pH ${fish1.minPh}-${fish1.maxPh} y ${fish2.name.es} pH ${fish2.minPh}-${fish2.maxPh}. Sin rango común.`,
        de: `${fish1.name.de} benötigt pH ${fish1.minPh}-${fish1.maxPh}, ${fish2.name.de} aber pH ${fish2.minPh}-${fish2.maxPh}. Keine Schnittmenge.`,
        fr: `${fish1.name.fr} requiert un pH de ${fish1.minPh}-${fish1.maxPh} alors que ${fish2.name.fr} demande ${fish2.minPh}-${fish2.maxPh}. Incompatible.`,
        ar: `${fish1.name.ar} تحتاج درجة حموضة (${fish1.minPh} - ${fish1.maxPh}) بينما ${fish2.name.ar} تحتاج (${fish2.minPh} - ${fish2.maxPh}). لا يوجد نطاق مشترك.`,
        tr: `${fish1.name.tr} pH ${fish1.minPh}-${fish1.maxPh} isterken, ${fish2.name.tr} pH ${fish2.minPh}-${fish2.maxPh} ister. Ortak güvenli değer yoktur.`,
      },
    });
  } else if (overlapPhMax - overlapPhMin < 0.4) {
    score -= 10;
    reasons.push({
      category: 'ph_mismatch',
      severity: 'info',
      title: {
        fa: 'بازه pH بسیار محدود و حساس',
        en: 'Narrow pH Overlap Tolerance',
        es: 'Rango de pH Estrecho',
        de: 'Enger gemeinsamer pH-Bereich',
        fr: 'Plage de pH Commune Étroite',
        ar: 'نطاق pH مشترك ضيق وحساس',
        tr: 'Dar pH Uyum Aralığı',
      },
      detail: {
        fa: `بازه مشترک pH بسیار باریک (${overlapPhMin.toFixed(1)} تا ${overlapPhMax.toFixed(1)}) است و نوسان آب می‌تواند یکی از گونه‌ها را با تنش اسیدی روبرو کند.`,
        en: `Safe overlapping pH is very narrow (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}). Strict buffering is required.`,
        es: `El rango común de pH es muy estrecho (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}).`,
        de: `Der gemeinsame pH-Bereich ist sehr eng (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}).`,
        fr: `La plage commune de pH est restreinte (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}).`,
        ar: `نطاق pH المشترك ضيق للغاية (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}) ويتطلب ثباتاً دقيقاً.`,
        tr: `Ortak pH aralığı oldukça dardır (${overlapPhMin.toFixed(1)} - ${overlapPhMax.toFixed(1)}). Su dengesi iyi korunmalıdır.`,
      },
    });
  }

  // 7. Temperature Mismatch
  const overlapTempMin = Math.max(fish1.minTempC, fish2.minTempC);
  const overlapTempMax = Math.min(fish1.maxTempC, fish2.maxTempC);

  if (overlapTempMin > overlapTempMax) {
    const gap = overlapTempMin - overlapTempMax;
    score -= 45;
    reasons.push({
      category: 'temp_mismatch',
      severity: 'danger',
      title: {
        fa: 'تضاد دمایی شدید (آب سرد در برابر استوایی)',
        en: 'Severe Thermal Conflict (Coldwater vs Tropical)',
        es: 'Incompatibilidad Térmica Severa',
        de: 'Schwerer Temperaturkonflikt (Kalt- vs Warmwasser)',
        fr: 'Conflit de Température Majeur',
        ar: 'تعارض حاد في درجة الحرارة (بارد مقابل استوائي)',
        tr: 'Ciddi Sıcaklık Çatışması (Soğuk Su ve Tropikal)',
      },
      detail: {
        fa: `${fish1.name.fa} به دمای (${fish1.minTempC}° تا ${fish1.maxTempC}°C) و ${fish2.name.fa} به (${fish2.minTempC}° تا ${fish2.maxTempC}°C) نیاز دارد. دمای مطلوب یکی باعث مرگ یا افت سیستم ایمنی دیگری می‌شود.`,
        en: `${fish1.name.en} thrives at ${fish1.minTempC}-${fish1.maxTempC}°C, whereas ${fish2.name.en} requires ${fish2.minTempC}-${fish2.maxTempC}°C. No thermal overlap exists.`,
        es: `${fish1.name.es} (${fish1.minTempC}-${fish1.maxTempC}°C) y ${fish2.name.es} (${fish2.minTempC}-${fish2.maxTempC}°C) no comparten rango de temperatura viable.`,
        de: `${fish1.name.de} (${fish1.minTempC}-${fish1.maxTempC}°C) und ${fish2.name.de} (${fish2.minTempC}-${fish2.maxTempC}°C) haben keine Temperaturüberschneidung.`,
        fr: `${fish1.name.fr} (${fish1.minTempC}-${fish1.maxTempC}°C) et ${fish2.name.fr} (${fish2.minTempC}-${fish2.maxTempC}°C) ne partagent aucune plage thermique.`,
        ar: `${fish1.name.ar} تفضل (${fish1.minTempC}° - ${fish1.maxTempC}°م) بينما ${fish2.name.ar} تحتاج (${fish2.minTempC}° - ${fish2.maxTempC}°م). لا يوجد تداخل حراري.`,
        tr: `${fish1.name.tr} (${fish1.minTempC}-${fish1.maxTempC}°C) ile ${fish2.name.tr} (${fish2.minTempC}-${fish2.maxTempC}°C) arasında ortak sıcaklık aralığı yoktur.`,
      },
    });
  }

  // 8. General Temperament Compatibility
  if (
    (fish1.temperament === 'aggressive' && fish2.temperament === 'peaceful') ||
    (fish2.temperament === 'aggressive' && fish1.temperament === 'peaceful')
  ) {
    const agg = fish1.temperament === 'aggressive' ? fish1 : fish2;
    const peace = fish1.temperament === 'peaceful' ? fish1 : fish2;
    score -= 30;
    reasons.push({
      category: 'aggression',
      severity: 'warning',
      title: {
        fa: 'ناهمخوانی خلق‌وخو (تهاجمی و صلح‌جو)',
        en: 'Temperament Mismatch (Aggressive vs Peaceful)',
        es: 'Incompatibilidad de Temperamento',
        de: 'Temperament-Konflikt (Aggressiv vs Friedlich)',
        fr: 'Incompatibilité de Caractère (Agressif vs Paisible)',
        ar: 'عدم تطابق في الطباع (شراسة مقابل هدوء)',
        tr: 'Mizaç Uyuşmazlığı (Agresif ve Barışçıl)',
      },
      detail: {
        fa: `${agg.name.fa} به عنوان گونه تهاجمی، آرامش ${peace.name.fa} را سلب کرده و موجب استرس مزمن و مرگ تدریجی آن خواهد شد.`,
        en: `${agg.name.en} is an aggressive species that will continuously intimidate and stress ${peace.name.en}.`,
        es: `${agg.name.es} es agresivo y estresará constantemente al pacífico ${peace.name.es}.`,
        de: `${agg.name.de} ist aggressiv und stresst die friedliche Art ${peace.name.de}.`,
        fr: `${agg.name.fr} est agressif et stressera constamment ${peace.name.fr}.`,
        ar: `${agg.name.ar} سمكة عدوانية ستسبب إجهاداً وذعراً دائماً لـ ${peace.name.ar}.`,
        tr: `${agg.name.tr} agresif bir türdür ve barışçıl ${peace.name.tr} balığını sürekli rahatsız ederek strese sokacaktır.`,
      },
    });
  }

  // Determine final status
  score = Math.max(0, Math.min(100, score));
  let status: CompatibilityStatus = 'compatible';

  const hasDanger = reasons.some(r => r.severity === 'danger');
  const hasWarning = reasons.some(r => r.severity === 'warning');

  if (hasDanger || score < 50) {
    status = 'incompatible';
  } else if (hasWarning || score < 80) {
    status = 'caution';
  }

  return {
    fish1Id: fish1.id,
    fish2Id: fish2.id,
    status,
    score,
    reasons,
  };
}

export function analyzeTank(selectedSpecies: FishSpecies[]): TankAnalysis {
  const pairResults = new Map<string, PairwiseResult>();
  const pairwiseList: PairwiseResult[] = [];
  const warnings: TankWarning[] = [];

  if (selectedSpecies.length === 0) {
    return {
      overallScore: 100,
      overallStatus: 'compatible',
      pairResults,
      pairwiseList,
      warnings,
      minRecommendedTankSizeLiters: 0,
      waterTypeHarmony: 'all_freshwater',
      safePhRange: { min: 6.5, max: 7.5, isCompatible: true },
      safeTempRangeC: { min: 24, max: 26, isCompatible: true },
    };
  }

  if (selectedSpecies.length === 1) {
    const single = selectedSpecies[0];
    return {
      overallScore: 100,
      overallStatus: 'compatible',
      pairResults,
      pairwiseList,
      warnings,
      minRecommendedTankSizeLiters: single.minTankSizeLiters,
      waterTypeHarmony: single.waterType === 'freshwater' ? 'all_freshwater' : 'all_saltwater',
      safePhRange: { min: single.minPh, max: single.maxPh, isCompatible: true },
      safeTempRangeC: { min: single.minTempC, max: single.maxTempC, isCompatible: true },
    };
  }

  // Water types check
  const hasFresh = selectedSpecies.some(f => f.waterType === 'freshwater');
  const hasSalt = selectedSpecies.some(f => f.waterType === 'saltwater');
  let waterHarmony: 'all_freshwater' | 'all_saltwater' | 'mixed_conflict' = 'all_freshwater';
  if (hasFresh && hasSalt) {
    waterHarmony = 'mixed_conflict';
  } else if (hasSalt) {
    waterHarmony = 'all_saltwater';
  }

  // Min tank size: largest min requirement + scaled by count
  const maxIndividualTank = Math.max(...selectedSpecies.map(f => f.minTankSizeLiters));
  const minRecommendedTankSizeLiters = Math.round(maxIndividualTank * (1 + (selectedSpecies.length - 1) * 0.15));

  // Global pH overlap
  const minPhGlobal = Math.max(...selectedSpecies.map(f => f.minPh));
  const maxPhGlobal = Math.min(...selectedSpecies.map(f => f.maxPh));
  const phCompatible = minPhGlobal <= maxPhGlobal;

  // Global Temp overlap
  const minTempGlobal = Math.max(...selectedSpecies.map(f => f.minTempC));
  const maxTempGlobal = Math.min(...selectedSpecies.map(f => f.maxTempC));
  const tempCompatible = minTempGlobal <= maxTempGlobal;

  let totalPairScores = 0;
  let pairCount = 0;
  let hasAnyDanger = false;
  let hasAnyWarning = false;

  for (let i = 0; i < selectedSpecies.length; i++) {
    for (let j = i + 1; j < selectedSpecies.length; j++) {
      const f1 = selectedSpecies[i];
      const f2 = selectedSpecies[j];
      const res = evaluateFishPair(f1, f2);

      const key = `${f1.id}__${f2.id}`;
      const revKey = `${f2.id}__${f1.id}`;
      pairResults.set(key, res);
      pairResults.set(revKey, res);
      pairwiseList.push(res);

      totalPairScores += res.score;
      pairCount++;

      if (res.status === 'incompatible') hasAnyDanger = true;
      if (res.status === 'caution') hasAnyWarning = true;

      // Extract high severity warnings for the tank dashboard
      res.reasons.forEach(r => {
        if (r.severity === 'danger' && !warnings.some(w => w.title.en === r.title.en && w.fishIds.includes(f1.id) && w.fishIds.includes(f2.id))) {
          warnings.push({
            severity: r.severity,
            fishIds: [f1.id, f2.id],
            title: r.title,
            message: r.detail,
          });
        }
      });
    }
  }

  let overallScore = pairCount > 0 ? Math.round(totalPairScores / pairCount) : 100;
  if (waterHarmony === 'mixed_conflict') {
    overallScore = 0;
  }

  let overallStatus: CompatibilityStatus = 'compatible';
  if (hasAnyDanger || overallScore < 50 || waterHarmony === 'mixed_conflict') {
    overallStatus = 'incompatible';
  } else if (hasAnyWarning || overallScore < 80 || !phCompatible || !tempCompatible) {
    overallStatus = 'caution';
  }

  return {
    overallScore,
    overallStatus,
    pairResults,
    pairwiseList,
    warnings,
    minRecommendedTankSizeLiters,
    waterTypeHarmony: waterHarmony,
    safePhRange: {
      min: minPhGlobal,
      max: maxPhGlobal,
      isCompatible: phCompatible,
    },
    safeTempRangeC: {
      min: minTempGlobal,
      max: maxTempGlobal,
      isCompatible: tempCompatible,
    },
  };
}
