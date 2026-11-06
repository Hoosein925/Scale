/**
 * مراقبت پرستاری هر تشخیص — تدوین‌شده بر پایهٔ کتاب
 * Ackley, Ladwig, Makic, Martinez-Kratz, Zanotti. Nursing Diagnosis Handbook: An Evidence-Based Guide to Planning Care, 12th ed. (Elsevier)
 * (ترجمه و تلخیص فارسی؛ همگی طبق دستور پزشک و پروتکل بیمارستان)
 */
export interface DiagnosisCare {
  /** پیامدهای مورد انتظار (Client Outcomes) */
  o?: string[];
  /** ارزیابی پرستاری */
  a?: string[];
  /** مداخلات پرستاری */
  i: string[];
  /** تغذیه و توصیه‌های سلامتی */
  n?: string[];
  /** آموزش به بیمار و خانواده / برنامهٔ ترخیص */
  t: string[];
  /** سالمندان */
  g?: string[];
  /** کودکان / نوزادان */
  p?: string[];
  /** نکات فرهنگی */
  c?: string[];
  /** مراقبت در منزل */
  h?: string[];
}
