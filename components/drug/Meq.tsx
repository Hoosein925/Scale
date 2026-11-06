import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

interface Elec { key: string; name: string; strength: string; mEqPerMl: number; mgPerMl: number; ampoule: string; warns: string[]; }

const ELECTROLYTES: Elec[] = [
  { key: 'kcl15', name: 'پتاسیم کلراید (KCl)', strength: '۱۵٪', mEqPerMl: 2, mgPerMl: 150, ampoule: 'آمپول ۱۰ mL = ۲۰ mEq',
    warns: ['هرگز بدون رقیق‌سازی و هرگز به‌صورت بولوس/پوش وریدی تزریق نشود (کشنده است).', 'سرعت معمول طبق پروتکل: تا حدود ۱۰ mEq/hr از راه محیطی؛ سرعت بیشتر فقط با پایش قلبی و رگ مرکزی و دستور پزشک.', 'غلظت مجاز در سرم طبق پروتکل بیمارستان (معمولاً تا ۴۰ mEq/L از راه محیطی).'] },
  { key: 'bic84', name: 'سدیم بیکربنات', strength: '۸٫۴٪', mEqPerMl: 1, mgPerMl: 84, ampoule: 'ویال ۵۰ mL = ۵۰ mEq',
    warns: ['با محلول‌های حاوی کلسیم در یک مسیر مخلوط نشود (رسوب می‌کند).', 'غلظت بالا (هایپراسمولار) است؛ در نوزاد/شیرخوار معمولاً ۱:۱ رقیق و به‌صورت ۴٫۲٪ استفاده می‌شود (طبق دستور پزشک).', 'نشت به بافت باعث نکروز می‌شود؛ محل رگ را کنترل کنید.'] },
  { key: 'bic75', name: 'سدیم بیکربنات', strength: '۷٫۵٪', mEqPerMl: 0.9, mgPerMl: 75, ampoule: 'ویال ۵۰ mL = ۴۵ mEq',
    warns: ['با محلول‌های حاوی کلسیم در یک مسیر مخلوط نشود.', 'تفاوت با ۸٫۴٪: غلظت کمتر است؛ برای همان دوز mEq حجم بیشتری لازم است.', 'محل رگ را از نظر نشت و نکروز کنترل کنید.'] },
  { key: 'bic42', name: 'سدیم بیکربنات', strength: '۴٫۲٪', mEqPerMl: 0.5, mgPerMl: 42, ampoule: 'سرنگ/ویال ۱۰ mL = ۵ mEq',
    warns: ['معمولاً برای نوزادان و شیرخواران (غلظت ایزوتونیک‌تر).', 'با کلسیم در یک مسیر مخلوط نشود.'] },
  { key: 'cag10', name: 'کلسیم گلوکونات', strength: '۱۰٪', mEqPerMl: 0.465, mgPerMl: 100, ampoule: 'آمپول ۱۰ mL = ۴٫۶۵ mEq کلسیم المنتال (≈ ۹۳ mg)',
    warns: ['آهسته تزریق شود (معمولاً طی ۵–۱۰ دقیقه) با پایش ریتم قلب؛ در هایپرکالمی/هیپوکلسمی علامت‌دار.', 'نشت به بافت خطرناک است؛ با بیکربنات مخلوط نشود.', 'در بیمار تحت دیگوکسین با احتیاط.'] },
  { key: 'cacl10', name: 'کلسیم کلراید', strength: '۱۰٪', mEqPerMl: 1.36, mgPerMl: 100, ampoule: 'آمپول ۱۰ mL ≈ ۱۳٫۶ mEq (کلسیم ۲٫۵ برابر غلیظ‌تر از گلوکونات)',
    warns: ['بسیار تحریک‌کننده و نکروزدهنده؛ ترجیحاً از رگ مرکزی یا رگ بزرگ و آهسته.', 'برای همان دوز، حجم کمتری نسبت به کلسیم گلوکونات لازم است؛ این دو را با هم اشتباه نکنید.'] },
  { key: 'mg20', name: 'منیزیم سولفات', strength: '۲۰٪', mEqPerMl: 1.62, mgPerMl: 200, ampoule: '۵ mL = ۱ گرم = ۸٫۱ mEq',
    warns: ['حین انفوزیون رفلکس‌های تاندونی (DTR)، تعداد تنفس و برون‌ده ادرار را پایش کنید (آنتی‌دوت: کلسیم گلوکونات).', 'داروی پرخطر: دوز و سرعت را با همکار دوباره کنترل کنید.'] },
  { key: 'mg50', name: 'منیزیم سولفات', strength: '۵۰٪', mEqPerMl: 4.06, mgPerMl: 500, ampoule: '۲ mL = ۱ گرم = ۸٫۱ mEq',
    warns: ['غلیظ است؛ قبل از تزریق وریدی حتماً رقیق شود.', 'پایش DTR، تنفس و ادرار.'] },
  { key: 'nacl3', name: 'سدیم کلراید هایپرتونیک', strength: '۳٪', mEqPerMl: 0.513, mgPerMl: 30, ampoule: '۱ mL ≈ ۰٫۵۱۳ mEq سدیم',
    warns: ['فقط با دستور پزشک و پایش سدیم؛ اصلاح سریع سدیم خطر دمیلینیزاسیون (ODS) دارد.'] },
  { key: 'nacl5', name: 'سدیم کلراید هایپرتونیک', strength: '۵٪', mEqPerMl: 0.856, mgPerMl: 50, ampoule: '۱ mL ≈ ۰٫۸۵۶ mEq سدیم',
    warns: ['فقط با دستور پزشک و پایش دقیق سدیم؛ خطر دمیلینیزاسیون (ODS).'] },
];

