import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

type DoseUnit = 'mcg/kg/min' | 'mcg/kg/hr' | 'mg/kg/hr' | 'mcg/min' | 'mg/hr' | 'mg/min' | 'U/hr' | 'U/kg/hr';

const AMOUNT_UNITS = [
  { value: 'mg', label: 'mg' },
  { value: 'mcg', label: 'mcg' },
  { value: 'g', label: 'g' },
  { value: 'U', label: 'واحد' },
];
const MASS_DOSE: DoseUnit[] = ['mcg/kg/min', 'mcg/kg/hr', 'mg/kg/hr', 'mcg/min', 'mg/hr', 'mg/min'];
const UNIT_DOSE: DoseUnit[] = ['U/hr', 'U/kg/hr'];

/** مقدار دارو در ساعت (mg یا واحد) از دوز تجویزی */
const toPerHour = (dose: number, u: DoseUnit, w: number): number => {
  switch (u) {
    case 'mcg/kg/min': return (dose * w * 60) / 1000;
    case 'mcg/kg/hr': return (dose * w) / 1000;
    case 'mg/kg/hr': return dose * w;
    case 'mcg/min': return (dose * 60) / 1000;
    case 'mg/hr': return dose;
    case 'mg/min': return dose * 60;
    case 'U/hr': return dose;
    case 'U/kg/hr': return dose * w;
  }
};
const fromPerHour = (perHr: number, u: DoseUnit, w: number): number => {
  switch (u) {
    case 'mcg/kg/min': return w > 0 ? (perHr * 1000) / (w * 60) : 0;
    case 'mcg/kg/hr': return w > 0 ? (perHr * 1000) / w : 0;
    case 'mg/kg/hr': return w > 0 ? perHr / w : 0;
    case 'mcg/min': return (perHr * 1000) / 60;
    case 'mg/hr': return perHr;
    case 'mg/min': return perHr / 60;
    case 'U/hr': return perHr;
    case 'U/kg/hr': return w > 0 ? perHr / w : 0;
  }
};

const PRESETS = [
  { key: 'dopa', label: 'دوپامین', amt: '200', au: 'mg', vol: '100', du: 'mcg/kg/min' as DoseUnit, dose: '5' },
  { key: 'dobu', label: 'دوبوتامین', amt: '250', au: 'mg', vol: '250', du: 'mcg/kg/min' as DoseUnit, dose: '5' },
  { key: 'nor', label: 'نوراپی‌نفرین', amt: '4', au: 'mg', vol: '100', du: 'mcg/min' as DoseUnit, dose: '8' },
  { key: 'epi', label: 'اپی‌نفرین', amt: '4', au: 'mg', vol: '100', du: 'mcg/min' as DoseUnit, dose: '2' },
  { key: 'tng', label: 'نیتروگلیسیرین', amt: '10', au: 'mg', vol: '100', du: 'mcg/min' as DoseUnit, dose: '10' },
  { key: 'hep', label: 'هپارین', amt: '25000', au: 'U', vol: '500', du: 'U/hr' as DoseUnit, dose: '1000' },
  { key: 'ins', label: 'انسولین رگولار', amt: '100', au: 'U', vol: '100', du: 'U/hr' as DoseUnit, dose: '2' },
  { key: 'fent', label: 'فنتانیل', amt: '500', au: 'mcg', vol: '50', du: 'mcg/kg/hr' as DoseUnit, dose: '1' },
  { key: 'mid', label: 'میدازولام', amt: '50', au: 'mg', vol: '50', du: 'mg/hr' as DoseUnit, dose: '2' },
  { key: 'lasix', label: 'فوروزمید', amt: '100', au: 'mg', vol: '100', du: 'mg/hr' as DoseUnit, dose: '10' },
];

