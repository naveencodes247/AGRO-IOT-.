import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  PhoneCall, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Sprout,
  Video,
  X,
  Globe,
  Radio,
  ChevronDown
} from 'lucide-react';
import { CropScan, Language } from '../types';
import { cropAnalyzerService, SAMPLE_CROP_SCANS } from '../services/cropAnalyzerService';
import { ASSETS } from '../assets/assetMap';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { HELPLINE_NUMBER, HELPLINE_TEL_HREF } from '../services/supportService';

interface CropAnalyzerViewProps {
  lang: Language;
}

interface CropOption {
  id: string;
  nameEn: string;
  nameHi: string;
  scientific: string;
}

const INDIAN_CROPS: CropOption[] = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूं', scientific: 'Triticum aestivum' },
  { id: 'paddy', nameEn: 'Paddy / Rice', nameHi: 'धान / चावल', scientific: 'Oryza sativa' },
  { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', scientific: 'Glycine max' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', scientific: 'Gossypium hirsutum' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', scientific: 'Solanum lycopersicum' },
  { id: 'mustard', nameEn: 'Mustard / Sarson', nameHi: 'सरसों', scientific: 'Brassica juncea' },
  { id: 'maize', nameEn: 'Maize / Corn', nameHi: 'मक्का', scientific: 'Zea mays' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', scientific: 'Solanum tuberosum' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गन्ना', scientific: 'Saccharum officinarum' },
  { id: 'chilli', nameEn: 'Chilli / Mirch', nameHi: 'मिर्च', scientific: 'Capsicum annuum' },
  { id: 'onion', nameEn: 'Onion / Pyaaz', nameHi: 'प्याज', scientific: 'Allium cepa' },
  { id: 'groundnut', nameEn: 'Groundnut / Peanut', nameHi: 'मूंगफली', scientific: 'Arachis hypogaea' },
  { id: 'gram', nameEn: 'Gram / Chana', nameHi: 'चना', scientific: 'Cicer arietinum' },
];

