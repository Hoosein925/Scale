import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

const AnthropometricEstimation: React.FC<Props> = ({ onBack, onHome }) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(65);
  const [kneeHeight, setKneeHeight] = useState<number>(50);
  const [muac, setMuac] = useState<number>(28);
  const [calfCirc, setCalfCirc] = useState<number>(31);
  const [useCustomCalf, setUseCustomCalf] = useState<boolean>(false);
  const [skinfold, setSkinfold] = useState<number>(0);

  // Results state
  const [estHeight, setEstHeight] = useState<number | null>(null);
  const [estWeight, setEstWeight] = useState<number | null>(null);
  const [estBmi, setEstBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<{ label: string; color: string; icon: string } | null>(null);

  useEffect(() => {
    // 1. Calculate Estimated Height using Chumlea's formulas
    let calculatedHeight = 0;
    if (gender === 'male') {
      if (age >= 60) {
        calculatedHeight = 64.19 - (0.04 * age) + (2.02 * kneeHeight);
      } else {
        calculatedHeight = 71.85 + (1.88 * kneeHeight);
      }
    } else {
      if (age >= 60) {
        calculatedHeight = 84.88 - (0.24 * age) + (1.83 * kneeHeight);
      } else {
        calculatedHeight = 79.69 - (0.14 * age) + (1.86 * kneeHeight);
      }
    }

    // 2. Calculate Estimated Weight using Chumlea's formulas (without skinfold)
    const effectiveCalf = useCustomCalf ? calfCirc : 31;
    let calculatedWeight = 0;
    if (gender === 'male') {
      calculatedWeight = (0.98 * effectiveCalf) + (1.16 * kneeHeight) + (1.73 * muac) + (0.37 * skinfold) - 81.69;
    } else {
      calculatedWeight = (1.27 * effectiveCalf) + (0.87 * kneeHeight) + (0.98 * muac) + (0.40 * skinfold) - 62.35;
    }

    // Round values
    const finalHeight = parseFloat(calculatedHeight.toFixed(1));
    const finalWeight = parseFloat(calculatedWeight.toFixed(1));
    setEstHeight(finalHeight);
    setEstWeight(finalWeight);

    // 3. Calculate Estimated BMI
    if (finalHeight > 0 && finalWeight > 0) {
      const heightInMeters = finalHeight / 100;
      const bmiVal = parseFloat((finalWeight / (heightInMeters * heightInMeters)).toFixed(1));
      setEstBmi(bmiVal);

      // BMI Category
      if (bmiVal < 18.5) {
        setBmiCategory({ label: 'کمبود وزن (Underweight)', color: 'from-sky-500 to-sky-600 shadow-sky-500/25', icon: '📉' });
      } else if (bmiVal < 25) {
        setBmiCategory({ label: 'وزن طبیعی (Normal Weight)', color: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25', icon: '✅' });
      } else if (bmiVal < 30) {
        setBmiCategory({ label: 'اضافه وزن (Overweight)', color: 'from-amber-500 to-amber-600 shadow-amber-500/25', icon: '📈' });
      } else if (bmiVal < 35) {
        setBmiCategory({ label: 'چاقی درجه ۱ (Obesity Class I)', color: 'from-orange-500 to-orange-600 shadow-orange-500/25', icon: '🟠' });
      } else if (bmiVal < 40) {
        setBmiCategory({ label: 'چاقی درجه ۲ (Obesity Class II)', color: 'from-rose-600 to-rose-700 shadow-rose-600/25', icon: '🚨' });
      } else {
        setBmiCategory({ label: 'چاقی درجه ۳ (Obesity Class III)', color: 'from-red-700 to-red-850 shadow-red-700/25', icon: '🆘' });
      }
    }
  }, [gender, age, kneeHeight, muac, calfCirc, useCustomCalf, skinfold]);

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      
      <div className="premium-card p-10 space-y-10 border-[#c69d5b]/25 shadow-md">
        <div className="pb-8 border-b border-[#c69d5b]/15 text-center">
          <h3 className="text-3xl font-black text-[#062a2e]">تخمین قد و وزن بالینی (آنتروپومتری غیرمستقیم)</h3>
          <p className="text-[#096067] text-base font-bold mt-2">
            ویژه بیماران غیرهوشیار، بستری طولانی‌مدت، ناتوان یا سالخورده که امکان ایستادن روی ترازو را ندارند
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Inputs Section */}
          <div className="lg:col-span-6 space-y-8 bg-white/90 p-8 rounded-3xl border border-[#c69d5b]/25 shadow-sm">
            <h4 className="text-xl font-black text-[#062a2e] border-b border-[#c69d5b]/15 pb-4 flex items-center gap-3">
              <span className="text-2xl">📝</span> اطلاعات و پارامترهای بیمار
            </h4>

            {/* Gender Selection */}
            <div className="space-y-3">
              <label className="text-[#062a2e] text-sm font-bold block">جنسیت بیمار</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-4 rounded-2xl font-black text-base border-2 transition-all cursor-pointer ${gender === 'male' ? 'bg-[#096067] border-[#c69d5b] text-white shadow-md' : 'bg-white/90 border-[#c69d5b]/25 text-[#062a2e] hover:border-[#096067]'}`}
                >
                  👨 مرد (Male)
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-4 rounded-2xl font-black text-base border-2 transition-all cursor-pointer ${gender === 'female' ? 'bg-[#096067] border-[#c69d5b] text-white shadow-md' : 'bg-white/90 border-[#c69d5b]/25 text-[#062a2e] hover:border-[#096067]'}`}
                >
                  👩 زن (Female)
                </button>
              </div>
            </div>

            {/* Age Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#062a2e] text-sm font-bold">سن بیمار (سال)</label>
                <span className="text-[#096067] font-mono text-lg font-black">{age} سال</span>
              </div>
              <input
                type="range"
                min="18"
                max="100"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-[#096067]"
              />
            </div>

            {/* Knee Height Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#062a2e] text-sm font-bold">قد زانو - Knee Height (سانتی‌متر)</label>
                <span className="text-[#096067] font-mono text-lg font-black">{kneeHeight} cm</span>
              </div>
              <p className="text-xs text-[#475569]">اندازه‌گیری از روی کشکک زانو تا پاشنه پا در زاویه ۹۰ درجه</p>
              <input
                type="range"
                min="30"
                max="75"
                value={kneeHeight}
                onChange={(e) => setKneeHeight(Number(e.target.value))}
                className="w-full accent-[#096067]"
              />
            </div>

            {/* MUAC Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[#062a2e] text-sm font-bold">دور بازو - MUAC / MAC (سانتی‌متر)</label>
                <span className="text-[#ca7f3c] font-mono text-lg font-black">{muac} cm</span>
              </div>
              <p className="text-xs text-[#475569]">اندازه‌گیری دور وسط بازوی غیرغالب در وضعیت ریلکس</p>
              <input
                type="range"
                min="15"
                max="55"
                value={muac}
                onChange={(e) => setMuac(Number(e.target.value))}
                className="w-full accent-[#ca7f3c]"
              />
            </div>

            {/* Subscapular skinfold */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-[#062a2e]">چین پوستی زیر کتف - Subscapular Skinfold (میلی‌متر)</label>
                <span className="font-black text-[#ca7f3c]">{skinfold} mm</span>
              </div>
              <p className="text-xs font-bold text-[#475569]">اگر اندازه‌گیری نشده، صفر بماند؛ در این حالت وزن تخمینی ممکن است چند کیلوگرم کمتر از واقعیت باشد.</p>
              <input type="range" min="0" max="40" value={skinfold} onChange={(e) => setSkinfold(Number(e.target.value))} className="w-full" />
            </div>
            {/* Calf Circumference Selection */}
            <div className="space-y-4 border-t border-[#c69d5b]/15 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-[#062a2e] text-sm font-bold block">اندازه‌گیری دور ساق پا (Calf Circumference)</label>
                  <span className="text-xs text-[#475569] block mt-1">اندازه‌گیری در حداکثر پهنای ساق پا</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseCustomCalf(!useCustomCalf)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all border ${useCustomCalf ? 'bg-[#096067] border-[#c69d5b] text-white' : 'bg-white/90 border-[#c69d5b]/30 text-[#062a2e]'}`}
                >
                  {useCustomCalf ? 'تنظیم دستی فعال' : 'استفاده از پیش‌فرض (۳۱)'}
                </button>
              </div>

              {useCustomCalf && (
                <div className="space-y-2 animate-in">
                  <div className="flex justify-between items-center">
                    <label className="text-[#475569] text-xs font-bold">مقدار دور ساق پا</label>
                    <span className="text-[#096067] font-mono font-bold text-sm">{calfCirc} cm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={calfCirc}
                    onChange={(e) => setCalfCirc(Number(e.target.value))}
                    className="w-full accent-[#096067]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Real-time Estimates Displays */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-black text-[#062a2e] border-b border-[#c69d5b]/15 pb-4 flex items-center gap-3">
                <span className="text-2xl">📊</span> تخمین‌های محاسباتی آنتروپومتریک
              </h4>

              {/* Height Card */}
              <div className="bg-white/90 border border-[#c69d5b]/25 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#475569] text-xs font-bold uppercase tracking-wider block">قد تخمینی بیمار</span>
                    <span className="text-[#096067] text-3xl font-black mt-2 inline-block font-mono tabular-nums">
                      {estHeight} <span className="text-lg font-bold text-[#334155]">سانتی‌متر</span>
                    </span>
                  </div>
                  <div className="bg-[#096067]/10 text-[#096067] px-4 py-2 rounded-xl text-xs font-black border border-[#096067]/20">
                    فرمول Chumlea
                  </div>
                </div>
                <p className="text-[10px] text-[#55696d] mt-3 border-t border-[#c69d5b]/15 pt-2 font-mono">
                  Height = {gender === 'male' 
                    ? (age >= 60 ? `64.19 - (0.04 * ${age}) + (2.02 * ${kneeHeight})` : `71.85 + (1.88 * ${kneeHeight})`)
                    : (age >= 60 ? `84.88 - (0.24 * ${age}) + (1.83 * ${kneeHeight})` : `79.69 - (0.14 * ${age}) + (1.86 * ${kneeHeight})`)
                  }
                </p>
              </div>

              {/* Weight Card */}
              <div className="bg-white/90 border border-[#c69d5b]/25 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[#475569] text-xs font-bold uppercase tracking-wider block">وزن تخمینی بیمار</span>
                    <span className="text-[#ca7f3c] text-3xl font-black mt-2 inline-block font-mono tabular-nums">
                      {estWeight} <span className="text-lg font-bold text-[#334155]">کیلوگرم</span>
                    </span>
                  </div>
                  <div className="bg-[#ca7f3c]/10 text-[#ca7f3c] px-4 py-2 rounded-xl text-xs font-black border border-[#ca7f3c]/20">
                    فرمول Chumlea (با چین زیرکتفی)
                  </div>
                </div>
                <p className="text-[10px] text-[#55696d] mt-3 border-t border-[#c69d5b]/15 pt-2 font-mono">
                  Weight = {gender === 'male'
                    ? `(0.98 * ${useCustomCalf ? calfCirc : 31}) + (1.16 * ${kneeHeight}) + (1.73 * ${muac}) + (0.37 * ${skinfold}) - 81.69`
                    : `(1.27 * ${useCustomCalf ? calfCirc : 31}) + (0.87 * ${kneeHeight}) + (0.98 * ${muac}) + (0.40 * ${skinfold}) - 62.35`
                  }
                </p>
              </div>

              {/* BMI Card */}
              {estBmi !== null && bmiCategory && (
                <div className={`bg-gradient-to-br ${bmiCategory.color} rounded-3xl p-6 text-white shadow-md relative overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 text-9xl opacity-10">
                    {bmiCategory.icon}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-white/80 text-xs font-bold uppercase tracking-wider block">شاخص توده بدنی تخمینی (Estimated BMI)</span>
                      <span className="text-white text-4xl font-black mt-2 inline-block font-mono tabular-nums">
                        {estBmi}
                      </span>
                    </div>
                    <div className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-black border border-white/25">
                      تخمینی بالینی
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
                    <span className="text-xl">{bmiCategory.icon}</span>
                    <span className="font-black text-sm">{bmiCategory.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Informative Guidance */}
            <div className="bg-[#096067]/10 p-5 rounded-2xl border border-[#c69d5b]/30 text-xs leading-relaxed text-[#1a3338] font-medium">
              <strong className="text-[#096067] font-bold block mb-1">💡 راهنمای بالینی آنتروپومتری غیرمستقیم:</strong>
              اندازه‌گیری‌های آنتروپومتریک غیرمستقیم (نظیر قد زانو و دور بازو) بر اساس مقالات مرجع بالینی برای ارزیابی وضعیت تغذیه‌ای بیمارانی که در تخت‌های مراقبت ویژه بستری بوده یا توانایی ایستادن ندارند استفاده می‌شود و از روش‌های توصیه شده توسط سازمان بهداشت جهانی (WHO) و انجمن‌های تغذیه بالینی می‌باشد.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnthropometricEstimation;
