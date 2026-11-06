import { INTERVENTIONS_PART1 } from './nursingInterventionsPart1';
import { INTERVENTIONS_PART2 } from './nursingInterventionsPart2';
import { INTERVENTIONS_PART3 } from './nursingInterventionsPart3';

/**
 * مداخلات پرستاری هر تشخیص (کلید = id در nursingDiagnosisData.ts).
 *
 * توجه: فایل منبع (اسلایدهای NANDA-I) مداخله ندارد؛ این مداخلات پیشنهادی هستند و بر پایهٔ
 * چارچوب NANDA-I/NIC و منابع آموزشی پرستاری (Ackley & Ladwig، Doenges، Nurseslabs و …) تدوین شده‌اند
 * و باید پیش از استفادهٔ آموزشی/بالینی توسط مدرس یا پروتکل بیمارستان بازبینی شوند.
 */
export const NURSING_INTERVENTIONS: Record<number, string[]> = {
  ...INTERVENTIONS_PART1,
  ...INTERVENTIONS_PART2,
  ...INTERVENTIONS_PART3,
};

export const INTERVENTION_SOURCES: string[] = [
  'NANDA International. Nursing Diagnoses: Definitions and Classification (Herdman & Kamitsuru) — چارچوب تشخیص‌ها',
  'Bulechek G. et al. Nursing Interventions Classification (NIC) — چارچوب مداخلات',
  'Ackley B.J., Ladwig G.B. Nursing Diagnosis Handbook: An Evidence-Based Guide to Planning Care, Elsevier',
  'Nurseslabs — Nursing Diagnosis & Care Plan Guides (nurseslabs.com)',
  'ابلاغیه‌های معاونت پرستاری وزارت بهداشت دربارهٔ مدیریت درد (۱۴۰۳–۱۴۰۴) برای تشخیص‌های درد',
];
