import { PainSeverity, PediatricAgeGroup } from '../types';

/** مسیر فایل‌های public با احترام به base پروژه (برای میزبانی در زیرمسیر هم کار کند) */
export const asset = (path: string): string => {
  const base = ((import.meta as any).env?.BASE_URL as string | undefined) ?? '/';
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
};

/* ------------------------------------------------------------------ */
/*  تصاویر مقیاس‌ها (استخراج‌شده از فایل‌های ابلاغی ارسال‌شده)           */
/* ------------------------------------------------------------------ */

export const WONG_BAKER_FACES = [
  { value: 0, img: asset('/assets/pain/wb_0.png'), en: 'No Hurt', fa: 'بدون درد' },
  { value: 2, img: asset('/assets/pain/wb_2.png'), en: 'Hurts Little Bit', fa: 'کمی درد' },
  { value: 4, img: asset('/assets/pain/wb_4.png'), en: 'Hurts Little More', fa: 'کمی بیشتر' },
  { value: 6, img: asset('/assets/pain/wb_6.png'), en: 'Hurts Even More', fa: 'باز هم بیشتر' },
  { value: 8, img: asset('/assets/pain/wb_8.png'), en: 'Hurts Whole Lot', fa: 'خیلی درد' },
  { value: 10, img: asset('/assets/pain/wb_10.png'), en: 'Hurts Worst', fa: 'بدترین درد' },
];

export const VAS_FACES = [
  { value: 0, img: asset('/assets/pain/vas_0.png'), fa: 'بدون درد' },
  { value: 2, img: asset('/assets/pain/vas_2.png'), fa: 'درد خفیف' },
  { value: 4, img: asset('/assets/pain/vas_4.png'), fa: 'درد متوسط (پایین)' },
  { value: 6, img: asset('/assets/pain/vas_6.png'), fa: 'درد متوسط (بالا)' },
  { value: 8, img: asset('/assets/pain/vas_8.png'), fa: 'درد شدید' },
  { value: 10, img: asset('/assets/pain/vas_10.png'), fa: 'بدترین درد ممکن' },
];

/** عکس‌های بالینی BPS؛ شاخص آرایه = امتیاز − ۱ */
export const BPS_FACE_IMAGES = [
  [asset('/assets/pain/bps_face_a_1.jpg'), asset('/assets/pain/bps_face_a_2.jpg'), asset('/assets/pain/bps_face_a_3.jpg'), asset('/assets/pain/bps_face_a_4.jpg')],
  [asset('/assets/pain/bps_face_b_1.jpg'), asset('/assets/pain/bps_face_b_2.jpg'), asset('/assets/pain/bps_face_b_3.jpg'), asset('/assets/pain/bps_face_b_4.jpg')],
];
export const BPS_ARM_IMAGES = [
  [asset('/assets/pain/bps_arm_a_1.jpg'), asset('/assets/pain/bps_arm_a_2.jpg'), asset('/assets/pain/bps_arm_a_3.jpg'), asset('/assets/pain/bps_arm_a_4.jpg')],
  [asset('/assets/pain/bps_arm_b_1.jpg'), asset('/assets/pain/bps_arm_b_2.jpg'), asset('/assets/pain/bps_arm_b_3.jpg'), asset('/assets/pain/bps_arm_b_4.jpg')],
];

/* ------------------------------------------------------------------ */
/*  تعیین شدت درد طبق ابلاغیه                                           */
/* ------------------------------------------------------------------ */

/** VAS / NRS بزرگسال طبق الگوریتم: ۰ | ۱-۳ | ۴-۶ | ۷-۸ | ۹-۱۰ */
export const adultNumericSeverity = (v: number): PainSeverity => {
  if (v === 0) return PainSeverity.NONE;
  if (v <= 3) return PainSeverity.MILD;
  if (v <= 6) return PainSeverity.MODERATE;
  if (v <= 8) return PainSeverity.SEVERE;
  return PainSeverity.VERY_SEVERE;
};

/** BPS طبق الگوریتم: ≤۳ بدون درد | ۴-۶ خفیف | ۷-۹ متوسط | ۱۰-۱۲ شدید */
export const bpsSeverity = (v: number): PainSeverity => {
  if (v <= 3) return PainSeverity.NONE;
  if (v <= 6) return PainSeverity.MILD;
  if (v <= 9) return PainSeverity.MODERATE;
  return PainSeverity.SEVERE;
};

/** FLACC / CHIPPS اطفال: ۰ | ۱-۳ | ۴-۶ | ≥۷ */
export const pediatricSeverity = (v: number): PainSeverity => {
  if (v === 0) return PainSeverity.NONE;
  if (v <= 3) return PainSeverity.MILD;
  if (v <= 6) return PainSeverity.MODERATE;
  return PainSeverity.SEVERE;
};

