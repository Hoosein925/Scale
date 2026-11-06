import React, { useEffect, useState } from 'react';
import { AssessmentResult, PainSeverity, PatientStatus } from '../types';
import {
  VAS_FACES, BPS_FACE_IMAGES, BPS_ARM_IMAGES,
  adultNumericSeverity, bpsSeverity, severityLabel,
} from './painData';

interface Props {
  status: PatientStatus;
  onAssess: (result: AssessmentResult | null) => void;
}

const sevColor: Record<PainSeverity, string> = {
  [PainSeverity.NONE]: 'bg-emerald-600',
  [PainSeverity.MILD]: 'bg-amber-500',
  [PainSeverity.MODERATE]: 'bg-orange-600',
  [PainSeverity.SEVERE]: 'bg-rose-700',
  [PainSeverity.VERY_SEVERE]: 'bg-red-800',
};

const ScoreBanner: React.FC<{ title: string; score: number | string; severity: PainSeverity; extra?: string }> = ({ title, score, severity, extra }) => (
  <div className={`${sevColor[severity]} rounded-3xl p-6 flex items-center justify-between text-white shadow-lg`}>
    <div>
      <p className="text-sm font-bold opacity-90">{title}</p>
      <p className="text-2xl font-black">{severityLabel[severity]}</p>
      {extra && <p className="text-xs font-bold opacity-90 mt-1">{extra}</p>}
    </div>
    <div className="bg-white text-[#ca7f3c] border-2 border-[#c69d5b] rounded-2xl px-6 py-2 text-4xl font-black tabular-nums">{score}</div>
  </div>
);

/* ----------------------------- VAS / چهره‌ها ----------------------------- */

