import React, { useState, useEffect } from 'react';
import ModuleHeader from './common/ModuleHeader';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

type TabType = 'RSBI' | 'CROP' | 'IWI' | 'P01' | 'NIF' | 'SBT_CHECKLIST';

const WeaningAssessment: React.FC<Props> = ({ onBack, onHome }) => {
  const [activeTab, setActiveTab] = useState<TabType>('RSBI');

  // Input states
  // 1. Common inputs
  const [f, setF] = useState<number>(18); // respiratory frequency (breaths/min)
  const [vt, setVt] = useState<number>(0.45); // tidal volume (Liters)
  
  // 2. Compliance inputs
  const [cdyn, setCdyn] = useState<number>(35); // dynamic compliance (mL / cmH2O)
  const [cstat, setCstat] = useState<number>(45); // static compliance (mL / cmH2O)
  
  // 3. Pressure inputs
  const [mip, setMip] = useState<number>(-25); // MIP / NIF (cmH2O)
  const [p01, setP01] = useState<number>(2.5); // P0.1 (cmH2O)
  
  // 4. Oxygenation inputs
  const [sao2, setSao2] = useState<number>(96); // SaO2 (%)
  const [pao2, setPao2] = useState<number>(85); // PaO2 (mmHg)
  const [fio2, setFio2] = useState<number>(40); // FiO2 (%)
  const [paco2, setPaco2] = useState<number>(40); // PaCO2 (mmHg)

  // Computed Values
  const [rsbi, setRsbi] = useState<number>(0);
  const [crop, setCrop] = useState<number>(0);
  const [iwi, setIwi] = useState<number>(0);
  const [pao2Pao2Ratio, setPao2Pao2Ratio] = useState<number>(0);
  const [pao2Alveolar, setPao2Alveolar] = useState<number>(0);

  // SBT Checklist states
  const [checklist, setChecklist] = useState({
    causeResolved: false,
    pao2Fio2Ok: false,
    peepOk: false,
    hemodynamicStable: false,
    consciousGcs: false,
    coughSecretions: false,
    temperatureOk: false,
    electrolytesOk: false,
  });

  // Calculate values
  useEffect(() => {
    // 1. RSBI
    const calculatedRsbi = vt > 0 ? f / vt : 0;
    setRsbi(calculatedRsbi);

    // 2. Alveolar gas equation for PAO2
    // PAO2 = FiO2/100 * (760 - 47) - PaCO2 / 0.8  (at sea level)
    const PAO2 = (fio2 / 100) * 713 - paco2 / 0.8;
    setPao2Alveolar(PAO2);

    const ratio = PAO2 > 0 ? pao2 / PAO2 : 0;
    setPao2Pao2Ratio(ratio);

    // 3. CROP Index
    // CROP = [Cdyn * |MIP| * (PaO2/PAO2)] / f
    const absMip = Math.abs(mip);
    const calculatedCrop = f > 0 ? (cdyn * absMip * ratio) / f : 0;
    setCrop(calculatedCrop);

    // 4. IWI
    // IWI = (Cstat * SaO2) / RSBI
    const calculatedIwi = calculatedRsbi > 0 ? (cstat * sao2) / calculatedRsbi : 0;
    setIwi(calculatedIwi);
  }, [f, vt, cdyn, cstat, mip, sao2, pao2, fio2, paco2]);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedSbtItems = Object.values(checklist).filter(Boolean).length;
  const totalSbtItems = Object.keys(checklist).length;

  const renderRSBI = () => {
    const isSuccess = rsbi < 105;
    const isExcellent = rsbi < 80;
    
    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Inputs */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-4 sm:space-y-5">
            <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">پارامترهای ورودی RSBI</h4>
            
            <div className="space-y-3.5">
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">تعداد تنفس (f)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={f}
                      onChange={(e) => setF(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-xs font-bold text-[#55696d]">/min</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#475569] font-medium">تعداد تنفس خودبه‌خودی بیمار در دقیقه</p>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={f}
                  onChange={(e) => setF(parseInt(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">حجم جاری (Vt)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      step="0.01"
                      value={vt}
                      onChange={(e) => setVt(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-xs font-bold text-[#55696d]">L</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#475569] font-medium">حجم هوای دم و بازدم بر حسب <b>لیتر (L)</b></p>
                <input
                  type="range"
                  min="0.05"
                  max="1.5"
                  step="0.01"
                  value={vt}
                  onChange={(e) => setVt(parseFloat(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>
            </div>

            {/* Formula box */}
            <div className="bg-[#fcfaf7] p-3 sm:p-3.5 rounded-2xl border-2 border-[#096067]/25 text-center text-xs font-mono font-bold text-[#062a2e] break-words [overflow-wrap:anywhere] leading-relaxed">
              <span className="text-[#096067] font-black">فرمول:</span> RSBI = f / Vt = {f} / {vt} L = {rsbi.toFixed(1)}
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">نتیجه شاخص RSBI</h4>
              
              <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
                <div className="text-[10px] sm:text-xs font-black text-[#475569] mb-1 uppercase tracking-wide break-words max-w-full">Rapid Shallow Breathing Index</div>
                <div className={`text-5xl sm:text-6xl font-black ${isSuccess ? (isExcellent ? 'text-emerald-600' : 'text-[#096067]') : 'text-rose-600'}`}>
                  {rsbi.toFixed(1)}
                </div>
                <div className="text-xs text-[#55696d] font-bold mt-1">breaths/min/L</div>

                <div className={`mt-4 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center text-center gap-1.5 border-2 max-w-full ${
                  isSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  <span>{isSuccess ? (isExcellent ? '🟢 آمادگی بسیار عالی (پیش‌بینی موفقیت بالا)' : '🟡 آمادگی مناسب (پیش‌بینی موفقیت)') : '🔴 خطر شکست بالا (تندنفسی سطحی)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/30 space-y-1 text-xs sm:text-sm shadow-xs">
              <div className="font-black text-[#096067] flex items-center gap-1">
                <span>💡</span> تفسیر بالینی:
              </div>
              <p className="text-[#062a2e] font-bold leading-relaxed text-xs">
                شاخص تنفس سریع و سطحی (Tobin Index) محبوب‌ترین شاخص در ICU است. مقدار <b>کمتر از ۱۰۵</b> نشان‌دهنده الگوی تنفسی کارآمد است و کاندید بسیار خوبی برای آزمون تنفس خودبه‌خودی (SBT) است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 space-y-4 shadow-xs">
          <h5 className="text-sm sm:text-base font-black text-[#062a2e] flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#062a2e] font-bold">
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>بیماران با تهویه مکانیکی عمومی، جراحی‌های بزرگ روتین و کسانی که سابقه بیماری ریوی زمینه‌ای پیچیده ندارند.</li>
                <li>ارزیابی سریع و بالینی بر بالین بیمار قبل از شروع پروتکل جداسازی.</li>
                <li>تغییرات روند RSBI در طول ۲۴ ساعت بسیار ارزشمندتر از یک تک‌اندازه‌گیری است.</li>
              </ul>
            </div>
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#ca7f3c]/35 shadow-xs">
              <p className="font-black text-[#ca7f3c]">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>در بیماران مسن یا بیماران با COPD ممکن است به طور کاذب بالا باشد ولی جداسازی با موفقیت انجام شود.</li>
                <li>تحت تاثیر اضطراب، درد، تب، ساکشن ترشحات یا سداسیون نامناسب تغییر چشمگیری می‌کند.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCROP = () => {
    const isSuccess = crop > 13;
    
    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Inputs */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">پارامترهای ورودی CROP</h4>
            
            <div className="space-y-3.5">
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">کمپلیانس دینامیک (Cdyn)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={cdyn}
                      onChange={(e) => setCdyn(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">mL/cmH2O</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={cdyn}
                  onChange={(e) => setCdyn(parseInt(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">حداکثر فشار دمی (MIP/NIF)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={Math.abs(mip)}
                      onChange={(e) => setMip(-Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">cmH2O</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={Math.abs(mip)}
                  onChange={(e) => setMip(-Math.abs(parseInt(e.target.value) || 0))}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">فشار اکسیژن شریانی (PaO2)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={pao2}
                      onChange={(e) => setPao2(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">mmHg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={pao2}
                  onChange={(e) => setPao2(parseInt(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-[#fcfaf7] p-3 rounded-2xl [&>*]:min-w-0 border-2 border-[#c69d5b]/25">
                <div>
                  <label className="text-[11px] text-[#062a2e] font-black block mb-1">اکسیژن دمی (FiO2 %)</label>
                  <input
                    type="number"
                    min="21"
                    max="100"
                    value={fio2}
                    onChange={(e) => setFio2(Math.max(21, Math.min(100, parseInt(e.target.value) || 21)))}
                    className="w-full min-w-0 p-1.5 rounded-xl bg-white border-2 border-[#c69d5b]/35 text-center font-black text-[#062a2e] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#062a2e] font-black block mb-1">فشار دی‌اکسید کربن (PaCO2)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={paco2}
                    onChange={(e) => setPaco2(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full min-w-0 p-1.5 rounded-xl bg-white border-2 border-[#c69d5b]/35 text-center font-black text-[#062a2e] text-xs"
                  />
                </div>
              </div>

              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 flex items-center justify-between">
                <div>
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">تعداد تنفس خودبه‌خودی (f)</label>
                  <p className="text-[11px] text-[#475569]">تعداد تنفس در دقیقه</p>
                </div>
                <input
                  type="number"
                  value={f}
                  onChange={(e) => setF(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">نتیجه شاخص CROP</h4>
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="text-[10px] sm:text-xs font-black text-[#475569] mb-1 uppercase tracking-wide break-words max-w-full">Compliance, Rate, Oxygenation, Pressure</div>
                <div className={`text-5xl sm:text-6xl font-black ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {crop.toFixed(1)}
                </div>
                <div className="text-xs text-[#55696d] font-bold mt-1">mL/breath/min</div>

                <div className="mt-4 grid grid-cols-2 gap-3 w-full text-xs font-mono break-words [&>*]:min-w-0 bg-[#fcfaf7] p-3 rounded-xl border-2 border-[#c69d5b]/25">
                  <div className="text-right">
                    <span className="text-[#475569] block font-bold text-[11px]">PAO2 (آلوئولی):</span>
                    <span className="text-[#096067] font-black">{pao2Alveolar.toFixed(0)} mmHg</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#475569] block font-bold text-[11px]">نسبت PaO2/PAO2:</span>
                    <span className="text-[#096067] font-black">{pao2Pao2Ratio.toFixed(2)}</span>
                  </div>
                </div>

                <div className={`mt-4 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center text-center gap-1.5 border-2 max-w-full ${
                  isSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  <span>{isSuccess ? '🟢 موفقیت جداسازی بالا (> ۱۳)' : '🔴 احتمال بالای شکست بستگی به ریه (≤ ۱۳)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/30 space-y-1 text-xs shadow-xs">
              <div className="font-black text-[#096067] flex items-center gap-1">
                <span>💡</span> تفسیر بالینی:
              </div>
              <p className="text-[#062a2e] font-bold leading-relaxed">
                فرمول پیشرفته: [Cdyn * MIP * (PaO2/PAO2)] / f. مقدار <b>بیشتر از ۱۳</b> نشانه توان بالا در عبور موفق از پروسه جداسازی است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 space-y-4 shadow-xs">
          <h5 className="text-sm sm:text-base font-black text-[#062a2e] flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#062a2e] font-bold">
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>بیمارانی با نارسایی قلبی حاد، بیماری‌های فضاگیر یا ناتوانی عضلانی ریوی همزمان.</li>
                <li>بیماران تحت تهویه مکانیکی طولانی مدت (Prolonged Intubation).</li>
              </ul>
            </div>
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#ca7f3c]/35 shadow-xs">
              <p className="font-black text-[#ca7f3c]">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>فرمول پیچیده و محاسبات طولانی‌تر نسبت به RSBI که نیاز به گاز خون شریانی (ABG) و مانیتورینگ دقیق کمپلیانس دارد.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIWI = () => {
    const isSuccess = iwi > 25;
    
    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Inputs */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">پارامترهای ورودی IWI</h4>
            
            <div className="space-y-3.5">
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">کمپلیانس استاتیک (Cstat)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={cstat}
                      onChange={(e) => setCstat(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">mL/cmH2O</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={cstat}
                  onChange={(e) => setCstat(parseInt(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">اشباع اکسیژن شریانی (SaO2)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={sao2}
                      onChange={(e) => setSao2(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-xs font-bold text-[#55696d]">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={sao2}
                  onChange={(e) => setSao2(parseInt(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-[#fcfaf7] p-3 rounded-2xl [&>*]:min-w-0 border-2 border-[#c69d5b]/25">
                <div>
                  <label className="text-[11px] text-[#062a2e] font-black block mb-1">تعداد تنفس (f)</label>
                  <input
                    type="number"
                    value={f}
                    onChange={(e) => setF(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full min-w-0 p-1.5 rounded-xl bg-white border-2 border-[#c69d5b]/35 text-center font-black text-[#062a2e] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#062a2e] font-black block mb-1">حجم جاری (Vt در لیتر)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={vt}
                    onChange={(e) => setVt(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                    className="w-full min-w-0 p-1.5 rounded-xl bg-white border-2 border-[#c69d5b]/35 text-center font-black text-[#062a2e] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Formula box */}
            <div className="bg-[#fcfaf7] p-3 sm:p-3.5 rounded-2xl border-2 border-[#096067]/25 text-center text-xs font-mono font-bold text-[#062a2e] break-words [overflow-wrap:anywhere] leading-relaxed">
              <span className="text-[#096067] font-black">فرمول:</span> IWI = (Cstat * SaO2) / RSBI
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">نتیجه شاخص IWI</h4>
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="text-[10px] sm:text-xs font-black text-[#475569] mb-1 uppercase tracking-wide break-words max-w-full">Integrated Weaning Index</div>
                <div className={`text-5xl sm:text-6xl font-black ${isSuccess ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {iwi.toFixed(1)}
                </div>
                <div className="text-xs text-[#55696d] font-bold mt-1">mL/cmH2O/breaths/min/L</div>

                <div className="mt-4 text-xs font-mono bg-[#fcfaf7] py-2 px-3 rounded-xl break-words max-w-full border-2 border-[#c69d5b]/25 text-[#475569] font-bold">
                  RSBI مخرج کسر: <span className="text-[#096067] font-black">{rsbi.toFixed(1)}</span>
                </div>

                <div className={`mt-4 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center text-center gap-1.5 border-2 max-w-full ${
                  isSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}>
                  <span>{isSuccess ? '🟢 آمادگی عالی برای لوله‌برداری (> ۲۵)' : '🔴 خطر شکست تنفسی بالا (≤ ۲۵)'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/30 space-y-1 text-xs shadow-xs">
              <div className="font-black text-[#096067] flex items-center gap-1">
                <span>💡</span> تفسیر بالینی:
              </div>
              <p className="text-[#062a2e] font-bold leading-relaxed">
                این شاخص هر سه ضلع مثلث تنفسی (SaO2، Cstat و RSBI) را ارزیابی می‌کند. مقادیر <b>بیشتر از ۲۵</b> نشان‌دهنده شانس بسیار بالا در جداسازی موفق است.
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 space-y-4 shadow-xs">
          <h5 className="text-sm sm:text-base font-black text-[#062a2e] flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#062a2e] font-bold">
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li><b>بالاترین دقت تشخیصی:</b> حساسیت و ویژگی برتر نسبت به تک شاخص RSBI.</li>
                <li>بیمارانی که نوسانات اکسیژن دمی دارند.</li>
              </ul>
            </div>
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#ca7f3c]/35 shadow-xs">
              <p className="font-black text-[#ca7f3c]">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>نیاز به محاسبه کمپلیانس استاتیک ریه و ثبت دقیق فشار پلاتو (Plateau Pressure).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderP01 = () => {
    let p01Status = "طبیعی (Normal Drive)";
    let p01Color = "text-emerald-800 bg-emerald-50 border-emerald-300";
    let p01Desc = "قدرت فرمان صادر شده از بصل‌النخاع کاملاً طبیعی و متناسب است. بیمار آماده ورود به پروسه جداسازی و لوله‌برداری است.";

    if (p01 < 1.0) {
      p01Status = "کاهش درایو تنفسی (Depressed Drive)";
      p01Color = "text-rose-800 bg-rose-50 border-rose-300";
      p01Desc = "درایو تنفسی مرکزی بیمار به شدت کاهش یافته است. علل اصلی می‌تواند سداسیون عمیق، هایپرکاپنی مزمن یا آسیب مغزی باشد.";
    } else if (p01 > 4.0) {
      p01Status = "بسیار بالا / بار شدید تنفسی (Hyperdrive)";
      p01Color = "text-red-800 bg-red-50 border-red-300";
      p01Desc = "مغز بیمار فرمان تنفس‌های بسیار شدید را صادر می‌کند. خستگی زودرس عضلانی دم و شکست در جداسازی محتمل است.";
    } else if (p01 > 2.0) {
      p01Status = "درایو نسبتاً بالا (Elevated Drive)";
      p01Color = "text-amber-800 bg-amber-50 border-amber-300";
      p01Desc = "مرکز تنفس فعال‌تر از معمول است. بررسی دقیق‌تر ترشحات، اسیدوز یا درد بیمار الزامی است.";
    }

    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Inputs */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">ثبت فشار انسداد آلوئول (P0.1)</h4>
            
            <div className="space-y-3.5">
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">فشار P0.1 ثبت شده</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      step="0.1"
                      value={p01}
                      onChange={(e) => setP01(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">cmH2O</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#475569] font-medium">فشار انسداد مجاری هوایی در ۱۰۰ میلی‌ثانیه اول دم</p>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={p01}
                  onChange={(e) => setP01(parseFloat(e.target.value) || 0)}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed text-[#062a2e] font-bold space-y-1.5 border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">💡 روش اندازه‌گیری P0.1:</p>
              <p className="text-[#334155]">
                این معیار به شکل اتوماتیک توسط ونتیلاتورهای مدرن حین تلاش دمی اولیه بیمار ثبت و برحسب cmH2O ارائه می‌گردد.
              </p>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">تحلیل فرمان تنفس مرکزی (Drive)</h4>
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="text-[10px] sm:text-xs font-black text-[#475569] mb-1 uppercase tracking-wide break-words max-w-full">Airway Occlusion Pressure (P0.1)</div>
                <div className="text-5xl sm:text-6xl font-black text-[#096067]">
                  {p01.toFixed(1)}
                </div>
                <div className="text-xs text-[#55696d] font-bold mt-1">cmH2O</div>

                <div className={`mt-4 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 text-center ${p01Color}`}>
                  {p01Status}
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl space-y-1 text-xs border-2 border-[#096067]/30 shadow-xs">
              <div className="font-black text-[#096067]">📌 نظر راهنمای بالینی:</div>
              <p className="text-[#062a2e] font-bold leading-relaxed">
                {p01Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 space-y-4 shadow-xs">
          <h5 className="text-sm sm:text-base font-black text-[#062a2e] flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#062a2e] font-bold">
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li><b>بیماران مبتلا به COPD شدید:</b> جهت مهار کار تنفسی و تنظیم PEEP.</li>
                <li>پیشگیری از آسیب ریه ناشی از تلاش خود بیمار (P-SILI).</li>
              </ul>
            </div>
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#ca7f3c]/35 shadow-xs">
              <p className="font-black text-[#ca7f3c]">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>پاسخ تنفسی نامنظم بیمار (سرفه یا دیس‌سینکرونی شدید) عدد را مخدوش می‌کند.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNIF = () => {
    const absMip = Math.abs(mip);
    const isAcceptable = absMip >= 20 && absMip < 30;
    const isWeak = absMip < 20;

    let nifStatus = "قدرت بسیار عالی عضلات دم (Strong Force)";
    let nifColor = "text-emerald-800 bg-emerald-50 border-emerald-300";
    let nifDesc = "عضلات دمی بیمار (دیافراگم و عضلات بین‌دنده‌ای) قدرت بسیار بالایی در تولید فشار منفی جهت غلبه بر مقاومت لوله تراشه دارند.";

    if (isWeak) {
      nifStatus = "ضعف شدید عضلات دمی (Severe Weakness)";
      nifColor = "text-rose-800 bg-rose-50 border-rose-300";
      nifDesc = "بیمار توانایی تولید حداقل نیروی تنفسی را ندارد. لوله‌برداری بلافاصله منجر به خستگی تنفسی خواهد شد.";
    } else if (isAcceptable) {
      nifStatus = "قدرت مرزی / نیازمند مراقبت (Borderline)";
      nifColor = "text-amber-800 bg-amber-50 border-amber-300";
      nifDesc = "نیروی تنفسی قابل قبول است. بیمار در صورت داشتن سایر معیارهای مثبت کاندید SBT است.";
    }

    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Inputs */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-4">
            <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">ثبت نیروی دمی منفی (NIF / MIP)</h4>
            
            <div className="space-y-3.5">
              <div className="bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#c69d5b]/25 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
                  <label className="text-[#062a2e] font-black text-xs sm:text-sm">نیروی دمی منفی (NIF)</label>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={absMip}
                      onChange={(e) => setMip(-Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 min-w-0 p-1 rounded-xl bg-white border-2 border-[#c69d5b]/40 text-center font-black text-[#062a2e] text-sm shadow-xs"
                    />
                    <span className="text-[11px] font-bold text-[#55696d]">cmH2O-</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#475569] font-medium">حداکثر فشار منفی دمی حین انسداد دم</p>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={absMip}
                  onChange={(e) => setMip(-Math.abs(parseInt(e.target.value) || 0))}
                  className="w-full h-2 accent-[#096067] cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed text-[#062a2e] font-bold space-y-1 border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">💡 روش آزمایش بالینی NIF:</p>
              <p className="text-[#334155]">
                لوله‌دمی بیمار به مدت ۱۵ تا ۲۰ ثانیه مسدود شده و عمیق‌ترین تلاش دم او ثبت می‌شود.
              </p>
            </div>
          </div>

          {/* Results display */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e] border-b border-[#c69d5b]/20 pb-3">وضعیت عضلات تنفسی</h4>
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="text-[10px] sm:text-xs font-black text-[#475569] mb-1 uppercase tracking-wide break-words max-w-full">Negative Inspiratory Force</div>
                <div className="text-5xl sm:text-6xl font-black text-[#096067]">
                  -{absMip}
                </div>
                <div className="text-xs text-[#55696d] font-bold mt-1">cmH2O</div>

                <div className={`mt-4 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 text-center ${nifColor}`}>
                  {nifStatus}
                </div>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl space-y-1 text-xs border-2 border-[#096067]/30 shadow-xs">
              <div className="font-black text-[#096067]">📌 راهنمای بالینی:</div>
              <p className="text-[#062a2e] font-bold leading-relaxed">
                {nifDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Application and Suitability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 space-y-4 shadow-xs">
          <h5 className="text-sm sm:text-base font-black text-[#062a2e] flex items-center gap-2">
            <span>🔍</span> چه زمانی و برای کدام بیماران مناسب است؟
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#062a2e] font-bold">
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#096067]/25 shadow-xs">
              <p className="font-black text-[#096067]">📌 بهترین وضعیت کاربرد:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li><b>بیماران نورومسکولار:</b> (گیلن باره، میاستنی گراویس، آسیب نخاعی).</li>
                <li>تخمین عالی از قدرت سرفه بیمار جهت تخلیه ترشحات.</li>
              </ul>
            </div>
            <div className="space-y-2 bg-[#fcfaf7] p-3.5 sm:p-4 rounded-2xl border-2 border-[#ca7f3c]/35 shadow-xs">
              <p className="font-black text-[#ca7f3c]">⚠️ محدودیت‌ها و موارد عدم انطباق:</p>
              <ul className="list-disc pr-4 space-y-1.5 text-[#334155]">
                <li>نیاز به همکاری کامل بیمار جهت تلاش حداکثری.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSbtChecklist = () => {
    return (
      <div className="space-y-6 sm:space-y-8 animate-in">
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/35 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#c69d5b]/20 pb-4 gap-3">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#062a2e]">چک‌لیست آمادگی آزمون تنفس خودبه‌خودی (SBT)</h4>
              <p className="text-[11px] sm:text-xs text-[#475569] font-medium mt-0.5">بر اساس گایدلاین انجمن ریه و مراقبت‌های ویژه آمریکا (ATS/ACCP)</p>
            </div>
            <div className="bg-[#092b36] border-2 border-[#c69d5b] px-4 py-2 rounded-2xl text-center shadow-sm flex items-center justify-between sm:block gap-3">
              <span className="text-[10px] text-[#eedaa8] block font-bold">تحقق معیارها:</span>
              <span className="text-base sm:text-lg font-black text-white">{completedSbtItems} از {totalSbtItems}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <ChecklistItem
              id="causeResolved"
              label="برطرف شدن علت اصلی اینتوباسیون"
              description="علت زمینه‌ای (سپسیس، ادم حاد ریه، اسپاسم ریوی) مهار شده یا رو به بهبود است."
              checked={checklist.causeResolved}
              onChange={() => toggleChecklistItem('causeResolved')}
            />
            <ChecklistItem
              id="pao2Fio2Ok"
              label="اکسیژن‌رسانی پایدار (PaO2/FiO2 ≥ ۱۵۰)"
              description="تبادل گازی مناسب است (مثلاً PaO2 بالای ۶۰ با FiO2 زیر ۴۰٪)."
              checked={checklist.pao2Fio2Ok}
              onChange={() => toggleChecklistItem('pao2Fio2Ok')}
            />
            <ChecklistItem
              id="peepOk"
              label="فشار مثبت انتهای بازدمی (PEEP ≤ ۵-۸)"
              description="ریه بیمار بدون نیاز به PEEPهای تهاجمی بالا باز می‌ماند."
              checked={checklist.peepOk}
              onChange={() => toggleChecklistItem('peepOk')}
            />
            <ChecklistItem
              id="hemodynamicStable"
              label="ثبات همودینامیک عالی"
              description="فشار خون بیمار پایدار است و نیاز به وازوپرسور سنگین یا آریتمی جدید ندارد."
              checked={checklist.hemodynamicStable}
              onChange={() => toggleChecklistItem('hemodynamicStable')}
            />
            <ChecklistItem
              id="consciousGcs"
              label="هوشیاری و رفلکس‌های عصبی کافی"
              description="بیمار هوشیار است (GCS ≥ ۸) و توان صیانت از راه هوایی را دارد."
              checked={checklist.consciousGcs}
              onChange={() => toggleChecklistItem('consciousGcs')}
            />
            <ChecklistItem
              id="coughSecretions"
              label="رفلکس سرفه قوی و ترشحات کم"
              description="ترشحات ریه غلیظ نیست و دفعات ساکشن بیش از هر ۲ ساعت یکبار نیاز ندارد."
              checked={checklist.coughSecretions}
              onChange={() => toggleChecklistItem('coughSecretions')}
            />
            <ChecklistItem
              id="temperatureOk"
              label="دمای طبیعی بدن (T < ۳۸°C)"
              description="بیمار تب شدید فعال یا هایپوترمی حاد ندارد تا بار متابولیک بیهوده افزایش نیابد."
              checked={checklist.temperatureOk}
              onChange={() => toggleChecklistItem('temperatureOk')}
            />
            <ChecklistItem
              id="electrolytesOk"
              label="تعادل الکترولیت‌ها و مایعات بدن"
              description="پتاسیم، فسفر و منیزیم نرمال است (عدم اختلال انقباض عضلانی دیافراگم)."
              checked={checklist.electrolytesOk}
              onChange={() => toggleChecklistItem('electrolytesOk')}
            />
          </div>
        </div>

        {/* Action recommendations based on completion */}
        <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 ${completedSbtItems === totalSbtItems ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-400'} space-y-2`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{completedSbtItems === totalSbtItems ? '🎉' : '⚠️'}</span>
            <h5 className="font-black text-[#062a2e] text-sm sm:text-base">
              {completedSbtItems === totalSbtItems ? 'آماده انجام آزمون تنفس خودبه‌خودی (SBT)' : 'برخی معیارهای کلیدی هنوز محقق نشده‌اند'}
            </h5>
          </div>
          <p className="text-xs sm:text-sm text-[#062a2e] leading-relaxed font-bold">
            {completedSbtItems === totalSbtItems 
              ? "بیمار تمام معیارهای غربالگری بالینی را داراست. بر اساس گایدلاین‌های جهانی، اکنون می‌توانید SBT را به مدت ۳۰ الی ۱۲۰ دقیقه شروع کنید. در صورت پایداری در این مدت، extubation بلامانع است."
              : `بیمار ${completedSbtItems} مورد از ${totalSbtItems} معیار کلیدی را پاس کرده است. توصیه می‌شود ابتدا پارامترهای نامنطبق را بهبود بخشیده و مجددا غربالگری را تکرار کنید تا احتمال شکست extubation به حداقل برسد.`
            }
          </p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'RSBI': return renderRSBI();
      case 'CROP': return renderCROP();
      case 'IWI': return renderIWI();
      case 'P01': return renderP01();
      case 'NIF': return renderNIF();
      case 'SBT_CHECKLIST': return renderSbtChecklist();
      default: return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in text-right" dir="rtl">
      <ModuleHeader onBack={onBack} onHome={onHome} />
      
      {/* Title */}
      <div className="premium-card p-4 sm:p-6 md:p-8 border-2 border-[#c69d5b]/30 shadow-md text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#092b36] to-[#04141a] rounded-2xl sm:rounded-3xl flex items-center justify-center mb-3 mx-auto border-2 border-[#c69d5b]/50 shadow-md text-white">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#eedaa8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v9M9 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12c-2.5 0-4.5 2-4.5 4.5 0 3 2 4.5 4.5 4.5" />
            <path d="M12 12c2.5 0 4.5 2 4.5 4.5 0 3-2 4.5-4.5 4.5" />
            <path d="M7.5 16.5C5 16.5 3 14 3 11c0-4 4-6 9-6s9 2 9 6c0 3-2 5.5-4.5 5.5" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#062a2e]">شاخص‌های جداسازی بیمار از ونتیلاتور</h3>
        <p className="text-[#096067] text-xs sm:text-sm font-bold mt-1.5 max-w-xl mx-auto">محاسبه، ارزیابی و تفسیر دقیق بالینی آمادگی بیمار جهت Extubation</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2.5 scrollbar-none border-b border-[#c69d5b]/20 -mx-1 px-1 sm:mx-0 sm:px-0">
        <TabButton id="RSBI" label="RSBI (شاخص توبین)" active={activeTab === 'RSBI'} onClick={() => setActiveTab('RSBI')} />
        <TabButton id="CROP" label="شاخص CROP" active={activeTab === 'CROP'} onClick={() => setActiveTab('CROP')} />
        <TabButton id="IWI" label="شاخص تلفیقی IWI" active={activeTab === 'IWI'} onClick={() => setActiveTab('IWI')} />
        <TabButton id="P01" label="فشار انسداد P0.1" active={activeTab === 'P01'} onClick={() => setActiveTab('P01')} />
        <TabButton id="NIF" label="قدرت عضلانی NIF" active={activeTab === 'NIF'} onClick={() => setActiveTab('NIF')} />
        <TabButton id="SBT_CHECKLIST" label="📝 چک‌لیست آمادگی SBT" active={activeTab === 'SBT_CHECKLIST'} onClick={() => setActiveTab('SBT_CHECKLIST')} />
      </div>

      {/* Active Tab Screen */}
      <div className="premium-card p-3.5 sm:p-6 md:p-8 border-2 border-[#c69d5b]/30 shadow-md [&_*]:min-w-0 [overflow-wrap:anywhere] overflow-hidden">
        {renderContent()}
      </div>

      {/* General Medical Disclaimer Footer */}
      <div className="bg-white border-2 border-[#c69d5b]/30 p-4 sm:p-5 rounded-2xl text-center text-xs text-[#062a2e] font-bold shadow-xs">
        📌 اطلاعات ارائه شده در این ماژول بر مبنای مراجع معتبر طب مراقبت‌های ویژه (MDCalc، Pilbeam و گایدلاین‌های ATS/ACCP) گردآوری شده است. تصمیم نهایی همواره با پزشک معالج بیمار در بخش ICU است.
      </div>
    </div>
  );
};

const TabButton = ({ id, label, active, onClick }: { id: string, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all whitespace-nowrap border-2 flex-shrink-0 cursor-pointer ${
      active 
        ? 'bg-gradient-to-r from-[#ca7f3c] to-[#c69d5b] border-[#eedaa8] text-white shadow-md' 
        : 'bg-white border-2 border-[#c69d5b]/30 text-[#062a2e] hover:border-[#096067]'
    }`}
  >
    {label}
  </button>
);

const ChecklistItem = ({ id, label, description, checked, onChange }: { id: string, label: string, description: string, checked: boolean, onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-right w-full cursor-pointer active:scale-98 ${
      checked 
        ? 'bg-[#092b36] border-[#eedaa8] text-white shadow-sm' 
        : 'bg-[#fcfaf7] border-2 border-[#c69d5b]/30 text-[#062a2e] hover:border-[#096067]'
    }`}
  >
    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center border mt-0.5 flex-shrink-0 ${
      checked ? 'bg-[#c69d5b] border-white text-[#062a2e]' : 'border-[#c69d5b]/50 bg-white'
    }`}>
      {checked && <span className="text-xs font-black">✓</span>}
    </div>
    <div className="space-y-0.5 min-w-0 flex-1">
      <span className={`font-black text-xs sm:text-sm block ${checked ? 'text-[#eedaa8]' : 'text-[#062a2e]'}`}>{label}</span>
      <p className={`text-[11px] sm:text-xs leading-relaxed ${checked ? 'text-[#d8e8eb]' : 'text-[#475569]'}`}>{description}</p>
    </div>
  </button>
);

export default WeaningAssessment;