/** Wong-Baker طبق اسلاید: ۱-۳ خفیف | ۴-۶ متوسط | ۷-۹ شدید | ۱۰ بسیار شدید */
export const wongBakerSeverity = (v: number): PainSeverity => {
  if (v === 0) return PainSeverity.NONE;
  if (v <= 3) return PainSeverity.MILD;
  if (v <= 6) return PainSeverity.MODERATE;
  if (v <= 9) return PainSeverity.SEVERE;
  return PainSeverity.VERY_SEVERE;
};

export const severityLabel: Record<PainSeverity, string> = {
  [PainSeverity.NONE]: 'فاقد درد',
  [PainSeverity.MILD]: 'درد خفیف',
  [PainSeverity.MODERATE]: 'درد متوسط',
  [PainSeverity.SEVERE]: 'درد شدید',
  [PainSeverity.VERY_SEVERE]: 'درد بسیار شدید / غیرقابل تحمل',
};

/* ------------------------------------------------------------------ */
/*  ساختار پلن درمانی                                                  */
/* ------------------------------------------------------------------ */

export interface PlanItem {
  text: string;
  /** 'file' = مطابق متن ابلاغیه، 'extra' = مرجع تکمیلی/عملکرد رایج که در ابلاغیه ذکر نشده و باید با پزشک/داروساز تأیید شود */
  source?: 'file' | 'extra';
}

export interface Plan {
  meds: PlanItem[];
  nonPharm: PlanItem[];
  actions: PlanItem[];
  reassess: PlanItem[];
  safety: PlanItem[];
  color: string;
  icon: string;
}

const f = (text: string): PlanItem => ({ text, source: 'file' });
const x = (text: string): PlanItem => ({ text, source: 'extra' });

/* ------------------------------ بزرگسالان ------------------------------ */

const ADULT_OPIOID_MONITORING: PlanItem[] = [
  f('بی‌دردی مناسب و بدون عارضه: دوز تجویزی ادامه یابد.'),
  f('بی‌دردی نامناسب ولی بدون عارضه: ابتدا راه وریدی و عملکرد صحیح داروی تجویزی توسط پرستار کنترل شود؛ سپس طبق نظر پزشک دوز افزایش یابد یا داروی مناسب دیگری جایگزین گردد.'),
  f('بی‌دردی مناسب ولی با عارضه (تعداد تنفس کمتر از ۸ در دقیقه، خارش بینی و قفسه سینه، احتباس ادراری، خواب‌آلودگی، کوتاهی تنفس): داروی مخدر موقتاً با صلاحدید پزشک قطع شود و بیمار با اکسیژن‌درمانی و مایع‌درمانی وریدی احیاء گردد.'),
  f('بی‌دردی مناسب و بدون عارضه پس از ۴ ساعت: دوز تجویزی را می‌توان زیر نظر پزشک کاهش داد.'),
  f('در تمام بیمارانی که مخدر یا غیرمخدر دریافت می‌کنند، علاوه بر علائم حیاتی، نمرهٔ تهوع/استفراغ و نمرهٔ آرام‌بخشی (RASS) نیز ارزیابی شود.'),
];

