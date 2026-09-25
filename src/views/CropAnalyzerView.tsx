import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  FileText, 
  PhoneCall, 
  Info,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CropScan, Language } from '../types';
import { cropAnalyzerService, SAMPLE_CROP_SCANS } from '../services/cropAnalyzerService';
import { ASSETS } from '../assets/assetMap';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../services/supportService';

interface CropAnalyzerViewProps {
  lang: Language;
}

export const CropAnalyzerView: React.FC<CropAnalyzerViewProps> = ({ lang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(ASSETS.samples.wheatRust);
  const [selectedCropName, setSelectedCropName] = useState<string>('Wheat (Triticum aestivum)');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<CropScan | null>(SAMPLE_CROP_SCANS[0]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setScanResult(null);
        setAnalysisError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: CropScan) => {
    setSelectedImage(sample.imageUrl);
    setSelectedCropName(sample.cropType);
    setScanResult(sample);
    setAnalysisError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await cropAnalyzerService.analyzeImage({
        imageUrl: selectedImage,
        cropContext: selectedCropName,
        source: 'upload'
      });
      setScanResult(result);
    } catch (err: any) {
      setAnalysisError(err.message || 'Diagnostic error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Minimal Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'फसल पत्ती रोग विश्लेषक' : 'Crop Foliar Health & Pathology Analyzer'}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Valid Agricultural Pipeline
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'वैज्ञानिक रोग निदान, ICAR/PAU मानक संदर्भ एवं मान्य कीटनाशक/जैविक उपचार'
              : 'Scientifically validated foliar diagnosis grounded in ICAR plant pathology & PAU agronomic standards.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Multimodal Vision Engine Ready</span>
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specimen Input (Upload, Capture, Sample Selection) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#151815] rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                1. Leaf Specimen Ingestion
              </span>
              <span className="text-[11px] text-stone-500">Camera / File Upload</span>
            </div>

            {/* Target Crop Selector */}
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                Select Crop Species:
              </label>
              <select
                value={selectedCropName}
                onChange={(e) => setSelectedCropName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-xs font-medium"
              >
                <option value="Wheat (Triticum aestivum)">Wheat (गेहूं) - Triticum aestivum</option>
                <option value="Paddy Rice (Oryza sativa)">Paddy Rice (धान / चावल) - Oryza sativa</option>
                <option value="Cotton (Gossypium hirsutum)">Cotton (कपास) - Gossypium hirsutum</option>
                <option value="Mustard (Brassica juncea)">Mustard (सरसों) - Brassica juncea</option>
                <option value="Tomato (Solanum lycopersicum)">Tomato (टमाटर) - Solanum lycopersicum</option>
                <option value="Potato (Solanum tuberosum)">Potato (आलू) - Solanum tuberosum</option>
                <option value="Sugarcane (Saccharum officinarum)">Sugarcane (गन्ना)</option>
                <option value="Chickpea / Gram (Cicer arietinum)">Chickpea / Gram (चना)</option>
                <option value="Soybean (Glycine max)">Soybean (सोयाबीन)</option>
              </select>
            </div>

            {/* Specimen Preview Box */}
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 flex flex-col items-center justify-center p-2">
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Leaf specimen for diagnosis"
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-stone-900/90 text-white p-2 rounded text-[11px] flex items-center justify-between">
                    <span className="truncate">{selectedCropName}</span>
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setScanResult(null);
                      }}
                      className="text-stone-300 hover:text-white underline cursor-pointer text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Scan className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                    No leaf photo selected yet
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Upload a clear photo or select a benchmark specimen below.
                  </p>
                </div>
              )}
            </div>

            {/* Ingestion Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-50 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 hover:bg-stone-50 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-stone-500" />
                <span>Camera Snap</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Run Analysis Trigger Button */}
            <button
              onClick={runAnalysis}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full py-2.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !selectedImage || isAnalyzing
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  : 'bg-[#143e24] hover:bg-[#1a4f2e] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Executing Multimodal Diagnostic Pipeline...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-emerald-300 dark:text-white" />
                  <span>Run Certified Pathology Analysis</span>
                </>
              )}
            </button>
          </div>

          {/* Benchmark Specimens Picker */}
          <div className="bg-white dark:bg-[#151815] rounded-xl border border-stone-200 dark:border-stone-800 p-4 space-y-2">
            <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
              Test Benchmark Agricultural Samples:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSelectSample(SAMPLE_CROP_SCANS[0])}
                className="p-2 rounded-md border border-stone-200 dark:border-stone-700 hover:border-emerald-600 text-left cursor-pointer transition-colors bg-stone-50 dark:bg-stone-850"
              >
                <div className="w-full h-16 rounded overflow-hidden mb-1.5">
                  <img src={ASSETS.samples.wheatRust} alt="Wheat Stripe Rust" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">Wheat Stripe Rust</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">Pathology Sample</span>
              </button>

              <button
                onClick={() => handleSelectSample(SAMPLE_CROP_SCANS[1])}
                className="p-2 rounded-md border border-stone-200 dark:border-stone-700 hover:border-emerald-600 text-left cursor-pointer transition-colors bg-stone-50 dark:bg-stone-850"
              >
                <div className="w-full h-16 rounded overflow-hidden mb-1.5">
                  <img src={ASSETS.samples.healthyPaddy} alt="Healthy Rice" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">Healthy Paddy Rice</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Normal Foliage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Output Dossier */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151815] rounded-xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-5 shadow-xs">
          {scanResult ? (
            <>
              {/* Header: Diagnosis & Confidence */}
              <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#143e24] text-white">
                    PATHOLOGY REPORT
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Confidence Index:</span>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {scanResult.confidenceScore}%
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                  {scanResult.referenceMatch}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Specimen Taxonomy: <strong className="text-stone-700 dark:text-stone-200">{scanResult.cropType}</strong> • Analyzed at {scanResult.timestamp}
                </p>
              </div>

              {/* Visual Foliar Observations */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Visual Morphological Pathology:
                </span>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-850 p-3 rounded-lg border border-stone-200 dark:border-stone-750">
                  {scanResult.observation}
                </p>
              </div>

              {/* Observed Diagnostic Symptoms */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Primary Characteristic Symptoms:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  {scanResult.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Agronomic Guidance & Remediation */}
              <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                  Verified Agronomic Guidance & Intervention:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                      Immediate Action (Next 24 Hrs):
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {scanResult.guidance.immediateAction}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">
                      Cultural & Spacing Practice:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {scanResult.guidance.culturalManagement}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                      Organic / Bio-Control Remedy:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {scanResult.guidance.biologicalControl}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                      CIBRC Registered Chemical Formulation:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {scanResult.guidance.chemicalRecommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Advisory Note */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>{scanResult.kvkAdvisoryNote}</p>
                  <a
                    href={HELPLINE_TEL_HREF}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Kisan Helpline {HELPLINE_NUMBER} for Physical Specimen Testing</span>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-stone-400">
              <Scan className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                Waiting for Leaf Specimen
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                Select an image on the left and click "Run Certified Pathology Analysis" to inspect foliar diseases and generate remediation advice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
