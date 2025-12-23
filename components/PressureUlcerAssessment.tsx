
import React, { useState, useEffect } from 'react';
import { BradenScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const getBradenRecommendations = (riskLevel: string): string[] => {
  switch(riskLevel) {
    case 'none':
      return ["ادامه مراقبت‌های روتین پرستاری.", "ارزیابی مجدد ریسک در صورت هرگونه تغییر در وضعیت بیمار."];
    case 'mild':
      return ["استفاده از تشک مواج یا تشک‌های کاهنده فشار.", "تغییر پوزیشن بیمار حداقل هر ۴ ساعت.", "مدیریت رطوبت پوست و استفاده از کرم‌های محافظ.", "اطمینان از دریافت مایعات و تغذیه کافی."];
    case 'moderate':
      return ["تغییر پوزیشن بیمار هر ۲ ساعت.", "محافظت کامل از نواحی پرفشار (پاشنه، ساکروم) با استفاده از بالشتک.", "درخواست مشاوره تغذیه جهت بهینه‌سازی پروتئین و کالری دریافتی.", "بازبینی و تنظیم برنامه مراقبت از پوست."];
    case 'high':
      return ["تغییر پوزیشن دقیق بیمار هر ۱ الی ۲ ساعت (حتی با زاویه کم).", "استفاده از تشک‌های پیشرفته کاهنده فشار (مانند low-air-loss).", "اجرای برنامه دقیق مدیریت پوست و ثبت روزانه وضعیت پوست.", "به حداقل رساندن نیروهای سایش و کشش حین جابجایی."];
    case 'very_high':
      return ["اجرای حداکثر اقدامات پیشگیرانه؛ در نظر گرفتن استفاده از تخت‌های مخصوص.", "تغییر پوزیشن مکرر و با دقت بالا طبق پروتکل بخش.", "ارزیابی روزانه پوست توسط پرستار مسئول و ثبت دقیق هرگونه تغییر.", "مداخله تهاجمی تغذیه‌ای با هماهنگی تیم درمان."];
    default:
      return [];
  }
};

const BradenScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [scores, setScores] = useState<BradenScores>({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });

    useEffect(() => {
        const totalScore = (Object.values(scores) as number[]).reduce((sum, val) => sum + val, 0);
        let interpretation = "", color = "", icon = "", riskLevel = "";
        if (totalScore <= 9) {
          riskLevel = "very_high";
          interpretation = "ریسک بسیار بالا (Very High Risk)";
          color = "bg-red-800";
          icon = "🆘";
        } else if (totalScore <= 12) {
          riskLevel = "high";
          interpretation = "ریسک بالا (High Risk)";
          color = "bg-rose-700";
          icon = "🚨";
        } else if (totalScore <= 14) {
          riskLevel = "moderate";
          interpretation = "ریسک متوسط (Moderate Risk)";
          color = "bg-orange-600";
          icon = "🟠";
        } else if (totalScore <= 18) {
          riskLevel = "mild";
          interpretation = "ریسک خفیف / پیشگیرانه (At Risk)";
          color = "bg-amber-500";
          icon = "🟡";
        } else {
          riskLevel = "none";
          interpretation = "ریسک وجود ندارد (No Risk)";
          color = "bg-emerald-600";
          icon = "✅";
        }
        const recommendations = getBradenRecommendations(riskLevel);
        onResult({ score: totalScore, interpretation, color, icon, recommendations, toolUsed: 'Braden' });
      }, [scores, onResult]);
    
      const handleSelect = (category: keyof BradenScores, value: number) => {
        setScores(prev => ({ ...prev, [category]: value }));
      };

    return (
        <div className="grid gap-12 pt-8">
            <AssessmentRow title="۱. درک حسی" currentValue={scores.sensory} onSelect={(v) => handleSelect('sensory', v)} options={[{label: 'کاملا محدود (عدم پاسخ به محرک دردناک)', value: 1}, {label: 'خیلی محدود (پاسخ فقط به درد)', value: 2}, {label: 'کمی محدود (پاسخ به دستور کلامی)', value: 3}, {label: 'بدون محدودیت (پاسخ کلامی و بیان درد)', value: 4}]} />
            <AssessmentRow title="۲. رطوبت پوست" currentValue={scores.moisture} onSelect={(v) => handleSelect('moisture', v)} options={[{label: 'رطوبت مداوم', value: 1}, {label: 'خیلی مرطوب (ملحفه هر شیفت تعویض)', value: 2}, {label: 'گاهی مرطوب (ملحفه روزی یکبار تعویض)', value: 3}, {label: 'بندرت مرطوب (پوست خشک)', value: 4}]} />
            <AssessmentRow title="۳. فعالیت فیزیکی" currentValue={scores.activity} onSelect={(v) => handleSelect('activity', v)} options={[{label: 'محدود به تخت (CBR)', value: 1}, {label: 'محدود به صندلی', value: 2}, {label: 'گاهی راه می‌رود', value: 3}, {label: 'مکرر راه می‌رود', value: 4}]} />
            <AssessmentRow title="۴. تحرک (تغییر پوزیشن)" currentValue={scores.mobility} onSelect={(v) => handleSelect('mobility', v)} options={[{label: 'کاملا بی‌حرکت', value: 1}, {label: 'حرکت بسیار محدود', value: 2}, {label: 'اندکی محدود', value: 3}, {label: 'بدون محدودیت', value: 4}]} />
            <AssessmentRow title="۵. تغذیه" currentValue={scores.nutrition} onSelect={(v) => handleSelect('nutrition', v)} options={[{label: 'بسیار کم (NPO/مایعات صاف)', value: 1}, {label: 'ناکافی (کمتر از نصف غذا یا NGT)', value: 2}, {label: 'کافی (بیش از نصف غذا)', value: 3}, {label: 'عالی (تمام وعده‌ها را کامل میخورد)', value: 4}]} />
            <AssessmentRow title="۶. اصطکاک و سایش" currentValue={scores.friction} onSelect={(v) => handleSelect('friction', v)} options={[{label: 'مشکل دار (نیاز به کمک زیاد برای جابجایی)', value: 1}, {label: 'مشکل احتمالی (نیاز به کمک کم)', value: 2}, {label: 'بدون مشکل (جابجایی مستقل)', value: 3}]} />
        </div>
    );
};