export const getAdultPlan = (severity: PainSeverity | undefined, tool: string): Plan => {
  const isBps = tool === 'BPS';
  const mildReassess = [
    f('ارزیابی علائم حیاتی و نمرهٔ درد هر ۲ ساعت یک‌بار ادامه یابد.'),
    f('قطع یا تنظیم مجدد دوز مسکن تزریقی/خوراکی بر اساس صلاحدید پزشک مربوطه.'),
    f('مستندسازی شدت درد پس از مداخلات درمانی و ارزیابی مجدد درد.'),
  ];
  const strongReassess = [
    f('ارزیابی علائم حیاتی و نمرهٔ درد حداقل هر ۱ ساعت و سپس بر حسب شرایط بیمار یا پس از انجام مداخلات، ارزیابی مجدد صورت گیرد.'),
    f('پایش مداوم اشباع اکسیژن خون شریانی با پالس‌اکسیمتری.'),
    f('مستندسازی شدت درد پس از انجام مداخلات درمانی و ارزیابی مجدد درد.'),
  ];

  switch (severity) {
    case PainSeverity.NONE:
      return {
        meds: [
          f('نیاز به تزریق مسکن مخدر یا غیرمخدر وجود ندارد.'),
          f(isBps
            ? 'اگر بی‌دردی با دوز خاصی از مخدر حاصل شده است، دربارهٔ ادامه، کاهش یا قطع آن با متخصص بیهوشی مشورت شود.'
            : 'اگر پس از دریافت مسکن/مخدر نمرهٔ «فاقد درد» کسب شده است، جهت تصمیم‌گیری دربارهٔ قطع یا ادامهٔ دارو به پزشک اطلاع داده شود.'),
        ],
        nonPharm: [],
        actions: [f('مستندسازی شدت درد، مداخلات درمانی و نتایج آن.')],
        reassess: mildReassess,
        safety: [],
        color: 'bg-emerald-600', icon: '✅',
      };
    case PainSeverity.MILD:
      return {
        meds: [
          f('اولویت با مسکن‌های غیرمخدر: استامینوفن (تزریقی یا خوراکی)، NSAIDs (ایبوبروفن، ناپروکسن، کتورولاک) یا ادجوانت‌ها (مانند کاربامازپین) طبق نظر پزشک و در صورت نبود منع مصرف.'),
        ],
        nonPharm: [f('ماساژ'), f('موسیقی‌درمانی'), f('انحراف فکر'), f('در صورت امکان، به‌صورت درمان مکمل')],
        actions: [f('مستندسازی شدت درد، مداخلات درمانی و نتایج آن.')],
        reassess: mildReassess,
        safety: [],
        color: 'bg-amber-500', icon: '🟡',
      };
    case PainSeverity.MODERATE:
      return {
        meds: isBps
          ? [
              f('تزریق یک دوز بلوس ضددرد مخدر، با یا بدون NSAIDs یا ادجوانت.'),
              f('افزایش دوز انفوزیون مخدر به میزان ۲۵٪ دوز پایه، به شرط نبود منع مصرف و طبق دستور پزشک.'),
            ]
          : [
              f('مخدر ضعیف (مانند اکسی‌کدون، متادون) به‌صورت دوز بلوس، انفوزیون، PCA یا خوراکی طبق نظر پزشک و در صورت نبود منع مصرف.'),
              f('با یا بدون NSAIDs یا ادجوانت.'),
            ],
        nonPharm: [f('روش‌های غیردارویی (ماساژ، موسیقی‌درمانی، انحراف فکر) به‌صورت مکمل در صورت امکان')],
        actions: [f('مستندسازی شدت درد، مداخلات درمانی و نتایج آن.')],
        reassess: strongReassess,
        safety: ADULT_OPIOID_MONITORING,
        color: 'bg-orange-600', icon: '🟠',
      };
    case PainSeverity.SEVERE:
      return {
        meds: isBps
          ? [
              f('اطلاع به متخصص بیهوشی.'),
              f('استفاده از مخدرهای سریع‌الاثر با قدرت اثربخشی بالا مانند فنتانیل، با یا بدون NSAIDs یا ادجوانت.'),
              f('افزایش دوز مخدر به میزان ۵۰ تا ۱۰۰ درصد دوز پایه جهت کنترل مؤثر درد، طبق دستور پزشک.'),
            ]
          : [
              f('مخدرهای با قدرت اثر بیشتر (مانند مورفین، فنتانیل، سوفنتانیل) به‌صورت دوز بلوس، انفوزیون یا PCA طبق نظر پزشک و در صورت نبود منع مصرف، با یا بدون NSAIDs یا ادجوانت.'),
            ],
        nonPharm: [],
        actions: [f('مستندسازی شدت درد، مداخلات درمانی و نتایج آن.')],
        reassess: strongReassess,
        safety: ADULT_OPIOID_MONITORING,
        color: 'bg-rose-700', icon: '🚨',
      };
    case PainSeverity.VERY_SEVERE:
      return {
        meds: [
          f('افزایش دوز مسکن‌های مخدر با قدرت اثر بالا، به‌صورت انفوزیون یا بلوس، با یا بدون NSAIDs یا ادجوانت طبق دستور پزشک.'),
          x('اطلاع فوری به پزشک معالج/متخصص بیهوشی.'),
        ],
        nonPharm: [],
        actions: [
          f('استفاده از اقدامات پاراکلینیک در راستای تشخیص علت درد، مانند CT، MRI و سونوگرافی.'),
          f('مستندسازی شدت درد، مداخلات درمانی و نتایج آن.'),
        ],
        reassess: strongReassess,
        safety: ADULT_OPIOID_MONITORING,
        color: 'bg-red-800', icon: '🆘',
      };
    default:
      return { meds: [], nonPharm: [], actions: [], reassess: [], safety: [], color: 'bg-indigo-900', icon: '❓' };
  }
};

/* ------------------------------ کودکان ------------------------------ */

