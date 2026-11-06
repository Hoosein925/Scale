
import React, { useState, useEffect } from 'react';
import AssessmentResultDisplay from './common/AssessmentResultDisplay';
import ModuleHeader from './common/ModuleHeader';

const RASSScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [score, setScore] = useState<number>(0);

    const rassLevels = [
        { score: 4, term: 'تهاجمی (Combative)', desc: 'خطر واضح برای پرسنل' },
        { score: 3, term: 'بسیار آژیته (Very Agitated)', desc: 'کشیدن لوله‌ها، رفتار تهاجمی' },
        { score: 2, term: 'آژیته (Agitated)', desc: 'حرکات غیرهدفمند و مکرر' },
        { score: 1, term: 'بی‌قرار (Restless)', desc: 'مضطرب یا نگران، اما حرکات غیرتهاجمی' },
        { score: 0, term: 'هوشیار و آرام (Alert and Calm)', desc: '' },
        { score: -1, term: 'خواب‌آلود (Drowsy)', desc: 'کاملاً هوشیار نیست؛ با صدا بیش از ۱۰ ثانیه بیدار می‌ماند (باز شدن چشم و تماس چشمی)' },
        { score: -2, term: 'آرام‌بخشی سبک (Light Sedation)', desc: 'با صدا کمتر از ۱۰ ثانیه بیدار می‌شود و تماس چشمی برقرار می‌کند' },
        { score: -3, term: 'آرام‌بخشی متوسط (Moderate Sedation)', desc: 'با صدا حرکت یا باز شدن چشم دارد، ولی تماس چشمی ندارد' },
        { score: -4, term: 'آرام‌بخشی عمیق (Deep Sedation)', desc: 'به صدا پاسخی نمی‌دهد، ولی با تحریک فیزیکی حرکت یا باز شدن چشم دارد' },
        { score: -5, term: 'غیرقابل بیدار شدن (Unarousable)', desc: 'بدون پاسخ به صدا یا تحریک فیزیکی' },
    ];

    useEffect(() => {
        const level = rassLevels.find(l => l.score === score);
        if (!level) return;

        let recommendations: string[] = [];
        let color = "bg-emerald-600", icon = "✅";

        if (score >= 3) {
            color = "bg-red-800"; icon = "🆘";
            recommendations = ["نیاز فوری به مداخله جهت کنترل آژیتاسیون.", "بررسی علل زمینه‌ای (درد، دلیریوم، هایپوکسی).", "اطلاع به پزشک جهت تنظیم داروهای سداتیو."];
        } else if (score >= 1) {
            color = "bg-amber-500"; icon = "🟡";
            recommendations = ["ارزیابی بیمار از نظر درد و اضطراب.", "استفاده از روش‌های غیردارویی آرام‌سازی.", "بررسی نیاز به تنظیم داروهای آرامبخش."];
        } else if (score === 0) {
            recommendations = ["سطح ایده‌آل. ادامه پایش طبق روتین."];
        } else if (score >= -2) {
            color = "bg-sky-600"; icon = "💤";
            recommendations = ["سطح مناسبی از سدیشن برای بسیاری از بیماران.", "ادامه پایش وضعیت هوشیاری و تنفسی."];
        } else { // -3 to -5
            color = "bg-indigo-800"; icon = "😴";
            recommendations = ["سدیشن عمیق. پایش دقیق همودینامیک و وضعیت تنفسی.", "بررسی روزانه جهت امکان سبک کردن سدیشن (Sedation Vacation)."];
        }

        onResult({ score, interpretation: level.term, color, icon, recommendations });
    }, [score]);

    return (
        <div className="pt-8 space-y-4">
            {rassLevels.map(level => (
                <button
                    key={level.score}
                    onClick={() => setScore(level.score)}
                    className={`w-full text-right p-5 rounded-2xl border-2 transition-all flex items-center gap-5 cursor-pointer ${
                        score === level.score
                            ? 'bg-[#096067] border-[#c69d5b] text-white shadow-md -translate-y-0.5'
                            : 'bg-white/90 border-[#c69d5b]/25 hover:border-[#096067] hover:bg-white shadow-sm'
                    }`}
                >
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-2xl ${
                        score === level.score
                            ? 'bg-[#ca7f3c] text-white shadow-sm'
                            : 'bg-[#096067]/10 text-[#096067]'
                    }`}>
                        {level.score > 0 ? `+${level.score}` : level.score}
                    </div>
                    <div>
                        <p className={`font-bold text-lg ${score === level.score ? 'text-white' : 'text-[#062a2e]'}`}>{level.term}</p>
                        <p className={`text-sm ${score === level.score ? 'text-white/80' : 'text-[#475569]'}`}>{level.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

const SOFAScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [values, setValues] = useState<any>({
        paO2: 95, fio2: 21, vent: false,
        platelets: 200, bilirubin: 1,
        map: 80, vasopressor: 'none',
        gcs: 15, creatinine: 1, urine: 2000
    });

    useEffect(() => {
        let totalScore = 0;
        let interpretationText = "";
        
        // Respiration
        const pfRatio = values.paO2 / (values.fio2 / 100);
        if (pfRatio < 100 && values.vent) totalScore += 4;
        else if (pfRatio < 200 && values.vent) totalScore += 3;
        else if (pfRatio < 300) totalScore += 2;
        else if (pfRatio < 400) totalScore += 1;

        // Coagulation
        if (values.platelets < 20) totalScore += 4;
        else if (values.platelets < 50) totalScore += 3;
        else if (values.platelets < 100) totalScore += 2;
        else if (values.platelets < 150) totalScore += 1;

        // Liver
        if (values.bilirubin >= 12) totalScore += 4;
        else if (values.bilirubin >= 6) totalScore += 3;
        else if (values.bilirubin >= 2) totalScore += 2;
        else if (values.bilirubin >= 1.2) totalScore += 1;

        // Cardiovascular
        if (values.vasopressor === 'high') totalScore += 4;
        else if (values.vasopressor === 'medium') totalScore += 3;
        else if (values.vasopressor === 'low') totalScore += 2;
        else if (values.map < 70) totalScore += 1;
        
        // CNS
        if (values.gcs < 6) totalScore += 4;
        else if (values.gcs <= 9) totalScore += 3;
        else if (values.gcs <= 12) totalScore += 2;
        else if (values.gcs <= 14) totalScore += 1;
        
        // Renal
        if (values.creatinine >= 5 || values.urine < 200) totalScore += 4;
        else if (values.creatinine >= 3.5 || values.urine < 500) totalScore += 3;
        else if (values.creatinine >= 2) totalScore += 2;
        else if (values.creatinine >= 1.2) totalScore += 1;

        interpretationText = `امتیاز بالاتر نشان‌دهنده اختلال عملکرد ارگان شدیدتر است. افزایش ناگهانی امتیاز به میزان ۲ یا بیشتر می‌تواند نشانگر سپسیس باشد.`;
        
        onResult({ score: totalScore, interpretation: interpretationText, color: 'bg-indigo-700', icon: '🧬' });
    }, [
        values.paO2, values.fio2, values.vent,
        values.platelets, values.bilirubin,
        values.map, values.vasopressor,
        values.gcs, values.creatinine, values.urine
    ]);

    const handleChange = (field: string, value: any) => {
        setValues((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="pt-8 space-y-8">
            <InputGroup title="۱. تنفسی (PaO2/FiO2)">
                <InputRow label="PaO2 (mmHg)" value={values.paO2} onChange={(v) => handleChange('paO2', v)} />
                <InputRow label="FiO2 (%)" value={values.fio2} onChange={(v) => handleChange('fio2', v)} />
                 <CheckboxRow label="تحت تهویه مکانیکی" checked={values.vent} onChange={(v) => handleChange('vent', v)} />
            </InputGroup>
            <InputGroup title="۲. انعقادی">
                 <InputRow label="پلاکت (x10³/µL)" value={values.platelets} onChange={(v) => handleChange('platelets', v)} />
            </InputGroup>
             <InputGroup title="۳. کبدی">
                 <InputRow label="بیلیروبین (mg/dL)" value={values.bilirubin} onChange={(v) => handleChange('bilirubin', v)} />
            </InputGroup>
            <InputGroup title="۴. قلبی-عروقی">
                <InputRow label="فشار متوسط شریانی (MAP)" value={values.map} onChange={(v) => handleChange('map', v)} />
                <RadioGroup
                    value={values.vasopressor}
                    onChange={(v) => handleChange('vasopressor', v)}
                    options={[
                        { value: 'none', label: 'بدون وازوپرسور' },
                        { value: 'low', label: 'دوپامین ≤۵ یا دوبوتامین' },
                        { value: 'medium', label: 'دوپامین >۵ یا اپی/نوراپی ≤۰.۱' },
                        { value: 'high', label: 'دوپامین >۱۵ یا اپی/نوراپی >۰.۱' },
                    ]}
                />
            </InputGroup>
            <InputGroup title="۵. سیستم عصبی مرکزی">
                 <InputRow label="امتیاز GCS" value={values.gcs} min={3} max={15} onChange={(v) => handleChange('gcs', v)} />
            </InputGroup>
             <InputGroup title="۶. کلیوی">
                 <InputRow label="کراتینین (mg/dL)" value={values.creatinine} onChange={(v) => handleChange('creatinine', v)} />
                 <InputRow label="برون‌ده ادراری (mL/day)" value={values.urine} onChange={(v) => handleChange('urine', v)} />
            </InputGroup>
        </div>
    );
};

// ---------- APACHE II (نسخهٔ کامل: ۱۲ متغیر فیزیولوژیک + سن + بیماری مزمن) ----------
const rangeScore = (v: number, table: [number, number, number][]): number => {
    // table: [min, max, points] ؛ بازه‌ها شامل مرز هستند
    for (const [lo, hi, pts] of table) if (v >= lo && v <= hi) return pts;
    return 0;
};

const apacheTemp = (t: number) => rangeScore(t, [[41, 99, 4], [39, 40.99, 3], [38.5, 38.99, 1], [36, 38.49, 0], [34, 35.99, 1], [32, 33.99, 2], [30, 31.99, 3], [0, 29.99, 4]]);
const apacheMap = (m: number) => rangeScore(m, [[160, 999, 4], [130, 159.99, 3], [110, 129.99, 2], [70, 109.99, 0], [50, 69.99, 2], [0, 49.99, 4]]);
const apacheHr = (h: number) => rangeScore(h, [[180, 999, 4], [140, 179.99, 3], [110, 139.99, 2], [70, 109.99, 0], [55, 69.99, 2], [40, 54.99, 3], [0, 39.99, 4]]);
const apacheRr = (r: number) => rangeScore(r, [[50, 999, 4], [35, 49.99, 3], [25, 34.99, 1], [12, 24.99, 0], [10, 11.99, 1], [6, 9.99, 2], [0, 5.99, 4]]);
const apachePh = (p: number) => rangeScore(p, [[7.7, 9, 4], [7.6, 7.699, 3], [7.5, 7.599, 1], [7.33, 7.499, 0], [7.25, 7.329, 2], [7.15, 7.249, 3], [0, 7.149, 4]]);
const apacheNa = (n: number) => rangeScore(n, [[180, 999, 4], [160, 179.99, 3], [155, 159.99, 2], [150, 154.99, 1], [130, 149.99, 0], [120, 129.99, 2], [111, 119.99, 3], [0, 110.99, 4]]);
const apacheK = (k: number) => rangeScore(k, [[7, 99, 4], [6, 6.99, 3], [5.5, 5.99, 1], [3.5, 5.49, 0], [3, 3.49, 1], [2.5, 2.99, 2], [0, 2.49, 4]]);
const apacheHct = (h: number) => rangeScore(h, [[60, 100, 4], [50, 59.99, 2], [46, 49.99, 1], [30, 45.99, 0], [20, 29.99, 2], [0, 19.99, 4]]);
const apacheWbc = (w: number) => rangeScore(w, [[40, 999, 4], [20, 39.99, 2], [15, 19.99, 1], [3, 14.99, 0], [1, 2.99, 2], [0, 0.99, 4]]);
const apacheCreat = (c: number, arf: boolean) => {
    const base = rangeScore(c, [[3.5, 99, 4], [2, 3.49, 3], [1.5, 1.99, 2], [0.6, 1.49, 0], [0, 0.59, 2]]);
    return arf ? base * 2 : base;
};
const apacheOxy = (fio2Pct: number, pao2: number, paco2: number) => {
    if (fio2Pct >= 50) {
        const aado2 = (fio2Pct / 100) * 713 - paco2 / 0.8 - pao2;
        return { pts: rangeScore(aado2, [[500, 9999, 4], [350, 499.99, 3], [200, 349.99, 2], [-999, 199.99, 0]]), label: `A-aDO₂ = ${aado2.toFixed(0)} mmHg` };
    }
    return { pts: rangeScore(pao2, [[71, 999, 0], [61, 70.99, 1], [55, 60.99, 3], [0, 54.99, 4]]), label: `PaO₂ = ${pao2} mmHg (FiO₂ < ۵۰٪)` };
};
const apacheAge = (a: number) => (a >= 75 ? 6 : a >= 65 ? 5 : a >= 55 ? 3 : a >= 45 ? 2 : 0);
const apacheMortality = (s: number) => (s <= 4 ? '≈ ۴٪' : s <= 9 ? '≈ ۸٪' : s <= 14 ? '≈ ۱۵٪' : s <= 19 ? '≈ ۲۵٪' : s <= 24 ? '≈ ۴۰٪' : s <= 29 ? '≈ ۵۵٪' : s <= 34 ? '≈ ۷۳٪' : '≈ ۸۵٪ یا بیشتر');

const APACHEIIScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [v, setV] = useState<any>({
        temp: 37, map: 90, hr: 80, rr: 16, fio2: 21, pao2: 95, paco2: 40, ph: 7.4, na: 140, k: 4,
        creat: 1, arf: false, hct: 40, wbc: 8, gcs: 15, age: 50, chronic: 'none',
    });
    const [detail, setDetail] = useState<any>(null);

    useEffect(() => {
        const oxy = apacheOxy(v.fio2, v.pao2, v.paco2);
        const parts = {
            temp: apacheTemp(v.temp), map: apacheMap(v.map), hr: apacheHr(v.hr), rr: apacheRr(v.rr),
            oxy: oxy.pts, ph: apachePh(v.ph), na: apacheNa(v.na), k: apacheK(v.k),
            creat: apacheCreat(v.creat, v.arf), hct: apacheHct(v.hct), wbc: apacheWbc(v.wbc),
            gcs: Math.max(0, Math.min(12, 15 - v.gcs)),
        };
        const aps = (Object.values(parts) as number[]).reduce((a, b) => a + b, 0);
        const ageScore = apacheAge(v.age);
        const chronicScore = v.chronic === 'none' ? 0 : v.chronic === 'elective' ? 2 : 5;
        const total = aps + ageScore + chronicScore;
        setDetail({ parts, aps, ageScore, chronicScore, oxyLabel: oxy.label });
        onResult({
            score: total,
            interpretation: `APS = ${aps} • سن = ${ageScore} • بیماری مزمن = ${chronicScore} — مرگ‌ومیر بیمارستانی تقریبی ${apacheMortality(total)} (برآورد جمعیتی، نه پیش‌بینی فردی)`,
            color: total >= 25 ? 'bg-red-800' : total >= 15 ? 'bg-rose-700' : total >= 10 ? 'bg-orange-600' : 'bg-emerald-600',
            icon: '📈',
            recommendations: [
                'باید از بدترین مقادیر ۲۴ ساعت اول پذیرش در ICU استفاده شود.',
                'APACHE II ابزار تعیین شدت بیماری و پیش‌آگهی جمعیتی است و برای تصمیم‌گیری دربارهٔ درمان یک بیمار به‌تنهایی کافی نیست.',
                'دمای مورد استفاده باید رکتال باشد؛ اگر هر متغیر اندازه‌گیری نشده، مقدار نرمال آن را وارد کنید.',
            ],
        });
    }, [v]);

    const set = (k: string, val: any) => setV((p: any) => ({ ...p, [k]: val }));
    const row = (label: string, k: string, pts?: number, step?: number) => (
        <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-[#062a2e] w-1/2">{label}</label>
            <input type="number" step={step ?? 'any'} value={v[k]} onChange={(e) => set(k, parseFloat(e.target.value) || 0)}
                className="w-1/3 p-2 rounded-xl bg-white border border-[#c69d5b]/30 text-[#062a2e] font-bold text-center focus:border-[#096067] focus:outline-none" />
            {pts !== undefined && <span className="w-1/6 text-center text-xs font-black text-[#ca7f3c]">+{pts}</span>}
        </div>
    );
    const p = detail?.parts || {};

    return (
        <div className="pt-8 space-y-8">
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-sm font-bold">
                بدترین مقدار هر متغیر در ۲۴ ساعت اول پذیرش را وارد کنید. عدد کنار هر ورودی، امتیاز همان متغیر است.
            </div>
            <InputGroup title="بخش A: امتیاز فیزیولوژی حاد (APS)">
                {row('دمای رکتال (°C)', 'temp', p.temp)}
                {row('فشار متوسط شریانی MAP (mmHg)', 'map', p.map)}
                {row('ضربان قلب (در دقیقه)', 'hr', p.hr)}
                {row('تعداد تنفس (در دقیقه)', 'rr', p.rr)}
                {row('FiO₂ (٪)', 'fio2')}
                {row('PaO₂ (mmHg)', 'pao2', p.oxy)}
                {row('PaCO₂ (mmHg) — برای A-aDO₂ وقتی FiO₂ ≥ ۵۰٪', 'paco2')}
                {row('pH شریانی', 'ph', p.ph, 0.01)}
                {row('سدیم سرم (mEq/L)', 'na', p.na)}
                {row('پتاسیم سرم (mEq/L)', 'k', p.k, 0.1)}
                {row('کراتینین سرم (mg/dL)', 'creat', p.creat, 0.1)}
                <CheckboxRow label="نارسایی حاد کلیه (ARF) — امتیاز کراتینین دو برابر می‌شود" checked={v.arf} onChange={(c: boolean) => set('arf', c)} />
                {row('هماتوکریت (٪)', 'hct', p.hct)}
                {row('WBC (×۱۰³/µL)', 'wbc', p.wbc, 0.1)}
                {row('GCS (۳ تا ۱۵)؛ امتیاز = ۱۵ − GCS', 'gcs', p.gcs)}
                {detail && <p className="text-xs font-bold text-[#475569]">اکسیژناسیون: {detail.oxyLabel}</p>}
            </InputGroup>
            <InputGroup title="بخش B: سن">
                {row('سن بیمار (سال)', 'age', detail?.ageScore)}
            </InputGroup>
            <InputGroup title="بخش C: بیماری مزمن (نارسایی شدید ارگان یا نقص ایمنی)">
                <RadioGroup name="chronic" value={v.chronic} onChange={(c: string) => set('chronic', c)} options={[
                    { value: 'none', label: 'ندارد (۰)' },
                    { value: 'elective', label: 'دارد — بعد از جراحی الکتیو (۲)' },
                    { value: 'emergency', label: 'دارد — بعد از جراحی اورژانس (۵)' },
                    { value: 'nonop', label: 'دارد — بیمار غیرجراحی (۵)' },
                ]} />
            </InputGroup>
        </div>
    );
};

// ---------- CAM-ICU ----------
const CAMICUScale: React.FC<{ onResult: (res: any) => void }> = ({ onResult }) => {
    const [rass, setRass] = useState<number | null>(null);
    const [f1, setF1] = useState<boolean | null>(null);        // شروع حاد یا سیر نوسانی
    const [errors2, setErrors2] = useState<number>(0);          // خطاهای آزمون توجه (حروف)
    const [errors3, setErrors3] = useState<number>(0);          // خطاهای تفکر نامنظم (۰ تا ۵)
    const [stage, setStage] = useState<'letters' | 'pictures'>('letters');

    const unable = rass !== null && rass <= -4;
    const f2 = stage === 'letters' ? errors2 > 2 : errors2 < 8; // در حالت تصویری، errors2 = تعداد پاسخ صحیح از ۱۰
    const f3 = errors3 > 1;
    const f4 = rass !== null && rass !== 0;
    const positive = f1 === true && f2 && (f3 || f4);
    const ready = rass !== null && !unable && f1 !== null;

    useEffect(() => {
        if (rass === null) { onResult(null); return; }
        if (unable) {
            onResult({ score: 'غیرقابل ارزیابی', interpretation: 'RASS −۴ یا −۵: بیمار بیش از حد آرام‌بخش‌شده است؛ ارزیابی CAM-ICU ممکن نیست. وقتی RASS به ≥ −۳ رسید دوباره ارزیابی کنید.', color: 'bg-indigo-800', icon: '😴', recommendations: ['ارزیابی روزانهٔ امکان سبک‌کردن آرام‌بخشی (Sedation Vacation) با نظر پزشک.', 'ارزیابی مجدد دلیریوم در هر شیفت یا با تغییر وضعیت بالینی.'] });
            return;
        }
        if (!ready) { onResult(null); return; }
        const subtype = rass! > 0 ? 'هایپراکتیو' : rass! < 0 ? 'هیپوأکتیو' : 'مختلط/نامشخص';
        onResult({
            score: positive ? 'مثبت' : 'منفی',
            interpretation: positive
                ? `CAM-ICU مثبت — دلیریوم (نوع ${subtype}). ویژگی ۱ ✔، ویژگی ۲ ✔، ${f3 ? 'ویژگی ۳ ✔' : ''}${f3 && f4 ? ' و ' : ''}${f4 ? 'ویژگی ۴ ✔' : ''}`
                : 'CAM-ICU منفی — معیارهای دلیریوم برقرار نیست.',
            color: positive ? 'bg-red-800' : 'bg-emerald-600',
            icon: positive ? '🧠' : '✅',
            recommendations: positive ? [
                'اطلاع به پزشک و بررسی علل قابل‌اصلاح: درد، هیپوکسی، اختلال الکترولیت/گلوکز، عفونت/سپسیس، احتباس ادراری/یبوست، داروها (بنزودیازپین‌ها، آنتی‌کولینرژیک‌ها، مخدرها) و ترک الکل/دارو.',
                'کنترل درد (BPS/VAS) و ارزیابی عمق آرام‌بخشی (RASS)؛ از بنزودیازپین‌ها تا حد ممکن پرهیز شود (طبق نظر پزشک).',
                'مداخلات غیردارویی: جهت‌یابی مکرر (ساعت و تقویم)، عینک و سمعک، چرخهٔ خواب و بیداری (نور روز/تاریکی و کاهش سر و صدای شب)، تحرک زودهنگام، حضور خانواده.',
                'ایمنی بیمار: پیشگیری از خارج‌کردن لوله‌ها/کاتترها و سقوط؛ مهار فیزیکی فقط در صورت ضرورت و طبق دستور.',
                'ارزیابی مجدد CAM-ICU حداقل هر شیفت و ثبت در پرونده.',
            ] : [
                'ادامهٔ ارزیابی روتین دلیریوم حداقل یک‌بار در هر شیفت و با هر تغییر وضعیت هوشیاری.',
                'اجرای اقدامات پیشگیرانه: خواب مناسب، تحرک زودهنگام، جهت‌یابی، رفع درد، تعدیل داروهای پرخطر.',
            ],
        });
    }, [rass, f1, errors2, errors3, stage]);

    const YN = ({ value, onChange }: { value: boolean | null; onChange: (b: boolean) => void }) => (
        <div className="grid grid-cols-2 gap-3 max-w-md">
            {[[true, 'بله'], [false, 'خیر']].map(([k, l]) => (
                <button key={String(k)} onClick={() => onChange(k as boolean)}
                    className={`py-3 rounded-2xl font-black border-2 cursor-pointer ${value === k ? 'bg-[#096067] text-white border-[#c69d5b]' : 'bg-white border-[#d8cfbe] text-[#062a2e]'}`}>{l as string}</button>
            ))}
        </div>
    );
    const Counter = ({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) => (
        <div className="flex items-center gap-4">
            <button onClick={() => onChange(Math.max(0, value - 1))} className="w-12 h-12 rounded-2xl bg-white border-2 border-[#d8cfbe] text-2xl font-black cursor-pointer">−</button>
            <span className="text-4xl font-black text-[#096067] w-12 text-center tabular-nums">{value}</span>
            <button onClick={() => onChange(Math.min(max, value + 1))} className="w-12 h-12 rounded-2xl bg-white border-2 border-[#d8cfbe] text-2xl font-black cursor-pointer">+</button>
        </div>
    );
    const Feature = ({ n, title, ok, children }: any) => (
        <div className={`p-6 rounded-3xl border-2 space-y-4 ${ok === true ? 'bg-rose-50 border-rose-300' : ok === false ? 'bg-emerald-50 border-emerald-300' : 'bg-white/90 border-[#d8cfbe]'}`}>
            <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-black text-[#062a2e]">ویژگی {n}: {title}</h4>
                {ok !== null && <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${ok ? 'bg-rose-600' : 'bg-emerald-600'}`}>{ok ? 'مثبت' : 'منفی'}</span>}
            </div>
            {children}
        </div>
    );

    return (
        <div className="pt-8 space-y-6">
            <div className="p-4 rounded-2xl bg-[#096067]/10 border border-[#096067]/30 text-sm font-bold leading-relaxed">
                CAM-ICU (Confusion Assessment Method for the ICU) برای غربالگری دلیریوم در بیماران ICU، از جمله بیماران تحت تهویهٔ مکانیکی. مثبت بودن = ویژگی ۱ و ویژگی ۲ و (ویژگی ۳ یا ویژگی ۴).
            </div>

            <div className="p-6 rounded-3xl bg-white/90 border-2 border-[#d8cfbe] space-y-4">
                <h4 className="text-lg font-black text-[#062a2e]">گام ۱: سطح هوشیاری (RASS)</h4>
                <p className="text-sm font-bold text-[#475569]">اگر RASS برابر −۴ یا −۵ باشد ارزیابی متوقف می‌شود؛ اگر ≥ −۳ است ادامه دهید.</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                    {[4, 3, 2, 1, 0, -1, -2, -3, -4, -5].map(n => (
                        <button key={n} onClick={() => setRass(n)}
                            className={`py-3 rounded-xl font-black border-2 cursor-pointer ${rass === n ? 'bg-[#096067] text-white border-[#c69d5b]' : 'bg-white border-[#d8cfbe] text-[#062a2e]'}`}>
                            {n > 0 ? `+${n}` : n}
                        </button>
                    ))}
                </div>
                {unable && <p className="font-black text-indigo-800">RASS ≤ −۴: ارزیابی CAM-ICU قابل انجام نیست (آرام‌بخشی عمیق).</p>}
            </div>

            {rass !== null && !unable && (
                <>
                    <Feature n="۱" title="شروع حاد یا سیر نوسانی وضعیت ذهنی" ok={f1}>
                        <p className="text-sm font-bold text-[#475569] leading-relaxed">آیا نسبت به وضعیت پایه تغییر حاد در وضعیت ذهنی وجود دارد؟ یا در ۲۴ ساعت گذشته وضعیت ذهنی نوسان داشته است (مثلاً نوسان RASS، GCS یا ارزیابی قبلی دلیریوم)؟</p>
                        <YN value={f1} onChange={setF1} />
                    </Feature>

                    <Feature n="۲" title="بی‌توجهی (Inattention)" ok={f1 === null ? null : f2}>
                        <div className="flex gap-2 p-1.5 bg-[#ede6d8] rounded-2xl max-w-md">
                            {[['letters', 'آزمون حروف (SAVEAHAART)'], ['pictures', 'آزمون تصاویر']].map(([k, l]) => (
                                <button key={k} onClick={() => { setStage(k as any); setErrors2(k === 'letters' ? 0 : 10); }}
                                    className={`flex-1 py-2 rounded-xl text-xs font-black cursor-pointer ${stage === k ? 'bg-[#096067] text-white' : 'text-[#062a2e]'}`}>{l}</button>
                            ))}
                        </div>
                        {stage === 'letters' ? (
                            <>
                                <p className="text-sm font-bold text-[#475569] leading-relaxed">به بیمار بگویید: «من ۱۰ حرف برایتان می‌خوانم؛ هر بار که حرف <b>A</b> را شنیدید دستم را فشار دهید.» حروف را با فاصلهٔ یک ثانیه و با صدای واضح بخوانید:</p>
                                <p className="text-3xl font-black tracking-[0.4em] text-[#096067] text-center" dir="ltr">S A V E A H A A R T</p>
                                <p className="text-sm font-bold text-[#475569]">خطا = فشار ندادن روی «A» یا فشار دادن روی حرف دیگر. تعداد خطاها (بیش از ۲ خطا = مثبت):</p>
                                <Counter value={errors2} onChange={setErrors2} max={10} />
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-[#475569] leading-relaxed">برای بیماری که قادر به آزمون حروف نیست (مثلاً ناخواندن/ناشنوا): ۵ تصویر را نشان دهید و سپس ۱۰ تصویر (۵ قبلی + ۵ جدید) را نشان دهید و بپرسید «قبلاً دیدید؟». تعداد پاسخ‌های صحیح از ۱۰ (کمتر از ۸ = مثبت):</p>
                                <Counter value={errors2} onChange={setErrors2} max={10} />
                            </>
                        )}
                    </Feature>

                    <Feature n="۳" title="تفکر نامنظم (Disorganized thinking)" ok={f1 === null ? null : f3}>
                        <p className="text-sm font-bold text-[#475569] leading-relaxed">چهار پرسش بله/خیر (یک مجموعه را برای هر ارزیابی انتخاب کنید):</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-bold">
                            <div className="p-3 rounded-xl bg-[#fbf9f5] border border-[#d8cfbe]">
                                <b>مجموعه A:</b><br />۱) آیا سنگ روی آب شناور می‌ماند؟<br />۲) آیا در دریا ماهی وجود دارد؟<br />۳) آیا یک کیلوگرم از دو کیلوگرم سنگین‌تر است؟<br />۴) آیا می‌توان با چکش به میخ کوبید؟
                            </div>
                            <div className="p-3 rounded-xl bg-[#fbf9f5] border border-[#d8cfbe]">
                                <b>مجموعه B:</b><br />۱) آیا برگ روی آب شناور می‌ماند؟<br />۲) آیا در دریا فیل وجود دارد؟<br />۳) آیا دو کیلوگرم از یک کیلوگرم سنگین‌تر است؟<br />۴) آیا می‌توان با چکش چوب را برید؟
                            </div>
                        </div>
                        <p className="text-sm font-bold text-[#475569] leading-relaxed">سپس دستور: «این‌قدر انگشت بالا ببرید» (۲ انگشت را نشان دهید)، و بعد «همین کار را با دست دیگر انجام دهید» (بدون نمایش). خطای دستور نیز به تعداد خطاها اضافه می‌شود. مجموع خطاها (بیش از ۱ خطا = مثبت):</p>
                        <Counter value={errors3} onChange={setErrors3} max={5} />
                    </Feature>

                    <Feature n="۴" title="سطح هوشیاری تغییریافته" ok={f4}>
                        <p className="text-sm font-bold text-[#475569]">اگر RASS فعلی برابر ۰ نباشد (هر مقداری غیر از هوشیار و آرام) این ویژگی مثبت است. RASS فعلی: <b>{rass! > 0 ? `+${rass}` : rass}</b></p>
                    </Feature>
                </>
            )}
        </div>
    );
};

