import React, { useEffect, useState } from 'react';
import { AssessmentResult, PainSeverity } from '../types';
import AssessmentRow from './common/AssessmentRow';
import { NEONATAL_DRUGS, NEONATAL_PROCEDURES } from './painData';

interface Props {
  onAssess: (result: AssessmentResult | null) => void;
  onBack?: () => void;
  onHome?: () => void;
}

type Item = { key: string; title: string; description?: string; options: string[] };
type ToolId = 'PIPP' | 'NIPS' | 'CRIES' | 'MPAT';

interface ToolDef {
  id: ToolId;
  title: string;
  shortTitle: string;
  subtitle: string;
  use: string;
  max: number;
  items: Item[];
  severity: (score: number) => PainSeverity;
  interpret: (score: number) => string;
  bands: string;
  note?: string;
  intro?: string;
}

const sevColor: Record<PainSeverity, string> = {
  [PainSeverity.NONE]: 'bg-emerald-600',
  [PainSeverity.MILD]: 'bg-amber-500',
  [PainSeverity.MODERATE]: 'bg-orange-600',
  [PainSeverity.SEVERE]: 'bg-rose-700',
  [PainSeverity.VERY_SEVERE]: 'bg-red-800',
};

const PCT = ['عادی: ۰–۹٪ زمان', 'حداقل: ۱۰–۳۹٪ زمان', 'متوسط: ۴۰–۶۹٪ زمان', 'حداکثر: ≥۷۰٪ زمان'];