export const PEDIATRIC_NONPHARM_BY_AGE: { key: string; label: string; items: string }[] = [
  { key: '0-1', label: '۰ تا ۱ سال', items: 'صداهای آرامش‌بخش، کاهش صدا و نور، شبیه‌سازی دوران جنینی (قنداق)، حضور والدین، تکان دادن ملایم، مکیدن غیرمغذی، لمس/ماساژ، نوشیدن محلول شیرین، تحریک حس، تماس پوستی (کانگورو)' },
  { key: '1-3', label: 'نوپا (۱ تا ۳ سال)', items: 'ماساژ ملایم، تکنیک‌های حواس‌پرتی، بازی‌درمانی، موسیقی و حرکت' },
  { key: '3-5', label: 'پیش‌دبستانی (۳ تا ۵ سال)', items: 'قصه‌گویی، هنردرمانی، تکنیک‌های آرامش، بازی تعاملی' },
  { key: '6-12', label: 'سن مدرسه (۶ تا ۱۲ سال)', items: 'درمان شناختی-رفتاری، تصویرسازی هدایت‌شده، فعالیت‌های بدنی، موسیقی‌درمانی، کارت‌های انحراف ذهن، حباب‌سازی، آدامس شیرین' },
  { key: '13-18', label: 'نوجوانان (۱۳ تا ۱۸ سال)', items: 'رایحه‌درمانی، درمان شناختی-رفتاری پیشرفته، راهبردهای آرام‌سازی، گروه‌های حمایت همتایان، تکنیک‌های خودمدیریتی، واقعیت مجازی، دلقک‌های بیمارستانی، هیپنوتیزم، بیوفیدبک، درجه‌بندی درد و مواجههٔ تدریجی' },
];

export const pediatricAgeKeys = (g?: PediatricAgeGroup | null): string[] => {
  switch (g) {
    case PediatricAgeGroup.INFANT_TODDLER:
    case PediatricAgeGroup.NON_VERBAL: return ['0-1', '1-3'];
    case PediatricAgeGroup.PRE_SCHOOL: return ['3-5', '6-12'];
    case PediatricAgeGroup.SCHOOL_ADOLESCENT: return ['6-12', '13-18'];
    case PediatricAgeGroup.POST_OP: return ['0-1', '1-3', '3-5', '6-12'];
    default: return [];
  }
};

const PEDS_SAFETY: PlanItem[] = [
  f('دوز داروها بر اساس وزن یا سطح بدنی کودک و تحت نظارت پزشک متخصص تنظیم شود.'),
  f('در صورت تجویز هر نوع داروی مخدر یا سداتیو، کودک با پالس‌اکسیمتری پایش شود و در معرض دید باشد.'),
  f('پایش عوارض: علائم دپرسیون تنفسی، تهوع، استفراغ و یبوست؛ در صورت دپرسیون تنفسی اقدامات حمایتی فوری (مانند اکسیژن‌درمانی) انجام شود.'),
  f('استفاده از میدازولام به علت اثرات منفی بر رشد و تکامل مغز محدود گردد.'),
  f('بروشور دارو در هر شرایطی مطالعه شود.'),
];