// ---------- توضیح مقیاس‌ها (قبل از نحوهٔ محاسبه) ----------
const SCALE_INFO: Record<string, { full: string; what: string; purpose: string; parts: string[]; score: string; when: string; note?: string }> = {
    'RASS': {
        full: 'Richmond Agitation-Sedation Scale — مقیاس بی‌قراری و آرام‌بخشی ریچموند',
        what: 'ابزاری ۱۰ درجه‌ای برای سنجش سطح هوشیاری و عمق آرام‌بخشی (یا شدت بی‌قراری) بیمار بستری در ICU؛ از ‎+۴ (پرخاشگر) تا ‎−۵ (غیرقابل بیدارشدن).',
        purpose: 'هدایت تنظیم دوز داروهای آرام‌بخش و رسیدن به سطح آرام‌بخشی هدف (معمولاً ۰ تا ‎−۲، بیمار آرام و قابل بیدارشدن) و پیشگیری از آرام‌بخشی بیش‌ازحد یا بی‌قراری کنترل‌نشده. نتیجهٔ RASS پیش‌نیاز انجام CAM-ICU است.',
        parts: [
            'گام ۱: مشاهدهٔ بیمار بدون تحریک (هوشیار، آرام یا بی‌قرار؟)',
            'گام ۲: تحریک کلامی — صدا زدن بیمار با اسم و درخواست باز کردن چشم و تماس چشمی؛ ثبت مدت تماس چشمی',
            'گام ۳: اگر به صدا پاسخ نداد، تحریک فیزیکی (تکان‌دادن شانه، سپس مالش جناغ)',
        ],
        score: 'امتیازها: ‎+۴ تا ‎+۱ (بی‌قراری)، ۰ (هوشیار و آرام)، ‎−۱ تا ‎−۳ (آرام‌بخشی سبک تا متوسط)، ‎−۴ و ‎−۵ (آرام‌بخشی عمیق).',
        when: 'حداقل یک‌بار در هر شیفت و پس از هر تغییر دوز داروهای آرام‌بخش/مخدر.',
    },
    'CAM-ICU': {
        full: 'Confusion Assessment Method for the ICU — روش ارزیابی کانفیوژن در ICU',
        what: 'ابزار معتبر و سریع (حدود ۲ تا ۵ دقیقه) برای غربالگری «دلیریوم» (اختلال حاد توجه و شناخت) در بیماران ICU، حتی بیماران تحت تهویهٔ مکانیکی که نمی‌توانند صحبت کنند.',
        purpose: 'تشخیص زودهنگام دلیریوم که با افزایش مرگ‌ومیر، طولانی‌شدن بستری و عوارض شناختی همراه است، تا علل قابل‌اصلاح (درد، هیپوکسی، عفونت، داروها و…) سریع‌تر بررسی شوند. دلیریوم می‌تواند هایپراکتیو، هیپوأکتیو (شایع‌تر و اغلب نادیده) یا مختلط باشد.',
        parts: [
            'پیش‌نیاز: RASS بیمار باید ‎−۳ یا بالاتر باشد (اگر ‎−۴ یا ‎−۵ است ارزیابی ممکن نیست)',
            'ویژگی ۱: شروع حاد یا سیر نوسانی تغییر وضعیت ذهنی',
            'ویژگی ۲: بی‌توجهی (آزمون حروف SAVEAHAART یا آزمون تصاویر)',
            'ویژگی ۳: تفکر نامنظم (۴ پرسش بله/خیر + یک دستور)',
            'ویژگی ۴: سطح هوشیاری تغییریافته (RASS غیر از صفر)',
        ],
        score: 'نتیجه مثبت/منفی است (نه عددی): CAM-ICU مثبت = ویژگی ۱ و ویژگی ۲ و (ویژگی ۳ یا ویژگی ۴).',
        when: 'حداقل یک‌بار در هر شیفت و در صورت تغییر ناگهانی رفتار یا هوشیاری بیمار.',
    },
    'SOFA': {
        full: 'Sequential (Sepsis-related) Organ Failure Assessment — ارزیابی متوالی نارسایی اعضا',
        what: 'نمره‌ای برای سنجش شدت اختلال عملکرد و نارسایی اعضای بدن در بیماران بدحال؛ هر یک از ۶ سیستم از ۰ (نرمال) تا ۴ (نارسایی شدید) امتیاز می‌گیرد.',
        purpose: 'پایش روند وضعیت بیمار در ICU، برآورد پیش‌آگهی و شناسایی سپسیس (طبق تعریف Sepsis-3، افزایش ≥ ۲ امتیاز نسبت به پایه همراه با عفونت مشکوک).',
        parts: [
            'تنفسی: PaO₂/FiO₂ و نیاز به حمایت تنفسی',
            'انعقادی: تعداد پلاکت',
            'کبدی: بیلی‌روبین',
            'قلبی-عروقی: فشار متوسط شریانی (MAP) و دوز وازوپرسورها',
            'سیستم عصبی: GCS',
            'کلیوی: کراتینین یا حجم ادرار',
        ],
        score: 'مجموع ۰ تا ۲۴؛ هرچه بیشتر، نارسایی اعضا و مرگ‌ومیر بیشتر. تغییر نمره در طول زمان مهم‌تر از یک عدد منفرد است.',
        when: 'هنگام پذیرش و سپس روزانه (بدترین مقدار هر ۲۴ ساعت).',
    },
    'APACHE II': {
        full: 'Acute Physiology And Chronic Health Evaluation II — ارزیابی فیزیولوژی حاد و سلامت مزمن',
        what: 'سیستم نمره‌دهی شدت بیماری برای بیماران بخش ICU که با ترکیب وضعیت فیزیولوژیک حاد، سن و بیماری‌های مزمن، شدت بیماری را در ۲۴ ساعت اول پذیرش تعیین می‌کند.',
        purpose: 'برآورد خطر مرگ‌ومیر بیمارستانی در گروه‌های بیماران، مقایسهٔ شدت بیماری بیماران و ارزیابی کیفیت مراقبت. برای تصمیم‌گیری دربارهٔ درمان یک بیمار به‌تنهایی کافی نیست.',
        parts: [
            'بخش A — امتیاز فیزیولوژی حاد (APS): ۱۲ متغیر (دمای رکتال، MAP، ضربان قلب، تعداد تنفس، اکسیژناسیون، pH، سدیم، پتاسیم، کراتینین، هماتوکریت، WBC، GCS) هرکدام ۰ تا ۴',
            'بخش B — سن: ۰ تا ۶ امتیاز',
            'بخش C — بیماری مزمن (نارسایی شدید ارگان یا نقص ایمنی): ۰، ۲ یا ۵ امتیاز',
        ],
        score: 'مجموع ۰ تا ۷۱؛ هرچه بیشتر، شدت بیماری و خطر مرگ‌ومیر بیشتر.',
        when: 'یک‌بار با بدترین مقادیر ۲۴ ساعت اول پذیرش در ICU.',
        note: 'اگر متغیری اندازه‌گیری نشده، مقدار نرمال آن را وارد کنید.',
    },
};

