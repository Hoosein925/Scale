import React, { useEffect, useState } from 'react';
import { AssessmentResult, PainSeverity, PediatricAgeGroup } from '../types';
import AssessmentRow from './common/AssessmentRow';
import {
  WONG_BAKER_FACES, pediatricSeverity, wongBakerSeverity, severityLabel,
  PEDIATRIC_DRUGS, PEDIATRIC_PROCEDURES,
} from './painData';

interface Props {
  ageGroup: PediatricAgeGroup;
  onAssess: (result: AssessmentResult | null) => void;
}

const sevColor: Record<PainSeverity, string> = {
  [PainSeverity.NONE]: 'bg-emerald-600',
  [PainSeverity.MILD]: 'bg-amber-500',
  [PainSeverity.MODERATE]: 'bg-orange-600',
  [PainSeverity.SEVERE]: 'bg-rose-700',
  [PainSeverity.VERY_SEVERE]: 'bg-red-800',
};

const Banner: React.FC<{ title: string; score: number; severity: PainSeverity; extra?: string }> = ({ title, score, severity, extra }) => (
  <div className={`${sevColor[severity]} rounded-3xl p-6 flex items-center justify-between text-white shadow-lg`}>
    <div>
      <p className="text-sm font-bold opacity-90">{title}</p>
      <p className="text-2xl font-black">{severityLabel[severity]}</p>
      {extra && <p className="text-xs font-bold opacity-90 mt-1">{extra}</p>}
    </div>
    <div className="bg-white text-[#ca7f3c] border-2 border-[#c69d5b] rounded-2xl px-6 py-2 text-4xl font-black tabular-nums">{score}</div>
  </div>
);

/* ------------------ ابزارهای ۵ آیتمی (FLACC / CHIPPS) ------------------ */

type Item = { key: string; title: string; options: string[] };

const FLACC_ITEMS: Item[] = [
  { key: 'face', title: 'ف) صورت (Face)', options: ['عدم وجود حالت خاص یا در حال لبخند زدن', 'لبخندهای گاه به گاه یا اخم، پس زدن، بی‌علاقگی', 'لرزیدن دائمی و مکرر چانه، فک به هم فشرده'] },
  { key: 'legs', title: 'ل) پاها (Legs)', options: ['حالت طبیعی یا آرام', 'ناراحت، بی‌قرار، سفتی', 'لگد زدن، پاهای کشیده شده'] },
  { key: 'activity', title: 'آ) فعالیت (Activity)', options: ['دراز کشیدن آرام، حالت طبیعی، به آسانی حرکت می‌کند', 'پیچ و تاب خوردن، بی‌ثبات، عقب و جلو شدن، سفتی', 'خمیده شدن، سفت و سخت یا حرکات سریع'] },
  { key: 'cry', title: 'ک) گریه (Cry)', options: ['بدون گریه (بیدار یا خواب)', 'ناله کردن یا زاری کردن، شکایت‌های گاه و بیگاه', 'پیوسته گریه می‌کند، جیغ می‌کشد یا هق‌هق می‌کند، مکرر شکایت می‌کند'] },
  { key: 'consol', title: 'ت) تسلی‌پذیری (Consolability)', options: ['خشنود، آرام', 'با لمس، آغوش کشیده شدن و صحبت با او گاه به گاه تسلی پیدا می‌کند؛ می‌توان ذهن او را از درد منحرف کرد', 'دلداری دادن و آرام کردن او دشوار است'] },
];

const CHIPPS_ITEMS: Item[] = [
  { key: 'cry', title: 'گریه (Crying)', options: ['ندارد', 'ناله می‌کند', 'جیغ و فریاد می‌کشد'] },
  { key: 'face', title: 'حالات صورت (Facial expression)', options: ['آرام است / لبخند می‌زند', 'فشردن دهان و لب‌ها', 'چهره درهم کشیده است'] },
  { key: 'trunk', title: 'وضعیت تنه (Posture of the trunk)', options: ['نرمال', 'تکان می‌خورد', 'سر را بالا می‌کشد (قوس دادن)'] },
  { key: 'legs', title: 'وضعیت پاها (Posture of the legs)', options: ['ریلکس', 'لگد می‌زند', 'منقبض کرده'] },
  { key: 'rest', title: 'بی‌قراری حرکتی (Motor restlessness)', options: ['ندارد', 'متوسط', 'بی‌قرار'] },
];

