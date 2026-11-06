import React, { useState, useEffect } from 'react';
import { PatientStatus, AssessmentResult, PatientCategory, PediatricAgeGroup } from './types';
import Header from './components/Header';
import PainAssessment from './components/PainAssessment';
import PediatricAssessment from './components/PediatricAssessment';
import NeonatalAssessment from './components/NeonatalAssessment';
import ManagementPlan from './components/ManagementPlan';
import Footer from './components/Footer';
import PressureUlcerAssessment from './components/PressureUlcerAssessment';
import FallRiskAssessment from './components/FallRiskAssessment';
import ConsciousnessAssessment from './components/ConsciousnessAssessment';
import ThromboembolismAssessment from './components/ThromboembolismAssessment';
import SuicideRiskAssessment from './components/SuicideRiskAssessment';
import BMICalculator from './components/BMICalculator';
import ICUAssessment from './components/ICUAssessment';
import ModuleHeader from './components/common/ModuleHeader';
import NIHSSAssessment from './components/NIHSSAssessment';
import AnthropometricEstimation from './components/AnthropometricEstimation';
import BloodGasAnalysis from './components/BloodGasAnalysis';
import WeaningAssessment from './components/WeaningAssessment';
import NursingDiagnoses from './components/NursingDiagnoses';
import DrugCalculation from './components/DrugCalculation';

