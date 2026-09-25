import { Alert, Farm, FarmPlot, Recommendation, SensorReading } from '../types';

// Default starter demo farm for demonstration purposes
const INITIAL_DEMO_FARM: Farm = {
  id: 'farm-pb-104',
  name: 'Kisan Green Acres Plot',
  farmerName: 'Sardar Gurpreet Singh',
  phone: '+91 9301929218',
  state: 'Punjab',
  district: 'Ludhiana',
  village: 'Samrala Kalan',
  totalAcres: 12.5,
  status: 'active',
  dataSource: 'demo',
  gatewayId: 'AGRO-ESP32-GW-901',
  batteryLevel: 94,
  signalStrength: 82,
  plots: [
    {
      id: 'plot-wheat-01',
      name: 'North Block (Plot #1 - Wheat)',
      sizeAcres: 5.5,
      cropName: 'Wheat (HD-3086)',
      cropVariety: 'Pusa Gautami',
      sowingDate: '2026-11-12',
      cropStage: 'Tillering',
      soilType: 'Loamy Alluvial',
      irrigationType: 'Drip',
      sensorNodeId: 'NODE-ESP32-W1',
      healthScore: 88,
    },
    {
      id: 'plot-mustard-02',
      name: 'South Terrace (Plot #2 - Mustard)',
      sizeAcres: 4.0,
      cropName: 'Mustard (Giriraj)',
      cropVariety: 'DRMRIJ-31',
      sowingDate: '2026-10-20',
      cropStage: 'Flowering',
      soilType: 'Sandy Loam',
      irrigationType: 'Sprinkler',
      sensorNodeId: 'NODE-ESP32-M2',
      healthScore: 82,
    },
    {
      id: 'plot-potato-03',
      name: 'Riverbank Sector (Plot #3 - Potato)',
      sizeAcres: 3.0,
      cropName: 'Potato (Kufri Jyoti)',
      cropVariety: 'Kufri Jyoti Early',
      sowingDate: '2026-10-28',
      cropStage: 'Vegetative',
      soilType: 'Alluvial Silt',
      irrigationType: 'Flood / Furrow',
      sensorNodeId: 'NODE-ESP32-P3',
      healthScore: 74,
    }
  ]
};

// Simulated sensor telemetry
const DEMO_READINGS: SensorReading[] = [
  {
    id: 'sm-15',
    sensorType: 'soil_moisture_shallow',
    name: 'Topsoil Moisture (15 cm)',
    value: 28.4,
    unit: '% VWC',
    idealRange: [25, 45],
    status: 'optimal',
    lastUpdated: '2 mins ago (Node #1)',
    depth: '15 cm'
  },
  {
    id: 'sm-30',
    sensorType: 'soil_moisture_deep',
    name: 'Root Zone Moisture (30 cm)',
    value: 34.2,
    unit: '% VWC',
    idealRange: [28, 50],
    status: 'optimal',
    lastUpdated: '2 mins ago (Node #1)',
    depth: '30 cm'
  },
  {
    id: 'amb-temp',
    sensorType: 'ambient_temp',
    name: 'Ambient Temperature',
    value: 24.6,
    unit: '°C',
    idealRange: [18, 30],
    status: 'optimal',
    lastUpdated: '1 min ago (Gateway #1)'
  },
  {
    id: 'rel-hum',
    sensorType: 'humidity',
    name: 'Air Relative Humidity',
    value: 68.0,
    unit: '%',
    idealRange: [40, 75],
    status: 'optimal',
    lastUpdated: '1 min ago (Gateway #1)'
  },
  {
    id: 'soil-temp',
    sensorType: 'soil_temp',
    name: 'Soil Temperature (15 cm)',
    value: 19.8,
    unit: '°C',
    idealRange: [16, 24],
    status: 'optimal',
    lastUpdated: '2 mins ago (Node #1)'
  },
  {
    id: 'solar-rad',
    sensorType: 'solar_radiation',
    name: 'Solar Insolation',
    value: 640,
    unit: 'W/m²',
    idealRange: [400, 950],
    status: 'optimal',
    lastUpdated: '5 mins ago'
  }
];

