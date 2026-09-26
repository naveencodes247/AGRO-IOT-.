import React, { useState } from 'react';
import { 
  PhoneCall, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  ChevronDown, 
  Send,
  Clock,
  ExternalLink,
  Bot,
  User,
  ShieldCheck,
  Award,
  Sparkles,
  Search,
  AlertCircle,
  Wifi,
  Cpu,
  Layers,
  PhoneForwarded
} from 'lucide-react';
import { Language, SupportTicket } from '../types';
import { 
  FAQ_DATA, 
  HELPLINE_NUMBER, 
  HELPLINE_TEL_HREF, 
  KISAN_TOLLFREE_NUMBER,
  KISAN_TOLLFREE_HREF,
  WHATSAPP_CHAT_URL,
  VERIFIED_AGRONOMISTS,
  supportService 
} from '../services/supportService';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';

interface CustomerSupportViewProps {
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  badge?: string;
}

const INITIAL_AI_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Namaste! I am your 24/7 AGRO-IoT Field Assistant. How can I help you today? You can ask about sensor wiring, ESP32 LoRa pairing, leaf disease treatments, or drip irrigation schedules.',
    timestamp: 'Just now',
    badge: 'KVK AI Agronomist'
  }
];

const QUICK_QUESTIONS = [
  { label: '📡 ESP32 LoRa won\'t connect', query: 'My ESP32 sensor node is not connecting to the 865MHz gateway. How do I fix it?' },
  { label: '🌾 Yellow spots on Wheat leaves', query: 'I see yellow/orange pustule spots on my wheat leaves. What disease is this and how should I treat it?' },
  { label: '💧 Drip pressure low & pump cutoff', query: 'The inline flow meter shows 0 L/min and the motor relay keeps tripping. What should I check?' },
  { label: '🧪 Ideal soil pH & moisture for Mustard', query: 'What is the ideal soil moisture percentage and soil pH for Mustard during flowering stage?' },
  { label: '🏛️ PM-KUSUM solar subsidy process', query: 'How can I apply for the 60% PM-KUSUM government subsidy for my solar pump and IoT controller?' },
];

