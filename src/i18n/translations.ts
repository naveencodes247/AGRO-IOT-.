import { Language } from '../types';

export const translations = {
  en: {
    // Brand
    brandName: 'AGRO-IOT',
    brandTagline: 'Intelligent Farm Monitoring & Agricultural Knowledge',
    
    // Navigation
    navOverview: 'Overview',
    navLiveMonitoring: 'Live Monitoring',
    navRecommendations: 'Recommendations',
    navAlerts: 'Alerts',
    navFarmInfo: 'Farm Information',
    navAgriIntelligence: 'Agri Intelligence',
    navHistory: 'History / Analytics',
    navCropAnalyzer: 'Crop Analyzer',
    navCustomerSupport: 'Customer Support',
    navProjectInfo: 'Technical & Project Info',
    
    // Header actions
    roleFarmer: 'Farmer',
    roleCoordinator: 'Coordinator',
    roleAdmin: 'Admin',
    helpCenter: 'Help Desk',
    helplineNumber: '+91 9301929218',
    callKisanHelpline: 'Call Kisan Helpline',
    
    // Status indicators
    demoData: 'DEMO DATA',
    waitingConnection: 'WAITING FOR FARM CONNECTION',
    notConnected: 'NOT CONNECTED',
    integrationReady: 'READY FOR INTEGRATION',
    hardwareDisconnected: 'Sensors / Gateway Offline',
    offlineModeActive: 'Offline-First Mode Active',
    cloudSyncPending: 'Cloud Sync: Local Storage Only',
    
    // Common actions
    addFarm: 'Add Farm',
    connectFarm: 'Connect Farm Device',
    refresh: 'Refresh Status',
    viewAll: 'View All',
    filterBy: 'Filter By',
    searchPlaceholder: 'Search crops, pests, diseases, states...',
    submit: 'Submit',
    cancel: 'Cancel',
    dismiss: 'Dismiss',
    acknowledge: 'Acknowledge',
    resolve: 'Resolve',
    learnMore: 'Learn More',
    viewGuide: 'View Guidance',
    
    // Live Monitoring
    liveFarmOverview: 'Farm & Soil Environment Monitor',
    liveFarmSub: 'Real-time telemetry architecture ready for LoRaWAN & ESP32 gateway sensors',
    soilMoistureShallow: 'Soil Moisture (15 cm)',
    soilMoistureDeep: 'Soil Moisture (30 cm)',
    ambientTemp: 'Air Temperature',
    relativeHumidity: 'Relative Humidity',
    soilTemp: 'Soil Temperature',
    irrigationStatus: 'Irrigation Valve',
    environmentalRisk: 'Disease Vulnerability Index',
    lastSyncTime: 'Last reading update',
    optimalRange: 'Agronomic Optimal Range',
    valveOpen: 'Active (Flowing)',
    valveClosed: 'Idle (Closed)',
    
    // Recommendations
    recommendationTitle: 'Agronomic Recommendations',
    observation: 'OBSERVATION',
    reason: 'REASON',
    action: 'ACTION',
    priority: 'PRIORITY',
    time: 'TIME',
    priorityCritical: 'Critical',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    
    // Alerts
    alertsTitle: 'Farm Alerts & Safety Center',
    criticalAlerts: 'Critical Alerts',
    warningAlerts: 'Agronomic Warnings',
    infoAlerts: 'Informational Notices',
    alertAcknowledgeSuccess: 'Alert acknowledged',
    
    // Crop Analyzer
    cropAnalyzerTitle: 'Crop Health & Leaf Analyzer',
    cropAnalyzerSub: 'Image-based foliar diagnostic pipeline designed for offline field inference and Krishi Vigyan Kendra validation',
    uploadPrompt: 'Upload or drag high-clarity leaf photo',
    cameraPrompt: 'Capture with Field Camera',
    sampleLeaves: 'Try Sample Agricultural Cases',
    analyzingState: 'Analyzing foliar patterns against pathology reference...',
    readyForInference: 'Ready for image analysis',
    aiNotConnectedNotice: 'AI inference service ready for local controller connection. Reference matching active.',
    immediateActionRequired: 'Immediate Field Action',
    culturalManagement: 'Cultural & Agronomic Practices',
    kvkDisclaimer: 'Disclaimer: Automated diagnostic suggestion. Consult local Agricultural Officer / KVK before applying scheduled chemicals.',

    // Customer Support
    supportTitle: 'Farmer Support & Krishi Helpline',
    supportSub: 'Direct telephone assistance and technical guidance for device connection and agronomy',
    directCallBanner: 'Official Dedicated Support Line: +91 9301929218',
    callNow: 'Call +91 9301929218 Now',
    commonIssuesTitle: 'Frequently Asked Questions & Field Guides',
    requestCallback: 'Request Agronomist Callback',
    
    // Agriculture Intelligence
    agriMapTitle: 'Interactive India Agricultural Knowledge Map',
    agriMapSub: 'State-wise cropping patterns, agro-climatic zones, and seasonal advisories across 28 States and 8 Union Territories',
    selectStatePrompt: 'Click on any State or Union Territory below to inspect verified agricultural profiles',
    stateSummary: 'State Agricultural Profile',
    majorCrops: 'Dominant Crops',
    kharifSeason: 'Kharif (Monsoon)',
    rabiSeason: 'Rabi (Winter)',
    zaidSeason: 'Zaid (Summer)',
    soilTypes: 'Major Soil Types',
  },
  hi: {
    // Brand
    brandName: 'एग्रो-आईओटी',
    brandTagline: 'स्मार्ट कृषि निगरानी और किसान ज्ञान मंच',
    
    // Navigation
    navOverview: 'अवलोकन (Overview)',
    navLiveMonitoring: 'लाइव निगरानी (Live)',
    navRecommendations: 'सिफारिशें (Advice)',
    navAlerts: 'अलर्ट एवं चेतावनियां',
    navFarmInfo: 'खेत की जानकारी',
    navAgriIntelligence: 'कृषि ज्ञानकोश',
    navHistory: 'इतिहास एवं विश्लेषण',
    navCropAnalyzer: 'फसल रोग विश्लेषक',
    navCustomerSupport: 'किसान सहायता केंद्र',
    navProjectInfo: 'तकनीकी वास्तुकला',
    
    // Header actions
    roleFarmer: 'किसान',
    roleCoordinator: 'समन्वयक',
    roleAdmin: 'प्रशासक',
    helpCenter: 'सहायता केंद्र',
    helplineNumber: '+91 9301929218',
    callKisanHelpline: 'किसान हेल्पलाइन पर कॉल करें',
    
    // Status indicators
    demoData: 'डेमो डेटा (DEMO DATA)',
    waitingConnection: 'खेत सेंसर कनेक्शन की प्रतीक्षा में',
    notConnected: 'सेंसर कनेक्टेड नहीं है',
    integrationReady: 'सेंसर एकीकरण हेतु तैयार',
    hardwareDisconnected: 'सेंसर / गेटवे ऑफलाइन',
    offlineModeActive: 'ऑफलाइन-फर्स्ट मोड सक्रिय',
    cloudSyncPending: 'क्लाउड सिंक: स्थानीय मेमोरी पर सुरक्षित',
    
    // Common actions
    addFarm: 'नया खेत जोड़ें',
    connectFarm: 'डिवाइस कनेक्ट करें',
    refresh: 'स्थिति ताज़ा करें',
    viewAll: 'सभी देखें',
    filterBy: 'फ़िल्टर करें',
    searchPlaceholder: 'फसल, कीट, रोग, राज्य खोजें...',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    dismiss: 'खारिज करें',
    acknowledge: 'स्वीकार करें',
    resolve: 'समाधान हुआ',
    learnMore: 'विस्तार से जानें',
    viewGuide: 'मार्गदर्शन देखें',
    
    // Live Monitoring
    liveFarmOverview: 'खेत एवं मृदा वातावरण निगरानी',
    liveFarmSub: 'ESP32 और LoRaWAN सेंसर हेतु एकीकृत टेलीमेट्री इंटरफ़ेस',
    soilMoistureShallow: 'मिट्टी की नमी (15 सेमी)',
    soilMoistureDeep: 'मिट्टी की नमी (30 सेमी)',
    ambientTemp: 'वायु तापमान',
    relativeHumidity: 'हवा की नमी (आर्द्रता)',
    soilTemp: 'मिट्टी का तापमान',
    irrigationStatus: 'सिंचाई वाल्व स्थिति',
    environmentalRisk: 'फसल रोग जोखिम सूचकांक',
    lastSyncTime: 'अंतिम अपडेट',
    optimalRange: 'अनुकूल कृषि सीमा',
    valveOpen: 'चालू (पानी बह रहा है)',
    valveClosed: 'बंद (निष्क्रिय)',
    
    // Recommendations
    recommendationTitle: 'कृषि विज्ञान आधारित सिफारिशें',
    observation: 'निरीक्षण (OBSERVATION)',
    reason: 'कारण (REASON)',
    action: 'आवश्यक कार्रवाई (ACTION)',
    priority: 'प्राथमिकता (PRIORITY)',
    time: 'समय (TIME)',
    priorityCritical: 'अति आवश्यक',
    priorityHigh: 'उच्च',
    priorityMedium: 'मध्यम',
    priorityLow: 'सामान्य',
    
    // Alerts
    alertsTitle: 'खेत अलर्ट एवं सुरक्षा केंद्र',
    criticalAlerts: 'गंभीर चेतावनी',
    warningAlerts: 'सावधानी सूचना',
    infoAlerts: 'सामान्य सूचना',
    alertAcknowledgeSuccess: 'अलर्ट दर्ज किया गया',
    
    // Crop Analyzer
    cropAnalyzerTitle: 'फसल स्वास्थ्य एवं पत्ता विश्लेषक',
    cropAnalyzerSub: 'खेत में बिना इंटरनेट भी काम करने योग्य पत्ता रोग पहचान प्रणाली',
    uploadPrompt: 'पत्ते की स्पष्ट तस्वीर अपलोड करें',
    cameraPrompt: 'कैमरे से तस्वीर लें',
    sampleLeaves: 'नमूना कृषि तस्वीरें आजमाएं',
    analyzingState: 'रोग लक्षणों का मिलान किया जा रहा है...',
    readyForInference: 'तस्वीर विश्लेषण हेतु तैयार',
    aiNotConnectedNotice: 'स्थानीय नियंत्रक हेतु तैयार। कृषि ज्ञानकोश से मिलान सक्रिय।',
    immediateActionRequired: 'खेत में तुरंत की जाने वाली कार्रवाई',
    culturalManagement: 'जैविक एवं कृषि वैज्ञानिक रोकथाम',
    kvkDisclaimer: 'सूचना: यह एक संदर्भ सुझाव है। रसायन छिड़काव से पूर्व स्थानीय कृषि विज्ञान केंद्र (KVK) से परामर्श लें।',

    // Customer Support
    supportTitle: 'किसान सहायता केंद्र एवं हेल्पलाइन',
    supportSub: 'डिवाइस सेटअप और फसल परामर्श हेतु सीधा टेलीफोन संपर्क',
    directCallBanner: 'समर्पित किसान सहायता नंबर: +91 9301929218',
    callNow: 'अभी कॉल करें: +91 9301929218',
    commonIssuesTitle: 'अक्सर पूछे जाने वाले सवाल और समाधान',
    requestCallback: 'विशेषज्ञ से कॉल का अनुरोध करें',
    
    // Agriculture Intelligence
    agriMapTitle: 'भारत का इंटरएक्टिव कृषि ज्ञानकोश मानचित्र',
    agriMapSub: '28 राज्यों और 8 केंद्र शासित प्रदेशों की फसल प्रणाली और कृषि-जलवायु क्षेत्र',
    selectStatePrompt: 'सत्यापित कृषि जानकारी देखने के लिए नीचे किसी भी राज्य या केंद्र शासित प्रदेश पर क्लिक करें',
    stateSummary: 'राज्य कृषि रूपरेखा',
    majorCrops: 'प्रमुख फसलें',
    kharifSeason: 'खरीफ (मानसून)',
    rabiSeason: 'रबी (शीतकालीन)',
    zaidSeason: 'जायद (गर्मी)',
    soilTypes: 'प्रमुख मृदा प्रकार',
  }
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.en;
};