// Structured Recommendations conforming strictly to:
// OBSERVATION, REASON, ACTION, PRIORITY, TIME
const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-01',
    title: 'Crown Root Initiation (CRI) Moisture Balancing',
    observation: 'Topsoil moisture in Plot #1 is at 28.4% VWC while wheat crop has reached 22 days post-sowing (Crown Root Initiation stage).',
    reason: 'The first irrigation at Crown Root Initiation is the most yield-critical event in wheat; slight deficit causes irreversible reduction in tillering capacity.',
    action: 'Schedule light drip or border-strip irrigation of 40mm within the next 18 hours. Avoid over-ponding to maintain root zone aeration.',
    priority: 'high',
    time: 'Today, 06:00 AM',
    category: 'irrigation',
    plotId: 'plot-wheat-01',
    plotName: 'North Block (Plot #1 - Wheat)',
    status: 'pending',
    isDemo: true
  },
  {
    id: 'rec-02',
    title: 'High Humidity & Dew Morning Disease Vigilance',
    observation: 'Microclimate sensors report relative humidity exceeding 85% for 6 consecutive nighttime hours with ambient temperature hovering between 13°C and 16°C.',
    reason: 'These exact psychrometric conditions favor the germination of Puccinia striiformis urediniospores (Stripe Rust / Yellow Rust).',
    action: 'Conduct morning leaf inspections on the field boundaries near tree shades. If yellow linear pustules are observed, prepare prophylactic spray of Propiconazole 25% EC @ 1 ml/L.',
    priority: 'critical',
    time: 'Yesterday, 07:15 PM',
    category: 'pest_control',
    plotId: 'plot-wheat-01',
    plotName: 'North Block (Plot #1 - Wheat)',
    status: 'pending',
    isDemo: true
  },
  {
    id: 'rec-03',
    title: 'Split Nitrogen Top-Dressing at First Irrigation',
    observation: 'Soil baseline test indicates medium available nitrogen (210 kg/ha); crop is transitioning into peak vegetative tillering.',
    reason: 'Wheat utilizes over 50% of its nitrogen demand during tillering. Single heavy basal applications lead to leaching losses.',
    action: 'Broadcast second split of Neem Coated Urea @ 30 kg/acre immediately prior to tomorrow\'s irrigation cycle.',
    priority: 'medium',
    time: '2 days ago',
    category: 'fertilizer',
    plotId: 'plot-wheat-01',
    plotName: 'North Block (Plot #1 - Wheat)',
    status: 'applied',
    isDemo: true
  },
  {
    id: 'rec-04',
    title: 'Mustard Aphid Border Scouting Threshold',
    observation: 'Ambient daytime temperature rising to 24°C in South Terrace Plot #2 with mustard crop entering peak flowering.',
    reason: 'Alate (winged) mustard aphids migrate rapidly to tender inflorescence during warm sunny afternoons.',
    action: 'Erect 5 yellow sticky traps per acre along southern field edges and inspect 20 representative plants for colonies exceeding 25 aphids/plant.',
    priority: 'high',
    time: '3 days ago',
    category: 'pest_control',
    plotId: 'plot-mustard-02',
    plotName: 'South Terrace (Plot #2 - Mustard)',
    status: 'pending',
    isDemo: true
  }
];

const DEMO_ALERTS: Alert[] = [
  {
    id: 'alt-01',
    title: 'Yellow Rust Climatic Susceptibility Alert',
    category: 'critical',
    type: 'disease_risk',
    message: 'Persistent morning fog and 88% humidity in Ludhiana district has created favorable microclimate for stripe rust development.',
    recommendedAction: 'Inspect lower foliage of HD-3086 wheat. Contact Kisan helpline +91 9301929218 if pustules appear.',
    timestamp: '2 hours ago',
    plotId: 'plot-wheat-01',
    plotName: 'North Block (Wheat)',
    status: 'active',
    isDemo: true
  },
  {
    id: 'alt-02',
    title: 'Shallow Root Zone Water Depletion Advisory',
    category: 'warning',
    type: 'water_stress',
    message: 'Topsoil moisture in Plot #3 (Potato) has reached 22% VWC, nearing lower boundary of optimal tuber bulking zone.',
    recommendedAction: 'Engage furrow irrigation valve #3 for 45 minutes this evening.',
    timestamp: '4 hours ago',
    plotId: 'plot-potato-03',
    plotName: 'Riverbank Sector (Potato)',
    status: 'active',
    isDemo: true
  },
  {
    id: 'alt-03',
    title: 'Node Battery Status Notice',
    category: 'information',
    type: 'connectivity_issue',
    message: 'Field Node #3 (Potato plot) solar charging normal at 3.9V; battery capacity stands at 78%.',
    recommendedAction: 'No immediate action required. Routine solar self-sustaining operational check passed.',
    timestamp: '1 day ago',
    plotId: 'plot-potato-03',
    plotName: 'Riverbank Sector (Potato)',
    status: 'resolved',
    isDemo: true
  }
];

