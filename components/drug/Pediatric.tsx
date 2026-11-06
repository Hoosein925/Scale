import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

interface Preset { key: string; label: string; conc: string; dose: string; freq: number; maxDay: string; note: string; }

const PRESETS: Preset[] = [
  { key: 'apap120', label: 'استامینوفن شربت ۱۲۰ mg/5mL', conc: '24', dose: '15', freq: 4, maxDay: '75', note: 'معمولاً ۱۰–۱۵ mg/kg هر ۴–۶ ساعت. سقف روزانه در مراجع ≈ ۷۵ mg/kg؛ ابلاغیه وزارت: ۱۰۰ (کودک) و ۷۰ (شیرخوار) mg/kg در روز؛ و نه بیش از ۴ گرم در روز.' },
  { key: 'apap160', label: 'استامینوفن شربت ۱۶۰ mg/5mL', conc: '32', dose: '15', freq: 4, maxDay: '75', note: 'مانند بالا؛ غلظت شربت‌ها فرق دارد، لیبل را بخوانید.' },
  { key: 'apapiv', label: 'استامینوفن تزریقی (آمپول ۱۰۰۰ mg/6٫۷ mL)', conc: '150', dose: '15', freq: 4, maxDay: '75', note: 'آمپول غلیظ است (حدود ۱۵۰ mg/mL) و باید طبق دستور رقیق شود. برای مسکن پس از جراحی در ۷۲ ساعت اول مرتب تجویز می‌شود.' },
  { key: 'ibu100', label: 'ایبوپروفن شربت ۱۰۰ mg/5mL', conc: '20', dose: '10', freq: 3, maxDay: '40', note: 'معمولاً ۵–۱۰ mg/kg هر ۶–۸ ساعت؛ حداکثر ۴۰ mg/kg در روز. زیر ۶ ماه، آبله‌مرغان و کم‌آبی ممنوع/با احتیاط.' },
  { key: 'amox125', label: 'آموکسی‌سیلین ۱۲۵ mg/5mL', conc: '25', dose: '15', freq: 3, maxDay: '90', note: 'معمول ۲۵–۵۰ mg/kg/day در ۲–۳ دوز؛ دوز بالا تا ۹۰ mg/kg/day با نظر پزشک.' },
  { key: 'amox250', label: 'آموکسی‌سیلین ۲۵۰ mg/5mL', conc: '50', dose: '15', freq: 3, maxDay: '90', note: 'مانند بالا؛ غلظت دو برابر است، مراقب اشتباه با ۱۲۵ باشید.' },
  { key: 'cefix', label: 'سفکسیم ۱۰۰ mg/5mL', conc: '20', dose: '4', freq: 2, maxDay: '8', note: 'معمول ۸ mg/kg در روز یک‌بار یا ۴ mg/kg هر ۱۲ ساعت (دوز روزانه ۸ mg/kg است، نه هر نوبت).' },
  { key: 'diph', label: 'دیفن‌هیدرامین ۱۲٫۵ mg/5mL', conc: '2.5', dose: '1.25', freq: 4, maxDay: '5', note: 'معمول ۱–۱٫۲۵ mg/kg هر ۶ ساعت؛ در کودک زیر ۲ سال فقط با دستور پزشک.' },
];

