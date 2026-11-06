import React, { useMemo, useState } from 'react';
import ModuleHeader from './common/ModuleHeader';
import {
  NURSING_DIAGNOSES, DOMAIN_NAMES, DOMAIN_TOTALS, TYPE_LABELS,
  NursingDiagnosis, DiagnosisType,
} from './nursingDiagnosisData';
import { NURSING_CARE } from './nursingCare';
import { DiagnosisCare } from './nursingCareTypes';
import { NURSING_DX_STATEMENTS, DxItem } from './nursingDxStatements';
import { DX_CATEGORIES, categoryOf, categoryLabel, isSpecialized } from './nursingDxMeta';

interface Props {
  onBack: () => void;
  onHome: () => void;
  onOpenModule: (moduleId: string) => void;
}

/** ابزارهای مرتبط داخل برنامه (بر اساس نام انگلیسی تشخیص) */
const RELATED_MODULES: Record<string, { id: string; label: string }[]> = {
  'Acute pain': [{ id: 'PAIN', label: 'مدیریت درد (ارزیابی و پلن مراقبتی)' }],
  'Chronic pain': [{ id: 'PAIN', label: 'مدیریت درد (ارزیابی و پلن مراقبتی)' }],
  'Impaired comfort': [{ id: 'PAIN', label: 'مدیریت درد' }],
  'Risk for falls': [{ id: 'FALL_RISK', label: 'ارزیابی ریسک سقوط' }],
  'Risk for pressure ulcer': [{ id: 'PRESSURE_ULCER', label: 'ارزیابی زخم فشاری (Braden و …)' }],
  'Pressure ulcer': [{ id: 'PRESSURE_ULCER', label: 'ارزیابی زخم فشاری (PUSH و …)' }],
  'Impaired skin integrity': [{ id: 'PRESSURE_ULCER', label: 'ارزیابی زخم فشاری' }],
  'Risk for impaired skin integrity': [{ id: 'PRESSURE_ULCER', label: 'ارزیابی زخم فشاری' }],
  'Risk for thrombosis': [{ id: 'THROMBO', label: 'ریسک ترومبوآمبولی (Wells)' }],
  'Dysfunctional ventilator weaning response': [{ id: 'WEANING', label: 'جداسازی از ونتیلاتور (RSBI و …)' }],
  'Impaired spontaneous ventilation': [{ id: 'WEANING', label: 'جداسازی از ونتیلاتور' }],
  'Impaired gas exchange': [{ id: 'ABG', label: 'تفسیر گازهای خونی' }],
  'Acute confusion': [{ id: 'ICU', label: 'ابزارهای ICU (CAM-ICU، RASS)' }],
  'Risk for acute confusion': [{ id: 'ICU', label: 'ابزارهای ICU (CAM-ICU، RASS)' }],
  'Imbalanced nutrition': [{ id: 'BMI', label: 'محاسبهٔ BMI' }, { id: 'ANTHRO', label: 'تخمین قد و وزن' }],
  'Risk for ineffective cerebral tissue perfusion': [{ id: 'LOC', label: 'سطح هوشیاری (GCS)' }, { id: 'NIHSS', label: 'مقیاس سکته NIHSS' }],
  'Hopelessness': [{ id: 'SUICIDE', label: 'ارزیابی ریسک خودکشی' }],
};

