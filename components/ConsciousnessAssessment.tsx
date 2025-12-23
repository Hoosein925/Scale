
import React, { useState, useEffect } from 'react';
import { GCSScores, FOURScores } from '../types';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

const GCSScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<GCSScores>({ eyes: 1, verbal: 1, motor: 1 });
  
  useEffect(() => {
    const total = scores.eyes + scores.verbal + scores.motor;
    let interpretation = "", color = "", icon = "";
    if (total <= 8) { interpretation = "آسیب شدید (Severe)"; color = "bg-red-800"; icon = "🆘"; }
    else if (total <= 12) { interpretation = "آسیب متوسط (Moderate)"; color = "bg-orange-600"; icon = "🟠"; }
    else { interpretation = "آسیب خفیف (Mild)"; color = "bg-amber-500"; icon = "🟡"; }
    onResult({ score: total, interpretation, color, icon });
  }, [scores, onResult]);

  const handleSelect = (cat: keyof GCSScores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. پاسخ چشمی (E)" currentValue={scores.eyes} onSelect={(v) => handleSelect('eyes', v)} options={[{label: 'باز کردن خود به خود', value: 4}, {label: 'با درخواست کلامی', value: 3}, {label: 'با تحریک دردناک', value: 2}, {label: 'بدون پاسخ', value: 1}]} />
      <AssessmentRow title="۲. پاسخ کلامی (V)" currentValue={scores.verbal} onSelect={(v) => handleSelect('verbal', v)} options={[{label: 'بیمار آگاه و مسلط', value: 5}, {label: 'گیج و منگ', value: 4}, {label: 'کلمات نامربوط', value: 3}, {label: 'صداهای نامفهوم', value: 2}, {label: 'بدون پاسخ', value: 1}]} />
      <AssessmentRow title="۳. پاسخ حرکتی (M)" currentValue={scores.motor} onSelect={(v) => handleSelect('motor', v)} options={[{label: 'اطاعت از دستورات', value: 6}, {label: 'مکان‌یابی درد', value: 5}, {label: 'کنار کشیدن از درد', value: 4}, {label: 'فلکسیون غیرطبیعی', value: 3}, {label: 'اکستانسیون غیرطبیعی', value: 2}, {label: 'بدون پاسخ', value: 1}]} />
    </div>
  );
};

const FOURScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [scores, setScores] = useState<FOURScores>({ eyes: 4, motor: 4, brainstem: 4, respiration: 4 });

  useEffect(() => {
    const total = scores.eyes + scores.motor + scores.brainstem + scores.respiration;
    let interpretation = "", color = "", icon = "";
    if (total <= 4) { interpretation = "کومای عمیق / ریسک بالای مرگ"; color = "bg-red-800"; icon = "🆘"; }
    else if (total <= 8) { interpretation = "آسیب شدید"; color = "bg-rose-700"; icon = "🚨"; }
    else if (total <= 12) { interpretation = "آسیب متوسط"; color = "bg-orange-600"; icon = "🟠"; }
    else { interpretation = "آسیب خفیف"; color = "bg-amber-500"; icon = "🟡"; }
    onResult({ score: total, interpretation, color, icon });
  }, [scores, onResult]);

  const handleSelect = (cat: keyof FOURScores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  return (
    <div className="grid gap-12 pt-8">
      <AssessmentRow title="۱. پاسخ چشمی (E)" description="ارزیابی باز بودن چشم‌ها و توانایی بیمار برای تعقیب اشیاء یا پلک زدن به دستور." currentValue={scores.eyes} onSelect={(v) => handleSelect('eyes', v)} options={[
        {label: 'پلک باز، تعقیب یا پلک زدن به دستور', value: 4},
        {label: 'پلک باز ولی عدم تعقیب', value: 3},
        {label: 'پلک بسته ولی به صدای بلند باز می‌شود', value: 2},
        {label: 'پلک بسته ولی به درد باز می‌شود', value: 1},
        {label: 'پلک با درد هم بسته می‌ماند', value: 0},
      ]} />
      <AssessmentRow title="۲. پاسخ حرکتی (M)" description="ارزیابی بهترین پاسخ حرکتی اندام فوقانی به دستورات کلامی یا تحریک دردناک." currentValue={scores.motor} onSelect={(v) => handleSelect('motor', v)} options={[
        {label: 'علامت پیروزی یا شست بالا به دستور', value: 4},
        {label: 'مکان‌یابی درد', value: 3},
        {label: 'پاسخ فلکسوری به درد', value: 2},
        {label: 'پاسخ اکستانسوری به درد', value: 1},
        {label: 'بدون پاسخ یا تشنج', value: 0},
      ]} />
      <AssessmentRow title="۳. رفلکس‌های ساقه مغز (B)" description="بررسی حضور یا عدم حضور رفلکس‌های مردمک به نور و رفلکس قرنیه." currentValue={scores.brainstem} onSelect={(v) => handleSelect('brainstem', v)} options={[
        {label: 'رفلکس قرنیه و مردمک حاضر', value: 4},
        {label: 'یک مردمک گشاد و ثابت', value: 3},
        {label: 'رفلکس قرنیه یا مردمک غایب', value: 2},
        {label: 'رفلکس قرنیه و مردمک غایب', value: 1},
        {label: 'رفلکس قرنیه، مردمک و سرفه غایب', value: 0},
      ]} />
       <AssessmentRow title="۴. الگوی تنفسی (R)" description="ارزیابی الگوی تنفسی بیمار، چه اینتوبه باشد یا به صورت خودبه‌خودی تنفس کند." currentValue={scores.respiration} onSelect={(v) => handleSelect('respiration', v)} options={[
        {label: 'غیر اینتوبه، تنفس منظم', value: 4},
        {label: 'غیر اینتوبه، تنفس شین-استوک', value: 3},
        {label: 'غیر اینتوبه، تنفس نامنظم', value: 2},
        {label: 'تنفس بالاتر از ریت ونتیلاتور', value: 1},
        {label: 'تنفس با ریت ونتیلاتور یا آپنه', value: 0},
      ]} />
    </div>
  );
};

const AVScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
  const [level, setLevel] = useState<string | null>(null);

  const handleSelect = (selectedLevel: string) => {
    setLevel(selectedLevel);
    let result = { score: 0, interpretation: '', color: '', icon: '' };
    switch (selectedLevel) {
      case 'A':
        result = { score: 4, interpretation: 'هوشیار (Alert)', color: 'bg-emerald-600', icon: '✅' };
        break;
      case 'V':
        result = { score: 3, interpretation: 'پاسخ به صدا (Voice)', color: 'bg-amber-500', icon: '🟡' };
        break;
      case 'P':
        result = { score: 2, interpretation: 'پاسخ به درد (Pain)', color: 'bg-orange-600', icon: '🟠' };
        break;
      case 'U':
        result = { score: 1, interpretation: 'بدون پاسخ (Unresponsive)', color: 'bg-red-800', icon: '🆘' };
        break;
    }
    onResult(result);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
      <AVPUButton label="Alert" persianLabel="هوشیار" value="A" selected={level} onClick={handleSelect} />
      <AVPUButton label="Voice" persianLabel="پاسخ به صدا" value="V" selected={level} onClick={handleSelect} />
      <AVPUButton label="Pain" persianLabel="پاسخ به درد" value="P" selected={level} onClick={handleSelect} />
      <AVPUButton label="Unresponsive" persianLabel="بدون پاسخ" value="U" selected={level} onClick={handleSelect} />
    </div>
  );
};

const AVPUButton = ({ label, persianLabel, value, selected, onClick }: any) => (
  <button onClick={() => onClick(value)} className={`p-6 rounded-3xl border-2 text-center transition-all ${selected === value ? 'bg-indigo-600 border-indigo-400 scale-105 shadow-xl' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
    <div className="text-4xl font-black text-white">{value}</div>
    <div className="text-sm font-bold text-indigo-300 mt-2">{label}</div>
    <div className="text-lg font-black text-white mt-1">{persianLabel}</div>
  </button>
);

const ConsciousnessAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scale, setScale] = useState<string | null>(null);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          <ScaleCard title="GCS" subtitle="Glasgow Coma Scale" onClick={() => setScale('GCS')} />
          <ScaleCard title="FOUR" subtitle="Full Outline of UnResponsiveness" onClick={() => setScale('FOUR')} />
          <ScaleCard title="AVPU" subtitle="Alert, Voice, Pain, Unresponsive" onClick={() => setScale('AVPU')} />
        </div>
      );
    }
    switch(scale) {
      case 'GCS': return <GCSScale onResult={setResult} />;
      case 'AVPU': return <AVScale onResult={setResult} />;
      case 'FOUR': return <FOURScale onResult={setResult} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-indigo-500/20">
        <div className="pb-8 border-b border-white/5 text-center">
          <h3 className="text-3xl font-black text-white">ارزیابی سطح هوشیاری</h3>
          <p className="text-indigo-400 text-base font-bold mt-2">لطفاً مقیاس مورد نظر را انتخاب کنید</p>
        </div>
        {renderContent()}
      </div>
      {result && scale && <AssessmentResultDisplay title={`نتیجه ارزیابی ${scale}`} toolUsed={scale} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} />}
    </div>
  );
};

const ScaleCard = ({ title, subtitle, onClick }: any) => (
    <button onClick={onClick} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-center hover:-translate-y-2">
      <h3 className="text-5xl font-black text-indigo-400 mb-3">{title}</h3>
      <p className="text-white text-sm font-bold">{subtitle}</p>
    </button>
);

export default ConsciousnessAssessment;