export const PediatricDose: React.FC = () => {
  const [weight, setWeight] = useState('12');
  const [dose, setDose] = useState('15');
  const [freq, setFreq] = useState(4);
  const [conc, setConc] = useState('24');
  const [maxDay, setMaxDay] = useState('75');
  const [note, setNote] = useState('');

  const apply = (k: string) => {
    const p = PRESETS.find(x => x.key === k)!;
    setConc(p.conc); setDose(p.dose); setFreq(p.freq); setMaxDay(p.maxDay); setNote(p.note);
  };

  const w = num(weight), d = num(dose), c = num(conc), mx = num(maxDay);
  const singleMg = w * d;
  const singleMl = c > 0 ? singleMg / c : 0;
  const dailyMg = singleMg * freq;
  const mgKgDay = w > 0 ? dailyMg / w : 0;
  const over = mx > 0 && mgKgDay > mx + 1e-9;
  const roundMl = singleMl >= 1 ? Math.round(singleMl * 10) / 10 : Math.round(singleMl * 20) / 20;
  const ok = w > 0 && d > 0 && c > 0;

  return (
    <div className="space-y-5">
      <Card>
        <Pills title="دارو و غلظت (برای پر کردن سریع؛ عدد دستور پزشک را بررسی و جایگزین کنید)" onPick={apply} items={PRESETS.map(p => ({ key: p.key, label: p.label }))} />
        {note && <Warn kind="info">{note}</Warn>}
      </Card>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="وزن کودک / نوزاد" value={weight} onChange={setWeight} unit="kg" hint="وزن فعلی را وارد کنید (نه سن)" />
          <Field label="دوز تجویزشده برای هر نوبت" value={dose} onChange={setDose} unit="mg/kg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="min-w-0">
            <label className="block text-sm font-black text-[#062a2e] mb-1.5">تعداد دفعات در شبانه‌روز</label>
            <select value={freq} onChange={(e) => setFreq(parseInt(e.target.value))}
              className="w-full px-3 py-3 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-[#062a2e] font-black text-base focus:outline-none focus:border-[#096067]">
              <option value={1}>۱ بار (هر ۲۴ ساعت)</option>
              <option value={2}>۲ بار (هر ۱۲ ساعت)</option>
              <option value={3}>۳ بار (هر ۸ ساعت)</option>
              <option value={4}>۴ بار (هر ۶ ساعت)</option>
              <option value={6}>۶ بار (هر ۴ ساعت)</option>
            </select>
          </div>
          <Field label="غلظت دارو (mg در هر mL)" value={conc} onChange={setConc} unit="mg/mL" hint="مثلاً شربت ۱۲۰ mg در ۵ mL = ۲۴ mg/mL" />
        </div>
        <Field label="حداکثر مجاز روزانه (برای هشدار) — اختیاری" value={maxDay} onChange={setMaxDay} unit="mg/kg/day" hint="۰ بگذارید تا هشدار نمایش داده نشود" />
      </Card>

      {ok ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Result title="دوز هر نوبت" value={fmt(singleMg)} unit="mg" sub={<>روزانه: <b>{fmt(dailyMg)} mg</b> ({fmt(mgKgDay, 1)} mg/kg/day)</>} tone={over ? 'danger' : 'ok'} />
            <Result title="حجم دارو برای هر نوبت" value={fmt(roundMl)} unit="mL" sub={<>مقدار دقیق: {fmt(singleMl, 3)} mL (گرد‌شده برای سرنگ)</>} tone={over ? 'danger' : 'ok'} />
          </div>
          {over && <Warn kind="danger">⛔ دوز روزانه ({fmt(mgKgDay, 1)} mg/kg) از حداکثر واردشده ({fmt(mx)} mg/kg) بیشتر است! قبل از دادن دارو با پزشک/داروساز هماهنگ کنید.</Warn>}
          {singleMl > 0 && singleMl < 1 && <Warn kind="info">برای حجم کمتر از ۱ mL از سرنگ ۱ سی‌سی (تیوبرکولین) استفاده کنید؛ در نوزادان NICU دقت اعشار حیاتی است.</Warn>}
        </>
      ) : <Warn kind="info">وزن، دوز و غلظت را وارد کنید.</Warn>}

      <Guide>
        <Formula title="فرمول دوز هر نوبت بر اساس وزن">دوز هر نوبت (mg) = وزن کودک (kg) × دوز تجویزی (mg/kg)</Formula>
        <Formula title="حجم شربت یا سوسپانسیون">حجم شربت (mL) = دوز هر نوبت (mg) ÷ غلظت شربت (mg/mL)</Formula>

        <GuideExample
          title="مثال: شربت استامینوفن برای کودک ۱۲ کیلوگرمی"
          description="وزن = ۱۲ kg، دوز تجویزی = ۱۵ mg/kg هر ۶ ساعت (۴ بار در روز)، شربت ۱۲۰ mg/5mL (غلظت ۲۴ mg/mL)"
          steps={[
            { label: 'دوز هر نوبت', math: '12 kg × 15 mg/kg', result: '180 mg' },
            { label: 'حجم شربت هر نوبت', math: '180 mg ÷ 24 mg/mL', result: '7.5 mL' },
            { label: 'دوز کل شبانه‌روز', math: '180 mg × 4', result: '720 mg/day' },
            { label: 'دوز دریافتی روزانه', math: '720 mg ÷ 12 kg', result: '60 mg/kg/day' },
          ]}
          note="سقف مجاز روزانه ۷۵ mg/kg است؛ دوز ۶۰ mg/kg کاملاً در محدوده امن قرار دارد."
        />
        <p className="text-xs font-bold text-slate-600 leading-relaxed pr-1">
          به والدین آموزش دهید حتماً از سرنگ دارودهی مدرج یا پیمانه استاندارد استفاده کنند و از قاشق‌های معمولی غذاخوری به دلیل خطای بالا پرهیز نمایند.
        </p>
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};

