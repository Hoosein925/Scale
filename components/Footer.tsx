import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const persianDate = time.toLocaleDateString('fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const persianTime = time.toLocaleTimeString('fa-IR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[100] py-3.5">
      <div className="absolute inset-0 bg-[#ede6d8]/95 backdrop-blur-2xl border-t border-[#c69d5b]/30 shadow-[0_-10px_30px_rgba(115,95,75,0.08)]"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Persian Date and Clock with luxury beige styling */}
          <div className="flex items-center gap-5 bg-white/95 px-5 py-1.5 rounded-2xl border border-[#c69d5b]/35 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#096067]">
              <span className="text-base">🗓️</span>
              <span className="text-xs md:text-sm font-black tracking-tight">{persianDate}</span>
            </div>
            <div className="w-px h-5 bg-[#c69d5b]/30"></div>
            <div className="flex items-center gap-2.5 text-[#ca7f3c]">
              <span className="text-base">🕒</span>
              <span className="text-lg md:text-xl font-black tabular-nums tracking-wider text-[#ab6526]">{persianTime}</span>
            </div>
          </div>

          {/* Designer signature with luxury gold accent */}
          <div className="text-center sm:text-left">
            <h4 className="text-xs md:text-sm font-black text-[#334155] flex items-center gap-2">
              <span className="text-[#64748b]">طراحی و توسعه تخصصی:</span>
              <span className="text-[#855f20] bg-[#c69d5b]/20 px-3.5 py-0.5 rounded-lg border border-[#c69d5b]/40 shadow-sm font-black">
                حسین نصاری
              </span>
            </h4>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