export const getPediatricPlan = (severity: PainSeverity | undefined): Plan => {
  const reassessNone = [f('ارزیابی درد به‌صورت روتین همراه با علائم حیاتی (حداقل هر ۴ ساعت) ادامه یابد.')];
  const reassessMild = [f('ارزیابی نمرهٔ درد هر ۴ ساعت.'), f('در صورت عدم بهبود، به پزشک گزارش شود.')];
  const reassessStrong = [
    f('ارزیابی درد و کنترل علائم حیاتی هر نیم‌ساعت تا ۴ ساعت (بر اساس شدت درد).'),
    f('در صورت بهبود درد، مداخلهٔ انتخابی ادامه یابد.'),
    f('در صورت عدم بهبود: اطلاع به پزشک + روش‌های غیردارویی + افزایش دوز دارو در صورت تجویز پزشک.'),
    f('ثبت و مستندسازی و گزارش به پزشک.'),
  ];
  switch (severity) {
    case PainSeverity.NONE:
      return {
        meds: [
          f('نیاز به مداخلهٔ دارویی ندارد.'),
          f('پس از جراحی: استامینوفن باید در ۷۲ ساعت اول با فواصل منظم تجویز شود، حتی اگر نمرهٔ درد کودک پایین باشد (طبق دستور پزشک).'),
        ],
        nonPharm: [], actions: [f('مستندسازی نمره صفر و ادامهٔ مراقبت.')],
        reassess: reassessNone, safety: [], color: 'bg-emerald-600', icon: '✅',
      };
    case PainSeverity.MILD:
      return {
        meds: [
          f('اولویت با روش‌های غیردارویی است.'),
          f('در صورت نیاز و طبق دستور پزشک: استامینوفن ۱۰–۱۵ mg/kg خوراکی/وریدی هر ۴ تا ۶ ساعت (سقف روزانه: کودکان ۱۰۰ mg/kg، شیرخواران ۷۰ mg/kg).'),
          f('یا ایبوپروفن ۵–۱۰ mg/kg خوراکی هر ۶ تا ۸ ساعت (سقف روزانه ۴۰ mg/kg؛ در شیرخوار زیر ۶ ماه، آبله‌مرغان و دهیدراتاسیون استفاده نشود).'),
        ],
        nonPharm: [f('بازی‌درمانی'), f('مکیدن سوکروز (شیرخواران)'), f('مراقبت آغوشی'), f('پرت‌کردن حواس'), f('حضور والدین')],
        actions: [f('مستندسازی شدت درد، مداخلات و نتایج آن.')],
        reassess: reassessMild, safety: PEDS_SAFETY, color: 'bg-amber-500', icon: '🟡',
      };
    case PainSeverity.MODERATE:
      return {
        meds: [
          f('استفادهٔ ترکیبی از اقدامات غیردارویی + داروهای خفیف (پاراستامول/استامینوفن) طبق دستور پزشک.'),
          f('استامینوفن ۱۰–۱۵ mg/kg هر ۴ تا ۶ ساعت؛ آمپول ۱۰۰۰ mg در ۶٫۷ cc است (هر cc حدود ۱۵۰ mg) — در تنظیم دوز وریدی دقت کافی شود.'),
          f('NSAIDs (ایبوپروفن/کتورولاک/دیکلوفناک) در صورت نبود منع مصرف: خطر خونریزی گوارشی، نارسایی کلیه و ممنوعیت در دهیدراتاسیون و مشکلات انعقادی؛ در شیرخواران زیر ۶ ماه ممنوعیت مطلق.'),
        ],
        nonPharm: [f('ترکیب چند روش غیردارویی متناسب با سن (جدول سنی زیر)')],
        actions: [f('مستندسازی شدت درد، مداخلات و نتایج آن.')],
        reassess: reassessStrong, safety: PEDS_SAFETY, color: 'bg-orange-600', icon: '🟠',
      };
    case PainSeverity.SEVERE:
    case PainSeverity.VERY_SEVERE:
      return {
        meds: [
          f('اقدامات غیردارویی + مورفین (۰٫۱–۰٫۲ mg/kg وریدی هر ۲ تا ۴ ساعت) طبق دستور پزشک.'),
          f('فنتانیل ۱–۲ mcg/kg به‌صورت انفوزیون وریدی؛ رقیق‌سازی و تزریق طبق دستورالعمل کارخانه (غلظت ۱ mcg/cc، سرعت ۱ mcg/min از طریق سه‌راهی).'),
          f('اگر درد با مورفین و استامینوفن تسکین نیافت: کلونیدین ۱ mcg/kg وریدی (بولوس) هر ۴ تا ۶ ساعت به‌عنوان مکمل.'),
          f('در جراحی‌های بزرگ یا دردهای غیرقابل کنترل با درمان سیستمیک: با نظر پزشک، بی‌حسی اپیدورال/نخاعی و بلوک‌های منطقه‌ای.'),
          x('آمادگی نالوکسان و تجهیزات احیا در دسترس باشد.'),
        ],
        nonPharm: [f('حضور مستمر والدین و کاهش محرک‌های محیطی'), f('روش‌های غیردارویی متناسب با سن (جدول سنی زیر)')],
        actions: [
          f('پایش مداوم علائم حیاتی و SpO₂ پس از تزریق دارو.'),
          f('مستندسازی و گزارش به پزشک.'),
        ],
        reassess: reassessStrong, safety: PEDS_SAFETY,
        color: severity === PainSeverity.VERY_SEVERE ? 'bg-red-800' : 'bg-rose-700', icon: severity === PainSeverity.VERY_SEVERE ? '🆘' : '🚨',
      };
    default:
      return { meds: [], nonPharm: [], actions: [], reassess: [], safety: [], color: 'bg-indigo-900', icon: '❓' };
  }
};

/* ------------------------------ نوزادان ------------------------------ */

const NEO_SAFETY: PlanItem[] = [
  f('تمام روش‌های دارویی باید با تجویز پزشک متخصص انجام شود.'),
  f('استفاده از میدازولام به علت اثرات منفی بر رشد و تکامل مغز نوزاد محدود گردد.'),
  f('پس از تزریق فنتانیل/مورفین، علائم حیاتی و SpO₂ پایش شود (خطر سفتی قفسه سینه، دپرسیون تنفسی و افت SpO₂).'),
  f('در نوزاد مبتلا به سندروم محرومیت (متولد از مادر معتاد) از قنداق‌کردن استفاده گردد.'),
  x('داروی آنتی‌دوت (نالوکسان) و ترالی احیای نوزادان در دسترس باشد.'),
];

