
import React from 'react';
import { AssessmentResult, PainSeverity, PatientCategory } from '../types';

interface Props {
  assessment: AssessmentResult;
  category: PatientCategory;
}

const ManagementPlan: React.FC<Props> = ({ assessment, category }) => {
  const getPlan = () => {
    if (category === PatientCategory.PEDIATRIC) {
      switch (assessment.severity) {
        case PainSeverity.NONE:
          return {
            meds: ["نیاز به مداخله دارویی ندارد"],
            actions: ["ثبت در برگه پایش", "ادامه مراقبت‌های معمول"],
            nonPharm: ["کاهش نور و صدا", "حضور والدین"],
            color: "bg-emerald-600", icon: "✅"
          };
        case PainSeverity.MILD:
          return {
            meds: ["استامینوفن (10-15 mg/kg) خوراکی/وریدی", "ایبوبروفن (5-10 mg/kg) برای سن بالای ۶ ماه"],
            actions: ["ارزیابی مجدد هر ۲ ساعت", "پایش دمای بدن"],
            nonPharm: ["مراقب کانگورویی (KMC)", "مکیدن غیرتغذیه‌ای (NNS)", "انحراف فکر با اسباب‌بازی"],
            color: "bg-amber-500", icon: "🟡"
          };
        case PainSeverity.MODERATE:
          return {
            meds: ["استامینوفن وریدی دوز بالا", "مخدر ضعیف طبق دستور پزشک", "در نظر گرفتن کلونیدین مکمل"],
            actions: ["مانیتورینگ پاسخ به درمان", "ارزیابی مجدد هر ۱ ساعت"],
            nonPharm: ["بازی‌درمانی تعاملی", "موسیقی درمانی ملایم", "پوزیشن‌دهی حمایتی"],
            color: "bg-orange-600", icon: "🟠"
          };
        case PainSeverity.SEVERE:
          return {
            meds: ["مورفین (0.1-0.2 mg/kg) وریدی", "فنتانیل (1-2 mcg/kg) انفوزیون", "آمادگی نالوکسان"],
            actions: ["پایش مداوم پالس‌اکسیمتری", "ارزیابی هر ۳۰ دقیقه", "مانیتورینگ تنفسی دقیق"],
            nonPharm: ["حضور دائم والدین/تسکین محیطی", "انحراف فکر پیشرفته (واقعیت مجازی برای نوجوانان)"],
            color: "bg-rose-700", icon: "🚨"
          };
        default: return { meds: [], actions: [], nonPharm: [], color: "bg-indigo-900", icon: "❓" };
      }
    } else {
      // روتین بزرگسالان قبلی
      switch (assessment.severity) {
        case PainSeverity.NONE: return { meds: ["عدم نیاز به مداخله"], actions: ["ثبت در برگه"], nonPharm: [], color: "bg-emerald-600", icon: "✅" };
        case PainSeverity.MILD: return { meds: ["استامینوفن", "NSAIDs"], actions: ["ارزیابی هر ۴ ساعت"], nonPharm: ["ماساژ", "تغییر پوزیشن"], color: "bg-amber-500", icon: "🟡" };
        case PainSeverity.MODERATE: return { meds: ["مخدر ضعیف", "پمپ PCA"], actions: ["ارزیابی هر ۱ ساعت"], nonPharm: ["آرام‌سازی"], color: "bg-orange-600", icon: "🟠" };
        case PainSeverity.SEVERE: return { meds: ["مورفین/فنتانیل وریدی", "پمپ PCA"], actions: ["پایش مداوم هوشیاری"], nonPharm: ["تسکین محیطی"], color: "bg-rose-700", icon: "🚨" };
        default: return { meds: [], actions: [], nonPharm: [], color: "bg-indigo-900", icon: "❓" };
      }
    }
  };

  const plan = getPlan();

  return (
    <div className="animate-in mt-10 premium-card overflow-hidden shadow-xl border border-white/5">
      <div className={`${plan.color} p-8 flex flex-col lg:flex-row items-center justify-between gap-8 relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-inner">
            {plan.icon}
          </div>
          <div className="text-center lg:text-right">
            <h3 className="text-2xl font-black text-white leading-tight">درمان انتخابی بر اساس شدت درد</h3>
            <p className="text-white/70 text-xs font-bold mt-1 uppercase tracking-wide">
              {category === PatientCategory.PEDIATRIC ? 'Pediatric Care Protocol' : 'Adult Care Protocol'}
            </p>
          </div>
        </div>
        
        <div className="relative flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl text-indigo-950 text-center shadow-lg">
            <span className="block text-[8px] font-black opacity-40 mb-0.5">امتیاز {assessment.toolUsed}</span>
            <span className="text-3xl font-black text-indigo-700 tabular-nums">{assessment.score}</span>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <SectionTitle color="bg-indigo-500" text="مداخالت دارویی (طبق فایل)" />
          <div className="grid gap-3">
            {plan.meds.map((med, i) => (
              <PlanItem key={i} text={med} icon="💊" color="border-l-indigo-500" />
            ))}
          </div>
          {category === PatientCategory.PEDIATRIC && plan.nonPharm && (
             <>
               <SectionTitle color="bg-pink-500" text="روش‌های غیردارویی (پیوست ۱)" />
               <div className="grid gap-3">
                {plan.nonPharm.map((item, i) => (
                  <PlanItem key={i} text={item} icon="🧸" color="border-l-pink-500" />
                ))}
              </div>
             </>
          )}
        </div>

        <div className="space-y-6">
          <SectionTitle color="bg-emerald-500" text="اقدامات پرستاری و پایش" />
          <div className="grid gap-3">
            {plan.actions.map((act, i) => (
              <PlanItem key={i} text={act} icon="📝" color="border-l-emerald-500" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ color, text }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-7 ${color} rounded-full shadow`}></div>
    <h4 className="text-xl font-black text-indigo-100">{text}</h4>
  </div>
);

const PlanItem = ({ text, icon, color }: any) => (
  <div className={`bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 border-l-4 ${color}`}>
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{icon}</div>
    <span className="text-base font-bold text-slate-100">{text}</span>
  </div>
);

export default ManagementPlan;