const Meq: React.FC = () => {
  const [sel, setSel] = useState('kcl15');
  const [meq, setMeq] = useState('20');
  const [ml, setMl] = useState('10');
  const [mg, setMg] = useState('1000');
  const e = ELECTROLYTES.find(x => x.key === sel)!;

  const needMl = e.mEqPerMl > 0 ? num(meq) / e.mEqPerMl : 0;
  const gotMeq = num(ml) * e.mEqPerMl;
  const mgMl = e.mgPerMl > 0 ? num(mg) / e.mgPerMl : 0;
  const mgToMeq = mgMl * e.mEqPerMl;

  return (
    <div className="space-y-5">
      <Card>
        <p className="text-sm font-black text-[#062a2e]">محلول را انتخاب کنید (غلظت روی لیبل آمپول را چک کنید)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ELECTROLYTES.map(x => (
            <button key={x.key} onClick={() => setSel(x.key)}
              className={`p-3 rounded-2xl border-2 text-right cursor-pointer transition-all min-w-0 ${sel === x.key ? 'bg-[#096067] text-white border-[#c69d5b]' : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'}`}>
              <div className="text-sm font-black break-words">{x.name} <span className="text-[#ca7f3c]">{x.strength}</span></div>
              <div className={`text-[11px] font-bold mt-0.5 ${sel === x.key ? 'text-[#eedaa8]' : 'text-slate-500'}`} dir="ltr">1 mL = {x.mEqPerMl} mEq</div>
            </button>
          ))}
        </div>
        <Warn kind="info"><b>{e.name} {e.strength}:</b> {e.ampoule} • هر ۱ mL حاوی {fmt(e.mgPerMl)} mg ماده.</Warn>
      </Card>

      <Card>
        <p className="text-sm font-black text-[#096067]">الف) دستور بر حسب mEq است؛ چند سی‌سی بکشم؟</p>
        <Field label="دوز تجویزشده" value={meq} onChange={setMeq} unit="mEq" />
        <Result title="حجم مورد نیاز از آمپول" value={needMl > 0 ? fmt(needMl) : '—'} unit="mL" sub="از آمپول برداشته و در سرم/رقیق‌کنندهٔ دستور شده حل کنید." />
        <p className="text-sm font-black text-[#096067] pt-2">ب) چند سی‌سی دارو دارم؛ چند mEq است؟</p>
        <Field label="حجم دارو" value={ml} onChange={setMl} unit="mL" />
        <Result title="مقدار الکترولیت" value={gotMeq > 0 ? fmt(gotMeq) : '—'} unit="mEq" />
        <p className="text-sm font-black text-[#096067] pt-2">ج) دستور بر حسب گرم/میلی‌گرم ماده است (مثل ۴ گرم منیزیم)</p>
        <Field label="دوز تجویزشده" value={mg} onChange={setMg} unit="mg" hint="۱ گرم = ۱۰۰۰ mg" />
        <Result title="حجم مورد نیاز" value={mgMl > 0 ? fmt(mgMl) : '—'} unit="mL" sub={mgMl > 0 ? <>معادل {fmt(mgToMeq)} mEq</> : undefined} />
      </Card>

      <Warn kind="danger">
        <b>هشدارهای این دارو:</b>
        <ul className="list-disc pr-5 mt-1 space-y-1">{e.warns.map((w, i) => <li key={i}>{w}</li>)}</ul>
      </Warn>

      <Guide>
        <Formula title="فرمول محاسبه حجم بر حسب میلی‌اکی‌والان">حجم مورد نیاز (mL) = دوز تجویزی (mEq) ÷ غلظت دارو (mEq در هر mL)</Formula>

        <GuideExample
          title="مثال ۱: پتاسیم کلراید (KCl ۱۵٪)"
          description="دستور پزشک: ۴۰ mEq پتاسیم در سرم ۱۰۰۰ سی‌سی. آمپول KCl ۱۵٪ (هر ۱ mL حاوی ۲ mEq)"
          steps={[
            { label: 'غلظت پتاسیم', math: '1 mL', result: '2 mEq' },
            { label: 'حجم مورد نیاز', math: '40 mEq ÷ 2 mEq/mL', result: '20 mL' },
          ]}
          note="معادل ۲ آمپول ۱۰ سی‌سی. هشدار: هرگز و تحت هیچ شرایطی به‌صورت پوش یا مستقیم تزریق نشود!"
        />

        <GuideExample
          title="مثال ۲: مقایسه دوز ۵۰ mEq بیکربنات در ۳ غلظت مختلف"
          description="دستور پزشک: ۵۰ mEq بیکربنات سدیم وریدی"
          steps={[
            { label: 'بیکربنات ۸٫۴٪ (1 mEq/mL)', math: '50 mEq ÷ 1', result: '50 mL' },
            { label: 'بیکربنات ۷٫۵٪ (0.9 mEq/mL)', math: '50 mEq ÷ 0.9', result: '55.6 mL' },
            { label: 'بیکربنات ۴٫۲٪ (0.5 mEq/mL)', math: '50 mEq ÷ 0.5', result: '100 mL' },
          ]}
          note="همیشه غلظت درصد درج‌شده روی برچسب ویال بیکربنات را بررسی و انتخاب کنید."
        />

        <GuideExample
          title="مثال ۳: منیزیم سولفات ۵۰٪ بر حسب گرم"
          description="دستور پزشک: ۴ گرم منیزیم سولفات در ۱۰۰ سی‌سی سرم. آمپول ۵۰٪ (۵۰۰ mg/mL)"
          steps={[
            { label: 'تبدیل گرم به میلی‌گرم', math: '4 g × 1000', result: '4000 mg' },
            { label: 'حجم سرنگ از آمپول ۵۰٪', math: '4000 mg ÷ 500 mg/mL', result: '8 mL' },
          ]}
        />
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};

export default Meq;
