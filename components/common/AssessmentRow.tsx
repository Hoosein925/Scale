import React from 'react';

interface Props {
  title: string;
  description?: string;
  options: { label: string; value: number }[];
  currentValue: number;
  onSelect: (value: number) => void;
}

const GRID_COLS: Record<number, string> = {
  1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4',
};

const AssessmentRow: React.FC<Props> = ({ title, description, options, currentValue, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-2.5 h-8 bg-gradient-to-b from-[#c69d5b] to-[#ca7f3c] rounded-full shadow mt-1 shrink-0"></div>
        <div>
          <h4 className="text-xl font-black text-[#062a2e]">{title}</h4>
          {description && <p className="text-sm text-[#2e838a] font-bold mt-1 max-w-lg">{description}</p>}
        </div>
      </div>
      <div className={`grid grid-cols-1 ${GRID_COLS[options.length > 4 ? 4 : options.length] || 'md:grid-cols-4'} gap-4`}>
        {options.map((opt) => (
          <button 
            key={opt.value} 
            onClick={() => onSelect(opt.value)} 
            className={`p-4 rounded-2xl border-2 transition-all duration-300 text-right relative overflow-hidden cursor-pointer ${
              currentValue === opt.value 
                ? 'bg-[#096067] border-[#096067] text-white shadow-lg shadow-[#096067]/25 -translate-y-1' 
                : 'bg-white/95 border-[#d8cfbe] text-[#334155] hover:border-[#c69d5b] hover:bg-[#faf7f2] shadow-sm'
            }`}
          >
            <div className={`text-[9px] font-black mb-2 uppercase tracking-widest ${currentValue === opt.value ? 'text-[#eedaa8]' : 'text-[#855f20]'}`}>
              امتیاز {opt.value}
            </div>
            <p className="text-base font-bold leading-tight">{opt.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssessmentRow;
