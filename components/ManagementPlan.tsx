import React from 'react';
import { AssessmentResult, PainSeverity, PatientCategory, PediatricAgeGroup } from '../types';
import {
  getAdultPlan, getPediatricPlan, getNeonatePlan, Plan, PlanItem,
  PEDIATRIC_NONPHARM_BY_AGE, pediatricAgeKeys, severityLabel,
} from './painData';

interface Props {
  assessment: AssessmentResult;
  category: PatientCategory;
  ageGroup?: PediatricAgeGroup | null;
}

const Section: React.FC<{ title: string; icon: string; items: PlanItem[]; tone?: string }> = ({ title, icon, items, tone = 'border-[#d8cfbe]' }) => {
  if (!items.length) return null;
  return (
    <div className={`p-6 rounded-3xl bg-white border-2 ${tone} shadow-sm`}>
      <h5 className="text-lg font-black text-[#062a2e] mb-4 flex items-center gap-2">
        <span>{icon}</span>{title}
      </h5>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 text-[#1e293b] font-bold leading-relaxed">
            <span className="text-[#096067] font-black mt-0.5">•</span>
            <span>
              {it.text}
              {it.source === 'extra' && (
                <span className="mr-2 inline-block align-middle text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  مرجع تکمیلی — نیاز به تأیید پزشک/داروساز
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ManagementPlan: React.FC<Props> = ({ assessment, category, ageGroup }) => {
  const tool = String(assessment.toolUsed);
  let plan: Plan;
  if (category === PatientCategory.NEONATE) plan = getNeonatePlan(assessment.severity);
  else if (category === PatientCategory.PEDIATRIC) plan = getPediatricPlan(assessment.severity);
  else plan = getAdultPlan(assessment.severity, tool);

  const ageKeys = category === PatientCategory.PEDIATRIC ? pediatricAgeKeys(ageGroup) : [];
  const ageRows = PEDIATRIC_NONPHARM_BY_AGE.filter(r => ageKeys.includes(r.key));
  const needsPhysician = assessment.severity && assessment.severity !== PainSeverity.NONE;

  return (
    <div className="animate-in mt-10 premium-card overflow-hidden shadow-xl border border-[#c69d5b]/30">
      <div className={`${plan.color} p-8 flex items-center justify-between gap-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl border border-white/30">{plan.icon}</div>
          <div>
            <h3 className="text-2xl font-black text-white">پلن مراقبتی و درمانی پیشنهادی</h3>
            <p className="text-white/90 text-sm font-bold mt-1">
              {assessment.severity ? severityLabel[assessment.severity] : ''} — نمره {assessment.score}
            </p>
          </div>
        </div>
      </div>

      {assessment.interpretation && (
        <div className="p-6 bg-[#fbf9f5] border-t border-[#d8cfbe]/60 text-center">
          <p className="text-lg font-black text-[#062a2e]"><span className="text-[#ca7f3c]">تفسیر: </span>{assessment.interpretation}</p>
        </div>
      )}

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#fbf9f5] border-t border-[#d8cfbe]/60">
        <Section title="اقدامات دارویی (طبق دستور پزشک)" icon="💊" items={plan.meds} tone="border-[#096067]/30" />
        <Section title="روش‌های غیردارویی" icon="🧸" items={plan.nonPharm} />
        <Section title="اقدامات پرستاری و مستندسازی" icon="📝" items={plan.actions} />
        <Section title="ارزیابی مجدد (ارزشیابی)" icon="⏱️" items={plan.reassess} tone="border-[#ca7f3c]/40" />
      </div>

      {plan.safety.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 bg-[#fbf9f5]">
          <Section title="پایش عوارض و ملاحظات ایمنی" icon="🛡️" items={plan.safety} tone="border-rose-300" />
        </div>
      )}

      {ageRows.length > 0 && assessment.severity !== PainSeverity.NONE && (
        <div className="px-6 sm:px-8 pb-6 bg-[#fbf9f5]">
          <div className="p-6 rounded-3xl bg-white border-2 border-[#d8cfbe] shadow-sm">
            <h5 className="text-lg font-black text-[#062a2e] mb-4">🎈 مداخلات غیردارویی مؤثر متناسب با سن</h5>
            <div className="space-y-3">
              {ageRows.map(r => (
                <div key={r.key} className="p-4 rounded-2xl bg-[#fbf9f5] border border-[#d8cfbe]">
                  <p className="font-black text-[#096067] mb-1">{r.label}</p>
                  <p className="text-[#1e293b] font-bold leading-relaxed text-sm">{r.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 sm:px-8 pb-8 bg-[#fbf9f5]">
        <div className="p-5 rounded-2xl bg-[#062a2e] text-[#eedaa8] text-sm font-bold leading-relaxed">
          {needsPhysician && 'نتیجهٔ ارزیابی مجدد باید به اطلاع پزشک مربوطه برسد و در هر مرحله از تشخیص، تسکین و ارزیابی مجدد، مستندسازی انجام شود؛ تصمیم دربارهٔ قطع یا ادامهٔ داروی مسکن بر اساس نظر پزشک است. '}
          این پلن بر پایهٔ دستورالعمل‌های ابلاغی معاونت پرستاری وزارت بهداشت (۱۴۰۳–۱۴۰۴) تنظیم شده و جایگزین دستور پزشک و قضاوت بالینی نیست.
        </div>
      </div>
    </div>
  );
};

export default ManagementPlan;
