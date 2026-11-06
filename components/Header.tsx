import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [installTab, setInstallTab] = useState<'android' | 'ios' | 'desktop'>('android');

  return (
    <>
      <header className="relative z-50 py-3.5 sm:py-4 px-4 sm:px-6 indigo-gradient-bg border-b border-[#c69d5b]/35 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#092b36] to-[#04141a] border-2 border-[#c69d5b] flex items-center justify-center shadow-[0_4px_14px_rgba(198,157,91,0.35)] shrink-0 group">
              <span className="text-xl sm:text-2xl transition-transform group-hover:scale-110">🩺</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-[#062a2e] tracking-tight">Nursing guide</h1>
              <p className="text-[9px] sm:text-[10px] text-[#2e838a] font-bold uppercase tracking-[0.15em] mt-0.5">Assessment • Nursing Care • Drug Calculation</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAboutModalOpen(true)} 
            className="flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-[#c69d5b]/15 hover:bg-[#c69d5b]/25 border border-[#c69d5b]/50 hover:border-[#ca7f3c]/70 transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-[#855f20] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[#855f20] group-hover:text-[#5e4315] font-black text-xs sm:text-sm">درباره برنامه</span>
          </button>
        </div>
      </header>

      {isAboutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-3 sm:p-5 animate-in">
          <div 
            className="absolute inset-0"
            onClick={() => setIsAboutModalOpen(false)}
            aria-hidden="true"
          />
          <div 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="about-title" 
            className="relative bg-[#fdfbf7] max-w-3xl w-full max-h-[90vh] flex flex-col rounded-[2rem] sm:rounded-[2.5rem] border-2 border-[#c69d5b]/50 shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header - Sticky */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#c69d5b]/25 bg-[#fdfbf7]/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#c69d5b] to-[#ca7f3c]"></div>
                <h3 id="about-title" className="text-lg sm:text-2xl font-black text-[#062a2e]">درباره Nursing guide</h3>
              </div>
              <button 
                onClick={() => setIsAboutModalOpen(false)} 
                aria-label="بستن" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-[#ca7f3c]/20 hover:border-[#ca7f3c]/40 border border-slate-200 transition-colors text-slate-700 text-lg sm:text-xl flex items-center justify-center cursor-pointer shadow-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
              {/* Introduction Banner */}
              <div className="bg-gradient-to-br from-[#092b36] via-[#096067] to-[#04141a] text-white p-4 sm:p-5 rounded-3xl border-2 border-[#c69d5b]/50 shadow-md relative overflow-hidden">
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-[#c69d5b]/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex items-start gap-3.5">
                  <span className="text-3xl sm:text-4xl shrink-0 p-2.5 bg-white/10 rounded-2xl border border-[#c69d5b]/30 shadow-xs">🩺</span>
                  <div className="space-y-1.5">
                    <h4 className="text-sm sm:text-base font-black text-[#eedaa8] flex items-center gap-2">
                      دستیار بالینی و محاسباتی کادر درمان
                      <span className="text-[10px] bg-[#c69d5b]/30 text-[#eedaa8] px-2.5 py-0.5 rounded-full font-black border border-[#c69d5b]/50">نسخه ۲.۰</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-bold">
                      سامانه‌ای یکپارچه و استاندارد طراحی‌شده برای پرستاران، دانشجویان و کادر درمان جهت تسهیل ارزیابی‌های دقیق بالینی، تریاژ، تصمیم‌گیری بالینی، محاسبات دارویی و تدوین فرآیند پرستاری در بخش‌های بستری و ویژه.
                    </p>
                  </div>
                </div>
              </div>

              {/* Categorized Modules Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 rounded-full bg-[#096067]"></div>
                  <h4 className="text-sm sm:text-base font-black text-[#062a2e]">ماژول‌ها و ابزارهای تخصصی سامانه</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Drug Calculations Module - NEW */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-[#eedaa8] hover:border-[#c69d5b] transition-all shadow-xs space-y-1.5 bg-gradient-to-br from-white to-[#fdfbf7]">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">💊</span>
                      <span>محاسبات جامع دارویی و انفوزیون</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-bold">جدید</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>قطرهٔ سرم و سرعت پمپ، دوز دارو از روی ویال (mg، g، واحد)</li>
                      <li>انفوزیون ICU: دوپامین، هپارین، انسولین و… (دوز ↔ سرعت پمپ)</li>
                      <li>داروهای درصدی، mEq (KCl، بیکربنات ۴٫۲/۷٫۵/۸٫۴٪، کلسیم، منیزیم) و رقیق‌سازی</li>
                      <li>دوز وزنی اطفال، مایع نگهدارنده، ۷ اصل دارودهی و داروهای پرخطر</li>
                    </ul>
                  </div>

                  {/* Nursing Diagnosis Module */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#062a2e] font-black text-xs sm:text-sm">
                      <span className="text-base">📋</span>
                      <span>تشخیص و مداخلات پرستاری (NANDA-I)</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>۱۱۳ تشخیص با دسته‌بندی بالینی و تفکیک بالفعل/بالقوه</li>
                      <li>مداخلات پرستاری، تغذیه و توصیه‌های سلامتی و آموزش به بیمار</li>
                    </ul>
                  </div>

                  {/* Pain Module */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">🩹</span>
                      <span>مدیریت جامع درد (Pain Scales)</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>بزرگسالان: مقیاس عددی VAS و رفتاری BPS</li>
                      <li>کودکان: ابزارهای FLACC، CHIPPS و Wong-Baker</li>
                      <li>نوزادان بستری: PIPP، NIPS، CRIES و MPAT همراه با پروتکل دارویی و غیردارویی ابلاغی</li>
                    </ul>
                  </div>

                  {/* ICU & Weaning Module */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">🫀</span>
                      <span>بخش‌های ویژه و تنفسی (ICU & Weaning)</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>جداسازی از ونتیلاتور (Weaning) بر اساس شاخص‌های RSBI و CROP</li>
                      <li>نمره‌دهی پیشرفته APACHE II و ارزیابی نارسایی اعضا SOFA</li>
                      <li>سنجش آرام‌بخشی (RASS) و غربالگری دلیریوم (CAM-ICU)</li>
                    </ul>
                  </div>

                  {/* Neuro Module */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">🧠</span>
                      <span>نورولوژی و سطح هوشیاری</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>سطح هوشیاری گلاسکو (GCS) و ارزیابی مردمک‌ها</li>
                      <li>مقیاس سکته مغزی حاد NIHSS با محاسبه خودکار شدت ضایعه</li>
                    </ul>
                  </div>

                  {/* Patient Safety */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">🛡️</span>
                      <span>ایمنی بیمار و پیشگیری از خطرات</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>زخم فشاری: مقیاس برادن (Braden) و اقدامات پیشگیرانه</li>
                      <li>سقوط: مقیاس مورس (Morse Fall Scale)</li>
                      <li>ترومبوآمبولی وریدی (VTE) و غربالگری خطر خودکشی</li>
                    </ul>
                  </div>

                  {/* Clinical Calculations */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">🧪</span>
                      <span>محاسبات و تفسیرهای بالینی</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>تحلیل گازهای خونی شریانی (ABG / VBG) و اختلالات اسید و باز</li>
                      <li>شاخص توده بدنی (BMI) و تخمین وزن و قد از روی قد زانو</li>
                    </ul>
                  </div>

                  {/* Nursing Diagnoses */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 hover:border-[#c69d5b]/50 transition-all shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0B1F3A] font-black text-xs sm:text-sm">
                      <span className="text-base">📋</span>
                      <span>تشخیص‌ها و مراقبت‌های پرستاری</span>
                    </div>
                    <ul className="text-[11px] sm:text-xs text-slate-600 space-y-1 pr-4 list-disc marker:text-[#ca7f3c]">
                      <li>بانک کامل تشخیص‌های استاندارد ناندا (NANDA-I)</li>
                      <li>اهداف پرستاری و اقدامات مراقبتی اختصاصی هر تشخیص</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* What's New Box */}
              <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 sm:p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#855f20] font-black text-xs sm:text-sm">
                  <span>✨</span>
                  <span>آخرین تغییرات و به‌روزرسانی‌های برنامه:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-700">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>ماژول تخصصی محاسبات دارویی، قطرات سرم، داروهای درصدی و دوزاژ اطفال و نوزادان</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>انفیوژن‌های بخش‌های ویژه (دوپامین، TNG، mcg/kg/min) و تبدیل mEq به سی‌سی</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>دستورالعمل جامع مدیریت درد نوزادان بستری (جدول دارویی و غیردارویی)</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>طراحی تماماً واکنش‌گرا و بهینه‌سازی اختصاصی برای نمایش در موبایل و تبلت</span>
                  </div>
                </div>
              </div>

              {/* PWA Installation Instructions */}
              <div className="bg-gradient-to-br from-[#092b36] to-[#04141a] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#c69d5b]/50 shadow-md text-white space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📲</span>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-[#eedaa8]">آموزش نصب برنامه بر روی دستگاه‌ها (PWA)</h4>
                    <p className="text-[11px] text-[#c2d7db]">نصب سریع مانند یک اپلیکیشن بومی، بدون نیاز به نصب از بازار یا اپ استور</p>
                  </div>
                </div>

                {/* Device Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-[#04141a]/60 p-1.5 rounded-xl border border-[#c69d5b]/30">
                  <button 
                    onClick={() => setInstallTab('android')}
                    className={`py-2 px-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      installTab === 'android'
                        ? 'bg-[#c69d5b] text-[#062a2e] shadow-md'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    📱 اندروید
                  </button>
                  <button 
                    onClick={() => setInstallTab('ios')}
                    className={`py-2 px-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      installTab === 'ios'
                        ? 'bg-[#c69d5b] text-[#062a2e] shadow-md'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    🍏 آیفون و آیپد
                  </button>
                  <button 
                    onClick={() => setInstallTab('desktop')}
                    className={`py-2 px-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      installTab === 'desktop'
                        ? 'bg-[#c69d5b] text-[#062a2e] shadow-md'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    💻 کامپیوتر
                  </button>
                </div>

                {/* Tab Instructions Content */}
                {installTab === 'android' && (
                  <div className="space-y-2.5 text-xs sm:text-sm bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10">
                    <div className="font-bold text-[#eedaa8] mb-1">نصب در گوگل کروم (Google Chrome) یا سامسونگ اینترنت:</div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۱</span>
                      <span>در بالای صفحه، منوی ۳ نقطه (<b className="text-[#eedaa8]">⋮</b>) مرورگر را لمس کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۲</span>
                      <span>گزینه <b className="text-[#eedaa8]">«افزودن به صفحه اصلی» (Add to Home screen)</b> یا <b className="text-[#eedaa8]">«نصب برنامه» (Install app)</b> را انتخاب نمایید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۳</span>
                      <span>دکمه <b className="text-[#eedaa8]">Install / افزودن</b> را بزنید. آیکون برنامه در صفحه برنامه‌های گوشی ظاهر می‌شود.</span>
                    </div>
                  </div>
                )}

                {installTab === 'ios' && (
                  <div className="space-y-2.5 text-xs sm:text-sm bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10">
                    <div className="font-bold text-[#eedaa8] mb-1">نصب در آیفون و آیپد با مرورگر سافاری (Safari):</div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۱</span>
                      <span>لینک سامانه را در مرورگر اصلی آیفون (<b className="text-[#eedaa8]">Safari</b>) باز کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۲</span>
                      <span>در نوار پایین، دکمه اشتراک‌گذاری (<b className="text-[#eedaa8]">Share Icon 📤</b>) را لمس کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۳</span>
                      <span>به پایین لیست بروید و گزینه <b className="text-[#eedaa8]">«Add to Home Screen» (افزودن به صفحه اصلی)</b> را انتخاب کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۴</span>
                      <span>در گوشه بالا دکمه <b className="text-[#eedaa8]">Add</b> را لمس کنید تا آیکون به صفحه اصلی افزوده شود.</span>
                    </div>
                  </div>
                )}

                {installTab === 'desktop' && (
                  <div className="space-y-2.5 text-xs sm:text-sm bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/10">
                    <div className="font-bold text-[#eedaa8] mb-1">نصب در ویندوز و مک (Google Chrome یا Edge):</div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۱</span>
                      <span>در انتهای سمت راست نوار آدرس، بر روی آیکون نصب (<b className="text-[#eedaa8]">کامپیوتر کوچک با پیکان رو به پایین ⤓</b>) کلیک کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۲</span>
                      <span>همچنین می‌توانید از منوی سه نقطه مرورگر، گزینه <b className="text-[#eedaa8]">«Save and share»</b> سپس <b className="text-[#eedaa8]">«Install app»</b> را انتخاب کنید.</span>
                    </div>
                    <div className="flex items-start gap-2 text-white/90">
                      <span className="w-5 h-5 rounded-full bg-[#c69d5b] text-[#062a2e] font-black flex items-center justify-center text-[11px] shrink-0">۳</span>
                      <span>بر روی <b className="text-[#eedaa8]">Install</b> کلیک کنید تا سامانه در پنجره مستقل و سریع اجرا شود.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Creator & Contact Info */}
              <div className="pt-2 border-t border-[#c69d5b]/25 text-center space-y-4">
                <p className="text-[#855f20] font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
                  <span>طراحی و اجرا: حسین نصاری</span>
                  <span className="opacity-40">•</span>
                  <span>آخرین به‌روزرسانی: آبان ۱۴۰۵</span>
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a 
                    href="https://t.me/ho3in925" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-[#f5f0e6] border border-[#2e838a]/40 hover:border-[#096067]/60 transition-all w-full justify-center text-right shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#096067] group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-1.37.2-1.64l16.43-6.2c.85-.32 1.58.2 1.32 1.28l-2.6 12.42c-.28 1.13-1.02 1.4-1.9 .86L12.1 14.53l-1.62 1.55c-.2.2-.36.36-.67.36z" />
                    </svg>
                    <div>
                      <span className="text-[#062a2e] font-black text-xs sm:text-sm">ارتباط با سازنده در تلگرام</span>
                      <span className="block text-[#2e838a] font-bold text-[11px]">@ho3in925</span>
                    </div>
                  </a>
                  <a 
                    href="https://www.aparat.com/Amazing.Nurse" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-[#f5f0e6] border border-[#ca7f3c]/40 hover:border-[#ca7f3c]/70 transition-all w-full justify-center text-right shadow-sm"
                  >
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#ca7f3c] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                        <path d="M2.35 10.16L7.5 2.37C8.55 0.81 9.3 1.38 9.7 1.42H14.3C14.7 1.38 15.45 0.81 16.5 2.37L21.65 10.16C22.42 11.3 22.42 12.7 21.65 13.84L16.5 21.63C15.45 23.19 14.7 22.62 14.3 22.58H9.7C9.3 22.62 8.55 23.19 7.5 21.63L2.35 13.84C1.58 12.7 1.58 11.3 2.35 10.16Z" fill="currentColor" />
                        <path d="M15 12L10 8V16L15 12Z" fill="#ffffff" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[#062a2e] font-black text-xs sm:text-sm">ویدیوهای آموزشی بالینی</span>
                      <span className="block text-[#ca7f3c] font-bold text-[11px]">Amazing.Nurse</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Header;
