
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const getBmiRecommendations = (bmi: number): string[] => {
  if (bmi < 18.5) { // کمبود وزن
    return [
      "توصیه تغذیه‌ای: افزایش تعداد وعده‌های غذایی به ۵ تا ۶ وعده کوچک و مغذی در روز. مصرف مواد غذایی پرکالری و غنی از پروتئین مانند آجیل، آووکادو، لبنیات پرچرب و روغن‌های گیاهی سالم را در برنامه خود بگنجانید.",
      "توصیه پرستاری: انجام تمرینات قدرتی برای ساخت توده عضلانی (نه فقط چربی). با پزشک جهت بررسی علل زمینه‌ای احتمالی کاهش وزن مشورت کنید. مشاوره با متخصص تغذیه برای دریافت یک برنامه غذایی ایمن و موثر ضروری است.",
    ];
  } else if (bmi < 25) { // وزن طبیعی
    return [
      "توصیه تغذیه‌ای: شما در محدوده وزن سالم قرار دارید. برای حفظ این وضعیت، یک رژیم غذایی متعادل شامل تمام گروه‌های غذایی (میوه، سبزی، پروتئین کم‌چرب، غلات کامل) را ادامه دهید و مصرف غذاهای فرآوری‌شده را محدود کنید.",
      "توصیه پرستاری: انجام حداقل ۱۵۰ دقیقه فعالیت بدنی با شدت متوسط در هفته (مانند پیاده‌روی سریع) برای حفظ سلامتی قلب و عروق و تناسب اندام توصیه می‌شود. وزن خود را به صورت دوره‌ای پایش کنید.",
    ];
  } else if (bmi < 30) { // اضافه وزن
    return [
      "توصیه تغذیه‌ای: با کنترل حجم وعده‌های غذایی و کاهش مصرف غذاهای پرچرب و شیرین، کالری دریافتی روزانه را کاهش دهید. مصرف فیبر (سبزیجات، میوه‌ها، حبوبات) را برای ایجاد حس سیری طولانی‌تر افزایش دهید.",
      "توصیه پرستاری: فعالیت بدنی خود را (ترکیبی از هوازی و قدرتی) به حداقل ۲۰۰-۲۵۰ دقیقه در هفته افزایش دهید. تعیین اهداف واقع‌بینانه برای کاهش وزن (مثلاً ۰.۵ تا ۱ کیلوگرم در هفته) به موفقیت شما کمک می‌کند.",
    ];
  } else if (bmi < 35) { // چاقی درجه ۱
    return [
      "توصیه تغذیه‌ای: پیروی از یک برنامه غذایی ساختاریافته و کم‌کالری تحت نظر متخصص تغذیه ضروری است. فست‌فود، نوشیدنی‌های شیرین و غذاهای سرخ‌شده را به طور کامل حذف کنید.",
      "توصیه پرستاری: ریسک ابتلا به بیماری‌هایی مانند فشار خون و دیابت نوع ۲ در شما افزایش یافته است. بررسی منظم این موارد توسط پزشک و انجام ورزش منظم برای بهبود سلامت متابولیک حیاتی است.",
    ];
  } else { // چاقی درجه ۲ و ۳
    return [
      "توصیه تغذیه‌ای: شما نیازمند مداخله تغذیه‌ای فشرده و تخصصی زیر نظر تیم درمانی (پزشک و متخصص تغذیه) هستید. تغییرات اساسی و دائمی در سبک زندگی و عادات غذایی برای کنترل وزن ضروری است.",
      "توصیه پرستاری: ریسک بیماری‌های قلبی-عروقی و متابولیک در شما بالاست. پایش دقیق و منظم وضعیت سلامتی الزامی است. با پزشک معالج خود در مورد گزینه‌های درمانی جدی‌تر مانند دارودرمانی یا جراحی چاقی مشورت کنید.",
    ];
  }
};

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
      const recommendations = getBmiRecommendations(roundedBmi);
      setResult({ interpretation, color, icon, recommendations });
    } else {
      setBmi(null);
      setResult(null);
    }
  }, [height, weight]);

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-12 border-[#c69d5b]/30 shadow-md">
        <div className="pb-8 border-b border-[#c69d5b]/15 text-center">
          <h3 className="text-3xl font-black text-[#062a2e]">محاسبه‌گر شاخص توده بدنی (BMI)</h3>
          <p className="text-[#096067] text-base font-bold mt-2">ابزار سریع برای ارزیابی وضعیت وزنی</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-xl font-black text-[#062a2e] block text-center">قد (سانتی‌متر)</label>
            <div className="relative group">
              <div className="text-5xl font-black text-[#ca7f3c] text-center tabular-nums">{height}</div>
            </div>
            <input 
              type="range" 
              min="100" 
              max="220" 
              value={height} 
              onChange={(e) => setHeight(Number(e.target.value))} 
              className="w-full cursor-pointer"
            />
          </div>
          <div className="space-y-4">
            <label className="text-xl font-black text-[#062a2e] block text-center">وزن (کیلوگرم)</label>
            <div className="relative group">
              <div className="text-5xl font-black text-[#ca7f3c] text-center tabular-nums">{weight}</div>
            </div>
            <input 
              type="range" 
              min="30" 
              max="200" 
              value={weight} 
              onChange={(e) => setWeight(Number(e.target.value))} 
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {result && bmi !== null && <AssessmentResultDisplay title="نتیجه محاسبه BMI" toolUsed="BMI Calculator" score={bmi} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

export default BMICalculator;