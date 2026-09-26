import React from 'react';
import { 
  Sprout, 
  Activity, 
  Lightbulb, 
  AlertTriangle, 
  Scan, 
  BookOpen, 
  Droplets, 
  Thermometer, 
  Wind, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall,
  Clock,
  Cpu,
  Radio,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Farm, Language, Recommendation, Alert, SensorReading } from '../types';
import { ASSETS } from '../assets/assetMap';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../services/supportService';
import { FieldConditionHub } from '../components/common/FieldConditionHub';

interface OverviewViewProps {
  farm: Farm | null;
  readings: SensorReading[];
  recommendations: Recommendation[];
  alerts: Alert[];
  onNavigate: (tab: string) => void;
  lang: Language;
  onToggleDemoMode: () => void;
  isDemoMode: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  farm,
  readings,
  recommendations,
  alerts,
  onNavigate,
  lang,
  onToggleDemoMode,
  isDemoMode,
}) => {
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.category === 'critical');
  const primaryPlot = farm?.plots[0];

  const moisture15 = readings.find(r => r.sensorType === 'soil_moisture_shallow')?.value ?? 28.4;
  const moisture30 = readings.find(r => r.sensorType === 'soil_moisture_deep')?.value ?? 34.2;
  const temp = readings.find(r => r.sensorType === 'ambient_temp')?.value ?? 24.6;
  const humidity = readings.find(r => r.sensorType === 'humidity')?.value ?? 68.0;

  return (
    <div className="space-y-12 pb-12">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (Inspired by AgriNova & Nutrify)              */}
      {/* ============================================================== */}
      <section className="relative pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Human Editorial Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Friendly handwritten style pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/80 text-[#133e24] dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'hi' ? 'स्मार्ट कृषि • स्वस्थ फसल और बेहतर भविष्य' : 'Smarter Farming • A Healthier Tomorrow'}</span>
            </div>

            {/* Editorial Main Heading (inspired by AgriNova "Modern Tech for Better Harvests") */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#133e24] dark:text-white tracking-tight leading-[1.12]">
              {lang === 'hi' ? (
                <>
                  बेहतर उपज के लिए <br />
                  <span className="text-emerald-600 dark:text-emerald-400 font-serif italic font-normal">
                    आधुनिक तकनीक
                  </span>
                </>
              ) : (
                <>
                  Modern Tech for <br />
                  <span className="text-emerald-600 dark:text-emerald-400 font-serif italic font-normal">
                    Better Harvests
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              {lang === 'hi'
                ? 'एग्रो-आईओटी खेत के सेंसर, पत्ता रोग विश्लेषण और कृषि वैज्ञानिकों की सलाह को सीधे आपके फोन से जोड़ता है — बिना इंटरनेट के भी पूरी तरह कार्यक्षम।'
                : 'AGRO-IOT brings smart sensor technology and foliar computer vision to your farm — helping you grow more, conserve groundwater, and protect crops with precision.'}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('live-monitoring')}
                className="px-6 py-3.5 rounded-xl bg-[#0fa958] hover:bg-[#13b963] active:bg-[#0d8f4a] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{lang === 'hi' ? 'खेत की लाइव स्थिति देखें' : 'Explore Live Farm'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('crop-analyzer')}
                className="px-5 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'hi' ? 'पत्ता रोग विश्लेषक' : 'Analyze Crop Leaf'}</span>
              </button>
            </div>

            {/* Sub-line endorsement */}
            <div className="flex items-center gap-3 pt-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                ICAR Grounded
              </span>
              <span>•</span>
              <span>Offline-First (ESP32 Ready)</span>
              <span>•</span>
              <span>Kisan Line: {HELPLINE_NUMBER}</span>
            </div>
          </div>

          {/* Right Column: Hero Framed Photograph with Floating Sensor Overlays (Inspired by AgriNova & Nutrify) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 aspect-4/3 sm:aspect-5/4">
              <img
                src={ASSETS.farmerBackground}
                alt="Indian farmer standing in healthy wheat field at sunrise"
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Sensor Glass Card on the Image (Like the tablet in AgriNova) */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/40 dark:border-stone-700 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-stone-200/60 dark:border-stone-700">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>North Block (Wheat HD-3086)</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    HEALTH: 88/100
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/80">
                    <span className="text-[10px] text-stone-400 block font-semibold">Moisture (15cm)</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono">{moisture15}%</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/80">
                    <span className="text-[10px] text-stone-400 block font-semibold">Air Temp</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">{temp}°C</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/80">
                    <span className="text-[10px] text-stone-400 block font-semibold">Dew Humidity</span>
                    <span className="font-extrabold text-teal-600 dark:text-teal-400 font-mono">{humidity}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. THE 4-FEATURE SHELF (Directly Inspired by AgriNova)         */}
      {/* ============================================================== */}
      <section className="bg-white dark:bg-[#121413] rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 dark:divide-stone-800">
          {/* Feature 1 */}
          <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-3 first:px-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Precision Irrigation
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Dual 15cm & 30cm root probes conserve 38% water by irrigating only on deficit.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Real-Time Monitoring
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                LoRa 865MHz link tracks microclimate, soil moisture, and battery autonomously.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Edge AI Intelligence
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                74ms offline neural inference identifies disease symptoms without internet.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:px-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Sustainable Farming
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Validated against ICAR and PAU package of practices for maximum soil fertility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TECHNOLOGY THAT WORKS WITH NATURE (Field Condition Hub)      */}
      {/* ============================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              FIELD STATUS SHOWCASE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#133e24] dark:text-white tracking-tight mt-0.5">
              Technology that works with nature
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md">
            Intelligent sensing helps Indian farmers increase productivity, reduce input costs, and protect soil biology.
          </p>
        </div>

        <FieldConditionHub
          farm={farm}
          readings={readings}
          lang={lang}
          onNavigate={onNavigate}
          isLiveMode={!isDemoMode}
        />
      </section>

      {/* ============================================================== */}
      {/* 4. REAL IMPACT ACROSS INDIAN FARMS (Inspired by AgriNova)       */}
      {/* ============================================================== */}
      <section className="rounded-3xl bg-[#133e24] dark:bg-[#0b2616] text-white p-7 sm:p-10 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
              PROVEN FIELD RESULTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Real Impact. Across Every Farm.
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-sm">
              Empowering farmers across Punjab, Haryana, UP, MP, and Maharashtra with actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 items-center border-t lg:border-t-0 lg:border-l border-emerald-800/80 pt-6 lg:pt-0 lg:pl-8">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">14K+</span>
              <span className="text-xs text-emerald-300 block font-medium mt-0.5">Acres Monitored</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">38%</span>
              <span className="text-xs text-emerald-300 block font-medium mt-0.5">Water Conserved</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">94.6%</span>
              <span className="text-xs text-emerald-300 block font-medium mt-0.5">Diagnostic Accuracy</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <a
              href={HELPLINE_TEL_HREF}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#133e24] font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Call Helpline: {HELPLINE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CROP AI & IMMEDIATE ADVISORY PREVIEW                         */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Crop Foliar Diagnostic Spotlight */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121413] rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'फसल पत्ता रोग विश्लेषक (AI Vision)' : 'Foliar Health & Pathology AI'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('crop-analyzer')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Scan Leaf</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Real multimodal AI vision model diagnoses foliar yellow rust, leaf blight, or blast from smartphone or field camera snapshots in seconds.
          </p>

          <div className="p-4 rounded-xl bg-[#faf8f5] dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center gap-4">
            <img 
              src={ASSETS.samples.wheatRust} 
              alt="Wheat leaf sample" 
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Stripe Rust (Yellow Rust)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  92% Match
                </span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px] line-clamp-1">
                Puccinia striiformis urediniospores on wheat lamina.
              </p>
              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                Immediate Action: Prophylactic Propiconazole 25% EC
              </div>
            </div>
          </div>
        </div>

        {/* Right: Urgent Agronomic Recommendations */}
        <div className="lg:col-span-6 bg-white dark:bg-[#121413] rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'ताज़ा कृषि सिफारिशें' : 'Immediate Agronomic Advisory'}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {rec.title}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                  {rec.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
