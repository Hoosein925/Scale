
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const BMICalculator: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);
  const [bmi, setBmi] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      const roundedBmi = parseFloat(calculatedBmi.toFixed(1));
      setBmi(roundedBmi);

      let interpretation = "", color = "", icon = "";
      if (roundedBmi < 18.5) {
        interpretation = "کمبود وزن (Underweight)";
        color = "bg-sky-600";
        icon = "📉";
      } else if (roundedBmi < 25) {
        interpretation = "وزن طبیعی (Normal Weight)";
        color = "bg-emerald-600";
        icon = "✅";
      } else if (roundedBmi < 30) {
        interpretation = "اضافه وزن (Overweight)";
        color = "bg-amber-500";
        icon = "📈";
      } else if (roundedBmi < 35) {
        interpretation = "چاقی درجه ۱ (Obesity Class I)";
        color = "bg-orange-600";
        icon = "🟠";
      } else if (roundedBmi < 40) {
        interpretation = "چاقی درجه ۲ (Obesity Class II)";
        color = "bg-rose-700";
        icon = "🚨";
      } else {
        interpretation = "چاقی درجه ۳ (Obesity Class III)";
        color = "bg-red-800";
        icon = "🆘";
      }
      setResult({ interpretation, color, icon });
    } else {
      setBmi(null);
      setResult(null);
    }
  }, [height, weight]);

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-12 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">محاسبه‌گر شاخص توده بدنی (BMI)</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">ابزار سریع برای ارزیابی وضعیت وزنی</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-xl font-black text-slate-100 block text-center">قد (سانتی‌متر)</label>
            <div className="relative group">
               <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="relative text-5xl font-black text-white text-center tabular-nums">{height}</div>
            </div>
            <input 
              type="range" 
              min="100" 
              max="220" 
              value={height} 
              onChange={(e) => setHeight(Number(e.target.value))} 
              className="w-full"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xl font-black text-slate-100 block text-center">وزن (کیلوگرم)</label>
             <div className="relative group">
               <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
              <div className="relative text-5xl font-black text-white text-center tabular-nums">{weight}</div>
            </div>
            <input 
              type="range" 
              min="30" 
              max="200" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))} 
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      {result && bmi !== null && <AssessmentResultDisplay title="نتیجه محاسبه BMI" toolUsed="BMI Calculator" score={bmi} interpretation={result.interpretation} color={result.color} icon={result.icon} />}
    </div>
  );
};

export default BMICalculator;
