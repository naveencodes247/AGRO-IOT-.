import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Sparkles, 
  PhoneCall, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Language } from '../../types';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF, WHATSAPP_CHAT_URL } from '../../services/supportService';

interface FarmerAiHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialQuery?: string;
  autoStartVoice?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  hindiText?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: '🎙️ बोलकर पूछें (Voice)', query: 'VOICE_TRIGGER' },
  { label: '🌾 Wheat Yellow Rust Spray', query: 'My wheat crop has yellow powder on leaves. What fungicide spray and dosage should I use?' },
  { label: '📡 ESP32 LoRa Gateway Setup', query: 'How do I pair my ESP32 farm sensor node with the 865MHz LoRa gateway?' },
  { label: '💧 Pump Cutoff & Flow Issue', query: 'Why is the water pump relay automatically shutting off when irrigation starts?' },
  { label: '🧪 Optimal Soil NPK & Moisture', query: 'What is the optimal soil moisture percentage and NPK ratio for mustard at flowering?' },
  { label: '🏛️ PM-KUSUM 60% Solar Subsidy', query: 'How do I apply for the PM-KUSUM government subsidy for solar pump & IoT sensors?' },
];

export const FarmerAiHelplineModal: React.FC<FarmerAiHelplineModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialQuery,
  autoStartVoice = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Namaste Kisan Ji! I am your 24/7 AI Farming & IoT Helpline. You can speak to me by pressing the microphone or type any question about crop diseases, fertilizers, pump automation, or ESP32 sensor setup.',
      hindiText: 'नमस्ते किसान जी! मैं आपका 24/7 किसान एआई हेल्पलाइन सहायक हूँ। आप माइक दबाकर बोलकर पूछ सकते हैं या फसल रोग, खाद, सिंचाई मोटर और सेंसर से जुड़ा कोई भी सवाल टाइप कर सकते हैं।',
      timestamp: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          stopSpeaking();
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
        if (event.results[0].isFinal) {
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone access was denied. Please allow microphone permission in your browser.');
        } else if (event.error !== 'no-speech') {
          setSpeechError('Could not capture audio. Please try speaking again or type your question.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lang]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  // Auto-start voice if requested
  useEffect(() => {
    if (isOpen && autoStartVoice && recognitionRef.current && !isListening) {
      toggleVoiceListen();
    }
  }, [isOpen, autoStartVoice]);

  // Handle Initial Query if passed
  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSendQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // Text-To-Speech output
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleVoiceListen = () => {
    if (!speechSupported) {
      setSpeechError('Voice speech input is not supported in this browser. Please type your query.');
      return;
    }
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    if (query === 'VOICE_TRIGGER') {
      toggleVoiceListen();
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);
    stopSpeaking();

    // Generate intelligent AI Agronomy response
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('rust') || q.includes('wheat') || q.includes('पीला') || q.includes('रतुआ') || q.includes('गेहूं') || q.includes('yellow')) {
        reply = lang === 'hi'
          ? '🌾 **गेहूं का पीला रतुआ (Yellow Rust) उपचार:**\n1. **तुरंत छिड़काव:** प्रोपिकोनाज़ोल 25% EC (टिल्ट) @ 1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़ 200 लीटर पानी में)।\n2. **जैविक विकल्प:** ट्राइकोडर्मा विरिडी 5 ग्राम/लीटर + नीम का तेल (1500 ppm) 3 मिली/लीटर।\n3. **सावधानी:** यूरिया खाद का अधिक प्रयोग न करें, क्योंकि अधिक नाइट्रोजन से यह फफूंद तेजी से फैलती है।'
          : '🌾 **Wheat Yellow Rust Treatment (Puccinia striiformis):**\n1. **Immediate Spray:** Apply **Propiconazole 25% EC** (Tilt) @ 1 ml per liter of water (200 ml in 200 L water per acre).\n2. **Bio-Control Alternative:** Trichoderma viride @ 5g/L mixed with Neem oil 1500 ppm @ 3 ml/L.\n3. **Field Caution:** Stop top-dressing excess urea immediately, as high nitrogen fosters rapid spore proliferation.';
      } else if (q.includes('esp32') || q.includes('lora') || q.includes('gateway') || q.includes('कनेक्ट') || q.includes('गेटवे') || q.includes('pair')) {
        reply = lang === 'hi'
          ? '📡 **ESP32 एवं LoRa गेटवे कनेक्शन समाधान:**\n1. **एंटीना जांचें:** सुनिश्चित करें कि 865MHz का एंटीना IPEX कनेक्टर पर ठीक से लगा है।\n2. **फ्रीक्वेंसी सेट करें:** फर्मवेयर में भारत के लिए निर्धारित `865.2 MHz` बैंड चुनें।\n3. **पावर सप्लाई:** LoRa ट्रांसमिशन के समय 3.3V @ 150mA की आवश्यकता होती है। 18650 बैटरी वोल्टेज 3.7V से ऊपर रखें।\n4. **गेटवे स्टेटस:** हेडर में "ESP32-GW-901" स्टेटस बार पर क्लिक करके लाइव पिंग टेस्ट करें।'
          : '📡 **ESP32 & LoRa Gateway Hardware Pairing:**\n1. **Antenna Seating:** Ensure the 865MHz helical/SMA antenna is tightly connected to avoid destroying the RF amplifier.\n2. **Frequency Band:** Set LoRa carrier frequency to **865.2 MHz** (India BIS certified ISM band).\n3. **Stable 3.3V Rail:** LoRa TX bursts pull up to 150mA; ensure your 18650 Li-ion battery or step-down buck converter is above 3.7V.\n4. **Verify Gateway:** Click the Gateway bar in the header to run a real-time ping to `ESP32-GW-901`.';
      } else if (q.includes('pump') || q.includes('cutoff') || q.includes('flow') || q.includes('मोटर') || q.includes('पानी') || q.includes('ट्रिप')) {
        reply = lang === 'hi'
          ? '💧 **सिंचाई मोटर ड्राई-रन एवं ऑटो-कटऑफ:**\n1. **ड्राई-रन सुरक्षा:** जब मोटर चालू होने पर भी पाइप में पानी का प्रवाह (Flow Rate) 0 L/min रहता है, तो एज एआई मोटर को जलने से बचाने के लिए तुरंत बंद कर देता है।\n2. **सक्शन लाइन देखें:** फुट वाल्व में कचरा या हवा (air pocket) की जांच करें।\n3. **डिस्क फिल्टर:** ड्रिप लाइन से पहले 120-मेश वाले फिल्टर को खोलकर साफ करें।\n4. **रीसेट:** मोटर ठीक करने के बाद कमांड सेंटर से दोबारा मोटर रिले ऑन करें।'
          : '💧 **Irrigation Pump Dry-Run Protection & Auto-Cutoff:**\n1. **Dry-Run Trip:** If the inline turbine detects 0 L/min while relay is commanded ON, Edge AI auto-cuts power in 1.2s to prevent impeller burnout.\n2. **Inspect Suction:** Check the foot valve for silt or air leaks.\n3. **Clean Disc Filter:** Flush the 120-mesh main filter before the drip lateral valves.\n4. **Manual Reset:** Once primed, toggle the Motor Relay back to ON in the Farm Command Center.';
      } else if (q.includes('ph') || q.includes('moisture') || q.includes('mustard') || q.includes('सरसों') || q.includes('नमी') || q.includes('खाद') || q.includes('npk')) {
        reply = lang === 'hi'
          ? '🌱 **सरसों की फसल के लिए मिट्टी व पोषक तत्व सलाह:**\n1. **मिट्टी की नमी:** फूल और फलियां बनते समय 45% से 55% नमी बनाए रखें।\n2. **मिट्टी का पीएच (pH):** 6.5 से 7.5 सबसे उपयुक्त है।\n3. **सल्फर की आवश्यकता:** सरसों में तेल की मात्रा बढ़ाने के लिए **बेंटोनाइट सल्फर 90%** @ 10 किग्रा प्रति एकड़ अवश्य डालें।'
          : '🌱 **Soil Moisture & NPK Advisory for Mustard:**\n1. **Optimal Moisture:** Maintain 45% - 55% soil field capacity during flowering and pod development.\n2. **Soil pH:** Best range is **6.5 to 7.5**. If pH is acidic (<6.0), apply agricultural lime @ 250 kg/acre.\n3. **Sulfur Boost:** Apply **Bentonite Sulfur 90%** @ 10 kg/acre at sowing or first irrigation for maximum oil content.';
      } else if (q.includes('kusum') || q.includes('subsidy') || q.includes('solar') || q.includes('सब्सिडी') || q.includes('सोलर') || q.includes('योजना')) {
        reply = lang === 'hi'
          ? '🏛️ **पीएम-कुसुम (PM-KUSUM) 60% सोलर पंप सब्सिडी प्रक्रिया:**\n1. **सब्सिडी:** 3HP से 7.5HP सोलर सिंचाई पंप पर केंद्र और राज्य सरकार मिलकर 60% तक अनुदान देती हैं।\n2. **पात्रता:** किसान, जल उपभोक्ता समितियां और FPO।\n3. **जरूरी दस्तावेज:** जमीन की जमाबंदी/खतौनी, आधार कार्ड, बैंक पासबुक, फोटो।\n4. **आवेदन:** राज्य की ऊर्जा विकास एजेंसी के पोर्टल पर जाएं या अपने कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
          : '🏛️ **PM-KUSUM 60% Solar Pump & Smart Controller Subsidy:**\n1. **Subsidy Scale:** Up to 60% capital cost covered for 3HP to 7.5HP standalone DC/AC solar pumps.\n2. **Eligibility:** Individual farmers, Water User Associations, and FPOs.\n3. **Documents:** Land 7/12 land revenue records, Aadhaar, Bank Passbook, and No-Dues certificate.\n4. **Where to Apply:** Apply through your State Renewable Energy Agency portal (e.g., HAREDA, MEDA, RREC) or visit your district KVK office.';
      } else {
        reply = lang === 'hi'
          ? `✅ आपके सवाल "${query}" के संदर्भ में:\nखेत की लाइव स्थिति और सेंसर डेटा कमांड सेंटर पर उपलब्ध है। अधिक जानकारी या विशेषज्ञ से सीधे बात करने के लिए आप हेल्पलाइन नंबर +91 93019 29218 पर कॉल कर सकते हैं या व्हाट्सएप पर संपर्क कर सकते हैं।`
          : `✅ Regarding your inquiry on "${query}":\nOur agronomy co-pilot recommends checking the live sensor telemetry in the Command Center. For direct on-field troubleshooting or urgent pathology questions, click "Call Helpline" or message our KVK agronomists on WhatsApp.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
      speakText(reply);
    }, 600);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none font-sans"
      onClick={() => {
        stopSpeaking();
        onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-2xl bg-[#082015] border border-emerald-500/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col h-[88vh] max-h-[720px] text-white relative isolate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* Top Header Bar: Title, Live Status, Voice Output Toggle, Close */}
        {/* ============================================================== */}
        <div className="px-5 py-4 bg-[#04130c] border-b border-emerald-900/60 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-0.5 shadow-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-[#04130c] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                  <span>{lang === 'hi' ? 'किसान एआई हेल्पलाइन' : 'Kisan AI Helpline'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Voice & Chat
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-emerald-300/80 font-medium">
                {lang === 'hi' ? 'बोलकर या लिखकर 24/7 कृषि व हार्डवेयर सलाह पाएं' : 'Ask in Hindi or English by voice or chat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Speech Output Mute/Unmute */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                voiceEnabled
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-stone-900/80 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
              title={voiceEnabled ? 'Voice responses active (Click to mute)' : 'Voice responses muted (Click to enable)'}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-[11px]">Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span className="hidden sm:inline text-[11px]">Muted</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Close Helpline"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Voice Bar Alert if Active */}
        {isListening && (
          <div className="bg-emerald-600/30 border-b border-emerald-500/40 px-5 py-2.5 flex items-center justify-between text-xs text-emerald-200 flex-shrink-0 animate-pulse z-10">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold text-white">
                {lang === 'hi' ? '🎙️ सुन रहे हैं... कृपया अपना सवाल बोलें' : '🎙️ Listening... Please speak your question clearly'}
              </span>
            </div>
            <button
              onClick={toggleVoiceListen}
              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] cursor-pointer"
            >
              Stop
            </button>
          </div>
        )}

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2.5 bg-[#05170e] border-b border-emerald-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0 z-10">
          {QUICK_PROMPTS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(chip.query)}
              className="whitespace-nowrap px-3 py-1 rounded-xl text-[11px] font-semibold bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition-all cursor-pointer flex-shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* Chat Stream Area (min-h-0 prevents flex container blow-out)     */}
        {/* ============================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs scrollbar-thin scrollbar-thumb-emerald-800 bg-[#082015] z-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md">
                  🌾
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-xs shadow-md break-words overflow-hidden ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-[#0e3523] text-stone-100 border border-emerald-500/30 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div>{lang === 'hi' && msg.hindiText ? msg.hindiText : msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-mono ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-emerald-400/80'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-stone-700 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-2.5 items-center text-xs text-emerald-300 pl-11">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Analyzing agronomy pathology and hardware data...</span>
            </div>
          )}

          {speechError && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Speaking Audio Wave Status Bar */}
        {isSpeaking && (
          <div className="px-4 py-2 bg-emerald-950/90 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 flex-shrink-0 z-10">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span className="font-semibold">AI is speaking response...</span>
            </div>
            <button
              onClick={stopSpeaking}
              className="text-[11px] underline font-bold hover:text-white cursor-pointer"
            >
              Stop Audio
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* Bottom Input Area: Big Mic Voice Button + Text Input           */}
        {/* ============================================================== */}
        <div className="p-3 sm:p-4 bg-[#04130c] border-t border-emerald-900/60 flex flex-col gap-2 flex-shrink-0 z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            {/* Prominent Voice Assistant Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceListen}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-400/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white hover:scale-105'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak (Voice Assistant)'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'hi' ? 'माइक दबाकर बोलें या सवाल टाइप करें...' : 'Click mic to speak, or type any farm/sensor query...'}
              className="flex-1 px-4 py-3 rounded-2xl border border-emerald-800/80 bg-[#082015] text-white text-xs sm:text-sm placeholder-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-emerald-950 font-black transition-all cursor-pointer flex-shrink-0"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Fallback Direct Contact Quick Bar */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 px-1">
            <span className="flex items-center gap-1 text-emerald-400/80">
              <Sparkles className="w-3 h-3" />
              Voice AI speaks in Hindi & English
            </span>

            <div className="flex items-center gap-3">
              <a
                href={HELPLINE_TEL_HREF}
                className="hover:text-emerald-300 font-bold underline flex items-center gap-1"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call {HELPLINE_NUMBER}</span>
              </a>
              <span>•</span>
              <a
                href={WHATSAPP_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] font-bold underline flex items-center gap-1"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