const FiveItemScale: React.FC<{
  name: 'FLACC' | 'CHIPPS'; subtitle: string; items: Item[]; onAssess: Props['onAssess']; note?: string;
}> = ({ name, subtitle, items, onAssess, note }) => {
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(items.map(i => [i.key, 0])));
  const [touched, setTouched] = useState(false);
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const severity = pediatricSeverity(total);

  useEffect(() => {
    if (!touched) { onAssess(null); return; }
    onAssess({
      score: total, severity, toolUsed: name,
      interpretation: `${severityLabel[severity]} (${name} = ${total} از ۱۰)`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, touched]);

  return (
    <div className="premium-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">{name} Scale</h3>
        <p className="text-[#096067] font-bold">{subtitle}</p>
        {note && <p className="text-sm font-bold text-rose-700">{note}</p>}
      </div>
      {items.map(it => (
        <AssessmentRow key={it.key} title={it.title}
          options={it.options.map((label, v) => ({ label, value: v }))}
          currentValue={scores[it.key]}
          onSelect={(v) => { setScores(s => ({ ...s, [it.key]: v })); setTouched(true); }} />
      ))}
      <Banner title={`مجموع امتیاز ${name}`} score={total} severity={severity} extra="۰ آرام • ۱–۳ خفیف • ۴–۶ متوسط • ۷–۱۰ شدید" />
      {!touched && <p className="text-center text-xs font-bold text-[#855f20]">برای نمایش پلن درمانی، حداقل یک گزینه را انتخاب کنید.</p>}
    </div>
  );
};

/* ------------------ شبکهٔ چهره‌ها (مشترک) ------------------ */

const FaceGrid: React.FC<{ value: number | null; onPick: (n: number) => void }> = ({ value, onPick }) => (
  <>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {WONG_BAKER_FACES.map(f => (
        <button key={f.value} onClick={() => onPick(f.value)}
          className={`p-3 rounded-3xl border-4 flex flex-col items-center gap-1 cursor-pointer transition-all bg-white ${value === f.value ? 'border-[#096067] -translate-y-1 shadow-xl' : 'border-[#e8e0d0] hover:border-[#c69d5b]'}`}>
          <img src={f.img} alt={f.fa} className="w-full max-w-[120px] aspect-square object-contain" />
          <span className="text-3xl font-black text-[#062a2e]">{f.value}</span>
          <span className="text-xs font-black text-[#475569] text-center leading-tight">{f.fa}</span>
          <span className="text-[10px] text-[#64748b] font-bold text-center" dir="ltr">{f.en}</span>
        </button>
      ))}
    </div>
    <p className="text-[11px] text-[#64748b] font-bold text-center" dir="ltr">
      Wong-Baker FACES® Pain Rating Scale © Wong-Baker FACES Foundation (www.WongBakerFACES.org). Used with permission — verify licence before wider distribution.
    </p>
  </>
);

/* ------------------ Wong-Baker با تصاویر ------------------ */

const WongBaker: React.FC<{ onAssess: Props['onAssess'] }> = ({ onAssess }) => {
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => {
    if (value === null) { onAssess(null); return; }
    const severity = wongBakerSeverity(value);
    onAssess({
      score: value, severity, toolUsed: 'WONG_BAKER',
      interpretation: `${severityLabel[severity]} (Wong-Baker = ${value})`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const severity = value === null ? null : wongBakerSeverity(value);

  return (
    <div className="premium-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">مقیاس چهره‌ای Wong-Baker FACES®</h3>
        <p className="text-[#096067] font-bold">برای کودکان ۳ تا ۷ سال که ممکن است قادر به استفاده از مقیاس عددی نباشند.</p>
        <p className="text-[#475569] font-bold text-sm">تصاویر چهره‌ها را به کودک نشان دهید و از او بخواهید چهره‌ای را انتخاب کند که احساس او را توصیف می‌کند.</p>
      </div>
      <FaceGrid value={value} onPick={setValue} />
      {severity && value !== null && (
        <Banner title="نتیجهٔ Wong-Baker" score={value} severity={severity} extra="۱–۳ خفیف • ۴–۶ متوسط • ۷–۹ شدید • ۱۰ بسیار شدید" />
      )}
    </div>
  );
};

/* ------------------ NRS + چهره‌ها ------------------ */

const NRS: React.FC<{ onAssess: Props['onAssess'] }> = ({ onAssess }) => {
  const [mode, setMode] = useState<'numeric' | 'faces'>('numeric');
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => {
    if (value === null) { onAssess(null); return; }
    // طبق ابلاغیه کودکان: ۱–۳ خفیف، ۴–۶ متوسط، ۷–۱۰ شدید (چهره‌ها: ۷–۹ شدید، ۱۰ بسیار شدید)
    const severity = mode === 'faces' ? wongBakerSeverity(value) : pediatricSeverity(value);
    onAssess({
      score: value, severity, toolUsed: mode === 'faces' ? 'WONG_BAKER' : 'NRS',
      interpretation: `${severityLabel[severity]} (${mode === 'faces' ? 'مقیاس چهره‌ای' : 'NRS'} = ${value})`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mode]);
  const changeMode = (m: 'numeric' | 'faces') => { setMode(m); setValue(null); };
  const severity = value === null ? null : (mode === 'faces' ? wongBakerSeverity(value) : pediatricSeverity(value));
  return (
    <div className="premium-card p-4 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">مقیاس عددی درد (NRS) یا چهره‌ای</h3>
        <p className="text-[#096067] font-bold">از حدود ۷ سالگی به بعد، برای کودکانی که می‌توانند درد خود را با عدد توصیف کنند. اگر کودک ترجیح می‌دهد، می‌تواند از چهره‌ها استفاده کند.</p>
      </div>
      <div className="flex gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-md mx-auto">
        {([['numeric', '🔢 مقیاس عددی'], ['faces', '🙂 مقیاس چهره‌ای']] as const).map(([k, label]) => (
          <button key={k} onClick={() => changeMode(k)}
            className={`flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${mode === k ? 'bg-[#096067] text-white shadow' : 'text-[#062a2e]'}`}>
            {label}
          </button>
        ))}
      </div>
      {mode === 'numeric' ? (
        <>
          <p className="text-center text-[#475569] font-bold text-sm">خطی نشان دهید که یک سر آن «بدون درد» و سر دیگر «بیشترین درد» است؛ از کودک بخواهید نقطه‌ای روی آن مشخص کند.</p>
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button key={i} onClick={() => setValue(i)}
                className={`py-4 rounded-2xl text-xl font-black border-2 cursor-pointer transition-all ${value === i ? 'bg-[#096067] text-white border-[#c69d5b] -translate-y-1 shadow-lg' : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'}`}>
                {i}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-center text-[#475569] font-bold text-sm">چهره‌ای را که بیشتر شبیه احساس کودک است انتخاب کنید.</p>
          <FaceGrid value={value} onPick={setValue} />
        </>
      )}
      {severity && value !== null && (
        <Banner title={mode === 'faces' ? 'نتیجهٔ مقیاس چهره‌ای' : 'نتیجهٔ NRS'} score={value} severity={severity}
          extra={mode === 'faces' ? '۱–۳ خفیف • ۴–۶ متوسط • ۷–۹ شدید • ۱۰ بسیار شدید' : '۱–۳ خفیف • ۴–۶ متوسط • ۷–۱۰ شدید'} />
      )}
    </div>
  );
};

/* ------------------ مراجع: پروسیجرها و داروها ------------------ */

const ProceduresTab: React.FC = () => (
  <div className="premium-card p-6 sm:p-10 space-y-6">
    <h3 className="text-2xl font-black text-[#062a2e] text-center">پروسیجرهای شایع بخش و مدیریت درد</h3>
    <div className="space-y-4">
      {PEDIATRIC_PROCEDURES.map((p, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border-2 border-[#d8cfbe] space-y-3">
          <p className="font-black text-[#062a2e]">{p.name}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold leading-relaxed">
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200"><span className="block text-sky-800 text-xs font-black mb-1">شیرخواران و کودکان کوچک‌تر از ۲ سال</span>{p.under2}</div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200"><span className="block text-amber-800 text-xs font-black mb-1">شیرخواران و کودکان بزرگ‌تر از ۲ سال</span>{p.over2}</div>
          </div>
        </div>
      ))}
    </div>
    <p className="text-xs font-bold text-[#475569]">منبع: جدول ۳ ابلاغیهٔ «مدیریت درد شیرخواران و کودکان بستری». دوز و تجویز دارو فقط با دستور پزشک.</p>
  </div>
);

const DrugsTab: React.FC = () => (
  <div className="premium-card p-6 sm:p-10 space-y-6">
    <h3 className="text-2xl font-black text-[#062a2e] text-center">داروهای شایع مورد مصرف در درمان درد کودکان</h3>
    <div className="space-y-3">
      {PEDIATRIC_DRUGS.map((d, i) => (
        <div key={i} className="p-5 rounded-2xl bg-white border-2 border-[#d8cfbe] grid grid-cols-1 md:grid-cols-4 gap-3 text-sm font-bold leading-relaxed">
          <div><span className="block text-xs text-[#855f20] font-black">{d.cls}</span><span className="text-lg font-black text-[#096067]">{d.name}</span></div>
          <div className="md:col-span-2"><span className="block text-xs text-[#855f20] font-black">مکانیسم و دوز</span>{d.dose}</div>
          <div><span className="block text-xs text-rose-700 font-black">عوارض جانبی</span>{d.adverse}</div>
        </div>
      ))}
    </div>
    <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-sm font-bold leading-relaxed space-y-2">
      <p>• استامینوفن وریدی: برای تسکین درد پس از جراحی باید مداوم و با فواصل منظم در ۷۲ ساعت اول تجویز شود، حتی اگر نمرهٔ درد پایین باشد.</p>
      <p>• NSAIDs به علت خونریزی گوارشی، نارسایی کلیه، دهیدراتاسیون و مشکلات انعقادی با احتیاط؛ در شیرخواران زیر ۶ ماه ممنوعیت مطلق.</p>
      <p>• فنتانیل: رقیق‌سازی طبق دستورالعمل کارخانه (ویال در ۱۰ cc حلال → غلظت ۱ mcg/cc، سرعت ۱ mcg/min از طریق سه‌راهی)؛ پس از تزریق علائم حیاتی و SpO₂ پایش شود.</p>
      <p>• کلونیدین: وقتی درد با مورفین و استامینوفن تسکین نیافت، هر ۴–۶ ساعت به‌صورت بولوس.</p>
      <p>• میدازولام به علت اثر منفی بر رشد و تکامل مغز محدود شود. در نبود کرم EMLA می‌توان از پماد لیدوکائین با پوشش پلاستیکی، نیم تا یک ساعت قبل از پروسیجر استفاده کرد.</p>
    </div>
  </div>
);

/* ------------------ کامپوننت اصلی ------------------ */

const PediatricAssessment: React.FC<Props> = ({ ageGroup, onAssess }) => {
  const [tab, setTab] = useState<'assess' | 'procedures' | 'drugs'>('assess');

  const renderScale = () => {
    switch (ageGroup) {
      case PediatricAgeGroup.NON_VERBAL:
        return <FiveItemScale name="FLACC" items={FLACC_ITEMS} onAssess={onAssess}
          subtitle="کودک فاقد کلام: اینتوبه، CP یا کوچک‌تر از ۳ سال؛ FLACC در تمام گروه‌های سنی فاقد کلام استفاده می‌شود." />;
      case PediatricAgeGroup.INFANT_TODDLER:
        return <FiveItemScale name="FLACC" items={FLACC_ITEMS} onAssess={onAssess}
          subtitle="از پایان یک ماهگی تا حدود ۴ سال، و کودکان بزرگ‌تر بستری در PICU که قادر به صحبت نیستند."
          note="در کودک غیرهوشیار، مقیاس‌های مشاهده‌ای رفتاری و شاخص‌های فیزیولوژیک اهمیت بیشتری دارند." />;
      case PediatricAgeGroup.PRE_SCHOOL:
        return <WongBaker onAssess={onAssess} />;
      case PediatricAgeGroup.SCHOOL_ADOLESCENT:
        return <NRS onAssess={onAssess} />;
      case PediatricAgeGroup.POST_OP:
        return <FiveItemScale name="CHIPPS" items={CHIPPS_ITEMS} onAssess={onAssess}
          subtitle="Children's and Infants' Postoperative Pain Scale — درد حاد پس از جراحی در شیرخواران و کودکان تا ۷ سال." />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-xl mx-auto">
        {([['assess', '📋 ارزیابی درد'], ['procedures', '🩺 پروسیجرها'], ['drugs', '💊 داروها']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${tab === k ? 'bg-[#096067] text-white shadow' : 'text-[#062a2e]'}`}>
            {label}
          </button>
        ))}
      </div>
      {/* ابزار ارزیابی همیشه mount می‌ماند تا نمره با عوض‌کردن تب پاک نشود */}
      <div className={tab === 'assess' ? '' : 'hidden'}>{renderScale()}</div>
      {tab === 'procedures' && <ProceduresTab />}
      {tab === 'drugs' && <DrugsTab />}
    </div>
  );
};

export default PediatricAssessment;