export const CropAnalyzerView: React.FC<CropAnalyzerViewProps> = ({ lang }) => {
  // Start with clean slate: NO pre-loaded automated image
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<CropScan | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Live Camera Viewfinder State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const selectedCrop = INDIAN_CROPS.find(c => c.id === selectedCropId) || INDIAN_CROPS[0];

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start live webcam / rear phone camera
  const startCamera = async () => {
    setCameraError(null);
    setSelectedImage(null);
    setScanResult(null);
    try {
      // Prefer rear environment camera on mobile phones
      const constraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);

      // Connect to video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn('Video play error:', e));
        }
      }, 100);
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      setCameraError('Unable to access device camera. Please check camera permissions or upload an image file.');
      setIsCameraActive(false);
    }
  };

  // Snap photo from live video feed
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setSelectedImage(dataUrl);
      setScanResult(null);
      setAnalysisError(null);
    }
    stopCameraStream();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCameraStream();
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
    stopCameraStream();
    setSelectedImage(sample.imageUrl);
    // Find matching crop if available
    const found = INDIAN_CROPS.find(c => sample.cropType.toLowerCase().includes(c.nameEn.toLowerCase()));
    if (found) setSelectedCropId(found.id);
    setScanResult(sample);
    setAnalysisError(null);
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const cropContextString = `${selectedCrop.nameEn} (${selectedCrop.nameHi} - ${selectedCrop.scientific})`;
      const result = await cropAnalyzerService.analyzeImage({
        imageUrl: selectedImage,
        cropContext: cropContextString,
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
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'क्रॉप विश्लेषक' : 'Real-Time Crop Analyzer'}
        subtitle={lang === 'hi'
          ? 'पत्ता रोग निदान, ICAR/PAU मानक संदर्भ एवं मान्य कीटनाशक/जैविक उपचार'
          : 'Live internet-connected foliar crop diagnostic powered by ICAR plant pathology neural engine'}
        actions={
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>ICAR Diagnostic Cloud Connected</span>
            </div>
            <a
              href={HELPLINE_TEL_HREF}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold shadow-2xs hover:bg-stone-50 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0fa958]" />
              <span>Helpline: {HELPLINE_NUMBER}</span>
            </a>
          </div>
        }
      />

      {/* Main Grid: Upload & Preview (Left 5 cols) + Diagnosis Report (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 cols): Camera / Upload / Crop Selector */}
        <Card className="lg:col-span-5 p-4 sm:p-5 space-y-4">
          <CardHeader
            icon={Camera}
            title={lang === 'hi' ? 'पत्ता फोटो व फसल चयन' : 'Leaf Capture & Crop Selection'}
            subtitle={lang === 'hi' ? 'सटीक निदान के लिए फसल चुनें और पत्ते की फोटो लें' : 'Select crop & capture live leaf photograph'}
          />

          {/* Bilingual Crop Selection Dropdown (Requirement 6) */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
              <span className="flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'फसल चुनें (Crop)' : 'Select Crop (फसल)'}</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                {selectedCrop.scientific}
              </span>
            </label>

            <div className="relative">
              <select
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer appearance-none"
              >
                {INDIAN_CROPS.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.nameEn} — {crop.nameHi} ({crop.scientific})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {/* Image Display / Live Camera Viewfinder Area */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 h-64 sm:h-72 bg-stone-900 flex items-center justify-center">
            {/* 1. Live Camera Viewfinder */}
            {isCameraActive && (
              <div className="relative w-full h-full bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Camera Scanner Reticle */}
                <div className="absolute inset-8 border-2 border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-2 left-2" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-2 right-2" />
                  <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-2 left-2" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-2 right-2" />
                  <span className="text-[10px] text-white/90 bg-black/60 px-2.5 py-1 rounded-full font-mono">
                    Align leaf inside frame
                  </span>
                </div>

                {/* Camera Controls Overlay */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3 z-20">
                  <button
                    onClick={captureSnapshot}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black text-xs shadow-xl cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Photo</span>
                  </button>
                  <button
                    onClick={stopCameraStream}
                    className="p-2.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer shadow-md"
                    title="Close Camera"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Captured / Uploaded Image Preview */}
            {!isCameraActive && selectedImage && (
              <div className="relative w-full h-full">
                <img
                  src={selectedImage}
                  alt="Captured foliar specimen"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs cursor-pointer shadow-md"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl flex items-center justify-between text-[11px]">
                  <span>Crop: <strong>{selectedCrop.nameEn}</strong></span>
                  <span className="text-emerald-400 font-bold">Ready for scan</span>
                </div>
              </div>
            )}

            {/* 3. Empty State (No image, camera off) */}
            {!isCameraActive && !selectedImage && (
              <div className="text-center p-6 text-stone-400 space-y-2">
                <div className="w-14 h-14 rounded-full bg-stone-800/80 border border-stone-700/60 flex items-center justify-center mx-auto text-emerald-400">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-200">No Leaf Image Selected</p>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto mt-0.5">
                    Open your device camera or upload a photo of the affected plant leaf for ICAR disease diagnosis.
                  </p>
                </div>
              </div>
            )}

            {/* Diagnostic loading overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3 z-30">
                <RefreshCw className="w-8 h-8 animate-spin text-[#0fa958]" />
                <div className="text-center">
                  <span className="text-xs font-bold block">Analyzing Leaf Pathology...</span>
                  <span className="text-[10px] text-stone-400 font-mono">Connecting to ICAR neural diagnosis cloud</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Working Camera & Upload Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              <Video className="w-4 h-4 text-[#0fa958]" />
              <span>{isCameraActive ? 'Camera Live' : 'Open Camera'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-200 text-xs font-bold cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Upload Image File</span>
            </button>

            {/* Hidden Native File & Native Camera Inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileUpload}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Diagnostic Trigger Button */}
          <button
            onClick={runAnalysis}
            disabled={!selectedImage || isAnalyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0fa958] to-[#13b963] hover:from-[#13b963] hover:to-[#0fa958] active:scale-98 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-extrabold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isAnalyzing 
                ? 'Processing Agronomic Pathology...' 
                : `Run Agronomic Diagnostic for ${selectedCrop.nameEn}`}
            </span>
          </button>

          {/* Test Reference Samples (Optional benchmark leaves) */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Or Test with Benchmark Reference Leaves
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_CROP_SCANS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedImage === sample.imageUrl
                      ? 'border-[#0fa958] bg-emerald-500/10'
                      : 'border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-850'
                  }`}
                >
                  <div className="text-[11px] font-bold text-stone-800 dark:text-stone-100 truncate">
                    {sample.cropType}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {sample.referenceMatch}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Column (7 cols): Diagnostic Report */}
        <Card className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <CardHeader
              icon={Sprout}
              title="ICAR Agronomic Pathology Report"
              subtitle="Grounded scientific disease diagnosis & recommended treatment"
              badge={
                scanResult && (
                  <StatusBadge
                    status={`${scanResult.confidenceScore}% Confidence`}
                    variant={scanResult.confidenceScore > 85 ? 'healthy' : 'medium'}
                    size="xs"
                  />
                )
              }
            />

            {analysisError && (
              <div className="p-3 my-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{analysisError}</span>
              </div>
            )}

            {scanResult ? (
              <div className="space-y-3.5 text-xs pt-2">
                {/* Result Title & Crop Identified */}
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      Identified Condition
                    </span>
                    <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                      {scanResult.referenceMatch}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                      {scanResult.cropType}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    scanResult.confidenceScore >= 90
                      ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                  }`}>
                    {scanResult.confidenceScore}% MATCH
                  </span>
                </div>

                {/* Pathological Observations */}
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Pathological Observations
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                    {scanResult.observation}
                  </p>
                </div>

                {/* Detected Symptoms */}
                {scanResult.symptoms && scanResult.symptoms.length > 0 && (
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                      Detected Diagnostic Symptoms
                    </h4>
                    <ul className="space-y-1">
                      {scanResult.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practical Guidance */}
                <div className="space-y-2 pt-1">
                  <h4 className="font-bold text-stone-800 dark:text-stone-200">
                    Recommended Agronomic Management
                  </h4>

                  <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                    <strong className="block text-[11px] font-extrabold uppercase mb-0.5">
                      Immediate Action (24-48 Hours):
                    </strong>
                    <span>{scanResult.guidance.immediateAction}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                    <strong className="block text-[11px] font-extrabold uppercase mb-0.5">
                      Cultural Field Management:
                    </strong>
                    <span>{scanResult.guidance.culturalManagement}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
                    <strong className="block text-[11px] font-extrabold uppercase mb-0.5">
                      Organic & Biological Competitor:
                    </strong>
                    <span>{scanResult.guidance.biologicalControl}</span>
                  </div>

                  {scanResult.guidance.chemicalRecommendation && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-900 dark:text-rose-200">
                      <strong className="block text-[11px] font-extrabold uppercase mb-0.5 text-rose-700 dark:text-rose-400">
                        Chemical Recommendation (PAU/ICAR CIBRC Standard):
                      </strong>
                      <span>{scanResult.guidance.chemicalRecommendation}</span>
                    </div>
                  )}
                </div>

                {/* Advisory Footer */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 text-[11px] text-stone-500 flex items-center justify-between gap-3">
                  <span className="flex-1">{scanResult.kvkAdvisoryNote}</span>
                  <a
                    href={HELPLINE_TEL_HREF}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[#0fa958] text-white font-bold hover:bg-[#13b963] flex items-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call KVK</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-stone-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                  <Sprout className="w-6 h-6 opacity-60" />
                </div>
                <div className="max-w-sm mx-auto">
                  <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">
                    No Diagnostic Report Generated
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Select your crop variety, capture a clear foliar photo using your camera or file upload, and click <strong>"Run Agronomic Diagnostic"</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
