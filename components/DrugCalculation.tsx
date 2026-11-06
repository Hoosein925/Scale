import React, { useState } from 'react';
import ModuleHeader from './common/ModuleHeader';
import FlowRate from './drug/FlowRate';
import BasicDose from './drug/BasicDose';
import Infusion from './drug/Infusion';
import Percent from './drug/Percent';
import Meq from './drug/Meq';
import Dilution from './drug/Dilution';
import Safety from './drug/Safety';
import { PediatricDose, PediatricFluid } from './drug/Pediatric';

interface Props { onBack: () => void; onHome: () => void; }

type ToolKey = 'flow' | 'dose' | 'infusion' | 'percent' | 'meq' | 'peddose' | 'pedfluid' | 'dilution' | 'safety';

const TOOLS: { key: ToolKey; title: string; desc: string; icon: string; bg: string; border: string }[] = [
  { key: 'flow', title: 'قطره و سرعت سرم', desc: 'قطره در دقیقه، mL/hr و مدت اتمام سرم', icon: '💧', bg: 'from-sky-100 to-sky-50', border: 'border-sky-300' },
  { key: 'dose', title: 'دوز دارو از روی ویال', desc: 'چند سی‌سی بکشم؟ (mg، g، واحد)', icon: '💉', bg: 'from-blue-100 to-blue-50', border: 'border-blue-300' },
  { key: 'infusion', title: 'انفوزیون و پمپ', desc: 'دوپامین، هپارین، انسولین و… دوز ↔ سرعت', icon: '🫀', bg: 'from-purple-100 to-purple-50', border: 'border-purple-300' },
  { key: 'percent', title: 'داروهای درصدی', desc: 'لیدوکائین، دکستروز، منیزیم، نسبت ۱:۱۰۰۰', icon: '🧪', bg: 'from-green-100 to-green-50', border: 'border-green-300' },
  { key: 'meq', title: 'الکترولیت‌ها (mEq)', desc: 'پتاسیم، بیکربنات ۴٫۲/۷٫۵/۸٫۴٪، کلسیم، منیزیم', icon: '⚡', bg: 'from-orange-100 to-orange-50', border: 'border-orange-300' },
  { key: 'peddose', title: 'دوز وزنی اطفال', desc: 'mg/kg، شربت، هشدار سقف روزانه', icon: '👶', bg: 'from-pink-100 to-pink-50', border: 'border-pink-300' },
  { key: 'pedfluid', title: 'مایع نگهدارنده کودک', desc: 'فرمول هولیدی-سگار (۴-۲-۱)', icon: '🍼', bg: 'from-teal-100 to-teal-50', border: 'border-teal-300' },
  { key: 'dilution', title: 'رقیق‌سازی (تغییر غلظت)', desc: 'C1×V1 = C2×V2، مثل بیکربنات ۸٫۴ → ۴٫۲٪', icon: '🔄', bg: 'from-yellow-100 to-yellow-50', border: 'border-yellow-300' },
  { key: 'safety', title: 'ایمنی دارویی', desc: '۷ اصل دارودهی و داروهای پرخطر', icon: '🛡️', bg: 'from-rose-100 to-rose-50', border: 'border-rose-300' },
];

const DrugCalculation: React.FC<Props> = ({ onBack, onHome }) => {
  const [tool, setTool] = useState<ToolKey | null>(null);
  const cur = TOOLS.find(t => t.key === tool) || null;

  const render = () => {
    switch (tool) {
      case 'flow': return <FlowRate />;
      case 'dose': return <BasicDose />;
      case 'infusion': return <Infusion />;
      case 'percent': return <Percent />;
      case 'meq': return <Meq />;
      case 'peddose': return <PediatricDose />;
      case 'pedfluid': return <PediatricFluid />;
      case 'dilution': return <Dilution />;
      case 'safety': return <Safety />;
      default: return null;
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0">
      <ModuleHeader onBack={() => (tool ? setTool(null) : onBack())} onHome={onHome} />

      {!cur ? (
        <>
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#062a2e]">محاسبات دارویی</h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">یک ابزار را انتخاب کنید؛ هر صفحه راهنمای کوتاه و مثال دارد.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {TOOLS.map(t => (
              <button key={t.key} onClick={() => { setTool(t.key); window.scrollTo({ top: 0, left: 0 }); }}
                className={`bg-gradient-to-b ${t.bg} border-2 ${t.border} rounded-3xl p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-w-0`}>
                <span className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/90 shadow-inner flex items-center justify-center text-3xl sm:text-5xl">{t.icon}</span>
                <span className="text-sm sm:text-lg font-black text-[#062a2e] leading-snug break-words">{t.title}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-600 leading-relaxed break-words">{t.desc}</span>
              </button>
            ))}
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
            ⚠️ این ابزارها فقط کمک‌محاسبه‌اند. نتیجه را با دستور پزشک، لیبل دارو و پروتکل بخش تطبیق دهید و در داروهای پرخطر کنترل دوبل انجام دهید.
          </div>
        </>
      ) : (
        <>
          <div className={`bg-gradient-to-b ${cur.bg} border-2 ${cur.border} rounded-3xl p-4 flex items-center gap-3`}>
            <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-3xl shrink-0">{cur.icon}</span>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-black text-[#062a2e] break-words">{cur.title}</h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-600 break-words">{cur.desc}</p>
            </div>
          </div>
          {render()}
        </>
      )}
    </div>
  );
};

export default DrugCalculation;