export const PediatricFluid: React.FC = () => {
  const [weight, setWeight] = useState('14');
  const w = num(weight);
  const day = w <= 0 ? 0 : w <= 10 ? w * 100 : w <= 20 ? 1000 + (w - 10) * 50 : 1500 + (w - 20) * 20;
  const hr = day / 24;

  return (
    <div className="space-y-5">
      <Card>
        <Field label="وزن کودک" value={weight} onChange={setWeight} unit="kg" />
      </Card>
      {day > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Result title="مایع نگهدارندهٔ ۲۴ ساعته" value={String(Math.round(day))} unit="mL/day" />
          <Result title="سرعت در ساعت" value={fmt(hr, 1)} unit="mL/hr" sub={<>معادل میکروست (۶۰ قطره/mL): <b>{fmt(hr, 1)}</b> قطره در دقیقه</>} />
        </div>
      ) : <Warn kind="info">وزن را وارد کنید.</Warn>}
      {w > 0 && w < 3 && <Warn kind="danger">در نوزادان تازه‌متولد و کم‌وزن، نیاز مایع بر اساس روز تولد و پروتکل NICU تعیین می‌شود؛ این فرمول برای آن‌ها کافی نیست.</Warn>}
      <Warn kind="info">
        مایع نگهدارنده فقط «نیاز پایه» است. کم‌آبی، تب، افزایش از دست دادن مایع و بیماری‌های قلبی/کلیوی نیاز به تنظیم ویژه دارند. نوع سرم (طبق راهنماهای جدید برای کودکان بستری معمولاً محلول ایزوتونیک مثل دکستروز-نرمال‌سالین، با یا بدون پتاسیم) و سرعت نهایی را پزشک تعیین می‌کند.
      </Warn>
      <Guide>
        <Formula title="قانون هالیدی–سیگار (Holliday-Segar) برای مایع ۲۴ ساعته">
          ۱۰ کیلوگرم اول: 100 mL/kg • ۱۰ کیلوگرم دوم: 50 mL/kg • بالای ۲۰ کیلوگرم: 20 mL/kg
        </Formula>
        <Formula title="قانون ۴-۲-۱ برای سرعت در ساعت">
          ۱۰ کیلوگرم اول: 4 mL/kg/hr • ۱۰ کیلوگرم دوم: 2 mL/kg/hr • بالای ۲۰ کیلوگرم: 1 mL/kg/hr
        </Formula>

        <GuideExample
          title="مثال: محاسبه سرم نگهدارنده کودک ۱۴ کیلوگرمی"
          description="وزن = ۱۴ kg (۱۰ کیلوگرم اول + ۴ کیلوگرم دوم)"
          steps={[
            { label: '۱۰ کیلوگرم اول', math: '10 × 100 mL', result: '1000 mL' },
            { label: '۴ کیلوگرم بعدی', math: '4 × 50 mL', result: '200 mL' },
            { label: 'مایع کل ۲۴ ساعت', math: '1000 + 200', result: '1200 mL/day' },
            { label: 'سرعت پمپ / میکروست', math: '1200 ÷ 24 hr', result: '50 mL/hr (gtt/min)' },
          ]}
          note="در میکروست (۶۰ قطره/mL)، سرعت ۵۰ mL/hr دقیقاً معادل ۵۰ قطره در دقیقه است."
        />
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};