export const getNeonatePlan = (severity: PainSeverity | undefined): Plan => {
  const reassessMild = [f('ارزیابی درد و علائم حیاتی هر ۲ ساعت ادامه یابد (فاقد درد: هر ۴ ساعت).')];
  const reassessStrong = [
    f('ارزیابی نمرهٔ درد نوزاد هر نیم‌ساعت تا ۴ ساعت.'),
    f('در صورت بهبود درد، ادامهٔ مداخلهٔ انتخابی.'),
    f('در صورت عدم بهبود: اطلاع به پزشک + روش‌های غیردارویی + افزایش دوز دارو در صورت تجویز پزشک.'),
    f('ثبت و مستندسازی و گزارش به پزشک.'),
  ];
  switch (severity) {
    case PainSeverity.NONE:
      return {
        meds: [f('نیاز به مداخلهٔ دارویی ندارد.')],
        nonPharm: [f('حفظ محیط آرام: کاهش نور و سر و صدا، خوشه‌بندی مراقبت‌ها و کاهش دستکاری نوزاد')],
        actions: [f('مستندسازی و ادامهٔ مراقبت و اندازه‌گیری درد هر ۴ ساعت یک‌بار.')],
        reassess: [f('ارزیابی دوره‌ای درد همراه با علائم حیاتی؛ اگر تغییری مشاهده شد، مجدداً ارزیابی شود.')],
        safety: [], color: 'bg-emerald-600', icon: '✅',
      };
    case PainSeverity.MILD:
      return {
        meds: [f('معمولاً روش‌های غیردارویی کافی است؛ در صورت نیاز طبق دستور پزشک پاراستامول.')],
        nonPharm: [
          f('سوکروز: نوزاد ترم ۲ mL و نوزاد پره‌ترم ۰٫۵ تا ۱ mL، دو دقیقه قبل از رویهٔ دردناک.'),
          f('شیر مادر (طعم و بوی شیر مادر) / مکیدن غیرمغذی (NNS).'),
          f('مراقبت آغوشی مادرانه (KMC)، قنداق‌کردن، ماساژ.'),
        ],
        actions: [f('مستندسازی شدت درد، مداخلات و نتایج آن.')],
        reassess: reassessMild, safety: NEO_SAFETY.slice(0, 2), color: 'bg-amber-500', icon: '🟡',
      };
    case PainSeverity.MODERATE:
      return {
        meds: [
          f('ترکیب اقدامات غیردارویی + داروی خفیف (پاراستامول/استامینوفن تزریقی) طبق دستور پزشک.'),
          f('پاراستامول ۱۰–۱۵ mg/kg؛ به‌طور روتین تا ۴۸ ساعت پس از جراحی یا بلافاصله پس از درد حاد.'),
          x('فاصلهٔ دوز و سقف مجاز روزانه در ابلاغیه ذکر نشده است؛ بر اساس سن بارداری و سن پس از تولد با پزشک/داروساز تعیین شود.'),
        ],
        nonPharm: [f('سوکروز + شیر مادر/مکیدن غیرمغذی'), f('مراقبت آغوشی مادرانه، قنداق‌کردن، ماساژ'), f('کاهش نور و صدای محیط')],
        actions: [f('مستندسازی شدت درد، مداخلات و نتایج آن.')],
        reassess: reassessStrong, safety: NEO_SAFETY, color: 'bg-orange-600', icon: '🟠',
      };
    case PainSeverity.SEVERE:
    case PainSeverity.VERY_SEVERE:
      return {
        meds: [
          f('اقدامات غیردارویی + مورفین + فنتانیل، طبق تجویز پزشک.'),
          f('دردهای شدید و مزمن: مورفین با دوز ۱۰ mcg/kg/hr (انفوزیون).'),
          f('فنتانیل به‌عنوان ضددرد و آرام‌بخش: ۱–۴ mcg/kg.'),
          f('اگر درد با مورفین و استامینوفن تسکین نیافت: کلونیدین ۱–۳ mcg/kg هر ۴ تا ۶ ساعت به‌صورت بولوس (مکمل).'),
        ],
        nonPharm: [f('سوکروز + شیر مادر/NNS، KMC، قنداق‌کردن به‌عنوان مکمل'), f('کاهش حداکثری محرک‌های محیطی')],
        actions: [f('پایش مداوم علائم حیاتی و SpO₂؛ مستندسازی و گزارش به پزشک.')],
        reassess: reassessStrong, safety: NEO_SAFETY, color: 'bg-rose-700', icon: '🚨',
      };
    default:
      return { meds: [], nonPharm: [], actions: [], reassess: [], safety: [], color: 'bg-indigo-900', icon: '❓' };
  }
};

/* ------------------------------ جدول رویه‌های نوزادان (جدول ۱ ابلاغیه) ------------------------------ */

