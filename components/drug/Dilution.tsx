import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

const PRESETS = [
  { key: 'bic', label: 'بیکربنات ۸٫۴٪ → ۴٫۲٪ (نوزاد)', c1: '8.4', c2: '4.2', v2: '20', u: '٪' },
  { key: 'd50', label: 'دکستروز ۵۰٪ → ۲۵٪', c1: '50', c2: '25', v2: '20', u: '٪' },
  { key: 'd10', label: 'دکستروز ۵۰٪ → ۱۰٪', c1: '50', c2: '10', v2: '100', u: '٪' },
  { key: 'nacl', label: 'NaCl ۳٪ → ۰٫۹٪', c1: '3', c2: '0.9', v2: '100', u: '٪' },
];

const Dilution: React.FC = () => {
  const [c1, setC1] = useState('8.4');
  const [c2, setC2] = useState('4.2');
  const [v2, setV2] = useState('20');
  const [u, setU] = useState('٪');

  const C1 = num(c1), C2 = num(c2), V2 = num(v2);
  const v1 = C1 > 0 ? (C2 * V2) / C1 : 0;
  const diluent = V2 - v1;
  const ok = C1 > 0 && C2 > 0 && V2 > 0 && C2 < C1;

  return (
    <div className="space-y-5">
      <Card>
        <Pills title="نمونه‌های رایج" onPick={(k) => { const p = PRESETS.find(x => x.key === k)!; setC1(p.c1); setC2(p.c2); setV2(p.v2); setU(p.u); }}
          items={PRESETS.map(p => ({ key: p.key, label: p.label }))} />
        <Field label="غلظت محلول غلیظ موجود (C1)" value={c1} onChange={setC1} unit={u} hint="هر واحدی باشد (٪، mg/mL، mEq/mL، …)؛ فقط واحد C1 و C2 یکی باشد" />
        <Field label="غلظت مورد نیاز (C2)" value={c2} onChange={setC2} unit={u} />
        <Field label="حجم نهایی مورد نیاز (V2)" value={v2} onChange={setV2} unit="mL" />
      </Card>

      {C2 >= C1 && C1 > 0 && C2 > 0 && <Warn kind="danger">غلظت مورد نیاز باید کمتر از غلظت محلول موجود باشد؛ رقیق‌سازی فقط غلظت را کم می‌کند.</Warn>}

      {ok ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Result title="حجم از محلول غلیظ" value={fmt(v1)} unit="mL" />
          <Result title="حجم رقیق‌کننده (آب مقطر/سالین/دکستروز طبق دستور)" value={fmt(diluent)} unit="mL"
            sub={<>نسبت اختلاط محلول : رقیق‌کننده = <b>{fmt(v1)} : {fmt(diluent)}</b></>} />
        </div>
      ) : null}

      <Guide>
        <Formula title="معادله پایستگی رقیق‌سازی محلول‌ها" ltr>C1 × V1 = C2 × V2</Formula>
        <Formula title="محاسبه حجم داروی غلیظ اولیه">حجم از داروی غلیظ (V1) = [غلظت نهایی (C2) × حجم نهایی (V2)] ÷ غلظت داروی غلیظ (C1)</Formula>

        <GuideExample
          title="مثال: تهیه ۲۰ سی‌سی بیکربنات ۴٫۲٪ از ویال غلیظ ۸٫۴٪ (نوزادان)"
          description="غلظت موجود (C1) = ۸٫۴٪ ، غلظت دلخواه (C2) = ۴٫۲٪ ، حجم نهایی (V2) = ۲۰ mL"
          steps={[
            { label: 'حجم بیکربنات ۸٫۴٪ (V1)', math: '(4.2 × 20) ÷ 8.4', result: '10 mL' },
            { label: 'حجم آب مقطر رقیق‌کننده', math: '20 mL - 10 mL', result: '10 mL' },
          ]}
          note="نسبت اختلاط ۱:۱ (۱۰ سی‌سی بیکربنات ۸٫۴٪ + ۱۰ سی‌سی آب مقطر استریل) برای نوزادان NICU طبق پروتکل بخش."
        />
        <p className="text-xs font-bold text-slate-600 leading-relaxed pr-1">
          رقیق‌کنندهٔ مناسب (آب مقطر تزریقی، نرمال‌سالین یا دکستروز ۵٪) را بر اساس بروشور دارو انتخاب کنید تا رسوب یا ناسازگاری ایجاد نشود.
        </p>
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};

export default Dilution;
