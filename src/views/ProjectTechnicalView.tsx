import React from 'react';
import { 
  Cpu, 
  Layers, 
  Wifi, 
  WifiOff, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Smartphone, 
  Radio, 
  Droplets, 
  Database,
  Terminal,
  Activity,
  FileText,
  Boxes,
  Compass
} from 'lucide-react';
import { Language } from '../types';

interface ProjectTechnicalViewProps {
  lang: Language;
}

export const ProjectTechnicalView: React.FC<ProjectTechnicalViewProps> = ({ lang }) => {
  return (
    <div className="space-y-8 font-sans">
      {/* Minimalist Monochromatic Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] text-stone-500 uppercase tracking-widest">
          <span>SPECIFICATION // AGRO-IOT v1.0.4</span>
          <span>•</span>
          <span>INDIAN AGRONOMIC SYSTEM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          System Architecture & Technical Engineering Dossier
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl leading-relaxed">
          Detailed technical reference documenting hardware schematics, local edge computing pipelines, communications protocol stacks, and agronomic verification standards for agricultural technology deployment.
        </p>
      </div>

      {/* 1. Closed Loop Operational Flowchart (Minimalist Architectural Diagram) */}
      <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
            01 // SYSTEM CONTROL & DECISION FLOW (CLOSED LOOP)
          </span>
          <span className="text-[10px] font-mono text-stone-400">LATENCY &lt; 100MS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            {
              step: 'OBSERVE',
              sub: 'Sensory Telemetry',
              details: 'Capacitive VWC probes (15cm & 30cm) + SHT31 ambient sensor + CMOS foliar camera.',
              tech: 'I2C / ADC 12-bit / LoRa 865MHz'
            },
            {
              step: 'UNDERSTAND',
              sub: 'Context Normalization',
              details: 'Local soil texture matric conversion (alluvial loam calibration curve) + crop stage.',
              tech: 'On-Chip Lookup Tables'
            },
            {
              step: 'DECIDE',
              sub: 'Edge Rule Inference',
              details: 'Quantized INT8 MobileNet foliar vision + microclimate disease hysteresis matrix.',
              tech: 'TinyML / C++ Decision Trees'
            },
            {
              step: 'ACT',
              sub: 'Field Actuation',
              details: 'Solenoid irrigation relay toggle + immediate local audio-visual buzzer and SMS alerts.',
              tech: 'GPIO Relay / 12V 2A Driver'
            },
            {
              step: 'LEARN',
              sub: 'Telemetry Buffering',
              details: 'Circular flash ring buffer in SPIFFS. Intermittent opportunistic upstream synchronization.',
              tech: 'MQTT-SN over Cellular 2G/4G'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">STEP 0{idx + 1}</span>
              <h4 className="text-xs font-extrabold text-stone-900 dark:text-stone-100">{item.step}</h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">{item.details}</p>
              <div className="pt-2 text-[10px] font-mono text-stone-400 border-t border-stone-100 dark:border-stone-800">
                {item.tech}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Detailed Hardware Bill of Materials (BOM) & Electrical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              02 // Hardware Component Bill of Materials (BOM)
            </h3>
            <span className="text-[10px] font-mono text-stone-400">PRODUCTION SPECS</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-stone-400 font-mono text-[10px] border-b border-stone-100 dark:border-stone-800">
                <th className="py-2">Component</th>
                <th className="py-2">Part No / IC</th>
                <th className="py-2">Operating Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-700 dark:text-stone-300">
              <tr>
                <td className="py-2 font-semibold">Microcontroller</td>
                <td className="py-2 font-mono text-[11px]">ESP32-S3-WROOM-1</td>
                <td className="py-2 font-mono text-[11px]">240MHz, 8MB PSRAM</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Long Range RF</td>
                <td className="py-2 font-mono text-[11px]">Semtech SX1276</td>
                <td className="py-2 font-mono text-[11px]">865 - 867 MHz (India)</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Soil Moisture</td>
                <td className="py-2 font-mono text-[11px]">Capacitive v2.0 (Dual)</td>
                <td className="py-2 font-mono text-[11px]">0 - 100% VWC (Analog)</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Microclimate</td>
                <td className="py-2 font-mono text-[11px]">Sensirion SHT31-DIS</td>
                <td className="py-2 font-mono text-[11px]">±0.2°C, ±2% RH (I2C)</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Solar Harvesting</td>
                <td className="py-2 font-mono text-[11px]">TP4056 + MPPT</td>
                <td className="py-2 font-mono text-[11px]">5W Panel / 3.7V LiFePO4</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Camera Sensor</td>
                <td className="py-2 font-mono text-[11px]">OmniVision OV2640</td>
                <td className="py-2 font-mono text-[11px]">2MP UXGA (JPEG/RGB)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Communication & Storage Protocol Stack */}
        <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              03 // Protocol & Offline Resiliency Architecture
            </h3>
            <span className="text-[10px] font-mono text-stone-400">STACK LAYERS</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850">
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                PHYSICAL & LINK LAYER (FIELD TO GATEWAY)
              </span>
              <p className="text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                LoRa Chirp Spread Spectrum (CSS) modulation on 865-867 MHz license-free Indian industrial band. Spreading Factor SF7 to SF10 dynamically modulated via Adaptive Data Rate (ADR). Link budget &gt; 148 dB allows reliable transmission through dense wheat/paddy crop canopies up to 3.5 km.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850">
              <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold block">
                STORAGE & LOCAL PERSISTENCE LAYER
              </span>
              <p className="text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                SPIFFS circular ring flash buffer. Sensors sample every 15 minutes and persist in embedded SQLite-compatible flash tables. Up to 180 days of granular field telemetry is preserved autonomously without requiring external internet.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850">
              <span className="font-mono text-[10px] text-stone-500 font-bold block">
                UPSTREAM CLOUD SYNCHRONIZATION
              </span>
              <p className="text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                When cellular 2G/4G or Wi-Fi beacon is detected, differential telemetry packets synchronize via MQTT-SN using TLS 1.3 encryption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Soil Physics Calibration & ICAR Mathematical Models */}
      <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            04 // Soil Physics & Phenological Water Balance Equations
          </h3>
          <span className="text-[10px] font-mono text-stone-400">AGRONOMIC VALIDATION</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">
              1. Soil Matric Conversion
            </span>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-900 font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
              VWC (%) = 0.0012 × ADC² - 0.45 × ADC + 42.1
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-[11px]">
              Calibrated specifically for Gangetic alluvial silt loams to eliminate hysteresis false readings.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">
              2. Crown Root Water Trigger
            </span>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-900 font-mono text-[11px] text-blue-700 dark:text-blue-400">
              Depletion Index = (FC - VWC) / (FC - PWP)
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-[11px]">
              Irrigation activates when available water capacity drops below 50% during the Crown Root Initiation stage (Days 20 - 25).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">
              3. Stripe Rust Fungal Index
            </span>
            <div className="p-2 rounded bg-stone-100 dark:bg-stone-900 font-mono text-[11px] text-amber-700 dark:text-amber-400">
              Risk = ∫ (RH &gt; 85%) dt × f(10°C &lt; T &lt; 18°C)
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-[11px]">
              Consecutive 6-hour night dew accumulation triggers automated scout notification to prevent epidemic spread.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