const TOOLS: ToolDef[] = [
  {
    id: 'PIPP',
    title: 'PIPP — پروفایل درد شیرخواران پره‌ترم',
    shortTitle: 'پروفایل درد شیرخواران پره‌ترم',
    subtitle: 'Premature Infant Pain Profile',
    use: 'نوزادان پره‌ترم (زودرس)؛ دردهای حاد. در نوزادان تحت ونتیلاتور به‌طور روتین همراه سایر علائم حیاتی.',
    max: 21,
    intro: 'ابتدا ۱۵ ثانیه قبل از اقدام درمانی، وضعیت رفتاری، ضربان قلب و اشباع اکسیژن پایه را ثبت کنید؛ سپس بلافاصله بعد از اقدام به مدت ۳۰ ثانیه ارزیابی کنید.',
    items: [
      { key: 'ga', title: '۱. سن حاملگی (در زمان مشاهده)', options: ['۳۶ هفته یا بیشتر', '۳۲ هفته تا ۳۵ هفته و ۶ روز', '۲۸ هفته تا ۳۱ هفته و ۶ روز', 'کمتر از ۲۸ هفته'] },
      { key: 'state', title: '۲. وضعیت رفتاری (۱۵ ثانیهٔ پایه)', options: ['فعال یا بیدار، چشم‌های باز، حرکات صورت', 'آرام یا بیدار، چشم‌ها باز، بدون حرکات صورت', 'فعال یا خواب، چشم‌ها بسته، حرکات صورت', 'خواب یا آرام، چشم‌ها بسته، بدون حرکات صورت'] },
      { key: 'hr', title: '۳. حداکثر ضربان قلب (۳۰ ثانیه)', options: ['۰–۴ ضربه در دقیقه افزایش', '۵–۱۴ ضربه در دقیقه افزایش', '۱۵–۲۴ ضربه در دقیقه افزایش', '۲۵ ضربه یا بیشتر افزایش'] },
      { key: 'spo2', title: '۴. حداقل اشباع اکسیژن (۳۰ ثانیه)', options: ['۰ تا ۲٫۴٪ کاهش', '۲٫۵ تا ۴٫۹٪ کاهش', '۵ تا ۷٫۴٪ کاهش', '۷٫۵٪ یا بیشتر کاهش'] },
      { key: 'brow', title: '۵. در هم کشیدن ابروها', options: PCT },
      { key: 'eye', title: '۶. فشردن چشم‌ها', options: PCT },
      { key: 'naso', title: '۷. خط کنار پره‌های بینی', options: PCT },
    ],
    severity: s => (s <= 6 ? PainSeverity.NONE : s <= 12 ? PainSeverity.MODERATE : PainSeverity.SEVERE),
    interpret: s => (s <= 6 ? 'عدم وجود درد / درد ناچیز' : s <= 12 ? 'درد خفیف تا متوسط' : 'درد شدید'),
    bands: '≤۶ بدون درد • ۷–۱۲ خفیف تا متوسط • >۱۲ شدید',
    note: 'نکته: در متن ابلاغیه دامنهٔ نمره یک‌جا «۳ تا ۲۷» و جای دیگر «۰ تا ۲۱» آمده است؛ با ۷ شاخص و امتیاز ۰ تا ۳، دامنهٔ صحیح ۰ تا ۲۱ است. ابلاغیه نمرهٔ ۶ را تعیین‌تکلیف نکرده؛ اینجا «بدون درد/ناچیز» محسوب می‌شود.',
  },
  {
    id: 'NIPS',
    title: 'NIPS — ابزار اندازه‌گیری درد نوزادان',
    shortTitle: 'اندازه‌گیری درد نوزادان',
    subtitle: 'Neonatal Infant Pain Scale',
    use: 'نوزادان ترم و نارس تا ۶ هفته پس از تولد؛ دردهای حاد ناشی از اقدامات تشخیصی-درمانی (خونگیری مویرگی، وریدی، شریانی). قبل و بعد از اقدام تهاجمی استفاده شود.',
    max: 7,
    items: [
      { key: 'face', title: 'حالت صورت', options: ['حالت آرامش', 'عضلات صورت سفت و کشیده و اخم‌آلود'] },
      { key: 'cry', title: 'گریه', options: ['آرام، بدون گریه', 'ناله مالیم، گریه متناوب', 'جیغ‌زدن و فریادکشیدن؛ گریه بدون صدا به نحوی که با حرکات صورت مشخص باشد'] },
      { key: 'breath', title: 'الگوی تنفس', options: ['آرام و طبیعی', 'تنفس نامنظم، سریع، نگه‌داشتن تنفس'] },
      { key: 'arms', title: 'دست‌ها', options: ['شل، بدون انقباض عضلات، حرکات معمولی', 'انقباض دست‌ها، حرکات سریع باز و بسته شدن دست‌ها'] },
      { key: 'legs', title: 'پاها', options: ['شل، بدون انقباض عضلات، گاهی پاها را حرکت می‌دهد', 'پاها حالت سفت دارد، به سختی باز و بسته می‌شوند؛ کشیدن پا یا باز و بسته شدن سریع'] },
      { key: 'arousal', title: 'وضعیت تحریک‌پذیری', options: ['خواب یا بیدار است، در حالت خواب یا بیداری آرامش دارد', 'تحریک‌پذیر است، بی‌قرار است و می‌غلتد'] },
    ],
    severity: s => (s === 0 ? PainSeverity.NONE : s < 3 ? PainSeverity.MILD : s <= 5 ? PainSeverity.MODERATE : PainSeverity.SEVERE),
    interpret: s => (s === 0 ? 'فاقد درد' : s < 3 ? 'درد خفیف' : s <= 5 ? 'درد متوسط؛ نیازمند مداخلات تسکینی' : 'درد شدید'),
    bands: '۰ بدون درد • ۱–۲ خفیف • ۳–۵ متوسط • ۶–۷ شدید',
    note: 'طبق ابلاغیه: کمتر از ۳ خفیف، ۳ تا ۵ متوسط، بالاتر از ۶ شدید. چون نمرهٔ ۶ تعیین‌تکلیف نشده، در این برنامه به‌صورت محافظه‌کارانه «شدید» در نظر گرفته می‌شود.',
  },
  {
    id: 'CRIES',
    title: 'CRIES — درد بعد از عمل جراحی نوزادان',
    shortTitle: 'درد بعد از عمل جراحی نوزادان',
    subtitle: 'Crying, Oxygenation, Vital Signs, Facial Expression, Sleeplessness',
    use: 'نوزادان نارس و ترم در بخش‌های مراقبت ویژه که تحت عمل جراحی قرار گرفته‌اند؛ به‌طور روتین پس از جراحی.',
    max: 10,
    items: [
      { key: 'cry', title: 'گریه (Crying)', options: ['گریه نمی‌کند یا صدای گریه بلند نیست', 'گریهٔ بلند (به راحتی ساکت می‌شود)', 'گریهٔ خیلی بلند (با آرام کردن، ساکت نمی‌شود)'] },
      { key: 'o2', title: 'اکسیژن مورد نیاز برای اشباع بیش از ۹۵٪ (Oxygenation)', options: ['اکسیژن مورد نیاز نیست', 'اکسیژن کمتر از ۳۰٪ مورد نیاز است', 'اکسیژن بیشتر از ۳۰٪ مورد نیاز است'] },
      { key: 'vs', title: 'علائم حیاتی (Vital signs)', options: ['ضربان قلب و فشارخون برابر یا کمتر از قبل از عمل', 'افزایش ضربان قلب یا فشارخون کمتر از ۲۰٪ قبل از عمل', 'افزایش ضربان قلب یا فشارخون بیشتر از ۲۰٪ قبل از عمل'] },
      { key: 'face', title: 'حالات صورت (Facial expression)', options: ['حالت طبیعی', 'حالت شکلک درآوردن', 'شکلک درآوردن یا نالیدن'] },
      { key: 'sleep', title: 'بی‌خوابی (Sleeplessness)', options: ['نوزاد به طور مداوم خواب است', 'مرتب از خواب بیدار می‌شود؛ مدت زمان زیادی بیدار است', 'همیشه و به طور مداوم بیدار است'] },
    ],
    severity: s => (s === 0 ? PainSeverity.NONE : s <= 3 ? PainSeverity.MILD : s <= 6 ? PainSeverity.MODERATE : PainSeverity.SEVERE),
    interpret: s => (s === 0 ? 'فاقد درد' : s <= 3 ? 'درد خفیف' : s <= 6 ? 'درد متوسط؛ باید مورد توجه قرار گیرد' : 'درد شدید؛ باید مورد توجه قرار گیرد'),
    bands: '۰ بدون درد • ۱–۳ خفیف • ۴–۶ متوسط • ۷–۱۰ شدید',
  },
  {
    id: 'MPAT',
    title: 'MPAT — ابزار ارزیابی درد تعدیل‌شده',
    shortTitle: 'ارزیابی درد تعدیل‌شده',
    subtitle: 'Modified Pain Assessment Tool',
    use: 'نوزادان و شیرخواران ۲۴ هفته تا ۶ ماهگی (و نوپایان بستری در PICU)؛ نوزادان تحت تهویهٔ مکانیکی یا با درد مزمن؛ ثبت روتین نمرهٔ درد در شیت.',
    max: 20,
    items: [
      { key: 'tone', title: 'تونیسیته', options: ['ریلکس، نرمال، بدون فلکسیون', 'اندام‌ها کاملاً باز، بدن سفت، شانه‌ها افتاده روی تخت', 'فلکسیون شدید، گارد اندام‌ها، شانه‌ها و گردن در برابر تغییر پوزیشن مقاومت می‌کنند'] },
      { key: 'sleep', title: 'الگوی خواب', options: ['ریلکس', 'به راحتی بیدار می‌شود', 'با کوچک‌ترین محرک آژیته و وحشت‌زده می‌شود'] },
      { key: 'cry', title: 'گریه', options: ['ندارد', 'دارد ولی قابل کنترل', 'دارد ولی به سادگی بعد از دستکاری آرام نمی‌شود؛ بلند گریه می‌کند'] },
      { key: 'face', title: 'حالات صورت', options: ['ریلکس، آرام', 'اخمو، چین‌های کم‌عمق، چشم‌ها نیمه‌بسته', 'چشم‌ها محکم فشرده، چین‌های عمیق'] },
      { key: 'skin', title: 'رنگ پوست', options: ['صورتی، پرفیوژن عالی', 'موتلینگ، رنگ‌پریده', 'خیلی رنگ‌پریده یا برافروخته، عرق کف دست'] },
      { key: 'breath', title: 'تنفس', options: ['نرمال', 'تاکی‌پنه هنگام استراحت', 'آپنه'] },
      { key: 'hr', title: 'ضربان قلب', options: ['نرمال', 'تاکی‌کاردی هنگام استراحت', 'نوسان چه هنگام استراحت و چه هنگام دستکاری'] },
      { key: 'spo2', title: 'میزان اشباع اکسیژن خون شریانی', options: ['نرمال', 'کاهش اشباع گذرا', 'کاهش اشباع با یا بدون دستکاری'] },
      { key: 'bp', title: 'فشار خون', options: ['نرمال', 'نوسان با دستکاری', 'افزایش یا کاهش فشار هنگام استراحت'] },
      { key: 'staff', title: 'تصمیم کادر درمان', options: ['درد ندارد', 'شیرخوار فقط هنگام دستکاری درد دارد', 'شیرخوار دچار درد است'] },
    ],
    severity: s => (s <= 3 ? PainSeverity.NONE : s <= 6 ? PainSeverity.MILD : s <= 12 ? PainSeverity.MODERATE : PainSeverity.SEVERE),
    interpret: s => (s <= 3 ? 'بدون درد / حداقل درد' : s <= 6 ? 'درد خفیف' : s <= 12 ? 'درد متوسط' : 'درد شدید'),
    bands: '۰–۳ بدون درد • ۴–۶ خفیف • ۷–۱۲ متوسط • >۱۲ شدید',
    note: 'نکته: ابلاغیه برای ۰ تا ۳ تفسیری نداده است؛ در این برنامه «بدون درد/حداقل» در نظر گرفته می‌شود.',
  },
];

