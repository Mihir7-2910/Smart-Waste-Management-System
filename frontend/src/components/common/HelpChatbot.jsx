import React, { useState } from 'react';
import { Bot, ChevronDown, Send, Sparkles, X } from 'lucide-react';
import { useLanguage } from '../../i18n';

const copy = {
  en: {
    title: 'CleanCity AI Help', greeting: 'Hi! I can help you report waste, track a ticket, or understand this screen.',
    placeholder: 'Ask for help...', send: 'Send', close: 'Close help', open: 'Open AI help',
    questions: ['How do I report waste?', 'How can I track my ticket?', 'What is the 4-hour SLA?'],
    answers: [
      'Open Raise Complaint, add a photo, choose your location, and submit the report.',
      'Choose Track Ticket from the top bar and enter your ticket ID.',
      'The sanitation team aims to respond and resolve a verified complaint within four hours.'
    ],
    fallback: 'I can help with reporting waste, tracking tickets, locations, photos, SLA, and this screen. Try one of the suggested questions.'
  },
  hi: {
    title: 'क्लीनसिटी AI सहायता', greeting: 'नमस्ते! मैं कचरा रिपोर्ट, टिकट ट्रैकिंग और इस स्क्रीन को समझने में मदद कर सकता हूँ।',
    placeholder: 'सहायता पूछें...', send: 'भेजें', close: 'सहायता बंद करें', open: 'AI सहायता खोलें',
    questions: ['कचरे की रिपोर्ट कैसे करें?', 'टिकट कैसे ट्रैक करें?', '4 घंटे की SLA क्या है?'],
    answers: [
      'शिकायत दर्ज करें खोलें, फोटो और स्थान चुनें, फिर रिपोर्ट सबमिट करें।',
      'ऊपर से टिकट ट्रैक करें चुनें और अपना टिकट ID डालें।',
      'सत्यापित शिकायत पर स्वच्छता टीम चार घंटे के अंदर कार्रवाई करने का लक्ष्य रखती है।'
    ],
    fallback: 'मैं कचरा रिपोर्ट, टिकट, स्थान, फोटो और SLA में मदद कर सकता हूँ। नीचे दिए सवालों में से एक चुनें।'
  },
  gu: {
    title: 'ક્લીનસિટી AI મદદ', greeting: 'નમસ્તે! હું કચરા રિપોર્ટ, ટિકિટ ટ્રેકિંગ અને આ સ્ક્રીન સમજવામાં મદદ કરી શકું છું.',
    placeholder: 'મદદ પૂછો...', send: 'મોકલો', close: 'મદદ બંધ કરો', open: 'AI મદદ ખોલો',
    questions: ['કચરાની જાણ કેવી રીતે કરવી?', 'ટિકિટ કેવી રીતે ટ્રેક કરવી?', '4 કલાકની SLA શું છે?'],
    answers: [
      'ફરિયાદ નોંધાવો ખોલો, ફોટો અને સ્થાન પસંદ કરો, પછી રિપોર્ટ સબમિટ કરો.',
      'ઉપરથી ટિકિટ ટ્રેક કરો પસંદ કરો અને તમારી ટિકિટ ID નાખો.',
      'ચકાસાયેલી ફરિયાદ પર સ્વચ્છતા ટીમ ચાર કલાકમાં કાર્યવાહી કરવાનો પ્રયાસ કરે છે.'
    ],
    fallback: 'હું કચરા રિપોર્ટ, ટિકિટ, સ્થાન, ફોટો અને SLAમાં મદદ કરી શકું છું. નીચેનો પ્રશ્ન પસંદ કરો.'
  }
};

export function HelpChatbot() {
  const { language } = useLanguage();
  const t = copy[language] || copy.en;
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const answerQuestion = (question, answer) => {
    setMessages((current) => [...current, { from: 'user', text: question }, { from: 'bot', text: answer }]);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    const questionIndex = t.questions.findIndex((question) => value.toLowerCase().includes(question.toLowerCase().slice(0, 12)));
    answerQuestion(value, questionIndex >= 0 ? t.answers[questionIndex] : t.fallback);
    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-3">
      {isOpen && (
        <section className="w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-950/95 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl" aria-label={t.title}>
          <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-emerald-950/80 to-slate-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950"><Bot size={20} /></div>
              <div>
                <h2 className="text-sm font-black text-white">{t.title}</h2>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label={t.close} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={17} /></button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto p-4">
            <div className="flex gap-2"><div className="mt-0.5 text-emerald-400"><Sparkles size={15} /></div><p className="max-w-[280px] rounded-2xl rounded-tl-sm bg-slate-800 px-3 py-2 text-xs leading-relaxed text-slate-200">{t.greeting}</p></div>
            {messages.map((item, index) => <div key={`${item.from}-${index}`} className={`flex ${item.from === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[280px] rounded-2xl px-3 py-2 text-xs leading-relaxed ${item.from === 'user' ? 'rounded-br-sm bg-emerald-500 text-slate-950' : 'rounded-bl-sm bg-slate-800 text-slate-200'}`}>{item.text}</p></div>)}
          </div>

          <div className="border-t border-slate-800 px-3 py-3">
            <div className="mb-2 flex flex-wrap gap-1.5">{t.questions.map((question, index) => <button key={question} onClick={() => answerQuestion(question, t.answers[index])} className="rounded-full border border-slate-700 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300">{question}</button>)}</div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.placeholder} aria-label={t.placeholder} className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-500 focus:border-emerald-500" />
              <button type="submit" aria-label={t.send} className="rounded-xl bg-emerald-500 p-2 text-slate-950 hover:bg-emerald-400"><Send size={15} /></button>
            </form>
          </div>
        </section>
      )}

      <button onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? t.close : t.open} className="group flex items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:-translate-y-0.5 hover:bg-emerald-400">
        {isOpen ? <ChevronDown size={18} /> : <Bot size={18} />}
        <span>{isOpen ? t.close : t.title}</span>
      </button>
    </div>
  );
}