export const CustomerSupportView: React.FC<CustomerSupportViewProps> = ({ lang }) => {
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  
  // Callback / Ticket state
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [issueCategory, setIssueCategory] = useState<SupportTicket['issueCategory']>('farm_connection');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Emergency'>('Urgent');
  const [message, setMessage] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>(() => supportService.getTickets());

  // Interactive AI Agronomist Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_AI_CHAT);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Filter FAQs
  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCategory = activeFaqCategory === 'all' || faq.category === activeFaqCategory;
    const matchesSearch = faqSearchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.tag.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      faq.hindiQuestion.includes(faqSearchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleSendChatMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // Generate intelligent AI response based on query keywords
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('esp32') || q.includes('lora') || q.includes('gateway') || q.includes('connect')) {
        reply = '🔧 **Hardware Diagnostic Steps for ESP32 & LoRa:**\n1. Check the antenna: Ensure the 865MHz helical or whip antenna is securely seated on the IPEX/SMA connector.\n2. Verify Frequency: Confirm frequency band in firmware is set to `865.2 MHz` (India BIS certified band).\n3. Check Gateway ID: Open the Hardware & API Gateway inspector in the header to confirm `ESP32-GW-901` is in listening state.\n4. Power Check: The node requires at least 3.3V @ 150mA during LoRa TX bursts. Check if your 18650 Li-ion battery is above 3.7V.';
      } else if (q.includes('yellow') || q.includes('wheat') || q.includes('rust') || q.includes('spot') || q.includes('leaf')) {
        reply = '🌾 **Agronomic Pathology Advisory (Yellow Rust / Puccinia striiformis):**\n1. Symptoms: Yellow powder/stripes along leaf veins indicating active fungal urediniospores.\n2. Immediate Chemical Action: Spray **Propiconazole 25% EC** (Tilt) @ 1 ml per litre of water (200 ml in 200 L water per acre).\n3. Alternative Bio-control: Trichoderma viride @ 5g/L + Neem oil 1500 ppm @ 3 ml/L.\n4. Field Precaution: Avoid excess urea fertilizer, as high nitrogen promotes fungal spread.';
      } else if (q.includes('pump') || q.includes('pressure') || q.includes('flow') || q.includes('cutoff') || q.includes('motor')) {
        reply = '💧 **Pump & Irrigation Flow Protection:**\n1. Dry-Run Cutoff: When flow is 0 L/min for >30 seconds while relay is ON, Edge AI auto-shuts off the motor.\n2. Check Suction Line: Inspect foot valve for silt blockage or air entrapment.\n3. Disc Filter: Clean the primary 120-mesh disc filter before drip laterals.\n4. Manual Override: You can toggle Motor Relay in the Command Center after priming the pump.';
      } else if (q.includes('ph') || q.includes('moisture') || q.includes('mustard') || q.includes('soil')) {
        reply = '🌱 **Mustard Soil & Nutrient Recommendations:**\n1. Soil Moisture: Maintain 45% - 55% field capacity during flowering and siliqua formation.\n2. Soil pH: Optimal range is **6.5 to 7.5**. If pH < 6.0, apply agricultural lime @ 250 kg/acre.\n3. Micronutrient Requirement: Mustard has high Sulfur requirement; apply **Bentonite Sulfur 90%** @ 10 kg/acre for higher oil content.';
      } else if (q.includes('kusum') || q.includes('subsidy') || q.includes('solar') || q.includes('scheme')) {
        reply = '🏛️ **PM-KUSUM Scheme & Subsidy Guide:**\n1. Component B provides **up to 60% subsidy** for standalone solar agricultural pumps (3HP to 7.5HP).\n2. Eligibility: Individual farmers, water user associations, and FPOs.\n3. Documents Required: Land 7/12 records, Aadhar card, bank passbook, and electricity NOC.\n4. Apply via your state renewable energy development agency portal (e.g. HAREDA, MEDA, RREC) or contact your district KVK.';
      } else {
        reply = `✅ Thank you for your inquiry regarding "${query}". Our agronomists recommend monitoring the live telemetry cards on the Command Center. For direct telephone troubleshooting or custom farm audits, click "Call Support Now" or message our agronomists on WhatsApp.`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'KVK Agronomist AI'
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = supportService.createTicket({
      farmerName: farmerName || 'Kisan User',
      phone: phone || '+91 93019 29218',
      issueCategory,
      message: `${priority.toUpperCase()} PRIORITY: ${message || 'Assistance requested with smart farm telemetry.'}`,
      preferredTime,
    });
    setSubmittedTicket(ticket);
    setAllTickets(supportService.getTickets());
    setMessage('');
  };

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'किसान सेवा एवं सहायता केंद्र' : 'Farmer Care & Technical Support'}
        subtitle={lang === 'hi'
          ? '24x7 खेत सेंसर सहायता, ESP32 गेटवे पेयरिंग, पत्ता रोग समाधान एवं कृषि विज्ञान केंद्र (KVK) परामर्श'
          : '24/7 dedicated support for IoT hardware pairing, LoRaWAN gateways, automated irrigation, foliar pathology, and agronomic advisory'}
      />

      {/* Prominent Emergency Helpline & WhatsApp Connect Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#072416] via-[#0d3b24] to-[#144f33] text-white p-6 sm:p-7 shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Support Desk Active
              </span>
              <span className="text-[11px] text-emerald-200/80 font-medium">
                14 KVK Agronomists & IoT Engineers Available Now
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-3">
              <span>{HELPLINE_NUMBER}</span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-300 bg-white/10 px-2.5 py-1 rounded-lg">
                Toll-Free: {KISAN_TOLLFREE_NUMBER}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
              {lang === 'hi'
                ? 'हार्डवेयर गेटवे कनेक्शन, मिट्टी सेंसर कैलिब्रेशन, पत्ता रोग की पहचान और सरकारी योजनाओं (PM-KUSUM) पर सीधे बात करें।'
                : 'Direct voice and WhatsApp guidance for ESP32 field gateway pairing, capacitive sensor calibration, pest treatment, and smart irrigation automation.'}
            </p>
          </div>

          {/* Action CTAs: Call Support & WhatsApp */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-shrink-0">
            <a
              href={HELPLINE_TEL_HREF}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white text-emerald-950 hover:bg-stone-100 font-extrabold text-xs shadow-lg transition-all hover:scale-102 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Call Helpline</span>
            </a>

            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-extrabold text-xs shadow-lg transition-all hover:scale-102 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <a
              href={KISAN_TOLLFREE_HREF}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Kisan Call Center"
            >
              <PhoneForwarded className="w-3.5 h-3.5" />
              <span>KCC 1800</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive AI Chatbot (Left) + Priority Callback Ticket (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left 7 Columns: Interactive AI Agronomist & Hardware Assistant */}
        <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col h-[580px] bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>Kisan AI Agronomist & Co-Pilot</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Instant agronomy & hardware answers backed by ICAR & KVK guidelines
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 hidden sm:inline">
              Latency: 12ms
            </span>
          </div>

          {/* Quick Question Chips */}
          <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-stone-100 dark:border-stone-800/50">
            {QUICK_QUESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChatMessage(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium bg-stone-100 dark:bg-stone-850 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 text-stone-700 dark:text-stone-300 transition-all border border-stone-200/60 dark:border-stone-700/60 cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 py-3 pr-1 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
                    🌾
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-stone-50 dark:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.badge && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{msg.badge}</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1 text-right font-mono ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500 dark:text-stone-400 pl-9">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>AI Agronomist is analyzing telemetry & pathology data...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'कोई भी कृषि या हार्डवेयर सवाल पूछें...' : 'Ask any farm question (e.g. wheat rust dosage, ESP32 LoRa pairing)...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </Card>

        {/* Right 5 Columns: Request Expert Callback / Priority Support Ticket */}
        <Card className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between h-[580px] bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800/80 shadow-sm overflow-y-auto">
          <div>
            <CardHeader
              icon={MessageSquare}
              title="Request Priority Callback"
              subtitle="Direct phone consultation with a KVK coordinator"
            />

            {submittedTicket ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 space-y-3 text-xs my-4">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Callback Ticket Generated!</span>
                </div>
                <div className="bg-white/60 dark:bg-black/30 p-3 rounded-lg space-y-1 font-mono text-[11px]">
                  <div>Ticket ID: <strong className="text-emerald-700 dark:text-emerald-400">{submittedTicket.id}</strong></div>
                  <div>Phone: <strong>{submittedTicket.phone}</strong></div>
                  <div>Window: <strong>{submittedTicket.preferredTime}</strong></div>
                  <div>Status: <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold">In Review by Agronomist</span></div>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
                  Our coordinator will phone you directly. You can also quote this Ticket ID when calling our helpline or on WhatsApp.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Create Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs mt-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Farmer Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaswinder Singh"
                      value={farmerName}
                      onChange={(e) => setFarmerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 93019 29218"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Issue Topic
                    </label>
                    <select
                      value={issueCategory}
                      onChange={(e) => setIssueCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none"
                    >
                      <option value="farm_connection">Gateway & ESP32 Pairing</option>
                      <option value="crop_analyzer">Crop Disease Photo Analysis</option>
                      <option value="sensor_reading">Sensor Calibration & Soil EC</option>
                      <option value="agri_guidance">Irrigation & PM-KUSUM Subsidy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Priority Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none"
                    >
                      <option value="Emergency">🚨 Emergency (Crop Loss Risk)</option>
                      <option value="Urgent">⚡ Urgent (within 4 hrs)</option>
                      <option value="Routine">🌱 Routine (within 24 hrs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                    <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                    <option value="Immediate Emergency">Immediate Emergency (ASAP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Brief Field Observation
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe crop symptoms, gateway LED behavior, or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Callback Request</span>
                </button>
              </form>
            )}
          </div>

          {/* Active Recent Tickets preview */}
          {allTickets.length > 0 && (
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 mt-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                <span>Recent Support Tickets</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{allTickets.length} active</span>
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {allTickets.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-[10px]"
                  >
                    <div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{t.id} - {t.farmerName}</div>
                      <div className="text-stone-500 dark:text-stone-400 truncate max-w-[180px]">{t.message}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Verified KVK Agronomists & Hardware Engineers Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified KVK Agronomists & Field Engineers</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Direct access to ICAR-accredited scientists and certified IoT hardware specialists
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>Govt. KVK Network Partner</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VERIFIED_AGRONOMISTS.map((agro) => (
            <Card
              key={agro.id}
              className="p-4 bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-2xl flex items-center justify-center flex-shrink-0">
                      {agro.avatarBadge}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>{lang === 'hi' ? agro.hindiName : agro.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {lang === 'hi' ? agro.hindiDesignation : agro.designation}
                      </div>
                      <div className="text-[10px] text-stone-400">{agro.institution}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/60 space-y-1.5 text-[11px]">
                  <div className="text-stone-600 dark:text-stone-300">
                    <span className="font-semibold text-stone-700 dark:text-stone-200">Specialty: </span>
                    {agro.specialization}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                    <span>Exp: {agro.experienceYears} yrs</span>
                    <span>⭐ {agro.rating} ({agro.consultationsCount}+ cases)</span>
                    <span className={agro.availableNow ? 'text-emerald-600 font-bold' : 'text-stone-400'}>
                      {agro.availableNow ? '🟢 Available' : '🟡 In Field'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${agro.contactNumber.replace(/\s+/g, '')}`}
                  className="flex-1 py-2 rounded-xl bg-stone-100 dark:bg-stone-850 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-stone-800 dark:text-stone-200 text-[11px] font-bold text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Direct</span>
                </a>
                <a
                  href={`${WHATSAPP_CHAT_URL}&text=Hello%20${encodeURIComponent(agro.name)}%2C%20I%20need%20expert%20consultation%20regarding%20my%20farm.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center"
                  title="Message on WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Field Guides & Hardware Troubleshooting Knowledge Base */}
      <Card className="p-4 sm:p-5 space-y-4 bg-white dark:bg-[#141b16] border border-stone-200/80 dark:border-stone-800/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-stone-800">
          <CardHeader
            icon={HelpCircle}
            title="Field Guides & Hardware Troubleshooting"
            subtitle="Step-by-step pinouts, sensor calibration, and irrigation procedures"
          />

          {/* Search FAQs Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, pins, sensors..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'farm_connection', label: 'ESP32 / LoRa' },
            { id: 'sensors', label: 'Sensors & Calibration' },
            { id: 'crop_analyzer', label: 'AI Crop Scan' },
            { id: 'irrigation_relay', label: 'Pump & Motor' },
            { id: 'schemes', label: 'PM-KUSUM Subsidy' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFaqCategory(cat.id)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                activeFaqCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2.5 text-xs">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-stone-400">
              No matching troubleshooting guides found. Try searching for "ESP32", "Moisture", or "Rust".
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <details
                key={faq.id}
                className="group p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/30 transition-colors open:bg-white dark:open:bg-[#141b16]"
              >
                <summary className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100 cursor-pointer list-none">
                  <div className="flex items-center gap-2 pr-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {faq.tag}
                    </span>
                    <span>{lang === 'hi' ? faq.hindiQuestion : faq.question}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-2.5 text-stone-600 dark:text-stone-300 leading-relaxed font-medium pt-2.5 border-t border-stone-100 dark:border-stone-800">
                  {lang === 'hi' ? faq.hindiAnswer : faq.answer}
                </p>
              </details>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