/** نمونه‌های نگارش تشخیص که در اسلایدهای فایل آمده است */
const FILE_EXAMPLES: Record<string, string[]> = {
  'Ineffective airway clearance': [
    'پاکسازی غیر موثر راه هوایی، در رابطه با افزایش ترشحات آلوئولی ناشی از پنومونی',
    'پاکسازی غیر موثر راه هوایی در رابطه با ادم ریه',
    'پاکسازی غیر موثر راه هوایی در رابطه با انسداد مزمن راه‌های هوایی',
    'پاکسازی غیر موثر راه هوایی در رابطه با ضعف عضلات تنفسی و ناتوانی در سرفه',
    'پاکسازی غیر موثر راه هوایی در رابطه با کاهش سطح هوشیاری',
  ],
  'Hyperthermia': [
    'افزایش درجه حرارت بدن، در رابطه با عفونت زخم جراحی',
    'افزایش درجه حرارت بدن، در رابطه با پنومونی',
    'افزایش درجه حرارت بدن، در رابطه با هیپوولمی و هیپرناترمی حاد',
    'افزایش درجه حرارت بدن، در رابطه با افزایش فشار داخل جمجمه',
    'افزایش درجه حرارت بدن، در رابطه با قرار گرفتن در محیط گرم',
    'افزایش درجه حرارت بدن، در رابطه با فلبیت',
    'افزایش درجه حرارت بدن، در رابطه با ترومبوز وریدهای عمقی',
  ],
  'Risk for constipation': [
    'خطر بروز یبوست، در رابطه با عدم تحرک ناشی از الزام استراحت در تخت',
    'خطر بروز یبوست، در رابطه با سندرم سالخوردگی',
    'خطر بروز یبوست، در رابطه با تغذیه‌ی نامناسب',
    'خطر بروز یبوست، در رابطه با تزریق مورفین برای تسکین درد',
    'خطر بروز یبوست، در رابطه با هیپوکالمی',
  ],
  'Risk for decreased cardiac output': [
    'خطر کاهش برون ده قلب، در رابطه با نارسایی حاد قلبی',
    'خطر کاهش برون ده قلب، در رابطه با خون‌ریزی گوارشی',
    'خطر کاهش برون ده قلب، در رابطه با شوک سپتیک',
    'خطر کاهش برون ده قلب، در رابطه با اینرسی بعد از زایمان',
    'خطر کاهش برون ده قلب، در رابطه با کمبود دریافت مایعات',
    'خطر کاهش برون ده قلب، در رابطه با پنوموتوراکس فشارنده',
  ],
};

const FORMAT_GUIDE: Record<DiagnosisType, { title: string; text: string }> = {
  problem: {
    title: 'فرمت تشخیص مبتنی بر مسئله',
    text: 'باید عامل ایجادکنندهٔ مشکل بیان شود: «نام تشخیص، در رابطه با (عامل)». بیان عامل ایجادکننده مستقیماً روی برنامه‌ریزی مداخلات پرستاری اثر می‌گذارد.',
  },
  risk: {
    title: 'فرمت تشخیص مبتنی بر خطر',
    text: 'باید بیان شود که پرستار به چه دلیل فکر می‌کند بیمار در آینده گرفتار این مشکل شود: «خطر …، در رابطه با (عامل خطر)».',
  },
  promotion: {
    title: 'فرمت تشخیص ارتقاء سلامت',
    text: 'مربوط به آمادگی مددجو برای یادگیری و شرکت در برنامه‌های خودمراقبتی و خودمدیریتی است؛ عموماً فقط موضوع مورد نظر برای آموزش بیان می‌شود.',
  },
  syndrome: {
    title: 'فرمت تشخیص سندرم',
    text: 'تعداد تشخیص‌های سندرمی انگشت‌شمار است و فقط به صورت ذکر همان سندرم بیان می‌شوند.',
  },
};

const TYPE_STYLE: Record<DiagnosisType, string> = {
  problem: 'bg-sky-100 text-sky-800 border-sky-300',
  risk: 'bg-amber-100 text-amber-800 border-amber-300',
  promotion: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  syndrome: 'bg-purple-100 text-purple-800 border-purple-300',
};

