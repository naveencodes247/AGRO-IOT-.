/**
 * AGRO-IOT Type Definitions
 * Designed for Indian agricultural systems with offline-first support.
 */

export type UserRole = 'farmer' | 'coordinator' | 'admin';

export type Language = 'en' | 'hi';

export type ThemeMode = 'system' | 'light' | 'dark';

export type ConnectionStatus = 'connected' | 'waiting' | 'demo' | 'offline_sync';

export interface SensorReading {
  id: string;
  sensorType: 'soil_moisture_shallow' | 'soil_moisture_deep' | 'ambient_temp' | 'humidity' | 'soil_temp' | 'solar_radiation' | 'npk_nitrogen';
  name: string;
  value: number;
  unit: string;
  idealRange: [number, number];
  status: 'optimal' | 'warning' | 'critical';
  lastUpdated: string;
  depth?: string;
}

export interface FarmPlot {
  id: string;
  name: string;
  sizeAcres: number;
  cropName: string;
  cropVariety?: string;
  sowingDate: string;
  cropStage: 'Germination' | 'Vegetative' | 'Tillering' | 'Flowering' | 'Grain Filling' | 'Maturity' | 'Harvest';
  soilType: string;
  irrigationType: 'Drip' | 'Sprinkler' | 'Flood / Furrow' | 'Canal';
  sensorNodeId: string;
  healthScore: number; // 0 - 100
}

export interface Farm {
  id: string;
  name: string;
  farmerName: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  totalAcres: number;
  status: 'active' | 'pending_setup' | 'offline';
  dataSource: 'demo' | 'live' | 'empty';
  gatewayId?: string;
  batteryLevel?: number; // percentage
  signalStrength?: number; // dBm or 0-100
  plots: FarmPlot[];
}

export type RecommendationPriority = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationCategory = 'irrigation' | 'fertilizer' | 'pest_control' | 'weather_alert' | 'soil_health';

export interface Recommendation {
  id: string;
  title: string;
  observation: string;
  reason: string;
  action: string;
  priority: RecommendationPriority;
  time: string;
  category: RecommendationCategory;
  plotId?: string;
  plotName?: string;
  status: 'pending' | 'applied' | 'dismissed';
  isDemo: boolean;
}

export type AlertCategory = 'critical' | 'warning' | 'information';
export type AlertType = 
  | 'water_stress' 
  | 'pest_risk' 
  | 'disease_risk' 
  | 'temperature_risk' 
  | 'irrigation_requirement' 
  | 'environmental_risk' 
  | 'connectivity_issue';

export interface Alert {
  id: string;
  title: string;
  category: AlertCategory;
  type: AlertType;
  message: string;
  recommendedAction: string;
  timestamp: string;
  plotId: string;
  plotName: string;
  status: 'active' | 'acknowledged' | 'resolved';
  isDemo: boolean;
}

export interface CropScan {
  id: string;
  timestamp: string;
  imageUrl: string;
  status: 'analyzed' | 'service_unavailable' | 'processing';
  cropType: string;
  observation: string;
  referenceMatch: string;
  confidenceScore: number; // percentage 0 - 100
  symptoms: string[];
  guidance: {
    immediateAction: string;
    culturalManagement: string;
    biologicalControl: string;
    chemicalRecommendation?: string;
  };
  kvkAdvisoryNote: string;
  isDemo: boolean;
}

export interface IndianStateAgriProfile {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  isUT: boolean;
  capital: string;
  majorSoils: string[];
  annualRainfallMm: number;
  climateZones: string[];
  primaryCrops: string[];
  horticultureCrops: string[];
  kharifCrops: string[];
  rabiCrops: string[];
  zaidCrops: string[];
  keyChallenges: string[];
  majorInstitutes: string[];
}

export interface AgriCrop {
  id: string;
  name: string;
  hindiName: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Commercial' | 'Horticultural' | 'Vegetables' | 'Fruits';
  climate: string;
  soil: string;
  sowingSeason: string;
  growingRegions: string[];
  idealTemperature: string;
  waterRequirement: string;
  growthDurationDays: string;
  nutrientRequirements: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicMatter: string;
  };
  commonPests: string[];
  commonDiseases: string[];
  harvestAdvice: string;
  storageRecommendation: string;
}

export interface AgriPest {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  affectedCrops: string[];
  symptoms: string[];
  identification: string;
  favorableConditions: string;
  generalManagement: {
    cultural: string;
    biological: string;
    chemical: string;
  };
  referenceSource: string;
}

export interface AgriDisease {
  id: string;
  name: string;
  causalOrganism: string;
  hindiName: string;
  affectedCrops: string[];
  symptoms: string[];
  favorableConditions: string;
  generalManagement: {
    preventive: string;
    cultural: string;
    fungicidal: string;
  };
  referenceSource: string;
}

export interface SupportTicket {
  id: string;
  farmerName: string;
  phone: string;
  issueCategory: 'farm_connection' | 'crop_analyzer' | 'sensor_reading' | 'agri_guidance' | 'other';
  message: string;
  preferredTime: string;
  status: 'submitted' | 'in_review' | 'resolved';
  createdAt: string;
}

export type SimulationScenario = 'normal' | 'water_stress' | 'pest_risk' | 'heatwave' | 'disease_risk';

export interface EnvironmentalRisk {
  diseaseRisk: 'Low' | 'Moderate' | 'High';
  pestRisk: 'Low' | 'Moderate' | 'High';
  heatStress: 'Low' | 'Moderate' | 'High' | 'Extreme';
  waterStress: 'Low' | 'Moderate' | 'High' | 'Severe';
  floodRisk: 'Low' | 'Moderate' | 'High';
}