export const NEONATAL_PROCEDURES: { name: string; milkNns: boolean; sucrose: boolean; pharm: boolean; kmc: boolean }[] = [
  { name: 'گرفتن خون از پاشنهٔ پا', milkNns: true, sucrose: true, pharm: false, kmc: true },
  { name: 'گرفتن خون از ورید', milkNns: true, sucrose: true, pharm: false, kmc: false },
  { name: 'تزریق عضلانی / زیرجلدی (واکسیناسیون)', milkNns: true, sucrose: true, pharm: false, kmc: true },
  { name: 'تعبیهٔ کاتتر ورید محیطی', milkNns: true, sucrose: true, pharm: true, kmc: false },
  { name: 'گرفتن خون شریانی یا گذاشتن کاتتر شریانی', milkNns: true, sucrose: true, pharm: false, kmc: false },
  { name: 'گذاشتن کاتتر نافی', milkNns: true, sucrose: true, pharm: false, kmc: false },
  { name: 'گرفتن مایع مغزی نخاعی (LP)', milkNns: true, sucrose: true, pharm: true, kmc: false },
  { name: 'تعبیهٔ کاتتر ورید مرکزی', milkNns: true, sucrose: true, pharm: true, kmc: false },
  { name: 'تعبیهٔ لولهٔ بینی-معدی', milkNns: true, sucrose: true, pharm: false, kmc: false },
  { name: 'جدا کردن چسب‌ها', milkNns: true, sucrose: true, pharm: false, kmc: true },
  { name: 'ساکشن لولهٔ تراشه', milkNns: false, sucrose: false, pharm: true, kmc: false },
  { name: 'واردکردن کاتتر مثانه یا انجام سوپرا پوبیک', milkNns: true, sucrose: true, pharm: false, kmc: false },
];

/* ------------------------------ جدول داروهای نوزادان ------------------------------ */

export const NEONATAL_DRUGS: { name: string; route: string; dose: string; note: string; source: 'file' | 'extra' }[] = [
  { name: 'پاراستامول (استامینوفن)', route: 'تزریقی / خوراکی', dose: '۱۰–۱۵ mg/kg', note: 'به‌طور روتین تا ۴۸ ساعت پس از جراحی یا بلافاصله پس از درد حاد. فاصلهٔ دوز و سقف روزانه طبق سن بارداری/پس از تولد و دستور پزشک/داروساز (در ابلاغیه ذکر نشده).', source: 'file' },
  { name: 'مورفین', route: 'انفوزیون وریدی', dose: '۱۰ mcg/kg/hr', note: 'دردهای شدید و مزمن. دپرسیون تنفسی پایش شود.', source: 'file' },
  { name: 'مورفین', route: 'بولوس وریدی آهسته', dose: '۰٫۰۵–۰٫۱ mg/kg هر ۴–۶ ساعت', note: 'مرجع تکمیلی (در ابلاغیه فقط دوز انفوزیون آمده است)؛ با پزشک/داروساز تأیید شود.', source: 'extra' },
  { name: 'فنتانیل', route: 'وریدی', dose: '۱–۴ mcg/kg', note: 'هم ضددرد و هم آرام‌بخش. تزریق سریع: سفتی قفسه سینه و افت SpO₂؛ مانیتورینگ ضروری.', source: 'file' },
  { name: 'فنتانیل', route: 'انفوزیون وریدی', dose: '۰٫۵–۲ mcg/kg/hr', note: 'مرجع تکمیلی (در ابلاغیه ذکر نشده)؛ با پزشک/داروساز تأیید شود.', source: 'extra' },
  { name: 'کلونیدین', route: 'بولوس وریدی', dose: '۱–۳ mcg/kg هر ۴–۶ ساعت', note: 'مکمل کنار مورفین یا استامینوفن وقتی درد کنترل نشده است.', source: 'file' },
  { name: 'میدازولام', route: '—', dose: 'محدود شود', note: 'به علت اثرات منفی بر رشد و تکامل مغز نوزاد؛ مورفین، پاراستامول و فنتانیل ارجح‌اند.', source: 'file' },
];

/* ------------------------------ جدول داروهای کودکان (جدول ۲ ابلاغیه) ------------------------------ */

export const PEDIATRIC_DRUGS: { cls: string; name: string; dose: string; adverse: string }[] = [
  { cls: 'مسکن ساده (درد خفیف تا متوسط)', name: 'استامینوفن', dose: '۲۰ mg/kg رکتال؛ ۱۰–۱۵ mg/kg خوراکی یا وریدی هر ۴ تا ۶ ساعت. سقف روزانه: ۱۰۰ mg/kg در کودکان و ۷۰ mg/kg در شیرخواران. آمپول ۱۰۰۰ mg در ۶٫۷ cc (هر cc = ۱۵۰ mg).', adverse: 'مسمومیت کبدی' },
  { cls: 'NSAIDs (درد متوسط)', name: 'ایبوپروفن', dose: '۵–۱۰ mg/kg خوراکی هر ۶ تا ۸ ساعت؛ حداکثر ۴۰ mg/kg/day. پرهیز: زیر ۶ ماه، آبله‌مرغان، دهیدراتاسیون.', adverse: 'خونریزی گوارشی، اختلال کلیه، مهار عملکرد پلاکت، تهوع و استفراغ' },
  { cls: 'NSAIDs (درد متوسط)', name: 'کتورولاک', dose: '۲ تا ۱۶ سال: ۰٫۵ mg/kg عضلانی یا وریدی؛ بالای ۱۶ سال: ۱۵ mg وریدی یا ۳۰ mg عضلانی.', adverse: 'همان NSAIDs' },
  { cls: 'NSAIDs (درد متوسط)', name: 'دیکلوفناک', dose: '۱ mg/kg رکتال.', adverse: 'همان NSAIDs' },
  { cls: 'مخدرها (درد متوسط تا شدید)', name: 'مورفین', dose: '۰٫۱–۰٫۲ mg/kg وریدی هر ۲ تا ۴ ساعت.', adverse: 'دپرسیون تنفسی، تهوع، سرگیجه، افت فشار خون' },
  { cls: 'مخدرها (درد متوسط تا شدید)', name: 'فنتانیل', dose: '۱–۲ mcg/kg انفوزیون وریدی.', adverse: 'دپرسیون تنفسی، تهوع، سرگیجه، افت فشار خون' },
  { cls: 'سایر', name: 'کلونیدین', dose: '۱ mcg/kg وریدی؛ مکمل مورفین/استامینوفن هر ۴ تا ۶ ساعت. مدت اثر داروی مخدر را حدود دو برابر می‌کند.', adverse: 'تهوع، استفراغ، سرگیجه، افت فشار خون' },
];

