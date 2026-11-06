/** دسته‌بندی بالینی و حوزهٔ کاربرد تشخیص‌های پرستاری (برای فیلتر و نمایش) */

export interface DxCategory { key: string; label: string; icon: string; }

export const DX_CATEGORIES: DxCategory[] = [
  { key: 'cardio', label: 'قلبی-عروقی', icon: '❤️' },
  { key: 'resp', label: 'تنفسی', icon: '🫁' },
  { key: 'renal', label: 'کلیه و مجاری ادراری', icon: '🚽' },
  { key: 'gi', label: 'گوارش و تغذیه', icon: '🍽️' },
  { key: 'fluid', label: 'مایعات، الکترولیت و قند', icon: '💧' },
  { key: 'neuro', label: 'عصبی و شناختی', icon: '🧠' },
  { key: 'mobility', label: 'تحرک و اسکلتی-عضلانی', icon: '🦴' },
  { key: 'skin', label: 'پوست، زخم و مخاط', icon: '🩹' },
  { key: 'infection', label: 'عفونت، خونریزی و آلرژی', icon: '🦠' },
  { key: 'safety', label: 'ایمنی و پیشگیری از آسیب', icon: '🛡️' },
  { key: 'temp', label: 'دمای بدن', icon: '🌡️' },
  { key: 'pain', label: 'درد و راحتی', icon: '😣' },
  { key: 'sleep', label: 'خواب، خستگی و فعالیت', icon: '😴' },
  { key: 'selfcare', label: 'خودمراقبتی', icon: '🧼' },
  { key: 'psych', label: 'روانی-اجتماعی', icon: '💭' },
  { key: 'edu', label: 'آموزش و ارتباط', icon: '🎓' },
  { key: 'surgery', label: 'جراحی و حول عمل', icon: '🏥' },
];

const GROUPS: Record<string, number[]> = {
  cardio: [37, 38, 39, 40, 41, 42, 44, 45, 91],
  resp: [21, 36, 46, 47, 75, 76],
  renal: [11, 12, 13, 14, 84],
  gi: [1, 2, 3, 5, 15, 16, 17, 18, 19, 20, 110],
  fluid: [4, 6, 7, 8, 9, 10],
  neuro: [33, 43, 52, 53, 54],
  mobility: [25, 26, 27, 28, 29, 30, 31, 88],
  skin: [78, 81, 85, 86, 87, 89, 90, 92, 93, 97, 98],
  infection: [74, 77, 101, 102, 103],
  safety: [79, 80, 83, 99, 100],
  temp: [104, 105, 106, 107, 109],
  pain: [111, 112, 113],
  sleep: [22, 23, 24, 32, 34, 35],
  selfcare: [48, 49, 50, 51],
  psych: [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73],
  edu: [55, 56, 57],
  surgery: [82, 94, 95, 96, 108],
};

/** تشخیص‌های تخصصی: مرتبط با بخش، تخصص یا موقعیت ویژه؛ بقیه عمومی (در اغلب بخش‌ها کاربرد دارند) */
const SPECIALIZED = new Set<number>([
  3, 5, 12, 13, 18, 19, 20, 27, 28, 29, 33, 39, 40, 43, 46, 47, 52, 62, 63, 65, 67, 71, 73,
  78, 81, 82, 83, 84, 86, 88, 91, 94, 95, 96, 99, 100, 102, 103, 108,
]);

const CAT_BY_ID: Record<number, string> = {};
Object.entries(GROUPS).forEach(([k, ids]) => ids.forEach(id => { CAT_BY_ID[id] = k; }));

export const categoryOf = (id: number): string => CAT_BY_ID[id] || 'safety';
export const isSpecialized = (id: number): boolean => SPECIALIZED.has(id);
export const categoryLabel = (key: string): DxCategory => DX_CATEGORIES.find(c => c.key === key) || DX_CATEGORIES[0];