const norm = (s: string) => s.replace(/[يٴ]/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ').toLowerCase();

const NursingDiagnoses: React.FC<Props> = ({ onBack, onHome, onOpenModule }) => {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [kind, setKind] = useState<'actual' | 'potential' | 'promotion' | null>(null);
  const [selected, setSelected] = useState<NursingDiagnosis | null>(null);

  const kindOf = (t: DiagnosisType): 'actual' | 'potential' | 'promotion' =>
    t === 'risk' ? 'potential' : t === 'promotion' ? 'promotion' : 'actual';

  const catCounts = useMemo(() => {
    const m: Record<string, number> = {};
    NURSING_DIAGNOSES.forEach(d => { const k = categoryOf(d.id); m[k] = (m[k] || 0) + 1; });
    return m;
  }, []);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return NURSING_DIAGNOSES.filter(d =>
      (cat === null || categoryOf(d.id) === cat) &&
      (kind === null || kindOf(d.type) === kind) &&
      (!q || norm(d.fa).includes(q) || norm(d.en).includes(q))
    );
  }, [query, cat, kind]);

  const open = (d: NursingDiagnosis) => { setSelected(d); window.scrollTo({ top: 0, left: 0 }); };
  const close = () => { setSelected(null); window.scrollTo({ top: 0, left: 0 }); };
  const handleBack = () => (selected ? close() : onBack());

  /* ----------------------- صفحهٔ جزئیات یک تشخیص ----------------------- */
  const renderDetail = (d: NursingDiagnosis) => {
    const related = RELATED_MODULES[d.en] || [];
    const care: DiagnosisCare | undefined = NURSING_CARE[d.id];
    const examples = FILE_EXAMPLES[d.en] || [];
    const guide = FORMAT_GUIDE[d.type];
    return (
      <div className="space-y-5 animate-in">
        <div className="premium-card p-4 sm:p-8 space-y-4 border-2 border-[#c69d5b]/30">
          <div className="flex flex-wrap items-center gap-2 text-xs font-black">
            <span className="px-3 py-1 rounded-full bg-[#096067] text-white">{categoryLabel(categoryOf(d.id)).icon} {categoryLabel(categoryOf(d.id)).label}</span>
            <span className={`px-3 py-1 rounded-full border ${TYPE_STYLE[d.type]}`}>{TYPE_LABELS[d.type]}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#062a2e] leading-snug break-words">{d.fa}</h3>
          <p className="text-sm sm:text-base font-bold text-[#096067] break-words" dir="ltr">{d.en}</p>
          <p className="text-[11px] font-bold text-[#64748b]">حیطهٔ NANDA: {DOMAIN_NAMES[d.domain]}{d.cls ? ` › ${d.cls}` : ''}</p>
        </div>

        <Block icon="📖" title="تعریف" tone="border-[#096067]/25">
          <p className="text-base font-bold text-[#1e293b] leading-loose">{d.definition}</p>
        </Block>

        {(() => {
          const dxs = NURSING_DX_STATEMENTS[d.id] || [];
          return (
            <Block icon="🧾" title="تشخیص‌های پرستاری مرتبط با این موضوع (NANDA-I)" tone="border-[#ca7f3c]/40">
              {dxs.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#475569] leading-relaxed">
                    برچسب‌ها، عوامل مرتبط/خطر و مشخصه‌ها از کتاب NANDA-I ویراست ۱۳ (۲۰۲۴–۲۰۲۶) هستند؛ هر مورد را متناسب با بیمار خود انتخاب و ترکیب کنید.
                  </p>
                  {dxs.map(dx => <DxCard key={dx.c} dx={dx} />)}
                </div>
              ) : (
                <p className="text-sm font-bold text-[#6b4a12] leading-relaxed">
                  برای این موضوع در ویراست ۲۰۲۴–۲۰۲۶ NANDA-I برچسب مستقلی یافت نشد (ممکن است حذف یا ادغام شده باشد).
                </p>
              )}
            </Block>
          );
        })()}

        <Block icon="🔍" title="برخی از علائم حاصل از بررسی بیمار" tone="border-[#c69d5b]/30">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {d.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-bold text-[#1e293b] leading-relaxed min-w-0">
                <span className="text-[#096067] font-black">•</span><span className="min-w-0 break-words">{f}</span>
              </li>
            ))}
          </ul>
        </Block>

        {care ? (
          <>
            {care.o && care.o.length > 0 && <ListBlock icon="🎯" title="پیامدهای مورد انتظار (اهداف مراقبتی)" items={care.o} tone="border-emerald-300" />}
            {care.a && care.a.length > 0 && <ListBlock icon="🩺" title="ارزیابی پرستاری" items={care.a} tone="border-sky-300" />}
            <ListBlock icon="🛠️" title="مداخلات پرستاری" items={care.i} tone="border-[#ca7f3c]/50" numbered />
            {care.n && care.n.length > 0 && <ListBlock icon="🥗" title="تغذیه و توصیه‌های سلامتی" items={care.n} tone="border-lime-400" />}
            <ListBlock icon="🎓" title="آموزش به بیمار و خانواده / برنامهٔ ترخیص" items={care.t} tone="border-[#096067]/40" numbered />
            {care.g && care.g.length > 0 && <ListBlock icon="👵" title="ملاحظات سالمندان" items={care.g} tone="border-purple-300" />}
            {care.p && care.p.length > 0 && <ListBlock icon="👶" title="ملاحظات کودکان و نوزادان" items={care.p} tone="border-pink-300" />}
            {care.c && care.c.length > 0 && <ListBlock icon="🌍" title="ملاحظات فرهنگی" items={care.c} tone="border-amber-300" />}
            {care.h && care.h.length > 0 && <ListBlock icon="🏠" title="مراقبت در منزل" items={care.h} tone="border-teal-300" />}
          </>
        ) : (
          <Block icon="🛠️" title="مداخلات پرستاری" tone="border-[#ca7f3c]/50">
            <p className="text-sm font-bold text-[#6b4a12]">برای این تشخیص هنوز مداخله‌ای ثبت نشده است.</p>
          </Block>
        )}

        {related.length > 0 && (
          <Block icon="🔗" title="ابزار و دستورالعمل مرتبط در این برنامه" tone="border-[#096067]/30">
            <div className="flex flex-wrap gap-2">
              {related.map(r => (
                <button key={r.id} onClick={() => onOpenModule(r.id)}
                  className="px-4 py-2.5 rounded-xl bg-[#096067] text-white text-sm font-black cursor-pointer hover:bg-[#074a50] transition-all">
                  {r.label} ←
                </button>
              ))}
            </div>
          </Block>
        )}

        <Block icon="✍️" title={guide.title} tone="border-[#d8cfbe]">
          <p className="text-sm font-bold text-[#1e293b] leading-relaxed">{guide.text}</p>
          {examples.length > 0 && (
            <div className="space-y-2 mt-3">
              <p className="text-xs font-black text-[#855f20]">نمونه‌های نگارش:</p>
              <ul className="space-y-1.5">
                {examples.map((e, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-[#fbf9f5] border border-[#d8cfbe] text-sm font-bold text-[#1e293b] leading-relaxed break-words">{e}</li>
                ))}
              </ul>
            </div>
          )}
        </Block>

        <p className="text-[11px] font-bold text-[#64748b] text-center px-4 leading-relaxed">
          تمام اقدامات دارویی و درمانی طبق دستور پزشک و پروتکل بیمارستان انجام می‌شود؛ این محتوا جایگزین قضاوت بالینی پرستار نیست.
        </p>
      </div>
    );
  };

  /* ----------------------- فهرست تشخیص‌ها ----------------------- */
  const renderList = () => (
    <div className="space-y-6">
      <div className="premium-card p-4 sm:p-8 space-y-3 border-2 border-[#096067]/25 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#092b36] to-[#04141a] border-2 border-[#c69d5b]/50 flex items-center justify-center text-3xl">📋</div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#062a2e]">تشخیص و مداخلات پرستاری</h3>
        <p className="text-sm font-bold text-[#096067]">NANDA-I Taxonomy II</p>
      </div>

      <div className="premium-card p-4 sm:p-6 space-y-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 جست‌وجوی تشخیص (فارسی یا انگلیسی)، مثلاً درد، خطر سقوط، Anxiety"
          className="w-full min-w-0 p-3.5 rounded-2xl bg-white border-2 border-[#c69d5b]/40 text-[#062a2e] font-bold text-sm focus:border-[#096067] focus:outline-none"
        />
      </div>

      <div className="premium-card p-4 sm:p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-sm font-black text-[#062a2e]">دسته‌بندی بر اساس سیستم / موضوع</p>
            <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">← قابل حرکت افقی</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setCat(null)}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border-2 text-center cursor-pointer transition-all flex items-center gap-2 ${
                cat === null
                  ? 'bg-[#096067] text-white border-[#c69d5b] shadow-md -translate-y-0.5'
                  : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'
              }`}
            >
              <span className="text-xl">📚</span>
              <span className="text-xs sm:text-sm font-black whitespace-nowrap">همهٔ تشخیص‌ها</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${cat === null ? 'bg-white/20 text-[#eedaa8]' : 'bg-slate-100 text-slate-600'}`}>
                {NURSING_DIAGNOSES.length}
              </span>
            </button>
            {DX_CATEGORIES.map(c => (
              <button
                key={c.key}
                onClick={() => setCat(cat === c.key ? null : c.key)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl border-2 text-center cursor-pointer transition-all flex items-center gap-2 ${
                  cat === c.key
                    ? 'bg-[#096067] text-white border-[#c69d5b] shadow-md -translate-y-0.5'
                    : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="text-xs sm:text-sm font-black whitespace-nowrap">{c.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${cat === c.key ? 'bg-white/20 text-[#eedaa8]' : 'bg-slate-100 text-slate-600'}`}>
                  {catCounts[c.key] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-black text-[#855f20] mb-2">ماهیت تشخیص</p>
          <div className="flex flex-wrap gap-2">
            <Chip active={kind === null} onClick={() => setKind(null)}>همه</Chip>
            <Chip active={kind === 'actual'} onClick={() => setKind(kind === 'actual' ? null : 'actual')}>بالفعل (قطعی)</Chip>
            <Chip active={kind === 'potential'} onClick={() => setKind(kind === 'potential' ? null : 'potential')}>بالقوه (محتمل)</Chip>
            <Chip active={kind === 'promotion'} onClick={() => setKind(kind === 'promotion' ? null : 'promotion')}>ارتقای سلامت</Chip>
          </div>
        </div>
      </div>

      <p className="text-sm font-black text-[#062a2e] px-1">{filtered.length} تشخیص</p>
      {filtered.length === 0 ? (
        <div className="premium-card p-8 text-center font-bold text-[#475569]">تشخیصی مطابق جست‌وجوی شما پیدا نشد.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(d => (
            <button key={d.id} onClick={() => open(d)}
              className="text-right p-4 rounded-2xl bg-white/95 border-2 border-[#c69d5b]/30 hover:border-[#096067] hover:-translate-y-0.5 transition-all shadow-sm cursor-pointer space-y-1.5 min-w-0">
              <h4 className="text-base font-black text-[#062a2e] leading-snug break-words min-w-0">{d.fa}</h4>
              <p className="text-xs font-bold text-[#096067] break-words" dir="ltr">{d.en}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ede6d8] text-[#062a2e]">{categoryLabel(categoryOf(d.id)).icon} {categoryLabel(categoryOf(d.id)).label}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${TYPE_STYLE[d.type]}`}>{TYPE_LABELS[d.type]}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <ModuleHeader onBack={handleBack} onHome={onHome} />
      {selected ? renderDetail(selected) : renderList()}
    </div>
  );
};


const DX_KIND_LABEL: Record<string, string> = { p: 'مبتنی بر مسئله', r: 'مبتنی بر خطر', h: 'ارتقای سلامت' };
const DX_KIND_STYLE: Record<string, string> = {
  p: 'bg-sky-100 text-sky-800 border-sky-300',
  r: 'bg-amber-100 text-amber-800 border-amber-300',
  h: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

const joinFa = (arr: string[]) => (arr.length <= 1 ? arr.join('') : arr.slice(0, -1).join('، ') + ' و ' + arr[arr.length - 1]);

const DxCard: React.FC<{ dx: DxItem }> = ({ dx }) => {
  const statements: string[] =
    dx.t === 'h'
      ? dx.d.map(x => `${dx.f}، که با ${x} مشخص می‌شود`)
      : dx.r.length > 0
        ? dx.r.map(x => `${dx.f} در ارتباط با ${x}`)
        : dx.d.map(x => `${dx.f}، که با ${x} مشخص می‌شود`);
  const full =
    dx.t === 'p' && dx.r.length > 0 && dx.d.length > 0
      ? `${dx.f} در ارتباط با ${dx.r[0]}، که با ${joinFa(dx.d.slice(0, 3))} مشخص می‌شود`
      : null;
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#d8cfbe] space-y-3 min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h5 className="text-base sm:text-lg font-black text-[#062a2e] leading-snug break-words">{dx.f}</h5>
          <p className="text-xs font-bold text-[#096067] break-words" dir="ltr">{dx.e} • NANDA-I {dx.c}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${DX_KIND_STYLE[dx.t]}`}>{DX_KIND_LABEL[dx.t]}</span>
      </div>

      {statements.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-black text-[#855f20]">تشخیص‌های پرستاری (نمونهٔ نگارش)</p>
          <ul className="space-y-1.5">
            {statements.map((st, i) => (
              <li key={i} className="p-2.5 rounded-xl bg-[#fbf9f5] border border-[#d8cfbe] text-sm font-bold text-[#1e293b] leading-relaxed break-words">{st}</li>
            ))}
          </ul>
        </div>
      )}

      {full && (
        <div className="p-3 rounded-xl bg-[#096067]/8 border border-[#096067]/25 text-sm font-bold text-[#062a2e] leading-relaxed break-words">
          <span className="block text-[11px] font-black text-[#096067] mb-1">نمونهٔ کامل (مسئله، علت و شواهد)</span>
          {full}
        </div>
      )}

      {dx.t !== 'h' && dx.d.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-black text-[#855f20]">مشخصه‌های تعیین‌کننده (شواهد)</p>
          <div className="flex flex-wrap gap-1.5">
            {dx.d.map((x, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-[#ede6d8] text-[#062a2e] text-xs font-bold break-words">{x}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Block: React.FC<{ icon: string; title: string; tone: string; children: React.ReactNode }> = ({ icon, title, tone, children }) => (
  <div className={`premium-card p-4 sm:p-8 space-y-3 border-2 ${tone}`}>
    <h4 className="text-lg font-black text-[#062a2e]">{icon} {title}</h4>
    {children}
  </div>
);

const ListBlock: React.FC<{ icon: string; title: string; items: string[]; tone: string; numbered?: boolean }> = ({ icon, title, items, tone, numbered }) => (
  <Block icon={icon} title={title} tone={tone}>
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1e293b] leading-relaxed min-w-0">
          {numbered
            ? <span className="shrink-0 w-6 h-6 rounded-full bg-[#096067] text-white text-xs font-black flex items-center justify-center mt-0.5">{i + 1}</span>
            : <span className="text-[#096067] font-black mt-0.5">•</span>}
          <span className="min-w-0 break-words">{it}</span>
        </li>
      ))}
    </ul>
  </Block>
);

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black border-2 cursor-pointer transition-all ${active ? 'bg-[#096067] border-[#c69d5b] text-white' : 'bg-white border-[#d8cfbe] text-[#062a2e] hover:border-[#096067]'}`}>
    {children}
  </button>
);

export default NursingDiagnoses;