const getPushInterpretationAndRecommendations = (score: number, areaScore: number, exudate: number, tissue: number) => {
  let interpretation = "امتیاز پایین‌تر نشان‌دهنده بهبودی زخم است. هدف، کاهش امتیاز در طول زمان است. (۰ = بهبود یافته | ۱۷ = بدترین وضعیت)";
  let woundSeverity = "";
  if (score > 13) woundSeverity = "وضعیت شدید";
  else if (score > 8) woundSeverity = "وضعیت متوسط";
  else if (score > 0) woundSeverity = "وضعیت خفیف";
  else woundSeverity = "زخم بهبود یافته";
  
  interpretation = `(${woundSeverity}) ` + interpretation;

  const recommendations: string[] = [];

  recommendations.push("امتیاز PUSH را به صورت هفتگی ثبت و نمودار آن را رسم کنید تا روند بهبودی به صورت بصری پایش شود.");

  if (tissue === 4) { // Necrotic
    recommendations.push("بافت نکروتیک مانع اصلی بهبودی است. نیاز فوری به دبریدمان (جراحی، آنزیماتیک یا اتولیتیک) با هماهنگی تیم درمان وجود دارد.");
  } else if (tissue === 3) { // Slough
    recommendations.push("بافت اسلاف (زرد) باید برداشته شود. از پانسمان‌های مرطوب کننده (مانند هیدروژل‌ها) برای تسهیل دبریدمان اتولیتیک استفاده کنید.");
  } else if (tissue === 2) { // Granulating
    recommendations.push("بافت گرانوله (قرمز) سالم و نشانه‌ی بهبودی است. از آن محافظت کنید. از پانسمان‌هایی استفاده کنید که محیط مرطوب را حفظ کرده و به بستر زخم نمی‌چسبند (مانند فوم‌ها).");
  } else if (tissue === 1) { // Epithelializing
    recommendations.push("بافت اپیتلیال (صورتی) در حال ترمیم است. آن را مرطوب نگه دارید و از اصطکاک محافظت کنید (مانند فیلم‌های شفاف یا هیدروکلوئیدها).");
  }

  if (exudate === 3) { // Heavy
    recommendations.push("اگزودای زیاد ریسک خیس‌خوردگی پوست اطراف را افزایش می‌دهد. از پانسمان‌های بسیار جاذب (مانند آلژینات‌ها، هیدروفایبرها) و کرم‌های محافظ پوست استفاده کنید.");
  } else if (exudate === 2) { // Moderate
    recommendations.push("اگزودا را با پانسمان‌های جاذب مناسب (مانند فوم‌ها) مدیریت کنید. فواصل تعویض پانسمان را بر اساس اشباع شدن آن تنظیم کنید.");
  }

  if (areaScore >= 7) { // Area >= 8 cm^2
    recommendations.push("اندازه زخم بزرگ است. برنامه دقیق تغییر پوزیشن و استفاده از سطوح کاهنده فشار (تشک مواج پیشرفته) برای برداشتن فشار از روی زخم حیاتی است.");
  }
  
  recommendations.push("وضعیت تغذیه بیمار (پروتئین، ویتامین C، زینک) را برای حمایت از روند ترمیم زخم ارزیابی و بهینه کنید.");

  return { interpretation, recommendations };
};


const PUSHScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [exudate, setExudate] = useState(0);
    const [tissue, setTissue] = useState(0);
  
    useEffect(() => {
      const area = length * width;
      let areaScore = 0;
      if (area === 0) areaScore = 0;
      else if (area < 0.3) areaScore = 1;
      else if (area <= 0.6) areaScore = 2;
      else if (area <= 1.0) areaScore = 3;
      else if (area <= 2.0) areaScore = 4;
      else if (area <= 3.0) areaScore = 5;
      else if (area <= 4.0) areaScore = 6;
      else if (area <= 8.0) areaScore = 7;
      else if (area <= 12.0) areaScore = 8;
      else if (area <= 24.0) areaScore = 9;
      else if (area > 24.0) areaScore = 10;
  
      const totalScore = areaScore + exudate + tissue;
  
      const { interpretation, recommendations } = getPushInterpretationAndRecommendations(totalScore, areaScore, exudate, tissue);
      
      onResult({ score: totalScore, interpretation, color: 'bg-teal-700', icon: '🌿', recommendations, toolUsed: 'PUSH' });
  
    }, [length, width, exudate, tissue, onResult]);
  
    return (
      <div className="pt-8 grid gap-12">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
          <h4 className="text-lg font-black text-slate-200">۱. ابعاد زخم (سانتی‌متر)</h4>
          <p className="text-sm text-slate-400 -mt-2">طولانی‌ترین فاصله (سر به پا) و عریض‌ترین فاصله (پهلو به پهلو) را اندازه‌گیری کنید.</p>
          <div className="flex items-center gap-4">
              <InputRow label="طول" value={length} onChange={setLength} />
              <span className="text-white font-bold text-2xl mt-8">×</span>
              <InputRow label="عرض" value={width} onChange={setWidth} />
          </div>
          <div className="text-center text-indigo-300 font-bold bg-slate-900/50 py-2 rounded-lg">مساحت: {(length * width).toFixed(2)} cm²</div>
        </div>
        <AssessmentRow 
            title="۲. میزان اگزودا (ترشحات)" 
            description="میزان ترشحات موجود پس از برداشتن پانسمان قدیمی و قبل از تمیز کردن زخم را تخمین بزنید."
            currentValue={exudate} 
            onSelect={setExudate} 
            options={[
                {label: 'بدون ترشح', value: 0}, 
                {label: 'کم (پانسمان خشک)', value: 1}, 
                {label: 'متوسط (پانسمان مرطوب)', value: 2}, 
                {label: 'زیاد (پانسمان اشباع)', value: 3}
            ]} 
        />
        <AssessmentRow 
            title="۳. نوع بافت"
            description="درصدی از هر نوع بافت را در بستر زخم مشخص کنید. نوعی که بیشترین درصد را دارد انتخاب کنید."
            currentValue={tissue} 
            onSelect={setTissue} 
            options={[
                {label: 'بسته / پوشیده از اپیتلیوم (زخم کاملاً پوشیده)', value: 0}, 
                {label: 'بافت اپیتلیال (صورتی یا قرمز روشن، سطحی)', value: 1}, 
                {label: 'بافت گرانوله (قرمز، گوشتی، مرطوب)', value: 2}, 
                {label: 'بافت اسلاف (زرد، کرم، چسبنده)', value: 3}, 
                {label: 'بافت نکروتیک (سیاه، قهوه‌ای، سخت)', value: 4}
            ]} 
        />
      </div>
    );
  };
  
const InputRow = ({ label, value, onChange }: any) => (
    <div className="flex-1 text-center">
        <label className="text-sm font-bold text-slate-400 block mb-2">{label}</label>
        <input
            type="number"
            value={value}
            min="0"
            step="0.1"
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full p-2 rounded-lg bg-slate-900/50 border border-slate-600 text-white font-bold text-center"
        />
    </div>
);

const PressureUlcerAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<'braden' | 'push' | null>(null);
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
          <MainCard title="ارزیابی ریسک" subtitle="Braden Scale" icon="🛡️" onClick={() => setScale('braden')} description="ابزار استاندارد برای پیش‌بینی خطر ایجاد زخم فشاری در بیماران." />
          <MainCard title="پایش بهبود زخم" subtitle="PUSH Tool 3.0" icon="📈" onClick={() => setScale('push')} description="ابزاری جهت پایش و ثبت روند بهبودی زخم‌های فشاری موجود." />
        </div>
      );
    }
    if (scale === 'braden') return <BradenScale onResult={setResult} />;
    if (scale === 'push') return <PUSHScale onResult={setResult} />;
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی زخم فشاری</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">انتخاب ابزار بر اساس هدف ارزیابی (ریسک یا پایش)</p>
        </div>
        {renderContent()}
      </div>
      {result && <AssessmentResultDisplay title={`نتیجه ارزیابی ${result.toolUsed}`} toolUsed={result.toolUsed} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
    </div>
  );
};

const MainCard = ({ title, subtitle, icon, onClick, description }: any) => (
    <button onClick={onClick} className="group premium-card p-10 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center border-white/5 hover:border-indigo-500/50">
      <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 text-6xl">{icon}</div>
      <h3 className="text-3xl font-black text-white mb-2">{title}</h3>
      <p className="text-indigo-400 text-sm font-bold mb-4">{subtitle}</p>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </button>
);

export default PressureUlcerAssessment;
