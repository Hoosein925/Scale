import React, { useState } from 'react';
import { Card, Field, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

const UNITS = [
  { value: 'g', label: 'گرم (g)' },
  { value: 'mg', label: 'میلی‌گرم (mg)' },
  { value: 'mcg', label: 'میکروگرم (mcg)' },
  { value: 'U', label: 'واحد (Unit)' },
];
const TO_MG: Record<string, number> = { g: 1000, mg: 1, mcg: 0.001 };

const BasicDose: React.FC = () => {
  const [dose, setDose] = useState('500');
  const [doseUnit, setDoseUnit] = useState('mg');
  const [strength, setStrength] = useState('1');
  const [strengthUnit, setStrengthUnit] = useState('g');
  const [vialMl, setVialMl] = useState('10');

  const d = num(dose), s = num(strength), v = num(vialMl);
  const famDose = doseUnit === 'U' ? 'U' : 'mass';
  const famStr = strengthUnit === 'U' ? 'U' : 'mass';
  const mismatch = famDose !== famStr;
  const dBase = famDose === 'U' ? d : d * TO_MG[doseUnit];
  const sBase = famStr === 'U' ? s : s * TO_MG[strengthUnit];
  const concPerMl = v > 0 ? sBase / v : 0;
  const draw = !mismatch && concPerMl > 0 ? dBase / concPerMl : 0;
  const ok = !mismatch && d > 0 && s > 0 && v > 0;
  const dosesPerVial = ok && dBase > 0 ? sBase / dBase : 0;

  return (
    <div className="space-y-5">
      <Card>
        <Field label="دوز تجویزشده توسط پزشک" value={dose} onChange={setDose}
          units={UNITS} unitValue={doseUnit} onUnitChange={setDoseUnit} hint="همان عددی که در دستور/کاردکس نوشته شده" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="مقدار دارو روی لیبل ویال/آمپول" value={strength} onChange={setStrength}
            units={UNITS} unitValue={strengthUnit} onUnitChange={setStrengthUnit} hint="مثلاً ۱ گرم یا ۵۰۰ mg" />
          <Field label="حجم کل ویال/آمپول (محلول نهایی)" value={vialMl} onChange={setVialMl} unit="mL"
            hint="اگر روی لیبل فقط غلظت (مثلاً ۲۵ mg/mL) نوشته شده، مقدار را ۲۵ و حجم را ۱ بگذارید" />
        </div>
      </Card>

      {mismatch && <Warn kind="danger">واحد دوز و واحد لیبل هم‌خانواده نیستند (مثلاً mg با «واحد»). واحدها را بررسی کنید؛ هرگز واحد (Unit) را با میلی‌گرم تبدیل نکنید.</Warn>}

      {ok ? (
        <>
          <Result title="حجم دارویی که باید بکشید" value={fmt(draw)} unit="mL"
            sub={<>غلظت دارو: <b>{fmt(concPerMl)} {famStr === 'U' ? 'واحد' : 'mg'}/mL</b> • از یک ویال حدود <b>{fmt(dosesPerVial, 1)}</b> دوز به دست می‌آید</>} />
          {draw > 0 && draw <= 1 && (
            <Warn kind="info">
              حجم کمتر از ۱ mL است؛ با سرنگ ۱ سی‌سی (تیوبرکولین) بکشید. روی سرنگ انسولین ۱۰۰ واحدی هر خط ≈ ۰٫۰۱ mL است، یعنی این حجم معادل <b>{fmt(draw * 100, 0)}</b> خط است (فقط معادل حجمی؛ انسولین را همیشه بر حسب «واحد» با سرنگ انسولین بکشید).
            </Warn>
          )}
          {draw > 10 && <Warn>حجم بالاتر از ۱۰ mL است؛ در صورت لزوم به چند ویال/سرنگ تقسیم کنید و روش تجویز و سرعت تزریق را بررسی کنید.</Warn>}
        </>
      ) : !mismatch ? <Warn kind="info">مقادیر را وارد کنید تا حجم محاسبه شود.</Warn> : null}

      <Guide>
        <Formula title="فرمول محاسبه حجم تزریق">حجم مورد نیاز (mL) = دوز تجویزی ÷ غلظت محلول (مقدار دارو ÷ حجم کل)</Formula>

        <GuideExample
          title="مثال ۱: ویال پودری یا آمپول میلی‌گرمی"
          description="دستور پزشک: ۵۰۰ mg سفازولین. ویال ۱ گرم (۱۰۰۰ mg) حل‌شده در ۱۰ mL آب مقطر."
          steps={[
            { label: 'غلظت ویال', math: '1000 mg ÷ 10 mL', result: '100 mg/mL' },
            { label: 'حجم سرنگ', math: '500 mg ÷ 100 mg/mL', result: '5 mL' },
          ]}
        />

        <GuideExample
          title="مثال ۲: هپارین (واحد دارویی / Unit)"
          description="دستور پزشک: ۵,۰۰۰ واحد هپارین زیرجلدی. ویال ۲۵,۰۰۰ واحد در ۵ mL."
          steps={[
            { label: 'غلظت ویال', math: '25,000 U ÷ 5 mL', result: '5,000 U/mL' },
            { label: 'حجم سرنگ', math: '5,000 U ÷ 5,000 U/mL', result: '1 mL' },
          ]}
          note="توجه: هرگز واحد (Unit) را به میلی‌گرم یا بالعکس تبدیل نکنید؛ محاسبه بر اساس واحد خالص است."
        />

        <p className="text-xs font-bold text-slate-600 leading-relaxed pr-1">
          برای پودرهای قابل‌حل: حجم کل پس از حل‌کردن (طبق بروشور کارخانه) را وارد کنید، نه فقط حجم آبی که اضافه کرده‌اید.
        </p>
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};

export default BasicDose;