/* ------------------------------ جدول رویه‌های کودکان (جدول ۳) ------------------------------ */

export const PEDIATRIC_PROCEDURES: { name: string; under2: string; over2: string }[] = [
  { name: 'تعبیهٔ لاین وریدی محیطی، خونگیری وریدی، تزریق عضلانی/زیرجلدی، کاتترنافی و تعویض خون', under2: 'مکیدن غیرمغذی، بغل کردن یا آغوش مادر، مراقبت کانگورویی، سوکروز ۲۴٪ (۲ سی‌سی، دو دقیقه قبل از پروسیجر دردناک)', over2: 'پرت‌کردن حواس، بازی‌درمانی، ماساژ، موسیقی‌درمانی، تماشای کارتون' },
  { name: 'تعبیهٔ سوند بینی-معدی/دهانی-معدی، سوند مثانه، برداشتن بخیه یا چسب، خروج هرگونه کاتتر', under2: 'قنداق‌کردن یا آغوش مادر، مراقبت کانگورویی، سوکروز ۲۴٪ (۲ سی‌سی، دو دقیقه قبل)، استفاده از استامینوفن', over2: 'پرت‌کردن حواس، بازی‌درمانی، ماساژ، موسیقی‌درمانی، کارتون؛ استفاده از استامینوفن' },
  { name: 'تعبیهٔ PICC، پونکسیون کمری (LP)، کشیدن مایع', under2: 'پماد EMLA (لیدوکائین-پریلوکائین) ۰٫۵–۱ گرم، ۱۵ دقیقه قبل از شروع پروسیجر؛ NNS، بغل‌کردن، ماساژ', over2: 'پماد EMLA ۰٫۵–۱ گرم، ۶۰ دقیقه قبل از شروع پروسیجر؛ پرت‌کردن حواس، بازی‌درمانی، ماساژ، موسیقی‌درمانی، کارتون' },
  { name: 'تعبیهٔ چست تیوب، نمونه‌گیری مغز استخوان، ایجاد هر گونه برش روی پوست', under2: 'فنتانیل وریدی آهسته؛ لیدوکائین ۱٪ زیرجلدی همراه با کنترل درد غیردارویی', over2: 'فنتانیل وریدی آهسته؛ لیدوکائین ۱٪ زیرجلدی همراه با کنترل درد غیردارویی' },
  { name: 'تعویض پانسمان و مراقبت از زخم، فیزیوتراپی قفسهٔ سینه', under2: 'سوکروز ۲۴٪، NNS، آغوش مادر؛ فنتانیل وریدی آهسته (فقط در فیزیوتراپی با وجود چست تیوب و مراقبت زخم‌های عمیق و وسیع)', over2: 'روش‌های غیردارویی؛ فنتانیل وریدی آهسته (فقط در فیزیوتراپی با وجود چست تیوب و زخم‌های عمیق و وسیع)' },
  { name: 'انتوباسیون / ساکشن لولهٔ تراشه', under2: 'فنتانیل وریدی آهسته؛ بغل یا قنداق‌کردن', over2: 'فنتانیل وریدی آهسته' },
  { name: 'اکستوباسیون', under2: 'بغل یا قنداق‌کردن', over2: 'روش‌های غیردارویی' },
  { name: 'بعد از عمل‌های جراحی', under2: 'مورفین، فنتانیل؛ استامینوفن تا ۷۲ ساعت پس از عمل حتی در صورت نمرهٔ درد خفیف', over2: 'مورفین، فنتانیل؛ استامینوفن تا ۷۲ ساعت پس از عمل حتی در صورت نمرهٔ درد خفیف' },
  { name: 'تهویهٔ مکانیکی', under2: 'فنتانیل وریدی آهسته (قطره‌ای/درپ)', over2: 'فنتانیل وریدی آهسته (قطره‌ای/درپ)' },
];
