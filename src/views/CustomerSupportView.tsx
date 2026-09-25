import React, { useState } from 'react';
import { 
  Headphones, 
  PhoneCall, 
  HelpCircle, 
  MessageSquare, 
  Radio, 
  Scan, 
  CheckCircle2, 
  ChevronDown, 
  Send,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Language, SupportTicket } from '../types';
import { FAQ_DATA, HELPLINE_NUMBER, HELPLINE_TEL_HREF, supportService } from '../services/supportService';

interface CustomerSupportViewProps {
  lang: Language;
}

export const CustomerSupportView: React.FC<CustomerSupportViewProps> = ({ lang }) => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [issueCategory, setIssueCategory] = useState<SupportTicket['issueCategory']>('farm_connection');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);

  const filteredFaqs = activeFaqCategory === 'all'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === activeFaqCategory);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = supportService.createTicket({
      farmerName: farmerName || 'Kisan User',
      phone: phone || '+91 9301929218',
      issueCategory,
      message,
      preferredTime,
    });
    setSubmittedTicket(ticket);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Top Helpline Banner with Verified Telephone Link */}
      <div className="relative overflow-hidden rounded-xl border border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-700/80 border border-emerald-500/40 text-emerald-100">
              <PhoneCall className="w-3 h-3 text-emerald-300" />
              {lang === 'hi' ? 'सीधा किसान हेल्पलाइन नंबर' : 'Official Kisan Telephony Support'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {HELPLINE_NUMBER}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              {lang === 'hi' 
                ? 'खेत सेंसर सेटअप, पत्ता रोग विश्लेषण और कृषि समस्याओं के लिए हमारे कृषि वैज्ञानिकों से सीधे फोन पर बात करें।' 
                : 'Direct voice assistance for on-field gateway pairing, sensor calibration, foliar pathology diagnosis, and government Krishi schemes.'}
            </p>
          </div>

          {/* Functional Telephone Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={HELPLINE_TEL_HREF}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-emerald-700" />
              <span>{lang === 'hi' ? 'अभी कॉल करें' : 'Call Support Now'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Knowledge Base / FAQs vs Request Callback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Help Center & Common Issues */}
        <div className="lg:col-span-7 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'सहायता केंद्र एवं अक्सर पूछे जाने वाले प्रश्न' : 'Help Center & Common Field Guides'}</span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Step-by-step instructions for hardware pairing and diagnostics
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'farm_connection', label: 'Connection' },
                { id: 'sensors', label: 'Sensors' },
                { id: 'crop_analyzer', label: 'Crop Scan' },
                { id: 'offline_sync', label: 'Offline' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveFaqCategory(c.id)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                    activeFaqCategory === c.id
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <details
                key={faq.id}
                className="group p-4 rounded-lg border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 text-xs transition-colors open:bg-white dark:open:bg-stone-850"
              >
                <summary className="font-bold text-stone-900 dark:text-stone-100 cursor-pointer flex items-center justify-between list-none">
                  <span>{lang === 'hi' ? faq.hindiQuestion : faq.question}</span>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-3 text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-2.5">
                  {lang === 'hi' ? faq.hindiAnswer : faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Right Column: Callback Request Form */}
        <div className="lg:col-span-5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'विशेषज्ञ से कॉल का अनुरोध' : 'Request Agronomist Callback'}</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Submit your inquiry and our agricultural engineer will call you back
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ticket Registered: #{submittedTicket.id}</span>
              </div>
              <p className="text-stone-700 dark:text-stone-300">
                Thank you, <strong>{submittedTicket.farmerName}</strong>. Our agronomy support team will call you on <strong>{submittedTicket.phone}</strong> during {submittedTicket.preferredTime}.
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="mt-2 text-emerald-700 dark:text-emerald-400 underline font-bold cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Mobile Number (Calling)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 9301929218"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Issue Classification
                </label>
                <select
                  value={issueCategory}
                  onChange={e => setIssueCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="farm_connection">Farm Hardware / Gateway Pairing</option>
                  <option value="crop_analyzer">Crop Analyzer Foliar Diagnosis</option>
                  <option value="sensor_reading">Soil Moisture Probe Calibration</option>
                  <option value="agri_guidance">General Agronomic Advice</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Brief Problem Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your crop condition or hardware question..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Preferred Calling Window
                </label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Callback Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
