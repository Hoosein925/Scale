
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import AssessmentRow from './common/AssessmentRow';
import ModuleHeader from './common/ModuleHeader';

// Define NIHSS scores state interface locally
interface NIHSSScores {
  loc: number;
  locQuestions: number;
  locCommands: number;
  gaze: number;
  visual: number;
  facial: number;
  motorArmLeft: number;
  motorArmRight: number;
  motorLegLeft: number;
  motorLegRight: number;
  ataxia: number;
  sensory: number;
  language: number;
  dysarthria: number;
  inattention: number;
}

const getNIHSSRecommendations = (score: number): string[] => {
  if (score === 0) {
    return ["علائم سکته مغزی وجود ندارد.", "در صورت وجود علائم بالینی، سایر تشخیص‌های افتراقی را در نظر بگیرید."];
  }
  if (score <= 4) {
    return ["پایش دقیق علائم حیاتی و ارزیابی‌های عصبی مکرر (Neuro Checks).", "آمادگی برای انجام تصویربرداری تشخیصی (CT/MRI) مغز.", "در نظر گرفتن درمان ضد پلاکت (مانند آسپرین) طبق دستور پزشک."];
  }
  if (score <= 15) {
    return ["فراخوانی فوری کد سکته یا تیم سکته (Stroke Team/Code).", "ارزیابی اورژانسی برای درمان ترومبولیتیک (tPA) در صورت قرار داشتن بیمار در پنجره زمانی (معمولاً ۳ تا ۴.۵ ساعت).", "مانیتورینگ مداوم قلبی و کنترل دقیق فشار خون."];
  }
  if (score <= 20) {
    return ["بستری در بخش مراقبت‌های ویژه سکته (Stroke Unit) یا ICU.", "اقدامات حمایتی پیشرفته (مدیریت راه هوایی در صورت نیاز).", "بررسی اندیکاسیون مداخلات پیشرفته‌تر مانند ترومبکتومی مکانیکی در مراکز مجهز."];
  }
  // score >= 21
  return ["حداکثر اقدامات حمایتی حیاتی و پایش دقیق.", "مدیریت فشار داخل جمجمه (ICP) در صورت بروز اِدِم مغزی.", "مشاوره جراحی مغز و اعصاب در صورت وجود هموراژی یا اِدِم شدید.", "ریسک بالای عوارض و مورتالیتی؛ نیازمند مراقبت‌های ویژه و تهاجمی."];
};


const NIHSSAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
  const [scores, setScores] = useState<NIHSSScores>({
    loc: 0,
    locQuestions: 0,
    locCommands: 0,
    gaze: 0,
    visual: 0,
    facial: 0,
    motorArmLeft: 0,
    motorArmRight: 0,
    motorLegLeft: 0,
    motorLegRight: 0,
    ataxia: 0,
    sensory: 0,
    language: 0,
    dysarthria: 0,
    inattention: 0,
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const totalScore = (Object.values(scores) as number[]).reduce((sum, val) => sum + val, 0);
    
    let interpretation = "", color = "", icon = "";
    if (totalScore === 0) {
      interpretation = "بدون علائم سکته (No Stroke Symptoms)";
      color = "bg-emerald-600";
      icon = "✅";
    } else if (totalScore <= 4) {
      interpretation = "سکته خفیف (Minor Stroke)";
      color = "bg-amber-500";
      icon = "🟡";
    } else if (totalScore <= 15) {
      interpretation = "سکته متوسط (Moderate Stroke)";
      color = "bg-orange-600";
      icon = "🟠";
    } else if (totalScore <= 20) {
      interpretation = "سکته متوسط تا شدید (Moderate to Severe Stroke)";
      color = "bg-rose-700";
      icon = "🚨";
    } else { // 21-42
      interpretation = "سکته شدید (Severe Stroke)";
      color = "bg-red-800";
      icon = "🆘";
    }

    const recommendations = getNIHSSRecommendations(totalScore);
    setResult({ score: totalScore, interpretation, color, icon, recommendations, toolUsed: 'NIHSS' });
  }, [scores]);

  const handleSelect = (category: keyof NIHSSScores, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="space-y-8">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      <div className="premium-card p-10 space-y-8 border-[#c69d5b]/30 shadow-md">
        <div className="pb-8 border-b border-[#c69d5b]/15 text-center">
          <h3 className="text-3xl font-black text-[#062a2e]">مقیاس سکته مغزی انستیتوی ملی بهداشت (NIHSS)</h3>
          <p className="text-[#096067] text-base font-bold mt-2">ابزار استاندارد برای ارزیابی شدت سکته مغزی حاد</p>
        </div>
        <div className="grid gap-12 pt-8">
          <AssessmentRow title="۱a. سطح هوشیاری" description="میزان پاسخ‌دهی کلی بیمار را ارزیابی کنید. اگر بیمار اینتوبه یا دچار تروما باشد، امتیاز مناسب را انتخاب کنید." currentValue={scores.loc} onSelect={(v) => handleSelect('loc', v)} options={[{label: 'هوشیار کامل (Alert)', value: 0}, {label: 'خواب آلود (Drowsy)', value: 1}, {label: 'مات و مبهوت (Stuporous)', value: 2}, {label: 'کما (Coma)', value: 3}]} />
          <AssessmentRow title="۱b. سوالات سطح هوشیاری" description="از بیمار بپرسید در چه ماهی هستیم و چند سال دارد. امتیاز بر اساس اولین پاسخ بیمار است." currentValue={scores.locQuestions} onSelect={(v) => handleSelect('locQuestions', v)} options={[{label: 'هر دو صحیح', value: 0}, {label: 'یک پاسخ صحیح', value: 1}, {label: 'هر دو غلط / آفازی', value: 2}]} />
          <AssessmentRow title="۱c. اجرای دستورات" description="از بیمار بخواهید چشم‌هایش را باز و بسته کند و سپس دست غیرپارِتیک خود را مشت کرده و باز کند." currentValue={scores.locCommands} onSelect={(v) => handleSelect('locCommands', v)} options={[{label: 'هر دو صحیح', value: 0}, {label: 'یک دستور صحیح', value: 1}, {label: 'هیچکدام صحیح نیست', value: 2}]} />
          <AssessmentRow title="۲. بهترین نگاه (Best Gaze)" description="فقط حرکات افقی چشم را ارزیابی کنید. از بیمار بخواهید انگشت شما را دنبال کند." currentValue={scores.gaze} onSelect={(v) => handleSelect('gaze', v)} options={[{label: 'طبیعی', value: 0}, {label: 'فلج نسبی نگاه', value: 1}, {label: 'انحراف ثابت نگاه', value: 2}]} />
          <AssessmentRow title="۳. میدان بینایی (Visual Fields)" description="میدان بینایی فوقانی و تحتانی هر دو چشم را با شمارش انگشتان تست کنید." currentValue={scores.visual} onSelect={(v) => handleSelect('visual', v)} options={[{label: 'بدون نقص', value: 0}, {label: 'همی‌آنوپی نسبی', value: 1}, {label: 'همی‌آنوپی کامل', value: 2}, {label: 'همی‌آنوپی دوطرفه', value: 3}]} />
          <AssessmentRow title="۴. فلج صورت (Facial Palsy)" description="از بیمار بخواهید دندان‌هایش را نشان دهد یا ابروهایش را بالا ببرد و چشم‌هایش را محکم ببندد." currentValue={scores.facial} onSelect={(v) => handleSelect('facial', v)} options={[{label: 'طبیعی', value: 0}, {label: 'فلج خفیف', value: 1}, {label: 'فلج نسبی', value: 2}, {label: 'فلج کامل', value: 3}]} />
          <AssessmentRow title="۵. حرکت بازوی چپ" description="بازو را در زاویه ۹۰ درجه (نشسته) یا ۴۵ درجه (خوابیده) بالا نگه دارید و از بیمار بخواهید ۱۰ ثانیه نگه دارد." currentValue={scores.motorArmLeft} onSelect={(v) => handleSelect('motorArmLeft', v)} options={[{label: 'بدون افتادن', value: 0}, {label: 'افتادن قبل از ۱۰ ثانیه', value: 1}, {label: 'مقاومت در برابر جاذبه', value: 2}, {label: 'بدون مقاومت در برابر جاذبه', value: 3}, {label: 'بدون حرکت', value: 4}]} />
          <AssessmentRow title="۶. حرکت بازوی راست" description="بازو را در زاویه ۹۰ درجه (نشسته) یا ۴۵ درجه (خوابیده) بالا نگه دارید و از بیمار بخواهید ۱۰ ثانیه نگه دارد." currentValue={scores.motorArmRight} onSelect={(v) => handleSelect('motorArmRight', v)} options={[{label: 'بدون افتادن', value: 0}, {label: 'افتادن قبل از ۱۰ ثانیه', value: 1}, {label: 'مقاومت در برابر جاذبه', value: 2}, {label: 'بدون مقاومت در برابر جاذبه', value: 3}, {label: 'بدون حرکت', value: 4}]} />
          <AssessmentRow title="۷. حرکت پای چپ" description="پا را در زاویه ۳۰ درجه (خوابیده) بالا نگه دارید و از بیمار بخواهید ۵ ثانیه نگه دارد." currentValue={scores.motorLegLeft} onSelect={(v) => handleSelect('motorLegLeft', v)} options={[{label: 'بدون افتادن', value: 0}, {label: 'افتادن قبل از ۵ ثانیه', value: 1}, {label: 'مقاومت در برابر جاذبه', value: 2}, {label: 'بدون مقاومت در برابر جاذبه', value: 3}, {label: 'بدون حرکت', value: 4}]} />
          <AssessmentRow title="۸. حرکت پای راست" description="پا را در زاویه ۳۰ درجه (خوابیده) بالا نگه دارید و از بیمار بخواهید ۵ ثانیه نگه دارد." currentValue={scores.motorLegRight} onSelect={(v) => handleSelect('motorLegRight', v)} options={[{label: 'بدون افتادن', value: 0}, {label: 'افتادن قبل از ۵ ثانیه', value: 1}, {label: 'مقاومت در برابر جاذبه', value: 2}, {label: 'بدون مقاومت در برابر جاذبه', value: 3}, {label: 'بدون حرکت', value: 4}]} />
          <AssessmentRow title="۹. آتاکسی اندام (Limb Ataxia)" description="تست انگشت به بینی و پاشنه به ساق پا را در هر دو طرف انجام دهید. آتاکسی در صورت عدم تناسب با ضعف، امتیاز می‌گیرد." currentValue={scores.ataxia} onSelect={(v) => handleSelect('ataxia', v)} options={[{label: 'بدون آتاکسی', value: 0}, {label: 'در یک اندام', value: 1}, {label: 'در دو اندام یا بیشتر', value: 2}]} />
          <AssessmentRow title="۱۰. حس (Sensory)" description="حس لمس یا درد را با سوزن در صورت، بازوها و پاها ارزیابی کنید." currentValue={scores.sensory} onSelect={(v) => handleSelect('sensory', v)} options={[{label: 'طبیعی', value: 0}, {label: 'کاهش حس خفیف تا متوسط', value: 1}, {label: 'کاهش حس شدید یا کامل', value: 2}]} />
          <AssessmentRow title="۱۱. بهترین زبان (Best Language)" description="از بیمار بخواهید یک تصویر را توصیف کند، اشیاء را نام ببرد و جملاتی را بخواند." currentValue={scores.language} onSelect={(v) => handleSelect('language', v)} options={[{label: 'بدون آفازی', value: 0}, {label: 'آفازی خفیف تا متوسط', value: 1}, {label: 'آفازی شدید', value: 2}, {label: 'سکوت / آفازی گلوبال', value: 3}]} />
          <AssessmentRow title="۱۲. دیس‌آرتری (Dysarthria)" description="از بیمار بخواهید لیستی از کلمات را بخواند. وضوح تکلم را ارزیابی کنید." currentValue={scores.dysarthria} onSelect={(v) => handleSelect('dysarthria', v)} options={[{label: 'تکلم طبیعی', value: 0}, {label: 'دیس‌آرتری خفیف تا متوسط', value: 1}, {label: 'تکلم غیرقابل فهم / آنارتری', value: 2}]} />
          <AssessmentRow title="۱۳. بی‌توجهی و غفلت (Extinction and Inattention)" description="بیمار را برای وجود غفلت یک‌طرفه (neglect) از طریق تحریک همزمان دیداری، شنیداری یا لمسی ارزیابی کنید." currentValue={scores.inattention} onSelect={(v) => handleSelect('inattention', v)} options={[{label: 'بدون غفلت', value: 0}, {label: 'غفلت نسبی', value: 1}, {label: 'غفلت کامل', value: 2}]} />
        </div>
      </div>
      {result && <AssessmentResultDisplay title="نتیجه ارزیابی NIHSS" {...result} />}
    </div>
  );
};

export default NIHSSAssessment;
