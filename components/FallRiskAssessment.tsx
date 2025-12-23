
import React, { useState, useEffect } from 'react';
import { HumptyDumptyScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const getMorseRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'low':
      return ["آموزش به بیمار و همراه در مورد ایمنی محیط.", "اطمینان از در دسترس بودن زنگ اخبار.", "حفظ محیطی با نور کافی و عاری از موانع."];
    case 'medium':
      return ["نصب دستگیره در کنار تخت و سرویس بهداشتی.", "استفاده از تخت در پایین‌ترین ارتفاع ممکن.", "استفاده از دستبند زرد رنگ (هشدار ریسک سقوط).", "بررسی نیاز به وسایل کمکی حین راه رفتن."];
    case 'high':
      return ["نظارت دقیق و مکرر بر بیمار (هر ۱-۲ ساعت).", "همراهی بیمار حین راه رفتن و انتقال.", "قرار دادن بیمار در اتاقی نزدیک به ایستگاه پرستاری.", "اطمینان از قفل بودن چرخ‌های تخت و ویلچر."];
    default:
      return [];
  }
};

const getHumptyRecommendations = (riskLevel: string): string[] => {
  switch (riskLevel) {
    case 'low':
      return ["آموزش ایمنی به والدین و کودک (متناسب با سن).", "بالا بودن نرده‌های تخت در همه حال.", "اطمینان از وجود روشنایی کافی در شب."];
    case 'high':
      return ["نصب علامت هشدار سقوط (ستاره زرد) بالای تخت بیمار.", "در نظر گرفتن همراهی دائم بیمار یا افزایش فواصل سرکشی.", "قرار دادن وسایل ضروری در دسترس کودک.", "استفاده از دستبند شناسایی ریسک سقوط."];
    default:
      return [];
  }
}

const MorseScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState({ history: 0, secondary: 0, aid: 0, iv: 0, gait: 0, mental: 0 });

  const handleSelect = (cat: keyof typeof scores, val: number) => {
    const newScores = { ...scores, [cat]: val };
    setScores(newScores);
    const total = (Object.values(newScores) as number[]).reduce((a, b) => a + b, 0);
    
    let interpretation = "", color = "", icon = "", riskLevel = "";
    if (total > 45) {
      riskLevel = 'high';
      interpretation = "ریسک بالا (High Risk)";
      color = "bg-rose-700";
      icon = "🚨";
    } else if (total >= 25) {
      riskLevel = 'medium';
      interpretation = "ریسک متوسط (Medium Risk)";
      color = "bg-amber-500";
      icon = "🟡";
    } else {
      riskLevel = 'low';
      interpretation = "ریسک کم (Low Risk)";
      color = "bg-emerald-600";
      icon = "✅";
    }
    const recommendations = getMorseRecommendations(riskLevel);
    onResult({ score: total, interpretation, color, icon, recommendations });
  };
  
  return (
    <div className="grid gap-12 pt-8">
        <AssessmentRow title="۱. سابقه سقوط" currentValue={scores.history} onSelect={(v) => handleSelect('history', v)} options={[{label: 'خیر', value: 0}, {label: 'بله (در ۳ ماه گذشته)', value: 25}]} />
        <AssessmentRow title="۲. تشخیص پزشکی ثانویه" currentValue={scores.secondary} onSelect={(v) => handleSelect('secondary', v)} options={[{label: 'خیر (فقط یک تشخیص فعال)', value: 0}, {label: 'بله (بیش از یک تشخیص فعال)', value: 15}]} />
        <AssessmentRow title="۳. ابزار کمکی" currentValue={scores.aid} onSelect={(v) => handleSelect('aid', v)} options={[{label: 'بدون کمک/استراحت مطلق/ویلچر', value: 0}, {label: 'عصا/واکر', value: 15}, {label: 'تکیه به وسایل اطراف', value: 30}]} />
        <AssessmentRow title="۴. IV درمانی" currentValue={scores.iv} onSelect={(v) => handleSelect('iv', v)} options={[{label: 'خیر', value: 0}, {label: 'بله', value: 20}]} />
        <AssessmentRow title="۵. الگوی گام برداشتن" currentValue={scores.gait} onSelect={(v) => handleSelect('gait', v)} options={[{label: 'نرمال', value: 0}, {label: 'ضعیف (سر خمیده، گام کوتاه)', value: 10}, {label: 'مختل (مشکل در برخاستن، نگاه به زمین)', value: 20}]} />
        <AssessmentRow title="۶. وضعیت روانی" currentValue={scores.mental} onSelect={(v) => handleSelect('mental', v)} options={[{label: 'طبیعی (آگاه به توانایی خود)', value: 0}, {label: 'فراموشکاری محدودیت‌ها', value: 15}]} />
    </div>
  );
};

const HumptyDumptyScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<HumptyDumptyScores>({ age: 1, gender: 1, diagnosis: 1, cognitive: 1, environmental: 1, surgery: 1, medication: 1 });

  useEffect(() => {
    const total = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0);
    let interpretation = "", color = "", icon = "", riskLevel = "";
    if (total >= 12) {
      riskLevel = 'high';
      interpretation = "ریسک بالای سقوط (High Risk)";
      color = "bg-rose-700";
      icon = "🚨";
    } else { // 7-11
      riskLevel = 'low';
      interpretation = "ریسک پایین سقوط (Low Risk)";
      color = "bg-amber-500";
      icon = "🟡";
    }
    const recommendations = getHumptyRecommendations(riskLevel);
    onResult({ score: total, interpretation, color, icon, recommendations });
  }, [scores, onResult]);
  
  const handleSelect = (cat: keyof HumptyDumptyScores, val: number) => {
    setScores(prev => ({...prev, [cat]: val}));
  }

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. سن" currentValue={scores.age} onSelect={(v) => handleSelect('age', v)} options={[{label: '< ۳ سال', value: 4}, {label: '۳ تا ۷ سال', value: 3}, {label: '۷ تا ۱۳ سال', value: 2}, {label: '≥ ۱۳ سال', value: 1}]} />
      <AssessmentRow title="۲. جنس" currentValue={scores.gender} onSelect={(v) => handleSelect('gender', v)} options={[{label: 'پسر', value: 2}, {label: 'دختر', value: 1}]} />
      <AssessmentRow title="۳. تشخیص بالینی" currentValue={scores.diagnosis} onSelect={(v) => handleSelect('diagnosis', v)} options={[{label: 'تشخیص‌های نورولوژیک', value: 4}, {label: 'اختلال در اکسیژن‌رسانی', value: 3}, {label: 'اختلالات روانی/رفتاری', value: 2}, {label: 'تشخیص‌های دیگر', value: 1}]} />
      <AssessmentRow title="۴. اختلالات شناختی" currentValue={scores.cognitive} onSelect={(v) => handleSelect('cognitive', v)} options={[{label: 'عدم آگاهی از ناتوانی', value: 3}, {label: 'فراموشی محدودیت‌ها', value: 2}, {label: 'آگاهی کامل از توانایی', value: 1}]} />
      <AssessmentRow title="۵. فاکتورهای محیطی" currentValue={scores.environmental} onSelect={(v) => handleSelect('environmental', v)} options={[{label: 'سابقه سقوط/شیرخوار در تخت نامناسب', value: 4}, {label: 'استفاده از وسایل کمک حرکتی', value: 3}, {label: 'بیمار در تخت است', value: 2}, {label: 'بیمار سرپایی', value: 1}]} />
      <AssessmentRow title="۶. پاسخ به جراحی/بیهوشی" currentValue={scores.surgery} onSelect={(v) => handleSelect('surgery', v)} options={[{label: 'تا ۲۴ ساعت بعد از عمل', value: 3}, {label: 'تا ۴۸ ساعت بعد از عمل', value: 2}, {label: '> ۴۸ ساعت گذشته یا بدون جراحی', value: 1}]} />
      <AssessmentRow title="۷. داروهای مصرفی" currentValue={scores.medication} onSelect={(v) => handleSelect('medication', v)} options={[{label: 'استفاده همزمان از داروهای پرخطر', value: 3}, {label: 'فقط یکی از داروهای پرخطر', value: 2}, {label: 'بدون داروهای پرخطر', value: 1}]} />
    </div>
  );
}

const FallRiskAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<'morse' | 'humpty' | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleBack = () => {
    if (scale) {
      setScale(null);
      setResult(null);
    } else {
      onBack();
    }
  };

  const renderContent = () => {
    if (!scale) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto pt-10">
          <MainCard title="بزرگسالان" subtitle="Morse Fall Scale" icon="👨‍🦳" onClick={() => setScale('morse')} />
          <MainCard title="اطفال" subtitle="Humpty Dumpty Scale" icon="👶" onClick={() => setScale('humpty')} />
        </div>
      );
    }
    if (scale === 'morse') return <MorseScale onResult={setResult} />;
    if (scale === 'humpty') return <HumptyDumptyScale onResult={setResult} />;
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی ریسک سقوط</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">انتخاب مقیاس بر اساس گروه سنی بیمار</p>
        </div>
        {renderContent()}
      </div>
      {result && <AssessmentResultDisplay title="نتیجه ارزیابی ریسک سقوط" toolUsed={scale === 'morse' ? 'Morse' : 'Humpty Dumpty'} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

const MainCard = ({ title, subtitle, icon, onClick }: any) => (
    <button onClick={onClick} className="group premium-card p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border-white/5 hover:border-indigo-500/50">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 text-6xl">{icon}</div>
      <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
      <p className="text-indigo-400 text-sm font-bold">{subtitle}</p>
    </button>
  );

export default FallRiskAssessment;