class FarmService {
  private currentMode: 'demo' | 'empty' = 'demo';
  private farms: Farm[] = [INITIAL_DEMO_FARM];
  private recommendations: Recommendation[] = [...DEMO_RECOMMENDATIONS];
  private alerts: Alert[] = [...DEMO_ALERTS];

  constructor() {
    const savedMode = localStorage.getItem('agro_iot_data_source');
    if (savedMode === 'empty' || savedMode === 'demo') {
      this.currentMode = savedMode;
    }
  }

  getMode(): 'demo' | 'empty' {
    return this.currentMode;
  }

  setMode(mode: 'demo' | 'empty') {
    this.currentMode = mode;
    localStorage.setItem('agro_iot_data_source', mode);
  }

  getFarm(): Farm | null {
    if (this.currentMode === 'empty') {
      return null;
    }
    return this.farms[0] || null;
  }

  getLiveReadings(): SensorReading[] {
    if (this.currentMode === 'empty') {
      return [];
    }
    return DEMO_READINGS;
  }

  getRecommendations(): Recommendation[] {
    if (this.currentMode === 'empty') {
      return [];
    }
    return this.recommendations;
  }

  getAlerts(): Alert[] {
    if (this.currentMode === 'empty') {
      return [];
    }
    return this.alerts;
  }

  acknowledgeAlert(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, status: 'acknowledged' as const } : a);
  }

  resolveAlert(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a);
  }

  applyRecommendation(id: string) {
    this.recommendations = this.recommendations.map(r => r.id === id ? { ...r, status: 'applied' as const } : r);
  }

  connectFarm(farmData: Partial<Farm>): Farm {
    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      name: farmData.name || 'New Connected Farm',
      farmerName: farmData.farmerName || 'Farmer Partner',
      phone: farmData.phone || '+91 9301929218',
      state: farmData.state || 'Punjab',
      district: farmData.district || 'Patiala',
      village: farmData.village || 'Khedi',
      totalAcres: farmData.totalAcres || 8,
      status: 'active',
      dataSource: 'demo',
      gatewayId: `AGRO-ESP32-${Math.floor(100 + Math.random() * 900)}`,
      batteryLevel: 98,
      signalStrength: 85,
      plots: [
        {
          id: `plot-${Date.now()}-1`,
          name: 'Main Connected Plot #1',
          sizeAcres: farmData.totalAcres || 8,
          cropName: 'Wheat (PBW-725)',
          sowingDate: new Date().toISOString().split('T')[0],
          cropStage: 'Vegetative',
          soilType: 'Loamy',
          irrigationType: 'Drip',
          sensorNodeId: 'NODE-ESP32-NEW',
          healthScore: 90,
        }
      ]
    };
    this.farms = [newFarm, ...this.farms];
    this.currentMode = 'demo';
    localStorage.setItem('agro_iot_data_source', 'demo');
    return newFarm;
  }

  addPlot(farmId: string, plot: Omit<FarmPlot, 'id' | 'sensorNodeId' | 'healthScore'>) {
    const target = this.farms.find(f => f.id === farmId);
    if (target) {
      const newPlot: FarmPlot = {
        ...plot,
        id: `plot-${Date.now()}`,
        sensorNodeId: `NODE-ESP32-${Math.floor(100 + Math.random() * 900)}`,
        healthScore: 85,
      };
      target.plots.push(newPlot);
      return newPlot;
    }
    return null;
  }
}

export const farmService = new FarmService();
