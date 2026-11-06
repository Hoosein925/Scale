import React, { useState } from 'react';
import { Card, Field, Pills, Result, Warn, Guide, Formula, GuideExample, num, fmt } from './ui';

const SETS = [
  { key: '10', label: '۱۰ قطره/mL' },
  { key: '15', label: '۱۵ قطره/mL' },
  { key: '20', label: '۲۰ قطره/mL' },
  { key: '60', label: '۶۰ قطره/mL (میکروست)' },
];

const FlowRate: React.FC = () => {
  const [mode, setMode] = useState<'rate' | 'time'>('rate');
  const [vol, setVol] = useState('500');
  const [hours, setHours] = useState('8');
  const [mins, setMins] = useState('0');
  const [mlhr, setMlhr] = useState('125');
  const [set, setSet] = useState('15');

  const drop = num(set);
  const v = num(vol);
  const totalMin = num(hours) * 60 + num(mins);

  let mlPerHr = 0, gttPerMin = 0, durH = 0, durM = 0;
  if (mode === 'rate') {
    mlPerHr = totalMin > 0 ? (v / totalMin) * 60 : 0;
    gttPerMin = totalMin > 0 ? (v * drop) / totalMin : 0;
  } else {
    mlPerHr = num(mlhr);
    gttPerMin = (mlPerHr * drop) / 60;
    const tot = mlPerHr > 0 ? (v / mlPerHr) * 60 : 0;
    durH = Math.floor(tot / 60); durM = Math.round(tot - durH * 60);
  }
  const ok = mode === 'rate' ? totalMin > 0 && v > 0 : num(mlhr) > 0 && v > 0;

  return (
    <div className="space-y-5">
      <Card>
        <Pills active={mode} onPick={(k) => setMode(k as 'rate' | 'time')} items={[
          { key: 'rate', label: '⏱️ مدت زمان را می‌دانم → سرعت را بده' },
          { key: 'time', label: '💧 سرعت (mL/hr) را می‌دانم → مدت را بده' },
        ]} />
        <Field label="حجم سرم یا دارو" value={vol} onChange={setVol} unit="mL" hint="مثلاً یک سرم ۵۰۰ سی‌سی" />
        {mode === 'rate' ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="مدت: ساعت" value={hours} onChange={setHours} unit="ساعت" />
            <Field label="مدت: دقیقه" value={mins} onChange={setMins} unit="دقیقه" />
          </div>
        ) : (
          <Field label="سرعت تجویز‌شده / تنظیم پمپ" value={mlhr} onChange={setMlhr} unit="mL/hr" />
        )}
        <Pills title="نوع ست سرم (روی بستهٔ ست بخوانید: «قطره/mL»)" active={set} onPick={setSet} items={SETS} />
      </Card>

      {ok ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Result title="سرعت پمپ / فلومتر" value={fmt(mlPerHr)} unit="mL/hr" tone="ok"
            sub={mode === 'time' ? `سرم تمام می‌شود: ${durH} ساعت و ${durM} دقیقه دیگر` : 'برای تنظیم پمپ انفوزیون'} />
          <Result title="تنظیم دستی ست سرم" value={fmt(gttPerMin, 1)} unit="قطره/دقیقه"
            sub={<>یعنی هر ۱۵ ثانیه حدود <b>{fmt(gttPerMin / 4, 1)}</b> قطره (یک قطره هر <b>{gttPerMin > 0 ? fmt(60 / gttPerMin, 1) : '—'}</b> ثانیه)</>} />
        </div>
      ) : (
        <Warn kind="info">مقادیر را وارد کنید تا نتیجه نمایش داده شود.</Warn>
      )}

      {ok && gttPerMin > 120 && <Warn>سرعت بالاست؛ در سرعت‌های بالا برای دقت بیشتر از پمپ انفوزیون استفاده کنید.</Warn>}
      {ok && mlPerHr > 0 && mlPerHr < 5 && <Warn kind="danger">سرعت بسیار کم است؛ برای سرعت‌های خیلی کم (مثلاً کودکان و داروهای حساس) از پمپ سرنگ یا پمپ انفوزیون استفاده کنید، نه قطره‌شماری.</Warn>}

      <Guide>
        <Formula title="فرمول سرعت پمپ">سرعت (mL/hr) = حجم کل (mL) ÷ زمان (ساعت)</Formula>
        <Formula title="فرمول قطره در دقیقه">قطره در دقیقه = [حجم (mL) × فاکتور قطره] ÷ زمان (دقیقه)</Formula>

        <GuideExample
          title="مثال: سرم ۵۰۰ سی‌سی طی ۸ ساعت با ست ۱۵ قطره‌ای"
          description="حجم = ۵۰۰ mL، زمان = ۸ ساعت (۴۸۰ دقیقه)، فاکتور ست = ۱۵ قطره/mL"
          steps={[
            { label: 'سرعت پمپ (mL/hr)', math: '500 ÷ 8', result: '62.5 mL/hr' },
            { label: 'قطره در دقیقه (gtt/min)', math: '(500 × 15) ÷ 480', result: '15.6 gtt/min' },
            { label: 'شمارش در ۱۵ ثانیه', math: '15.6 ÷ 4', result: '≈ 4 قطره' },
          ]}
          note="نکته: در میکروست (۶۰ قطره/mL) تعداد قطره در دقیقه دقیقاً برابر با mL/hr است."
        />
        <p className="text-xs font-bold text-slate-600 leading-relaxed pr-1">
          قطره‌شماری دستی را پس از تنظیم غلتک، با نگاه به ساعت (طی ۱۵ یا ۶۰ ثانیه) کنترل و تأیید کنید.
        </p>
      </Guide>
    </div>
  );
};

export default FlowRate;
