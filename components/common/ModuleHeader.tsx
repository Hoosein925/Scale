import React from 'react';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

const ModuleHeader: React.FC<Props> = ({ onBack, onHome }) => {
  const handleHome = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onHome();
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onBack();
  };

  return (
    <div className="flex justify-between items-center">
      <button 
        onClick={handleHome} 
        className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#fcfaf7] border-2 border-[#c69d5b]/35 hover:border-[#ca7f3c] transition-all duration-300 group shadow-xs hover:shadow-sm cursor-pointer text-[#062a2e]"
      >
        <span className="text-lg sm:text-xl transition-transform group-hover:scale-110">🏠</span>
        <span className="font-black text-xs sm:text-sm text-[#062a2e]">منوی اصلی</span>
      </button>
      <button 
        onClick={handleBack} 
        className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-[#fcfaf7] border-2 border-[#c69d5b]/35 hover:border-[#ca7f3c] transition-all duration-300 group shadow-xs hover:shadow-sm cursor-pointer text-[#062a2e]"
      >
        <span className="font-black text-xs sm:text-sm text-[#062a2e]">بازگشت</span>
        <span className="text-lg sm:text-xl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 text-[#ca7f3c]">→</span>
      </button>
    </div>
  );
};

export default ModuleHeader;