const ConsciousPain: React.FC<Props> = ({ onAssess }) => {
  const [mode, setMode] = useState<'numeric' | 'faces'>('numeric');
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (value === null) { onAssess(null); return; }
    const severity = adultNumericSeverity(value);
    onAssess({
      score: value,
      severity,
      toolUsed: mode === 'faces' ? 'FACES' : 'VAS',
      interpretation: `${severityLabel[severity]} (${mode === 'faces' ? 'مقیاس چهره‌ای' : 'VAS/NRS'} = ${value})`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mode]);

  const changeMode = (m: 'numeric' | 'faces') => { setMode(m); setValue(null); };
  const severity = value === null ? null : adultNumericSeverity(value);

  return (
    <div className="premium-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">ارزیابی درد بیمار هوشیار</h3>
        <p className="text-[#096067] font-bold">درد به‌عنوان پنجمین علامت حیاتی همراه با علائم حیاتی در هر شیفت ارزیابی شود.</p>
      </div>

      <div className="flex gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-md mx-auto">
        {([['numeric', '🔢 مقیاس عددی (VAS/NRS)'], ['faces', '🙂 مقیاس چهره‌ای']] as const).map(([k, label]) => (
          <button key={k} onClick={() => changeMode(k)}
            className={`flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${mode === k ? 'bg-[#096067] text-white shadow' : 'text-[#062a2e]'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'numeric' ? (
        <div className="space-y-6">
          <p className="text-center text-[#475569] font-bold">از بیمار بخواهید شدت درد خود را از ۰ (بدون درد) تا ۱۰ (بدترین درد ممکن) بیان کند.</p>
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <button key={i} onClick={() => setValue(i)}
                className={`py-4 rounded-2xl text-xl font-black border-2 cursor-pointer transition-all ${value === i ? 'bg-[#096067] text-white border-[#c69d5b] -translate-y-1 shadow-lg' : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'}`}>
                {i}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 text-center text-[11px] sm:text-xs font-black text-[#475569] gap-1">
            <span className="bg-emerald-100 rounded-lg py-1">۰ فاقد درد</span>
            <span className="bg-amber-100 rounded-lg py-1">۱–۳ خفیف</span>
            <span className="bg-orange-100 rounded-lg py-1">۴–۶ متوسط</span>
            <span className="bg-rose-100 rounded-lg py-1">۷–۸ شدید</span>
            <span className="bg-red-100 rounded-lg py-1">۹–۱۰ غیرقابل تحمل</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-center text-[#475569] font-bold">
            برای بیمارانی که قادر به بیان عددی درد نیستند (مثلاً سالمند، کم‌سواد یا مشکل ارتباطی): چهره‌ای را که بیشتر شبیه حال او است انتخاب کند.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {VAS_FACES.map(f => (
              <button key={f.value} onClick={() => setValue(f.value)}
                className={`p-2 rounded-3xl border-4 flex flex-col items-center gap-1 cursor-pointer transition-all ${value === f.value ? 'border-[#096067] bg-[#096067]/10 -translate-y-1 shadow-lg' : 'border-transparent bg-white hover:border-[#c69d5b]'}`}>
                <img src={f.img} alt={f.fa} className="w-full max-w-[110px] aspect-square object-contain" />
                <span className="text-2xl font-black text-[#062a2e]">{f.value}</span>
                <span className="text-xs font-bold text-[#475569] text-center">{f.fa}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {severity && value !== null && (
        <ScoreBanner title={mode === 'faces' ? 'نتیجهٔ مقیاس چهره‌ای' : 'نتیجهٔ مقیاس VAS/NRS'} score={value} severity={severity} />
      )}
    </div>
  );
};

/* ----------------------------- BPS ----------------------------- */

const PhotoOption: React.FC<{
  selected: boolean; score: number; label: string; photos?: string[]; onClick: () => void;
}> = ({ selected, score, label, photos, onClick }) => (
  <button onClick={onClick}
    className={`p-3 rounded-2xl border-2 text-right flex flex-col gap-2 cursor-pointer transition-all ${selected ? 'bg-[#096067] border-[#096067] text-white shadow-lg -translate-y-1' : 'bg-white border-[#d8cfbe] hover:border-[#c69d5b] text-[#334155]'}`}>
    {photos && (
      <div className="grid grid-cols-2 gap-1.5">
        {photos.map((p, i) => <img key={i} src={p} alt={`نمونه امتیاز ${score}`} className="w-full h-24 object-cover rounded-xl bg-white" />)}
      </div>
    )}
    <span className={`text-[10px] font-black ${selected ? 'text-[#eedaa8]' : 'text-[#855f20]'}`}>امتیاز {score}</span>
    <span className="font-bold leading-snug text-sm">{label}</span>
  </button>
);

const BPSPain: React.FC<Props> = ({ onAssess }) => {
  const [intubated, setIntubated] = useState(true);
  const [face, setFace] = useState(1);
  const [arms, setArms] = useState(1);
  const [vent, setVent] = useState(1);
  const [voice, setVoice] = useState(1);
  const [touched, setTouched] = useState(false);

  const total = face + arms + (intubated ? vent : voice);
  const severity = bpsSeverity(total);

  useEffect(() => {
    if (!touched) { onAssess(null); return; }
    onAssess({
      score: total,
      severity,
      toolUsed: 'BPS',
      interpretation: total <= 3 ? 'نمرهٔ BPS برابر ۳ — فاقد درد' : `${severityLabel[severity]} (BPS = ${total} از ۱۲)`,
      timestamp: new Date(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, touched, intubated]);

  const pick = (setter: (n: number) => void) => (n: number) => { setter(n); setTouched(true); };

  const faceLabels = ['آرام', 'چهره نسبتاً درهم کشیده (مانند پایین انداختن ابروها)', 'چهره کاملاً درهم کشیده (مانند بستن چشم‌ها)', 'درهم رفتن چهره به‌طوری که حالت خصمانه به خود بگیرد'];
  const armLabels = ['بی‌حرکت', 'کمی خم می‌کند', 'کاملاً خم می‌کند و انگشتان را نیز جمع می‌کند', 'کشیدن و مقاومت در برابر مراقبت'];
  const ventLabels = ['تحمل کردن تهویه', 'سرفه در حالی که در اغلب موارد دستگاه تهویه مکانیکی را تحمل می‌کند', 'جنگ با دستگاه تهویه مکانیکی؛ در بعضی مواقع تهویه امکان‌پذیر است', 'عدم تحمل تهویه'];
  const voiceLabels = ['صحبت کردن بدون درد', 'آه و ناله کمتر از ۳ بار در دقیقه و با طول زمان کمتر از ۳ ثانیه', 'آه و ناله بیشتر از ۳ بار در دقیقه یا با طول زمان بیش از ۳ ثانیه', 'ضجه زدن یا شکایت‌های کلامی (آخ – وای) یا نگه‌داشتن تنفس'];

  const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-7 bg-gradient-to-b from-[#c69d5b] to-[#ca7f3c] rounded-full"></div>
        <h4 className="text-xl font-black text-[#062a2e]">{title}</h4>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{children}</div>
    </div>
  );

  return (
    <div className="premium-card p-6 sm:p-10 space-y-10">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">مقیاس رفتاری درد (BPS)</h3>
        <p className="text-[#096067] font-bold">ویژهٔ بیماران با کاهش سطح هوشیاری، اینتوبه یا غیراینتوبه. عکس‌ها نمونهٔ بالینی هر امتیاز هستند.</p>
      </div>

      <div className="flex gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-md mx-auto">
        {[[true, '🫁 اینتوبه (تهویه مکانیکی)'], [false, '🗣️ غیر اینتوبه']].map(([k, label]) => (
          <button key={String(k)} onClick={() => { setIntubated(k as boolean); setTouched(true); }}
            className={`flex-1 py-3 rounded-xl text-sm font-black cursor-pointer transition-all ${intubated === k ? 'bg-[#096067] text-white shadow' : 'text-[#062a2e]'}`}>
            {label as string}
          </button>
        ))}
      </div>

      <Block title="۱. حالات چهره">
        {faceLabels.map((l, i) => (
          <PhotoOption key={i} score={i + 1} label={l} selected={face === i + 1} onClick={() => pick(setFace)(i + 1)}
            photos={[BPS_FACE_IMAGES[0][i], BPS_FACE_IMAGES[1][i]]} />
        ))}
      </Block>

      <Block title="۲. حرکات اندام‌های فوقانی">
        {armLabels.map((l, i) => (
          <PhotoOption key={i} score={i + 1} label={l} selected={arms === i + 1} onClick={() => pick(setArms)(i + 1)}
            photos={[BPS_ARM_IMAGES[0][i], BPS_ARM_IMAGES[1][i]]} />
        ))}
      </Block>

      {intubated ? (
        <Block title="۳. هماهنگی با تهویهٔ مکانیکی">
          {ventLabels.map((l, i) => <PhotoOption key={i} score={i + 1} label={l} selected={vent === i + 1} onClick={() => pick(setVent)(i + 1)} />)}
        </Block>
      ) : (
        <Block title="۳. صحبت کردن (بیمار غیر اینتوبه)">
          {voiceLabels.map((l, i) => <PhotoOption key={i} score={i + 1} label={l} selected={voice === i + 1} onClick={() => pick(setVoice)(i + 1)} />)}
        </Block>
      )}

      <ScoreBanner title="مجموع امتیاز BPS (۳ تا ۱۲)" score={total} severity={severity}
        extra="۳ فاقد درد • ۴–۶ خفیف • ۷–۹ متوسط • ۱۰–۱۲ شدید" />
      {!touched && <p className="text-center text-xs font-bold text-[#855f20]">برای نمایش پلن درمانی، حداقل یک گزینه را انتخاب کنید (مقدار پیش‌فرض: همهٔ موارد امتیاز ۱).</p>}
    </div>
  );
};

/* ----------------------------- بیمار پارالیزه ----------------------------- */

const ParalyzedPain: React.FC<Props> = ({ onAssess }) => {
  const items = [
    'افزایش فشار خون نسبت به مقدار پایه',
    'تاکی‌کاردی (افزایش ضربان قلب نسبت به مقدار پایه)',
    'تعریق',
    'کاهش SpO₂',
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  useEffect(() => { onAssess(null); /* برای این گروه نمرهٔ ابزاری وجود ندارد */ // eslint-disable-next-line
  }, []);
  const count = checked.filter(Boolean).length;

  return (
    <div className="premium-card p-6 sm:p-10 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-[#062a2e]">بیمار تحت پارالیز / مرگ مغزی / فلج چهار اندام</h3>
        <p className="text-rose-700 font-bold">
          در بیماری که داروی بلوک‌کنندهٔ عضلانی دریافت کرده، پارالیز شده، مرگ مغزی دارد یا دچار فلج چهار اندام است، امکان استفاده از ابزار تشخیص درد (VAS/BPS) وجود ندارد.
        </p>
      </div>
      <p className="text-[#475569] font-bold text-center">به‌جای ابزار، تغییرات همودینامیک بیمار ارزیابی شود:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((t, i) => (
          <label key={i} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer font-bold ${checked[i] ? 'bg-rose-50 border-rose-400' : 'bg-white border-[#d8cfbe]'}`}>
            <input type="checkbox" checked={checked[i]} className="w-5 h-5"
              onChange={() => setChecked(c => c.map((v, j) => (j === i ? !v : v)))} />
            <span>{t}</span>
          </label>
        ))}
      </div>
      <div className={`${count ? 'bg-rose-700' : 'bg-emerald-600'} text-white rounded-3xl p-6 shadow-lg`}>
        <p className="text-xl font-black">
          {count ? `${count} نشانهٔ همودینامیک مثبت — احتمال وجود درد` : 'نشانهٔ همودینامیک مثبتی ثبت نشده است'}
        </p>
        {count > 0 && (
          <ul className="mt-3 space-y-2 font-bold text-sm leading-relaxed">
            <li>• موضوع را به پزشک/متخصص بیهوشی اطلاع دهید؛ علل دیگر تغییرات همودینامیک (هیپوکسی، هیپوولمی، سپسیس و...) نیز بررسی شود.</li>
            <li>• تصمیم دربارهٔ تجویز مسکن طبق دستور پزشک است؛ ارزیابی علائم حیاتی را حداقل هر ۱ ساعت تکرار کنید.</li>
            <li>• نتیجه و مداخلات را مستندسازی کنید.</li>
          </ul>
        )}
      </div>
      <p className="text-xs font-bold text-[#475569]">
        در تمام بیمارانی که مخدر یا غیرمخدر دریافت می‌کنند، علاوه بر علائم حیاتی، نمرهٔ تهوع/استفراغ و نمرهٔ آرام‌بخشی (RASS) نیز ارزیابی شود.
      </p>
    </div>
  );
};

const PainAssessment: React.FC<Props> = (props) => {
  switch (props.status) {
    case PatientStatus.CONSCIOUS: return <ConsciousPain {...props} />;
    case PatientStatus.DECREASED_CONSCIOUSNESS: return <BPSPain {...props} />;
    case PatientStatus.PARALYZED: return <ParalyzedPain {...props} />;
    default: return null;
  }
};

export default PainAssessment;