const App: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [category, setCategory] = useState<PatientCategory | null>(null);
  const [patientStatus, setPatientStatus] = useState<PatientStatus | null>(null);
  const [pediatricAge, setPediatricAge] = useState<PediatricAgeGroup | null>(null);
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);

  // Automatically scroll to the very top whenever a module, category, or status changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [selectedModule, category, patientStatus, pediatricAge]);

  const reset = () => {
    setSelectedModule(null);
    setCategory(null);
    setPatientStatus(null);
    setPediatricAge(null);
    setAssessment(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  
  const handleBackToMenu = () => {
    setSelectedModule(null);
    setAssessment(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  
  const handleBackFromAssessment = () => {
    setAssessment(null);
    if (category === PatientCategory.ADULT) {
        setPatientStatus(null);
    } else if (category === PatientCategory.PEDIATRIC) {
        setPediatricAge(null);
    } else {
        setCategory(null);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const renderModule = () => {
    switch (selectedModule) {
      case 'PAIN':
        return renderPainModule();
      case 'NURSING_DX':
        return <NursingDiagnoses onBack={handleBackToMenu} onHome={reset} onOpenModule={(id) => { setAssessment(null); setSelectedModule(id); }} />;
      case 'PRESSURE_ULCER':
        return <PressureUlcerAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'FALL_RISK':
        return <FallRiskAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'LOC':
        return <ConsciousnessAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'NIHSS':
        return <NIHSSAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'THROMBO':
        return <ThromboembolismAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'SUICIDE':
        return <SuicideRiskAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'BMI':
        return <BMICalculator onBack={handleBackToMenu} onHome={reset} />;
      case 'ICU':
        return <ICUAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'ANTHRO':
        return <AnthropometricEstimation onBack={handleBackToMenu} onHome={reset} />;
      case 'ABG':
        return <BloodGasAnalysis onBack={handleBackToMenu} onHome={reset} />;
      case 'WEANING':
        return <WeaningAssessment onBack={handleBackToMenu} onHome={reset} />;
      case 'DRUG_CALC':
        return <DrugCalculation onBack={handleBackToMenu} onHome={reset} />;
      default:
        return null;
    }
  }

  const renderPainModule = () => (
    <>
      {!category ? (
        <div className="space-y-8 animate-in">
            <ModuleHeader onBack={() => setSelectedModule(null)} onHome={reset} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <MainCard 
                title="پروتکل بزرگسالان"
                subtitle="Adult Protocols"
                description="شامل ابزارهای VAS، BPS و پایش همودینامیک برای بیماران بالای ۱۸ سال."
                onClick={() => setCategory(PatientCategory.ADULT)}
                icon="🧑"
              />
              <MainCard 
                title="نوزادان بستری (زیر ۱ ماه)"
                subtitle="Neonatal (0 - 1mo)"
                description="بر اساس دستورالعمل ابلاغی مدیریت درد نوزادان شامل مقیاس‌های NIPS، CRIES و مراقبت‌های غیردارویی."
                onClick={() => setCategory(PatientCategory.NEONATE)}
                icon="🚼"
                highlight
              />
              <MainCard 
                title="شیرخواران و کودکان"
                subtitle="Pediatric (1mo - 18yr)"
                description="بر اساس ابلاغیه جدید زمستان ۱۴۰۳ شامل مقیاس‌های FLACC، CHIPPS و Wong-Baker."
                onClick={() => setCategory(PatientCategory.PEDIATRIC)}
                icon="👶"
              />
            </div>
        </div>
      ) : category === PatientCategory.ADULT && !patientStatus ? (
        <div className="space-y-8 sm:space-y-12">
           <ModuleHeader onBack={() => setCategory(null)} onHome={reset} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard title="بیمار هوشیار" subtitle="VAS / چهره‌ها" description="گزارش عددی (۰ تا ۱۰) یا انتخاب چهره برای بیمار ناتوان از بیان عددی." onClick={() => setPatientStatus(PatientStatus.CONSCIOUS)} icon="🧑‍⚕️" />
            <StatusCard title="کاهش سطح هوشیاری" subtitle="BPS Scale" description="ارزیابی رفتاری با تصاویر بالینی (اینتوبه / غیر اینتوبه)." onClick={() => setPatientStatus(PatientStatus.DECREASED_CONSCIOUSNESS)} icon="🏥" />
            <StatusCard title="بیمار تحت پارالیز" subtitle="Vital Signs" description="بلوک عضلانی، پارالیز، مرگ مغزی یا فلج چهار اندام: پایش همودینامیک." onClick={() => setPatientStatus(PatientStatus.PARALYZED)} icon="⚡" />
          </div>
        </div>
      ) : category === PatientCategory.PEDIATRIC && !pediatricAge ? (
        <div className="space-y-8 sm:space-y-12">
           <ModuleHeader onBack={() => setCategory(null)} onHome={reset} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatusCard title="کودک فاقد کلام" subtitle="FLACC Scale" description="اینتوبه، CP یا کوچک‌تر از ۳ سال (همهٔ گروه‌های سنیِ فاقد کلام)." onClick={() => setPediatricAge(PediatricAgeGroup.NON_VERBAL)} icon="🤍" />
              <StatusCard title="۱ ماه تا ۴ سال" subtitle="FLACC Scale" description="ارزیابی رفتاری (چهره، پا، فعالیت، گریه، تسلی‌پذیری)." onClick={() => setPediatricAge(PediatricAgeGroup.INFANT_TODDLER)} icon="🤱" />
              <StatusCard title="۳ تا ۷ سال" subtitle="Wong-Baker" description="مقیاس چهره‌ها با تصویر (برای کودکی که هنوز عدد را کامل نمی‌شناسد)." onClick={() => setPediatricAge(PediatricAgeGroup.PRE_SCHOOL)} icon="🎨" />
              <StatusCard title="بالای ۷ سال" subtitle="NRS یا چهره‌ها" description="ارزیابی عددی (۰ تا ۱۰) یا انتخاب چهره." onClick={() => setPediatricAge(PediatricAgeGroup.SCHOOL_ADOLESCENT)} icon="🎒" />
              <StatusCard title="بعد از عمل (تا ۷ سال)" subtitle="CHIPPS Scale" description="درد حاد پس از جراحی در شیرخواران و کودکان." onClick={() => setPediatricAge(PediatricAgeGroup.POST_OP)} icon="🩹" />
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in">
            <ModuleHeader onBack={handleBackFromAssessment} onHome={reset} />
            <div className="premium-card p-6 flex flex-col md:flex-row items-center justify-center gap-6 border-[#c69d5b]/40 shadow-sm">
             <div className="bg-white px-8 py-3.5 rounded-2xl border border-[#c69d5b]/40 shadow-sm">
              <span className="text-lg font-black text-[#062a2e] uppercase tracking-wide">
                {category === PatientCategory.ADULT 
                  ? 'پروتکل بزرگسال' 
                  : category === PatientCategory.NEONATE 
                    ? 'پروتکل نوزادان بستری' 
                    : 'پروتکل کودکان و شیرخواران'}
              </span>
            </div>
          </div>

          {category === PatientCategory.ADULT ? (
            <PainAssessment status={patientStatus!} onAssess={setAssessment} />
          ) : category === PatientCategory.NEONATE ? (
            <NeonatalAssessment onAssess={setAssessment} onBack={handleBackFromAssessment} onHome={reset} />
          ) : (
            <PediatricAssessment ageGroup={pediatricAge!} onAssess={setAssessment} />
          )}

          {assessment && <ManagementPlan assessment={assessment} category={category!} ageGroup={pediatricAge} />}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen pb-48 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-6 sm:py-10">
        {!selectedModule ? (
           <div className="space-y-10 sm:space-y-16 animate-in">
            <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#062a2e] border border-[#c69d5b]/40 text-[#eedaa8] text-xs font-black shadow-sm">
                <span className="text-sm">✨</span>
                <span>سامانه تخصصی ابزارهای بالینی و مراقبت‌های استاندارد</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#062a2e] leading-tight drop-shadow-sm">
                <span className="bg-gradient-to-r from-[#096067] via-[#ca7f3c] to-[#c69d5b] bg-clip-text text-transparent" dir="ltr">
                  Nursing guide
                </span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#52606d] font-medium max-w-2xl mx-auto leading-relaxed">
                ابزارهای استاندارد، مقیاس‌های معتبر بین‌المللی و دستورالعمل‌های بالینی جامع
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              <ModuleCard 
                title="مدیریت درد" 
                subtitle="VAS • BPS • FLACC • NIPS • PIPP" 
                icon="😣"
                onClick={() => setSelectedModule('PAIN')} 
              />
              <ModuleCard 
                title="زخم فشاری" 
                subtitle="Braden Scale" 
                icon="🩹"
                onClick={() => setSelectedModule('PRESSURE_ULCER')} 
              />
              <ModuleCard 
                title="ریسک سقوط" 
                subtitle="Morse • Humpty Dumpty • نوزادان" 
                icon="🚶"
                onClick={() => setSelectedModule('FALL_RISK')} 
              />
              <ModuleCard 
                title="سطح هوشیاری" 
                subtitle="GCS & AVPU" 
                icon="🧠"
                onClick={() => setSelectedModule('LOC')} 
              />
              <ModuleCard 
                title="مقیاس سکته NIHSS" 
                subtitle="Stroke 11-Item Scale" 
                icon="🕰️"
                onClick={() => setSelectedModule('NIHSS')} 
              />
              <ModuleCard 
                title="ریسک ترومبوآمبولی" 
                subtitle="Wells DVT & PE" 
                icon="🩸"
                onClick={() => setSelectedModule('THROMBO')} 
              />
              <ModuleCard 
                title="محاسبه BMI" 
                subtitle="Body Mass Index" 
                icon="📏"
                onClick={() => setSelectedModule('BMI')} 
              />
              <ModuleCard 
                title="تخمین قد و وزن" 
                subtitle="Chumlea Formula" 
                icon="📐"
                onClick={() => setSelectedModule('ANTHRO')} 
              />
              <ModuleCard 
                title="تفسیر گازهای خونی" 
                subtitle="ABG • VBG • P/F" 
                icon="🧪"
                onClick={() => setSelectedModule('ABG')} 
              />
              <ModuleCard 
                title="ریسک خودکشی" 
                subtitle="SAD PERSONS" 
                icon="❤️‍🩹"
                onClick={() => setSelectedModule('SUICIDE')} 
              />
              <ModuleCard 
                title="ابزارهای ICU" 
                subtitle="RASS • CAM-ICU • SOFA • APACHE II" 
                icon="❤️‍🔥"
                onClick={() => setSelectedModule('ICU')} 
              />
              <ModuleCard 
                title="تشخیص و مداخلات پرستاری" 
                subtitle="NANDA-I • ۱۱۳ تشخیص + مداخلات" 
                icon="📋"
                onClick={() => setSelectedModule('NURSING_DX')} 
              />
              <ModuleCard 
                title="جداسازی از ونتیلاتور" 
                subtitle="RSBI • CROP • IWI" 
                icon="🫁"
                onClick={() => setSelectedModule('WEANING')} 
              />
              <ModuleCard 
                title="محاسبات دارویی و سرم" 
                subtitle="قطرات • درصدی • mEq • دوز وزنی • اطفال و NICU" 
                icon="💊"
                onClick={() => setSelectedModule('DRUG_CALC')} 
              />
            </div>
          </div>
        ) : (
          <div className="animate-in">{renderModule()}</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

interface ModuleCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  enabled?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, subtitle, icon, onClick, enabled = true }) => {
  return (
    <button 
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      className={`group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col items-start text-right overflow-hidden border-2 cursor-pointer w-full ${
        enabled 
          ? 'bg-gradient-to-b from-[#0f2c52] via-[#0B1F3A] to-[#071629] border-[#c69d5b]/55 hover:border-[#eedaa8] shadow-[0_10px_25px_rgba(11,31,58,0.38)] hover:shadow-[0_18px_36px_rgba(11,31,58,0.55)] hover:-translate-y-1.5' 
          : 'opacity-40 grayscale cursor-not-allowed bg-slate-900 border-slate-700'
      }`}
    >
      {/* برش هندسی گوشه کاشی به رنگ بنفش (#4A0072) با خط درز طلای عتیق در گوشه بالا-چپ */}
      <svg 
        className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="purpleCornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7507b3" />
            <stop offset="60%" stopColor="#4A0072" />
            <stop offset="100%" stopColor="#30004c" />
          </linearGradient>
          <linearGradient id="goldSeamGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eedaa8" />
            <stop offset="50%" stopColor="#c69d5b" />
            <stop offset="100%" stopColor="#eedaa8" />
          </linearGradient>
        </defs>
        {/* برش مثلثی بنفش */}
        <polygon points="0,0 100,0 0,100" fill="url(#purpleCornerGrad)" />
        {/* خط برش طلایی با ضخامت و جلای لوکس */}
        <line x1="0" y1="100" x2="100" y2="0" stroke="url(#goldSeamGrad)" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#eedaa8" strokeWidth="1" strokeLinecap="round" />
      </svg>

      {/* هاله نورانی گوشه بنفش */}
      <div className="absolute -top-4 -left-4 w-14 h-14 bg-[#7b1fa2]/25 rounded-full blur-xl pointer-events-none z-0" />

      {/* Subtle radiant background accent on hover */}
      <div className="absolute inset-0 bg-radial from-[#eedaa8]/12 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />

      {/* Graphic Icon Container placed to the right (سمت راست کاشی و کاملاً جدا از برش بنفش) */}
      <div className="w-full flex justify-start items-center mb-2.5 sm:mb-3 z-10">
        <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#163a6a] via-[#0B1F3A] to-[#061424] border-2 border-[#c69d5b]/70 group-hover:border-[#eedaa8] flex items-center justify-center shadow-md group-hover:shadow-[0_0_20px_rgba(198,157,91,0.45)] transition-all duration-300 group-hover:scale-105">
          <div className="absolute inset-0 rounded-2xl bg-radial from-[#eedaa8]/20 to-transparent pointer-events-none" />
          <span className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform transition-transform group-hover:scale-110 select-none">
            {icon}
          </span>
        </div>
      </div>

      {/* Title & Subtitle - Aligned to Right */}
      <h3 className="text-xs sm:text-base font-black text-[#fdfbf7] group-hover:text-[#eedaa8] transition-colors leading-tight z-10">
        {title}
      </h3>
      <span className="text-[9px] sm:text-[11px] font-bold text-[#eedaa8]/85 mt-1 tracking-wide group-hover:text-[#eedaa8] transition-colors z-10 line-clamp-1">
        {subtitle}
      </span>

      {/* Action Arrow Indicator */}
      <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#eedaa8] group-hover:text-white transition-all z-10">
        <span>ورود</span>
        <span className="text-xs transition-transform group-hover:-translate-x-1">←</span>
      </div>

      {!enabled && (
        <span className="text-[9px] mt-2 bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold z-10">
          به زودی
        </span>
      )}
    </button>
  );
};

const MainCard = ({ title, subtitle, description, icon, onClick, highlight }: any) => {
  return (
    <button 
      onClick={onClick} 
      className={`group relative p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden cursor-pointer rounded-3xl border-2 ${
        highlight 
          ? 'bg-gradient-to-b from-[#0f2c52] via-[#0B1F3A] to-[#071629] border-[#eedaa8] shadow-[0_12px_32px_rgba(11,31,58,0.5)] text-white' 
          : 'bg-gradient-to-b from-[#0f2c52] via-[#0B1F3A] to-[#071629] border-[#c69d5b]/50 hover:border-[#eedaa8] shadow-[0_10px_25px_rgba(11,31,58,0.38)] text-white'
      }`}
    >
      {/* برش هندسی گوشه کاشی به رنگ بنفش */}
      <svg 
        className="absolute top-0 left-0 w-28 h-28 sm:w-36 sm:h-36 pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polygon points="0,0 100,0 0,100" fill="#4A0072" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#c69d5b" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#eedaa8" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#7b1fa2]/25 rounded-full blur-xl pointer-events-none z-0" />

      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#163a6a] via-[#0B1F3A] to-[#061424] border-2 border-[#c69d5b]/70 group-hover:border-[#eedaa8] rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all shadow-md z-10">
        <span className="text-4xl sm:text-5xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
          {icon}
        </span>
      </div>
      <span className="text-[10px] font-black text-[#eedaa8] mb-1.5 uppercase tracking-[0.25em] z-10">{subtitle}</span>
      <h3 className="text-xl sm:text-2xl font-black text-[#fdfbf7] mb-2 group-hover:text-[#eedaa8] transition-colors z-10">{title}</h3>
      <p className="text-[#d0e0e3] text-xs sm:text-sm leading-relaxed mb-5 font-medium z-10">{description}</p>
      <div className="mt-auto text-[#eedaa8] group-hover:text-white font-black text-xs transition-all flex items-center gap-1.5 bg-[#0B1F3A]/90 px-4 py-2 rounded-xl border border-[#c69d5b]/45 z-10 shadow-sm">
        ورود به پروتکل <span className="text-sm">←</span>
      </div>
    </button>
  );
};

const StatusCard = ({ title, subtitle, description, icon, onClick }: any) => {
  return (
    <button 
      onClick={onClick} 
      className="group relative p-5 sm:p-6 bg-gradient-to-b from-[#0f2c52] via-[#0B1F3A] to-[#071629] border-2 border-[#c69d5b]/50 hover:border-[#eedaa8] rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_25px_rgba(11,31,58,0.38)] hover:shadow-[0_18px_36px_rgba(11,31,58,0.55)] hover:-translate-y-1 cursor-pointer text-white overflow-hidden"
    >
      {/* برش هندسی گوشه کاشی به رنگ بنفش */}
      <svg 
        className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 pointer-events-none z-0 transition-transform duration-500 group-hover:scale-105" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <polygon points="0,0 100,0 0,100" fill="#4A0072" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#c69d5b" strokeWidth="3" strokeLinecap="round" />
        <line x1="0" y1="100" x2="100" y2="0" stroke="#eedaa8" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#7b1fa2]/25 rounded-full blur-xl pointer-events-none z-0" />

      <div className="relative w-14 h-14 bg-gradient-to-br from-[#163a6a] via-[#0B1F3A] to-[#061424] border-2 border-[#c69d5b]/60 group-hover:border-[#eedaa8] rounded-2xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform z-10">
        <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none">
          {icon}
        </span>
      </div>
      <span className="text-[9px] font-black text-[#eedaa8] mb-1 uppercase tracking-wider z-10">{subtitle}</span>
      <h3 className="text-base sm:text-lg font-black text-[#fdfbf7] group-hover:text-[#eedaa8] mb-1.5 transition-colors z-10">{title}</h3>
      <p className="text-[#c2d7db] text-[11px] leading-relaxed line-clamp-2 z-10">{description}</p>
    </button>
  );
};

export default App;