const Infusion: React.FC = () => {
  const [mode, setMode] = useState<'dose2rate' | 'rate2dose'>('dose2rate');
  const [amt, setAmt] = useState('200');
  const [au, setAu] = useState('mg');
  const [vol, setVol] = useState('100');
  const [weight, setWeight] = useState('70');
  const [du, setDu] = useState<DoseUnit>('mcg/kg/min');
  const [dose, setDose] = useState('5');
  const [rate, setRate] = useState('10');

  const isUnits = au === 'U';
  const doseOptions = isUnits ? UNIT_DOSE : MASS_DOSE;
  const changeAmtUnit = (u: string) => {
    setAu(u);
    const nowUnits = u === 'U';
    if (nowUnits && !UNIT_DOSE.includes(du)) setDu('U/hr');
    if (!nowUnits && !MASS_DOSE.includes(du)) setDu('mcg/kg/min');
  };

  const pick = (k: string) => {
    const p = PRESETS.find(x => x.key === k)!;
    setAmt(p.amt); setAu(p.au); setVol(p.vol); setDu(p.du); setDose(p.dose);
  };

  const amtBase = isUnits ? num(amt) : num(amt) * (au === 'g' ? 1000 : au === 'mcg' ? 0.001 : 1);
  const v = num(vol);
  const w = num(weight);
  const conc = v > 0 ? amtBase / v : 0; // mg/mL یا U/mL
  const needsW = du.includes('/kg/');
  const weightMissing = needsW && w <= 0;

  const perHrFromDose = toPerHour(num(dose), du, w);
  const rateMl = conc > 0 && !weightMissing ? perHrFromDose / conc : 0;
  const doseFromRate = conc > 0 && !weightMissing ? fromPerHour(num(rate) * conc, du, w) : 0;
  const cLabel = isUnits ? 'واحد' : 'mg';
  const concMcg = isUnits ? null : conc * 1000;

  return (
    <div className="space-y-5">
      <Card>
        <Pills title="نمونهٔ غلظت‌های رایج (فقط برای پر کردن سریع؛ غلظت را با پروتکل بخش تطبیق دهید)" onPick={pick} items={PRESETS.map(p => ({ key: p.key, label: p.label }))} />
      </Card>

      <Card>
        <p className="text-sm font-black text-[#096067]">۱) محلول داخل سرنگ/سرم چیست؟</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="مقدار کل دارو در محلول" value={amt} onChange={setAmt} units={AMOUNT_UNITS} unitValue={au} onUnitChange={changeAmtUnit} />
          <Field label="حجم نهایی محلول (دارو + رقیق‌کننده)" value={vol} onChange={setVol} unit="mL" />
        </div>
        <p className="text-sm font-black text-[#096067]">۲) بیمار</p>
        <Field label="وزن بیمار" value={weight} onChange={setWeight} unit="kg" hint="فقط برای دوزهای «بر حسب کیلوگرم» لازم است" />
        <p className="text-sm font-black text-[#096067]">۳) چه می‌خواهید محاسبه کنید؟</p>
        <Pills active={mode} onPick={(k) => setMode(k as 'dose2rate' | 'rate2dose')} items={[
          { key: 'dose2rate', label: '➡️ دوز را می‌دانم → سرعت پمپ را بده' },
          { key: 'rate2dose', label: '⬅️ سرعت پمپ را می‌دانم → دوز را بده' },
        ]} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-sm font-black text-[#062a2e] mb-1.5">واحد دوز</label>
            <select dir="ltr" value={du} onChange={(e) => setDu(e.target.value as DoseUnit)}
              className="w-full px-3 py-3 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-[#062a2e] font-black text-base focus:outline-none focus:border-[#096067]">
              {doseOptions.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {mode === 'dose2rate'
            ? <Field label="دوز تجویزشده" value={dose} onChange={setDose} unit={du} />
            : <Field label="سرعت فعلی پمپ" value={rate} onChange={setRate} unit="mL/hr" />}
        </div>
      </Card>

      {weightMissing && <Warn kind="danger">این واحد به وزن نیاز دارد؛ وزن بیمار را وارد کنید. بدون وزن محاسبه انجام نمی‌شود.</Warn>}

      {conc > 0 && !weightMissing && (
        mode === 'dose2rate' ? (
          <>
            <Result title="سرعت تنظیم پمپ" value={fmt(rateMl)} unit="mL/hr"
              sub={<>غلظت محلول: <b>{fmt(conc, 3)} {cLabel}/mL</b>{concMcg ? <> (= {fmt(concMcg, 1)} mcg/mL)</> : null} • معادل میکروست (۶۰ قطره/mL): <b>{fmt(rateMl, 1)}</b> قطره در دقیقه</>} />
            {rateMl > 250 && <Warn kind="danger">سرعت بسیار بالاست؛ غلظت و دوز را دوباره بررسی کنید.</Warn>}
            {rateMl > 0 && rateMl < 0.5 && <Warn>سرعت خیلی کم است؛ ممکن است محلول را غلیظ‌تر از حد معمول ساخته باشید یا اشتباه واحد داشته باشید.</Warn>}
          </>
        ) : (
          <Result title="دوز فعلی بیمار" value={fmt(doseFromRate)} unit={du}
            sub={<>با غلظت <b>{fmt(conc, 3)} {cLabel}/mL</b> و سرعت <b>{fmt(num(rate))} mL/hr</b></>} />
        )
      )}

      <Guide>
        <Formula title="فرمول سرعت پمپ انفوزیون">سرعت پمپ (mL/hr) = دوز دارویی در هر ساعت ÷ غلظت محلول (mg/mL)</Formula>

        <GuideExample
          title="مثال: انفوزیون دوپامین بر اساس وزن"
          description="بیمار ۷۰ کیلوگرمی، دستور ۵ mcg/kg/min. محلول: ۲۰۰ mg دوپامین در ۱۰۰ mL سرم قندی ۵٪ (غلظت ۲ mg/mL)."
          steps={[
            { label: 'غلظت محلول', math: '200 mg ÷ 100 mL', result: '2 mg/mL (= 2000 mcg/mL)' },
            { label: 'نیاز در دقیقه', math: '5 mcg × 70 kg', result: '350 mcg/min' },
            { label: 'نیاز در ساعت', math: '(350 × 60) ÷ 1000', result: '21 mg/hr' },
            { label: 'سرعت پمپ', math: '21 mg/hr ÷ 2 mg/mL', result: '10.5 mL/hr' },
          ]}
          note="در حالت معکوس، می‌توانید سرعت فعلی پمپ سرنگ را وارد کنید تا ببینید دقیقاً بیمار در هر دقیقه چند mcg/kg دارو دریافت می‌کند."
        />
        <p className="text-xs font-bold text-slate-600 leading-relaxed pr-1">
          داروهای حساس مانند هپارین و انسولین با واحد (Unit/hr) محاسبه می‌شوند و به وزن بیمار وابسته نیستند؛ واحد را هرگز به میلی‌گرم تبدیل نکنید.
        </p>
      </Guide>
      <Warn kind="danger">داروهای انفوزیونی پرخطرند: غلظت، دوز و تنظیم پمپ را با یک همکار دیگر کنترل کنید. {PLEASE_CHECK}</Warn>
    </div>
  );
};

export default Infusion;
