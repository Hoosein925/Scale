
import React, { useState } from 'react';
import { PediatricAgeGroup, PainSeverity, AssessmentResult, FLACCScores } from '../types';

interface Props {
  ageGroup: PediatricAgeGroup;
  onAssess: (result: AssessmentResult) => void;
}

const PediatricAssessment: React.FC<Props> = ({ ageGroup, onAssess }) => {
  const [flacc, setFlacc] = useState<FLACCScores>({ face: 0, legs: 0, activity: 0, cry: 0, consolability: 0 });
  const [selectedScore, setSelectedScore] = useState<number>(0);

  const handleFlaccChange = (cat: keyof FLACCScores, val: number) => {
    const newScores = { ...flacc, [cat]: val };
    setFlacc(newScores);
    
    // Fix: Explicitly cast to number[] to resolve 'unknown' type errors during reduction and comparison
    const total = (Object.values(newScores) as number[]).reduce((a, b) => a + b, 0);
    
    let severity = PainSeverity.NONE;
    if (total > 0 && total <= 3) severity = PainSeverity.MILD;
    else if (total <= 6) severity = PainSeverity.MODERATE;
    else if (total >= 7) severity = PainSeverity.SEVERE;

    onAssess({ score: total, severity, toolUsed: 'FLACC', timestamp: new Date() });
  };

  const handleSimpleScore = (val: number, tool: 'WONG_BAKER' | 'NRS') => {
    setSelectedScore(val);
    let severity = PainSeverity.NONE;
    if (val > 0 && val <= 3) severity = PainSeverity.MILD;
    else if (val <= 6) severity = PainSeverity.MODERATE;
    else if (val >= 7) severity = PainSeverity.SEVERE;

    onAssess({ score: val, severity, toolUsed: tool, timestamp: new Date() });
  };

  if (ageGroup === PediatricAgeGroup.INFANT_TODDLER) {
    return (
      <div className="premium-card p-10 space-y-12 border-indigo-500/20">
        <div className="text-right border-b border-white/5 pb-6">
          <h3 className="text-3xl font-black text-white">مقیاس FLACC (۱ ماه تا ۴ سال)</h3>
          <p className="text-indigo-400 text-sm font-bold mt-2 italic">ارزیابی رفتاری بر اساس مشاهده پرستار</p>
        </div>
        <div className="grid gap-10">
          <FlaccRow title="چهره (Face)" current={flacc.face} options={["آرام (۰)", "اخم گهگاه/بی‌علاقگی (۱)", "لرزش چانه/فک فشرده (۲)"]} onSelect={(v) => handleFlaccChange('face', v)} />
          <FlaccRow title="پاها (Legs)" current={flacc.legs} options={["طبیعی (۰)", "ناآرام/سفت (۱)", "لگد زدن/کشیده شده (۲)"]} onSelect={(v) => handleFlaccChange('legs', v)} />
          <FlaccRow title="فعالیت (Activity)" current={flacc.activity} options={["حرکت آرام (۰)", "پیچ و تاب/سفتی (۱)", "حرکات سریع/تکان شدید (۲)"]} onSelect={(v) => handleFlaccChange('activity', v)} />
          <FlaccRow title="گریه (Cry)" current={flacc.cry} options={["بدون گریه (۰)", "ناله/شکایت گهگاه (۱)", "گریه مداوم/جیغ (۲)"]} onSelect={(v) => handleFlaccChange('cry', v)} />
          <FlaccRow title="تسلی‌پذیری (Consolability)" current={flacc.consolability} options={["آرام (۰)", "با لمس آرام می‌شود (۱)", "دلداری دادن دشوار است (۲)"]} onSelect={(v) => handleFlaccChange('consolability', v)} />
        </div>
      </div>
    );
  }

  if (ageGroup === PediatricAgeGroup.PRE_SCHOOL) {
    return (
      <div className="premium-card p-10 space-y-12">
        <div className="text-right border-b border-white/5 pb-6">
          <h3 className="text-3xl font-black text-white">مقیاس Wong-Baker (۳ تا ۷ سال)</h3>
          <p className="text-indigo-400 text-sm font-bold mt-2 italic">از کودک بخواهید چهره‌ای که مشابه حال اوست را انتخاب کند</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[0, 2, 4, 6, 8, 10].map((v, i) => (
            <button key={v} onClick={() => handleSimpleScore(v, 'WONG_BAKER')} className={`p-6 rounded-3xl border-2 transition-all ${selectedScore === v ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-xl' : 'bg-white/5 border-white/5 grayscale opacity-50'}`}>
              <div className="text-5xl mb-4">{["😊", "😐", "😟", "😣", "😭", "😫"][i]}</div>
              <div className="text-lg font-black text-white">{v}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // اضافه کردن بخش NRS و CHIPPS در صورت نیاز به توسعه بیشتر مشابه FLACC
  return (
    <div className="premium-card p-10 text-center">
      <h3 className="text-2xl font-black text-white mb-4">مقیاس انتخابی در حال توسعه است</h3>
      <p className="text-slate-400">لطفاً از ابزار FLACC یا Wong-Baker برای دمو استفاده کنید.</p>
    </div>
  );
};

const FlaccRow = ({ title, options, current, onSelect }: any) => (
  <div className="space-y-4">
    <h4 className="text-lg font-black text-slate-200">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((opt: string, i: number) => (
        <button key={i} onClick={() => onSelect(i)} className={`p-4 rounded-2xl border-2 text-right transition-all ${current === i ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}>
          <span className="text-sm font-bold">{opt}</span>
        </button>
      ))}
    </div>
  </div>
);

export default PediatricAssessment;
