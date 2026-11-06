import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt, PLEASE_CHECK } from './ui';

const PRESETS = [
  { key: 'lido2', label: 'لیدوکائین ۲٪', p: '2' },
  { key: 'lido1', label: 'لیدوکائین ۱٪', p: '1' },
  { key: 'd50', label: 'دکستروز ۵۰٪', p: '50' },
  { key: 'd10', label: 'دکستروز ۱۰٪', p: '10' },
  { key: 'd5', label: 'دکستروز ۵٪', p: '5' },
  { key: 'cag', label: 'کلسیم گلوکونات ۱۰٪', p: '10' },
  { key: 'man', label: 'مانیتول ۲۰٪', p: '20' },
  { key: 'mg20', label: 'منیزیم سولفات ۲۰٪', p: '20' },
  { key: 'mg50', label: 'منیزیم سولفات ۵۰٪', p: '50' },
];

const Percent: React.FC = () => {
  const [kind, setKind] = useState<'percent' | 'ratio'>('percent');
  const [p, setP] = useState('2');
  const [ratio, setRatio] = useState('1000');
  const [needMg, setNeedMg] = useState('100');
  const [givenMl, setGivenMl] = useState('10');

  // ۱٪ = ۱ گرم در ۱۰۰ mL = ۱۰ mg/mL ؛ نسبت ۱:N = ۱ گرم در N mL = ۱۰۰۰/N mg/mL
  const mgPerMl = kind === 'percent' ? num(p) * 10 : num(ratio) > 0 ? 1000 / num(ratio) : 0;
  const needMl = mgPerMl > 0 ? num(needMg) / mgPerMl : 0;
  const givenMg = num(givenMl) * mgPerMl;

  return (
    <div className="space-y-5">
      <Card>
        <Pills title="داروهای درصدی رایج (برای پر کردن سریع)" onPick={(k) => { const x = PRESETS.find(i => i.key === k)!; setKind('percent'); setP(x.p); }}
          items={PRESETS.map(x => ({ key: x.key, label: x.label }))} />
        <Pills active={kind} onPick={(k) => setKind(k as 'percent' | 'ratio')} items={[
          { key: 'percent', label: 'غلظت به‌صورت درصد (٪)' },
          { key: 'ratio', label: 'غلظت به‌صورت نسبت (مثل ۱:۱۰۰۰)' },
        ]} />
        {kind === 'percent'
          ? <Field label="درصد دارو روی لیبل" value={p} onChange={setP} unit="٪" />
          : <Field label="نسبت ۱ به …" value={ratio} onChange={setRatio} unit="1 : N" hint="اپی‌نفرین ۱:۱۰۰۰ → عدد ۱۰۰۰ و ۱:۱۰۰۰۰ → عدد ۱۰۰۰۰" />}
        <Warn kind="info">
          {mgPerMl > 0
            ? <>این محلول معادل <b>{fmt(mgPerMl)} mg</b> دارو در هر ۱ mL است ({fmt(mgPerMl / 1000, 4)} گرم در mL).</>
            : 'غلظت را وارد کنید.'}
        </Warn>
      </Card>

      <Card>
        <p className="text-sm font-black text-[#096067]">الف) پزشک دوز را بر حسب میلی‌گرم نوشته؛ چند سی‌سی بکشم؟</p>
        <Field label="دوز تجویزشده" value={needMg} onChange={setNeedMg} unit="mg" hint="اگر دستور به گرم است، ضرب در ۱۰۰۰ کنید (۱ g = ۱۰۰۰ mg)" />
        <Result title="حجم مورد نیاز" value={needMl > 0 ? fmt(needMl) : '—'} unit="mL" />
        <p className="text-sm font-black text-[#096067] pt-2">ب) چند سی‌سی تزریق شده؛ چه مقدار دارو گرفته است؟</p>
        <Field label="حجم تزریق‌شده" value={givenMl} onChange={setGivenMl} unit="mL" />
        <Result title="مقدار داروی خالص" value={givenMg > 0 ? fmt(givenMg) : '—'} unit="mg"
          sub={givenMg > 0 ? <>معادل {fmt(givenMg / 1000, 3)} گرم</> : undefined} />
      </Card>

      <Guide>
        <Formula title="قانون طلایی داروهای درصدی">هر ۱ درصد غلظت = ۱۰ میلی‌گرم ماده در هر ۱ سی‌سی (1% = 10 mg/mL)</Formula>
        <Formula title="فرمول حجم تجویزی">حجم مورد نیاز (mL) = دوز تجویزی (mg) ÷ (درصد روی لیبل × ۱۰)</Formula>

        <GuideExample
          title="مثال ۱: آمپول لیدوکائین ۲٪"
          description="دستور پزشک: ۱۰۰ mg لیدوکائین وریدی"
          steps={[
            { label: 'غلظت لیدوکائین ۲٪', math: '2 × 10', result: '20 mg/mL' },
            { label: 'حجم سرنگ', math: '100 mg ÷ 20 mg/mL', result: '5 mL' },
          ]}
        />

        <GuideExample
          title="مثال ۲: ویال دکستروز ۵۰٪"
          description="دستور پزشک: تزریق ۲۵ گرم دکستروز هایپرتونیک (۲۵,۰۰۰ mg) در هیپوگلیسمی شدید"
          steps={[
            { label: 'غلظت دکستروز ۵۰٪', math: '50 × 10', result: '500 mg/mL' },
            { label: 'حجم ویال ۵۰٪', math: '25,000 mg ÷ 500 mg/mL', result: '50 mL' },
          ]}
        />

        <GuideExample
          title="مثال ۳: داروهای نسبتی (مانند اپی‌نفرین)"
          description="نسبت یعنی ۱ گرم داروی خالص در حجم مشخص"
          steps={[
            { label: 'اپی‌نفرین ۱:۱۰۰۰ (عضلانی)', math: '1000 mg ÷ 1000 mL', result: '1 mg/mL' },
            { label: 'اپی‌نفرین ۱:۱۰۰۰۰ (احیا/وریدی)', math: '1000 mg ÷ 10,000 mL', result: '0.1 mg/mL' },
          ]}
          note="درصد در داروها یعنی مقدار گرم ماده در ۱۰۰ میلی‌لیتر محلول نهایی."
        />
      </Guide>
      <Warn>{PLEASE_CHECK}</Warn>
    </div>
  );
};

export default Percent;