const ScaleIntro: React.FC<{ scaleKey: string }> = ({ scaleKey }) => {
    const info = SCALE_INFO[scaleKey];
    if (!info) return null;
    return (
        <div className="mt-6 p-4 sm:p-6 rounded-3xl bg-[#096067]/8 border-2 border-[#096067]/25 space-y-4 text-right">
            <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div className="min-w-0">
                    <h4 className="text-lg font-black text-[#062a2e]">این ابزار چیست؟</h4>
                    <p className="text-xs font-black text-[#096067] mt-0.5 break-words" dir="ltr">{info.full}</p>
                </div>
            </div>
            <p className="text-sm font-bold text-[#1e293b] leading-relaxed">{info.what}</p>
            <div>
                <p className="text-sm font-black text-[#ca7f3c] mb-1">کاربرد و هدف</p>
                <p className="text-sm font-bold text-[#1e293b] leading-relaxed">{info.purpose}</p>
            </div>
            <div>
                <p className="text-sm font-black text-[#ca7f3c] mb-1">شامل چه بخش‌هایی است؟</p>
                <ul className="space-y-1.5">
                    {info.parts.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-bold text-[#1e293b] leading-relaxed">
                            <span className="text-[#096067]">•</span><span className="min-w-0">{p}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#d8cfbe]">
                    <p className="text-xs font-black text-[#855f20] mb-1">نحوهٔ امتیازدهی و تفسیر</p>
                    <p className="text-sm font-bold text-[#1e293b] leading-relaxed">{info.score}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#d8cfbe]">
                    <p className="text-xs font-black text-[#855f20] mb-1">زمان استفاده</p>
                    <p className="text-sm font-bold text-[#1e293b] leading-relaxed">{info.when}</p>
                </div>
            </div>
            {info.note && <p className="text-xs font-bold text-[#855f20]">{info.note}</p>}
            <div className="pt-2 border-t border-[#096067]/20 text-center text-sm font-black text-[#096067]">⬇️ نحوهٔ محاسبه / ثبت ⬇️</div>
        </div>
    );
};

const ICUAssessment: React.FC<{ onBack: () => void; onHome: () => void; }> = ({ onBack, onHome }) => {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                    <ScaleCard title="RASS" subtitle="Richmond Agitation-Sedation Scale" desc="سطح هوشیاری و عمق آرام‌بخشی (‎+۴ تا ‎−۵)" onClick={() => setScale('RASS')} />
                    <ScaleCard title="CAM-ICU" subtitle="Confusion Assessment Method for the ICU" desc="غربالگری دلیریوم (مثبت/منفی)" onClick={() => setScale('CAM-ICU')} />
                    <ScaleCard title="SOFA" subtitle="Sequential Organ Failure Assessment" desc="شدت نارسایی ۶ سیستم بدن (۰ تا ۲۴)" onClick={() => setScale('SOFA')} />
                    <ScaleCard title="APACHE II" subtitle="Acute Physiology And Chronic Health Evaluation II" desc="شدت بیماری و خطر مرگ‌ومیر در ۲۴ ساعت اول (۰ تا ۷۱)" onClick={() => setScale('APACHE II')} />
                </div>
            );
        }
        const body = (() => {
            switch (scale) {
                case 'RASS': return <RASSScale onResult={setResult} />;
                case 'SOFA': return <SOFAScale onResult={setResult} />;
                case 'APACHE II': return <APACHEIIScale onResult={setResult} />;
                case 'CAM-ICU': return <CAMICUScale onResult={setResult} />;
                default: return null;
            }
        })();
        return (<><ScaleIntro scaleKey={scale} />{body}</>);
    };

    return (
        <div className="space-y-8">
            <ModuleHeader onBack={handleBack} onHome={onHome} />
            <div className="premium-card p-4 sm:p-10 space-y-8 border-[#c69d5b]/25 shadow-md">
                <div className="pb-8 border-b border-[#c69d5b]/15 text-center">
                    <h3 className="text-3xl font-black text-[#062a2e]">ابزارهای تخصصی ICU</h3>
                    <p className="text-[#096067] text-base font-bold mt-2">مقیاس‌های ارزیابی بیماران بخش مراقبت‌های ویژه</p>
                </div>
                {renderContent()}
            </div>
            {result && scale && <AssessmentResultDisplay title={`نتیجه ارزیابی ${scale}`} toolUsed={scale as any} score={result.score} interpretation={result.interpretation} color={result.color} icon={result.icon} recommendations={result.recommendations} />}
        </div>
    );
};

