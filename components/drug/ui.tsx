import React from 'react';

/** تبدیل ارقام فارسی/عربی و جداکننده‌های اعشار به عدد استاندارد */
export const num = (s: string): number => {
  const t = (s || '')
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[٫,،]/g, '.')
    .replace(/[^0-9.]/g, '');
  const v = parseFloat(t);
  return Number.isFinite(v) ? v : 0;
};

/** نمایش عدد با دقت مناسب (بدون صفرهای اضافی) */
export const fmt = (v: number, max = 2): string => {
  if (!Number.isFinite(v)) return '—';
  const d = Math.abs(v) >= 100 ? 1 : Math.abs(v) >= 1 ? 2 : Math.abs(v) >= 0.1 ? 3 : 4;
  return String(parseFloat(v.toFixed(Math.min(d, Math.max(max, d)))));
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  units?: { value: string; label: string }[];
  unitValue?: string;
  onUnitChange?: (v: string) => void;
  hint?: string;
  placeholder?: string;
}

export const Field: React.FC<FieldProps> = ({ label, value, onChange, unit, units, unitValue, onUnitChange, hint, placeholder }) => (
  <div className="min-w-0">
    <label className="block text-sm font-black text-[#062a2e] mb-1.5 leading-snug">{label}</label>
    <div className="flex items-stretch gap-2 min-w-0">
      <input
        type="text"
        inputMode="decimal"
        dir="ltr"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 px-3 py-3 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-[#062a2e] text-lg font-black text-left focus:border-[#096067] focus:outline-none"
      />
      {unit && (
        <span dir="ltr" className="shrink-0 min-w-[3.4rem] px-3 flex items-center justify-center rounded-xl bg-[#ede6d8] border-2 border-[#d8cfbe] text-[#062a2e] font-black text-sm">
          {unit}
        </span>
      )}
      {units && (
        <select
          dir="ltr"
          value={unitValue}
          onChange={(e) => onUnitChange && onUnitChange(e.target.value)}
          className="shrink-0 max-w-[45%] px-2 rounded-xl bg-[#ede6d8] border-2 border-[#d8cfbe] text-[#062a2e] font-black text-sm focus:outline-none focus:border-[#096067]"
        >
          {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      )}
    </div>
    {hint && <p className="text-[11px] font-bold text-slate-500 mt-1 leading-relaxed">{hint}</p>}
  </div>
);

export const Pills: React.FC<{ items: { key: string; label: string }[]; active?: string; onPick: (k: string) => void; title?: string }> = ({ items, active, onPick, title }) => (
  <div className="space-y-2">
    {title && <p className="text-sm font-black text-[#062a2e]">{title}</p>}
    <div className="flex flex-wrap gap-2">
      {items.map(i => (
        <button key={i.key} onClick={() => onPick(i.key)}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-black border-2 cursor-pointer transition-all text-right ${active === i.key ? 'bg-[#096067] text-white border-[#c69d5b]' : 'bg-white text-[#062a2e] border-[#d8cfbe] hover:border-[#096067]'}`}>
          {i.label}
        </button>
      ))}
    </div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`premium-card p-4 sm:p-6 space-y-4 min-w-0 ${className}`}>{children}</div>
);

export const Result: React.FC<{ title: string; value: string; unit?: string; sub?: React.ReactNode; tone?: 'ok' | 'warn' | 'danger' }> = ({ title, value, unit, sub, tone = 'ok' }) => {
  const bg = tone === 'danger' ? 'from-rose-800 to-rose-950' : tone === 'warn' ? 'from-amber-700 to-amber-900' : 'from-[#092b36] to-[#04141a]';
  return (
    <div className={`rounded-3xl bg-gradient-to-br ${bg} text-white p-5 sm:p-6 shadow-lg min-w-0 space-y-2 text-center`}>
      <p className="text-xs sm:text-sm font-bold text-[#eedaa8]">{title}</p>
      <p className="font-black leading-tight break-words" dir="ltr">
        <span className="text-4xl sm:text-5xl tabular-nums">{value}</span>
        {unit && <span className="text-base sm:text-lg text-[#eedaa8] mr-2 ml-2">{unit}</span>}
      </p>
      {sub && <div className="text-xs sm:text-sm font-bold text-slate-100 leading-relaxed break-words">{sub}</div>}
    </div>
  );
};

export const Warn: React.FC<{ children: React.ReactNode; kind?: 'warn' | 'danger' | 'info' }> = ({ children, kind = 'warn' }) => {
  const st = kind === 'danger' ? 'bg-rose-50 border-rose-300 text-rose-900' : kind === 'info' ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-amber-50 border-amber-300 text-amber-900';
  return <div className={`p-3 sm:p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold leading-relaxed break-words ${st}`}>{children}</div>;
};

export const Guide: React.FC<{ title?: string; children: React.ReactNode }> = ({ title = '📘 راهنمای کوتاه و مثال', children }) => (
  <details className="rounded-2xl bg-[#096067]/8 border-2 border-[#096067]/25 p-3 sm:p-4 group">
    <summary className="cursor-pointer text-sm font-black text-[#062a2e] list-none flex items-center justify-between gap-2">
      <span>{title}</span><span className="text-[#096067] text-xs">نمایش/پنهان</span>
    </summary>
    <div className="mt-3 text-xs sm:text-sm font-bold text-[#1e293b] leading-loose space-y-2 break-words">{children}</div>
  </details>
);

export const MathSpan: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span dir="ltr" className={`inline-block font-mono font-bold text-[#062a2e] px-1.5 py-0.5 mx-0.5 bg-[#ede6d8]/70 rounded-md border border-[#d8cfbe] text-xs sm:text-sm ${className}`}>
    {children}
  </span>
);

export interface CalcStepItem {
  label: string;
  math: string;
  result: string;
}

export const GuideExample: React.FC<{
  title: string;
  description?: string;
  steps: CalcStepItem[];
  note?: string;
}> = ({ title, description, steps, note }) => (
  <div className="rounded-2xl bg-white border-2 border-[#c69d5b]/30 p-3.5 space-y-3 my-2.5 shadow-xs">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#ca7f3c] shrink-0" />
      <span className="text-xs sm:text-sm font-black text-[#062a2e]">{title}</span>
    </div>
    {description && (
      <p className="text-xs text-slate-700 font-bold leading-relaxed pr-3.5 break-words">{description}</p>
    )}
    <div className="space-y-2">
      {steps.map((s, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-[#fbf9f5] border border-[#ede6d8] rounded-xl p-2.5">
          <span className="text-xs font-black text-[#096067] shrink-0">{s.label}:</span>
          <div dir="ltr" className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#062a2e] font-black tracking-wide overflow-x-auto py-0.5">
            <span className="whitespace-nowrap">{s.math}</span>
            <span className="text-[#ca7f3c] font-black shrink-0">=</span>
            <span className="px-2 py-0.5 rounded-lg bg-[#096067] text-white font-black whitespace-nowrap shadow-xs">{s.result}</span>
          </div>
        </div>
      ))}
    </div>
    {note && (
      <p className="text-[11px] text-slate-500 font-bold leading-relaxed pr-3.5 border-t border-[#ede6d8] pt-2 break-words">{note}</p>
    )}
  </div>
);

export const Formula: React.FC<{ title?: string; children: React.ReactNode; ltr?: boolean }> = ({ title, children, ltr }) => (
  <div className="p-3 rounded-xl bg-white border border-[#c69d5b]/40 text-[#062a2e] shadow-xs space-y-1">
    {title && <p className="text-xs font-black text-[#096067] text-right">{title}:</p>}
    <div dir={ltr ? 'ltr' : 'rtl'} className={`text-xs sm:text-sm font-black leading-relaxed break-words ${ltr ? 'font-mono text-center tracking-wide' : 'text-center'}`}>
      {children}
    </div>
  </div>
);

export const PLEASE_CHECK =
  'همیشه نتیجه را با دستور پزشک، لیبل دارو و پروتکل بخش تطبیق دهید و در داروهای پرخطر محاسبه را با یک همکار دیگر دوباره بررسی کنید (Double check).';
