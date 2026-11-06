
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ProtocolAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAssistant = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: "شما دستیار هوشمند پروتکل مدیریت درد و ارزیابی‌های بالینی وزارت بهداشت هستید. پاسخ‌ها را علمی، کاربردی و کوتاه به زبان فارسی ارائه دهید.",
        },
      });
      setAnswer(response.text || '');
    } catch (e) {
      setAnswer("خطایی رخ داد. لطفاً دوباره سوال کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100]" dir="rtl">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-md w-[22rem] md:w-[26rem] rounded-[2.5rem] shadow-[0_20px_50px_rgba(9,96,103,0.18)] border border-[#c69d5b]/30 flex flex-col overflow-hidden animate-in">
          <div className="bg-gradient-to-r from-[#062a2e] to-[#096067] text-white p-6 flex justify-between items-center border-b border-[#c69d5b]/25">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c69d5b] text-[#062a2e] rounded-full flex items-center justify-center font-bold text-sm">🤖</div>
              <span className="font-black text-sm text-[#eedaa8]">دستیار هوشمند پروتکل</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center justify-center">✕</button>
          </div>
          
          <div className="p-6 h-80 overflow-y-auto bg-[#f5f0e6]/50">
            {!answer && !loading && (
              <div className="text-center mt-10 space-y-4">
                <p className="text-[#475569] text-sm">سوالات خود را درباره دوز داروها، نحوه استفاده از ابزارها و زمان‌بندی ارزیابی بپرسید.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["دوز مرفین؟", "زمان ارزیابی مجدد؟", "نحوه کار با BPS"].map(q => (
                    <button key={q} onClick={() => {setQuery(q);}} className="text-[11px] font-bold bg-white border border-[#c69d5b]/30 text-[#062a2e] px-3 py-1.5 rounded-full hover:border-[#096067] hover:bg-[#096067]/10 transition-all cursor-pointer">{q}</button>
                  ))}
                </div>
              </div>
            )}
            {answer && (
              <div className="bg-white p-5 rounded-3xl text-sm text-[#062a2e] leading-relaxed border border-[#c69d5b]/20 shadow-sm font-medium">
                {answer}
              </div>
            )}
            {loading && <div className="flex justify-center mt-10"><div className="w-6 h-6 border-2 border-[#096067] border-t-transparent rounded-full animate-spin"></div></div>}
          </div>

          <div className="p-4 bg-white border-t border-[#c69d5b]/15 flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
              placeholder="اینجا بنویسید..."
              className="flex-1 bg-[#f5f0e6]/60 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#096067] transition-all font-bold text-[#062a2e] placeholder:text-[#55696d]"
            />
            <button 
              onClick={askAssistant}
              disabled={loading}
              className="bg-gradient-to-r from-[#ca7f3c] to-[#c69d5b] text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#062a2e] to-[#096067] text-white w-14 h-14 rounded-2xl shadow-xl border border-[#c69d5b]/30 flex items-center justify-center text-2xl hover:scale-105 transition-all active:scale-95 group cursor-pointer"
          title="دستیار هوشمند پروتکل"
        >
          <span className="group-hover:rotate-12 transition-transform">🤖</span>
        </button>
      )}
    </div>
  );
};

export default ProtocolAssistant;