/* --------------------------- یک ابزار --------------------------- */

const ScoredTool: React.FC<{ tool: ToolDef; onAssess: Props['onAssess'] }> = ({ tool, onAssess }) => {
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(tool.items.map(i => [i.key, 0])));
  const [touched, setTouched] = useState(false);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const severity = tool.severity(total);

  useEffect(() => {
    if (!touched) { onAssess(null); return; }
    onAssess({
      score: total, severity, toolUsed: tool.id,
      interpretation: `${tool.interpret(total)} (${tool.id} = ${total} از ${tool.max})`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, touched]);

  return (
    <div className="premium-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">{tool.title}</h3>
        <p className="text-[#096067] font-bold" dir="ltr">{tool.subtitle}</p>
        <p className="text-sm font-bold text-[#475569]">{tool.use}</p>
        {tool.intro && <p className="text-sm font-bold text-rose-700">{tool.intro}</p>}
      </div>
      {tool.items.map(it => (
        <AssessmentRow key={it.key} title={it.title} description={it.description}
          options={it.options.map((label, v) => ({ label, value: v }))}
          currentValue={scores[it.key]}
          onSelect={(v) => { setScores(s => ({ ...s, [it.key]: v })); setTouched(true); }} />
      ))}
      <div className={`${sevColor[severity]} rounded-3xl p-6 flex items-center justify-between text-white shadow-lg`}>
        <div>
          <p className="text-sm font-bold opacity-90">مجموع امتیاز {tool.id} (۰ تا {tool.max})</p>
          <p className="text-2xl font-black">{tool.interpret(total)}</p>
          <p className="text-xs font-bold opacity-90 mt-1">{tool.bands}</p>
        </div>
        <div className="bg-white text-[#ca7f3c] border-2 border-[#c69d5b] rounded-2xl px-6 py-2 text-4xl font-black tabular-nums">{total}</div>
      </div>
      {tool.note && <p className="text-xs font-bold text-[#855f20] leading-relaxed">{tool.note}</p>}
      {!touched && <p className="text-center text-xs font-bold text-[#855f20]">برای نمایش پلن درمانی، حداقل یک گزینه را انتخاب کنید.</p>}
    </div>
  );
};

/* --------------------------- تب‌های مرجع --------------------------- */

const NON_PHARM: [string, string][] = [
  ['مکیدن غیرمغذی (NNS)', 'روشی ساده و پرکاربرد؛ معمولاً همراه با شیر مادر یا سوکروز ارائه می‌شود. بر پایهٔ تئوری کنترل دریچه‌ای درد، ارسال پیام‌های درد به مغز را کاهش می‌دهد.'],
  ['سوکروز', 'نوزاد ترم ۲ میلی‌لیتر؛ نوزاد پره‌ترم ۰٫۵ تا ۱ میلی‌لیتر، دو دقیقه قبل از رویهٔ دردناک مانند خونگیری یا کاتترگذاری (در صورت نبود منع مصرف خوراکی).'],
  ['شیر مادر', 'طعم و بوی شیر مادر می‌تواند به کاهش درد کمک کند.'],
  ['مراقبت آغوشی مادرانه (KMC)', 'تماس پوستی مادر و نوزاد باعث کاهش درد و اضطراب نوزاد می‌شود.'],
  ['قنداق‌کردن', 'به‌ویژه در نوزادانی که در معرض تحریکات محیطی‌اند، احساس آرامش ایجاد می‌کند؛ در نوزاد مبتلا به سندروم محرومیت (متولد از مادر معتاد) توصیه می‌شود.'],
  ['ماساژ', 'ماساژ ملایم ناحیهٔ خونگیری/رگ‌گیری حداقل ۵ دقیقه قبل از انجام رویه.'],
  ['مدیریت محیط فیزیکی', 'کاهش نور و سر و صدا، کاهش دستکاری نوزاد و مدیریت دوره‌های خواب و بیداری؛ پرهیز از محرک‌های تنش‌زا (شنوایی، بینایی، لامسه، تعادلی).'],
  ['سایر روش‌ها', 'لمس‌درمانی، پوزیشن‌دادن، شیردهی از سینهٔ مادر و تکان‌دادن گهواره‌ای نیز از روش‌های غیردارویی مؤثرند.'],
];

const NonPharmTab: React.FC = () => (
  <div className="premium-card p-6 sm:p-10 space-y-6">
    <h3 className="text-2xl font-black text-[#062a2e] text-center">روش‌های غیردارویی تسکین درد نوزاد</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold leading-relaxed">
      {NON_PHARM.map(([t, d]) => (
        <div key={t} className="p-4 rounded-2xl bg-white border-2 border-[#d8cfbe]">
          <p className="font-black text-[#096067] mb-1">{t}</p><p className="text-[#1e293b]">{d}</p>
        </div>
      ))}
    </div>
    <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-sm font-bold leading-relaxed space-y-1">
      <p>• تعداد دفعات و زمان انجام اقدامات دردناک تا حد ممکن کاهش یابد.</p>
      <p>• در صورت امکان، خونگیری‌ها به روش خونگیری از پاشنهٔ پا انجام شود.</p>
      <p>• برای کاهش تحریکات دردناک حین کاتترگذاری از راهنمای بالینی همان کاتتر استفاده شود.</p>
      <p>• درد حاد در حین اقدامات دردناک تسکین داده شود و پس از جراحی حتماً مسکن مناسب تجویز گردد.</p>
    </div>
  </div>
);

const Mark: React.FC<{ on: boolean }> = ({ on }) => (
  <span className={on ? 'text-emerald-600 text-xl font-black' : 'text-slate-300'}>{on ? '✔' : '—'}</span>
);

const ProceduresTab: React.FC = () => (
  <div className="premium-card p-6 sm:p-10 space-y-6">
    <h3 className="text-2xl font-black text-[#062a2e] text-center">اقدام تسکینی مناسب هر رویهٔ دردناک در بخش نوزادان</h3>
    <div className="overflow-x-auto rounded-2xl border-2 border-[#d8cfbe] bg-white">
      <table className="w-full text-sm font-bold text-center">
        <thead className="bg-[#096067] text-white">
          <tr>
            <th className="p-3 text-right">رویهٔ دردناک</th>
            <th className="p-3">شیر مادر / مکیدن غیرمغذی</th>
            <th className="p-3">سوکروز</th>
            <th className="p-3">روش دارویی</th>
            <th className="p-3">مراقبت کانگورویی</th>
          </tr>
        </thead>
        <tbody>
          {NEONATAL_PROCEDURES.map((r, i) => (
            <tr key={r.name} className={i % 2 ? 'bg-[#fbf9f5]' : ''}>
              <td className="p-3 text-right text-[#062a2e]">{r.name}</td>
              <td className="p-3"><Mark on={r.milkNns} /></td>
              <td className="p-3"><Mark on={r.sucrose} /></td>
              <td className="p-3"><Mark on={r.pharm} /></td>
              <td className="p-3"><Mark on={r.kmc} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="text-xs font-bold text-[#475569]">منبع: جدول ۱ ابلاغیهٔ «مراقبت‌های پرستاری در مدیریت درد نوزادان بستری در بیمارستان» (بهار ۱۴۰۴). روش دارویی فقط با تجویز پزشک.</p>
  </div>
);

const DrugsTab: React.FC = () => (
  <div className="premium-card p-6 sm:p-10 space-y-6">
    <h3 className="text-2xl font-black text-[#062a2e] text-center">داروهای تسکین درد نوزادان</h3>
    <div className="space-y-3">
      {NEONATAL_DRUGS.map((d, i) => (
        <div key={i} className={`p-5 rounded-2xl bg-white border-2 ${d.source === 'extra' ? 'border-amber-300' : 'border-[#d8cfbe]'} grid grid-cols-1 md:grid-cols-4 gap-3 text-sm font-bold leading-relaxed`}>
          <div><span className="text-lg font-black text-[#096067]">{d.name}</span><span className="block text-xs text-[#855f20]">{d.route}</span></div>
          <div className="font-black text-[#062a2e]" dir="auto">{d.dose}</div>
          <div className="md:col-span-2">
            {d.note}
            {d.source === 'extra' && (
              <span className="mr-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                مرجع تکمیلی — نیاز به تأیید پزشک/داروساز
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
    <p className="text-xs font-bold text-[#475569]">تمام روش‌های دارویی باید با تجویز پزشک متخصص انجام شود. استفاده از میدازولام به علت تأثیر منفی بر رشد و تکامل مغز نوزاد محدود گردد.</p>
  </div>
);

/* --------------------------- کامپوننت اصلی --------------------------- */

const NeonatalAssessment: React.FC<Props> = ({ onAssess }) => {
  const [tab, setTab] = useState<'assess' | 'nonpharm' | 'procedures' | 'drugs'>('assess');
  const [toolId, setToolId] = useState<ToolId | null>(null);
  const tool = TOOLS.find(t => t.id === toolId) || null;

  useEffect(() => {
    if (!tool) onAssess(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-3xl mx-auto">
        {([['assess', '📋 ارزیابی درد'], ['nonpharm', '🤱 غیردارویی'], ['procedures', '🩺 رویه‌ها'], ['drugs', '💊 داروها']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 min-w-[110px] py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${tab === k ? 'bg-[#096067] text-white shadow' : 'text-[#062a2e]'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className={tab === 'assess' ? 'space-y-6' : 'hidden'}>
        <div className="premium-card p-5 text-center space-y-1">
          <p className="font-black text-[#062a2e]">آیا نوزاد آرام است؟</p>
          <p className="text-sm font-bold text-[#475569]">
            اگر آرام است: ارزیابی دوره‌ای درد همراه علائم حیاتی (هر ۲ تا ۴ ساعت)؛ در صورت مشاهدهٔ هر تغییر، مجدداً ارزیابی شود.
            اگر آرام نیست: از ابزار ارزیابی مخصوص نوزاد بر اساس شرایط او استفاده کنید.
          </p>
        </div>

        {!tool ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => setToolId(t.id)}
                className="text-right p-6 rounded-3xl bg-white/90 border-2 border-[#c69d5b]/30 hover:border-[#096067] hover:-translate-y-1 transition-all shadow-md cursor-pointer space-y-2">
                <h4 className="text-4xl font-black text-[#096067]">{t.id}</h4>
                <p className="font-black text-[#062a2e]">{t.shortTitle}</p>
                <p className="text-xs font-bold text-[#475569] leading-relaxed">{t.use}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setToolId(null)} className="px-4 py-2 rounded-xl bg-white border-2 border-[#c69d5b]/40 font-black text-sm cursor-pointer">
              ↩ انتخاب ابزار دیگر
            </button>
            <ScoredTool key={tool.id} tool={tool} onAssess={onAssess} />
          </div>
        )}
      </div>

      {tab === 'nonpharm' && <NonPharmTab />}
      {tab === 'procedures' && <ProceduresTab />}
      {tab === 'drugs' && <DrugsTab />}
    </div>
  );
};

export default NeonatalAssessment;