const ScaleCard = ({ title, subtitle, desc, onClick }: any) => (
    <button onClick={onClick} className="group p-6 sm:p-8 rounded-3xl bg-white/90 border border-[#c69d5b]/30 hover:border-[#096067] hover:bg-white transition-all duration-300 text-center hover:-translate-y-1.5 cursor-pointer shadow-md hover:shadow-xl">
      <h3 className="text-4xl font-black text-[#096067] mb-3 group-hover:scale-105 transition-transform">{title}</h3>
      <p className="text-[#062a2e] text-sm font-bold break-words">{subtitle}</p>
      {desc && <p className="text-[#475569] text-xs font-bold mt-2 leading-relaxed">{desc}</p>}
    </button>
);

// Helper Components for Inputs
const InputGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 p-6 bg-white/90 rounded-2xl border border-[#c69d5b]/25 shadow-sm">
        <h4 className="text-lg font-black text-[#062a2e]">{title}</h4>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputRow = ({ label, value, onChange, min = 0, max = 1000 }: any) => (
    <div className="flex items-center gap-4">
        <label className="text-sm font-bold text-[#062a2e] w-1/2">{label}</label>
        <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-1/2 p-2 rounded-xl bg-white border border-[#c69d5b]/30 text-[#062a2e] font-bold text-center focus:border-[#096067] focus:outline-none"
        />
    </div>
);

const CheckboxRow = ({ label, checked, onChange }: any) => (
    <label className="flex items-center gap-3 p-3 bg-white/90 border border-[#c69d5b]/20 rounded-xl cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 rounded text-[#096067] border-[#c69d5b]/30 focus:ring-[#096067]" />
        <span className="text-sm font-bold text-[#062a2e]">{label}</span>
    </label>
);

const RadioGroup = ({ options, value, onChange, name = 'rg' }: any) => (
    <div className="grid grid-cols-2 gap-2">
        {options.map((opt: any) => (
            <label key={opt.value} className={`p-3 rounded-xl text-center text-xs font-bold cursor-pointer transition-all border ${value === opt.value ? 'bg-[#096067] text-white border-[#c69d5b]' : 'bg-white/90 text-[#062a2e] border-[#c69d5b]/25 hover:border-[#096067]'}`}>
                <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} className="hidden" />
                {opt.label}
            </label>
        ))}
    </div>
);

export default ICUAssessment;
