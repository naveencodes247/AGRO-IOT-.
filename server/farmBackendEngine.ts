import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'farm_database.json');

export interface SoilTelemetry {
  moisture: number; // % VWC
  moistureTrend: 'rising' | 'falling' | 'stable';
  moistureDelta: number;
  temperature: number; // °C
  ph: number;
  ec: number; // mS/cm
  nitrogen: number; // ppm
  phosphorus: number; // ppm
  potassium: number; // ppm
  status: 'Optimal' | 'Normal' | 'Deficit' | 'Saturated';
}

export interface EnvironmentTelemetry {
  temperature: number; // °C
  temperatureTrend: 'rising' | 'falling' | 'stable';
  temperatureDelta: number;
  humidity: number; // %
  humidityTrend: 'rising' | 'falling' | 'stable';
  humidityDelta: number;
  pressure: number; // hPa
  lightLux: number; // Lux
  solarRadiation: number; // W/m²
  rainfallMm: number; // mm today
  isRaining: boolean;
  windSpeedKmh: number; // km/h
  windDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  environmentalRisk: 'Low' | 'Moderate' | 'High';
  dewPoint: number; // °C
}

export interface WaterTelemetry {
  tankLevelPercent: number; // %
  flowRateLpm: number; // Litres per minute
  pumpActive: boolean;
  valveOpen: boolean;
  dailyUsageLitres: number;
  mode: 'AUTO' | 'MANUAL' | 'SCHEDULED';
  lastIrrigationTime: string;
}

export interface CropTelemetry {
  name: string;
  variety: string;
  stage: string;
  daysSown: number;
  healthIndex: number; // 0 - 100
  overallCondition: 'Healthy' | 'Attention' | 'Critical';
  cropStress: 'Low' | 'Moderate' | 'High';
  waterStress: 'Low' | 'Moderate' | 'Severe';
  environmentalStress: 'Low' | 'Moderate' | 'High';
  leafWetnessHours: number;
  canopyTemp: number; // °C
  cameraStatus: 'Ready (Standby)' | 'Scanning' | 'Offline';
}

export interface SystemDeviceTelemetry {
  batteryPercent: number;
  solarWatts: number;
  gatewayStatus: 'Connected (Live Backend)' | 'Demo Simulation Online' | 'Hardware Synced';
  sensorMeshNodes: number;
  activeSensors: number;
  packetCount: number;
  lastPacketTimestamp: string;
  rssiSignalDbm: number;
  hardwareDeviceName?: string;
}

export interface FarmPlotModel {
  id: string;
  name: string;
  crop: string;
  variety: string;
  areaHa: number;
  soilMoisture: number;
  cropHealth: number;
  temperature: number;
  status: 'Healthy' | 'Attention' | 'Critical';
  statusReason: string;
  xPercent: number;
  yPercent: number;
}

export interface FarmActivityEvent {
  id: string;
  time: string;
  category: 'sensor' | 'irrigation' | 'risk' | 'system' | 'crop' | 'auth';
  description: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}

export interface FarmAlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
  plotName: string;
  action: string;
  resolved?: boolean;
  acknowledged?: boolean;
}

export interface FarmRecommendationItem {
  id: string;
  title: string;
  reason: string;
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Irrigation' | 'Nutrient' | 'Scouting' | 'Protection';
  applied?: boolean;
}

export interface HistoryPoint {
  timeLabel: string;
  moisture: number;
  temperature: number;
  humidity: number;
  waterFlow: number;
  solarRadiation?: number;
  battery?: number;
}

export interface BackendFarmState {
  farmName: string;
  location: string;
  dataMode: 'DEMO SIMULATION' | 'LIVE HARDWARE' | 'BACKEND HYBRID';
  isAutoUpdateEnabled: boolean;
  selectedPlotId: string;
  soil: SoilTelemetry;
  environment: EnvironmentTelemetry;
  water: WaterTelemetry;
  crop: CropTelemetry;
  system: SystemDeviceTelemetry;
  plots: FarmPlotModel[];
  activities: FarmActivityEvent[];
  alerts: FarmAlertItem[];
  recommendations: FarmRecommendationItem[];
  history: HistoryPoint[];
  overallFarmHealthScore: number;
  overallHealthBreakdown: {
    soil: number;
    water: number;
    environment: number;
    crop: number;
    system: number;
  };
  serverStats: {
    startedAt: string;
    lastCycleAt: string;
    totalCyclesRun: number;
    packetsIngested: number;
    backendEngine: string;
    persistence: string;
  };
}

export interface HardwareIngestionPayload {
  deviceId: string;
  apiKey?: string;
  plotId?: string;
  moisture?: number;
  temperature?: number;
  humidity?: number;
  ph?: number;
  ec?: number;
  flowRate?: number;
  battery?: number;
  solarWatts?: number;
  rawPayload?: any;
}

export class FarmBackendEngine {
  private state: BackendFarmState;
  private intervalTimer: NodeJS.Timeout | null = null;
  private autoCycleSeconds: number = 120; // 2 minutes as requested

  constructor() {
    this.ensureStorage();
    this.state = this.loadStateFromDisk();
    this.startBackgroundCycle();
  }

  private ensureStorage() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.error('[Backend Engine] Failed to create data dir:', err);
    }
  }

  private loadStateFromDisk(): BackendFarmState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log('[Backend Engine] Loaded existing farm state from disk:', DB_FILE);
        return parsed;
      }
    } catch (err) {
      console.warn('[Backend Engine] Disk load error, initializing default state:', err);
    }
    const initial = this.createDefaultState();
    this.saveStateToDisk(initial);
    return initial;
  }

  private saveStateToDisk(stateToSave: BackendFarmState = this.state) {
    try {
      this.ensureStorage();
      fs.writeFileSync(DB_FILE, JSON.stringify(stateToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Backend Engine] Error persisting farm database to disk:', err);
    }
  }

  private createDefaultState(): BackendFarmState {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const initialHistory: HistoryPoint[] = [
      { timeLabel: '02:00', moisture: 44.5, temperature: 27.2, humidity: 68, waterFlow: 0, solarRadiation: 580, battery: 96 },
      { timeLabel: '02:05', moisture: 44.1, temperature: 27.8, humidity: 67, waterFlow: 0, solarRadiation: 610, battery: 96 },
      { timeLabel: '02:10', moisture: 43.8, temperature: 28.5, humidity: 66, waterFlow: 0, solarRadiation: 640, battery: 95 },
      { timeLabel: '02:15', moisture: 43.4, temperature: 29.1, humidity: 65, waterFlow: 0, solarRadiation: 670, battery: 95 },
      { timeLabel: '02:20', moisture: 43.1, temperature: 29.8, humidity: 64, waterFlow: 0, solarRadiation: 695, battery: 94 },
      { timeLabel: '02:25', moisture: 42.8, temperature: 30.2, humidity: 63, waterFlow: 0, solarRadiation: 710, battery: 94 },
      { timeLabel: '02:30', moisture: 42.5, temperature: 30.4, humidity: 62, waterFlow: 0, solarRadiation: 720, battery: 93 },
    ];

    const initialPlots: FarmPlotModel[] = [
      {
        id: 'plot-uttar-1',
        name: 'Uttari Khet — Plot A (उत्तरी खेत)',
        crop: 'Soybean (JS-335 / सोयाबीन)',
        variety: 'Certified Breeder Seed (ICAR-IISR)',
        areaHa: 1.8,
        soilMoisture: 42.5,
        cropHealth: 95,
        temperature: 30.4,
        status: 'Healthy',
        statusReason: 'Soil moisture & chlorophyll index optimal. No water stress.',
        xPercent: 32,
        yPercent: 44,
      },
      {
        id: 'plot-poorv-2',
        name: 'Poorvi Khet — Plot B (पूर्वी खेत)',
        crop: 'Wheat (HD-3086 / गेंहू)',
        variety: 'Pusa Gautami Cereal Grain',
        areaHa: 2.1,
        soilMoisture: 27.8,
        cropHealth: 78,
        temperature: 31.6,
        status: 'Attention',
        statusReason: 'Moisture entering lower threshold (<28%). Scheduled evening drip pulse.',
        xPercent: 74,
        yPercent: 28,
      },
      {
        id: 'plot-dakshin-3',
        name: 'Dakshini Baag — Plot C (दक्षिणी बाग)',
        crop: 'Tomato (Pusa Ruby / टमाटर)',
        variety: 'High Yield Solanaceous Fruit',
        areaHa: 1.1,
        soilMoisture: 51.2,
        cropHealth: 92,
        temperature: 29.8,
        status: 'Healthy',
        statusReason: 'Flowering cluster uniform. Drip lines in standby.',
        xPercent: 68,
        yPercent: 74,
      },
      {
        id: 'plot-nehar-4',
        name: 'Nehar Block — Plot D (नहर ब्लॉक)',
        crop: 'Mustard (Giriraj / सरसों)',
        variety: 'DRMRIJ-31 Oilseed',
        areaHa: 0.8,
        soilMoisture: 44.0,
        cropHealth: 91,
        temperature: 28.5,
        status: 'Healthy',
        statusReason: 'Pod formation stage. Nitrogen profile optimal.',
        xPercent: 24,
        yPercent: 78,
      },
    ];

    const initialActivities: FarmActivityEvent[] = [
      {
        id: 'act-1',
        time: timeStr,
        category: 'sensor',
        description: 'Uttari Khet soil moisture synced to 42.5% VWC via LoRa Node-01.',
        severity: 'info',
      },
      {
        id: 'act-2',
        time: '02:28:14',
        category: 'risk',
        description: 'Microclimate environmental risk calculated as Low (VPD: 1.12 kPa).',
        severity: 'info',
      },
      {
        id: 'act-3',
        time: '02:24:00',
        category: 'system',
        description: 'Node.js Express backend initialized with disk persistence (JSON DB).',
        severity: 'success',
      },
      {
        id: 'act-4',
        time: '02:18:50',
        category: 'irrigation',
        description: 'Irrigation pump standby verified. Main tank reservoir at 72%.',
        severity: 'info',
      },
      {
        id: 'act-5',
        time: '02:10:00',
        category: 'crop',
        description: 'Vegetative canopy scan confirmed healthy chlorophyll SPAD reading.',
        severity: 'success',
      },
    ];

    const initialAlerts: FarmAlertItem[] = [
      {
        id: 'alert-1',
        severity: 'warning',
        title: 'Depleting Moisture in Eastern Plot B',
        description: 'Poorvi Khet moisture dropped to 27.8% VWC. Drip irrigation recommended within 3 hours.',
        time: '24 min ago',
        plotName: 'Poorvi Khet — Plot B',
        action: 'Schedule 25 min Drip Pulse',
        resolved: false,
        acknowledged: false,
      },
      {
        id: 'alert-2',
        severity: 'info',
        title: 'Microclimatic Dew Point Window Approaching',
        description: 'Canopy temperature and humidity favorable for foliar spore germination between 04:00 - 06:00 AM.',
        time: '48 min ago',
        plotName: 'All Farmland Sectors',
        action: 'Inspect Leaf Wetness Sensor',
        resolved: false,
        acknowledged: true,
      },
    ];

    const initialRecommendations: FarmRecommendationItem[] = [
      {
        id: 'rec-1',
        title: 'Postpone Overhead Spray due to Afternoon Wind',
        reason: 'Wind velocity at 8.4 km/h with gusts up to 14 km/h causes pesticide drift away from targeted canopy.',
        action: 'Schedule foliar application for early morning (06:30 AM).',
        priority: 'Medium',
        category: 'Protection',
        applied: false,
      },
      {
        id: 'rec-2',
        title: 'Activate Drip Sector 2 for Wheat Crown Rooting',
        reason: 'Poorvi Khet root zone moisture is approaching critical wilt threshold of 25%.',
        action: 'Run 450L drip pulse via Solar Pump #1.',
        priority: 'High',
        category: 'Irrigation',
        applied: false,
      },
      {
        id: 'rec-3',
        title: 'Soil Potassium Supplement for Pod Filling',
        reason: 'Soil test shows Potassium at 18 ppm, slightly below optimum 22 ppm for Mustard pod firmness.',
        action: 'Apply Sulphate of Potash (SOP 0-0-50) via fertigation tank.',
        priority: 'Medium',
        category: 'Nutrient',
        applied: false,
      },
    ];

    return {
      farmName: 'Kisan Shanti Krishi Farm (किसान शांति कृषि फार्म)',
      location: 'Indore, Madhya Pradesh • Malwa Region',
      dataMode: 'DEMO SIMULATION',
      isAutoUpdateEnabled: true,
      selectedPlotId: 'plot-uttar-1',
      soil: {
        moisture: 42.5,
        moistureTrend: 'falling',
        moistureDelta: -0.3,
        temperature: 27.3,
        ph: 6.7,
        ec: 0.82,
        nitrogen: 24,
        phosphorus: 10,
        potassium: 18,
        status: 'Optimal',
      },
      environment: {
        temperature: 30.4,
        temperatureTrend: 'rising',
        temperatureDelta: 0.2,
        humidity: 64,
        humidityTrend: 'falling',
        humidityDelta: -1.0,
        pressure: 1012,
        lightLux: 68500,
        solarRadiation: 720,
        rainfallMm: 0,
        isRaining: false,
        windSpeedKmh: 8.4,
        windDirection: 'NE',
        timeOfDay: 'afternoon',
        environmentalRisk: 'Low',
        dewPoint: 22.4,
      },
      water: {
        tankLevelPercent: 72,
        flowRateLpm: 0,
        pumpActive: false,
        valveOpen: false,
        dailyUsageLitres: 1240,
        mode: 'AUTO',
        lastIrrigationTime: 'Today, 06:30 AM (Morning Pulse)',
      },
      crop: {
        name: 'Soybean (सोयाबीन)',
        variety: 'JS-335 Certified High Yield',
        stage: 'Vegetative (V4 Leaf Expansion)',
        daysSown: 38,
        healthIndex: 95,
        overallCondition: 'Healthy',
        cropStress: 'Low',
        waterStress: 'Low',
        environmentalStress: 'Low',
        leafWetnessHours: 1.2,
        canopyTemp: 28.9,
        cameraStatus: 'Ready (Standby)',
      },
      system: {
        batteryPercent: 93,
        solarWatts: 720,
        gatewayStatus: 'Connected (Live Backend)',
        sensorMeshNodes: 4,
        activeSensors: 14,
        packetCount: 1420,
        lastPacketTimestamp: 'Just now',
        rssiSignalDbm: -72,
        hardwareDeviceName: 'AGRO-NODE-ESP32-CORE',
      },
      plots: initialPlots,
      activities: initialActivities,
      alerts: initialAlerts,
      recommendations: initialRecommendations,
      history: initialHistory,
      overallFarmHealthScore: 92,
      overallHealthBreakdown: {
        soil: 94,
        water: 88,
        environment: 95,
        crop: 95,
        system: 98,
      },
      serverStats: {
        startedAt: now.toISOString(),
        lastCycleAt: now.toISOString(),
        totalCyclesRun: 0,
        packetsIngested: 0,
        backendEngine: 'Node.js Express Full-Stack Server',
        persistence: 'Atomic JSON Store (data/farm_database.json)',
      },
    };
  }

  private startBackgroundCycle() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
    }
    // Run authoritative physics cycle every 2 minutes
    this.intervalTimer = setInterval(() => {
      if (this.state.isAutoUpdateEnabled) {
        this.stepTelemetryCycle('cron');
      }
    }, this.autoCycleSeconds * 1000);
  }

  public getState(): BackendFarmState {
    return this.state;
  }

  public stepTelemetryCycle(source: 'cron' | 'manual' | 'hardware' = 'cron'): BackendFarmState {
    const s = this.state;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Physics step
    const tempNoise = (Math.random() - 0.48) * 0.4;
    const humNoise = (Math.random() - 0.52) * 0.8;
    const newTemp = Math.max(18, Math.min(42, Number((s.environment.temperature + tempNoise).toFixed(1))));
    const newHum = Math.max(25, Math.min(95, Math.round(s.environment.humidity + humNoise)));

    let newMoisture = s.soil.moisture;
    let newTankLevel = s.water.tankLevelPercent;
    let newDailyUsage = s.water.dailyUsageLitres;
    let newFlowRate = s.water.flowRateLpm;

    if (s.water.pumpActive) {
      // Pump is on: moisture goes up, tank drains, usage increases
      newFlowRate = 18.5 + (Math.random() - 0.5) * 1.5;
      newMoisture = Math.min(68, Number((newMoisture + 0.35).toFixed(1)));
      newTankLevel = Math.max(5, Number((newTankLevel - 0.15).toFixed(1)));
      newDailyUsage = Math.round(newDailyUsage + 37);
    } else {
      // Pump off: gradual moisture drainage
      newFlowRate = 0;
      const moistureLoss = 0.1 + (newTemp > 32 ? 0.15 : 0.05);
      newMoisture = Math.max(18, Number((newMoisture - moistureLoss).toFixed(1)));
    }

    const moistureDelta = Number((newMoisture - s.soil.moisture).toFixed(2));
    const moistureTrend = moistureDelta > 0.05 ? 'rising' : moistureDelta < -0.05 ? 'falling' : 'stable';
    const temperatureDelta = Number((newTemp - s.environment.temperature).toFixed(1));
    const temperatureTrend = temperatureDelta > 0.1 ? 'rising' : temperatureDelta < -0.1 ? 'falling' : 'stable';
    const humidityDelta = Number((newHum - s.environment.humidity).toFixed(1));
    const humidityTrend = humidityDelta > 0.5 ? 'rising' : humidityDelta < -0.5 ? 'falling' : 'stable';

    // Correlated solar & battery
    const solarWatts = Math.round(Math.max(0, Math.min(980, 720 + (Math.random() - 0.5) * 40)));
    const batteryPercent = Math.max(20, Math.min(100, Math.round(s.system.batteryPercent + (solarWatts > 400 ? 0.1 : -0.1))));

    // Append history point
    const newHistory: HistoryPoint[] = [
      ...s.history.slice(-11),
      {
        timeLabel: timeStr,
        moisture: newMoisture,
        temperature: newTemp,
        humidity: newHum,
        waterFlow: Math.round(newFlowRate),
        solarRadiation: solarWatts,
        battery: batteryPercent,
      },
    ];

    // Selected plot update
    const updatedPlots = s.plots.map((p) => {
      if (p.id === s.selectedPlotId) {
        return {
          ...p,
          soilMoisture: newMoisture,
          temperature: newTemp,
          status: newMoisture < 28 ? ('Attention' as const) : newMoisture < 22 ? ('Critical' as const) : ('Healthy' as const),
        };
      }
      return p;
    });

    // Activity log entry
    const newActivity: FarmActivityEvent = {
      id: `act-${Date.now()}`,
      time: timeStr,
      category: s.water.pumpActive ? 'irrigation' : 'sensor',
      description: s.water.pumpActive
        ? `Hydraulic pulse active: 18.5 L/min delivered to ${s.plots.find((p) => p.id === s.selectedPlotId)?.name || 'active plot'}. Moisture at ${newMoisture}%.`
        : `Backend cycle executed (${source}): Soil moisture ${newMoisture}%, Ambient ${newTemp}°C, RH ${newHum}%.`,
      severity: newMoisture < 28 ? 'warning' : 'info',
    };

    const newActivities = [newActivity, ...s.activities.slice(0, 19)];

    this.state = {
      ...s,
      soil: {
        ...s.soil,
        moisture: newMoisture,
        moistureTrend,
        moistureDelta,
        temperature: Number((s.soil.temperature + (newTemp > s.soil.temperature ? 0.1 : -0.1)).toFixed(1)),
        status: newMoisture < 25 ? 'Deficit' : newMoisture > 55 ? 'Saturated' : 'Optimal',
      },
      environment: {
        ...s.environment,
        temperature: newTemp,
        temperatureTrend,
        temperatureDelta,
        humidity: newHum,
        humidityTrend,
        humidityDelta,
        solarRadiation: solarWatts,
        environmentalRisk: newTemp > 38 || newHum < 30 ? 'High' : newTemp > 33 || newHum > 85 ? 'Moderate' : 'Low',
      },
      water: {
        ...s.water,
        flowRateLpm: Number(newFlowRate.toFixed(1)),
        tankLevelPercent: newTankLevel,
        dailyUsageLitres: newDailyUsage,
      },
      system: {
        ...s.system,
        batteryPercent,
        solarWatts,
        packetCount: s.system.packetCount + 1,
        lastPacketTimestamp: 'Just now',
      },
      plots: updatedPlots,
      activities: newActivities,
      history: newHistory,
      serverStats: {
        ...s.serverStats,
        lastCycleAt: now.toISOString(),
        totalCyclesRun: s.serverStats.totalCyclesRun + 1,
      },
    };

    this.saveStateToDisk();
    return this.state;
  }

  public toggleIrrigation(params: {
    pumpActive?: boolean;
    valveOpen?: boolean;
    mode?: 'AUTO' | 'MANUAL' | 'SCHEDULED';
  }): BackendFarmState {
    const s = this.state;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPumpState = params.pumpActive !== undefined ? params.pumpActive : !s.water.pumpActive;
    const newValveState = params.valveOpen !== undefined ? params.valveOpen : newPumpState;
    const newMode = params.mode || s.water.mode;

    const activity: FarmActivityEvent = {
      id: `act-irrig-${Date.now()}`,
      time: timeStr,
      category: 'irrigation',
      description: newPumpState
        ? `Farmer activated irrigation pump (Solar Pump #1). Valve OPEN. Flow rate stabilizing at 18.5 L/min.`
        : `Irrigation pump shut down by command. Valve CLOSED. Line depressurized.`,
      severity: newPumpState ? 'success' : 'info',
    };

    this.state = {
      ...s,
      water: {
        ...s.water,
        pumpActive: newPumpState,
        valveOpen: newValveState,
        mode: newMode,
        flowRateLpm: newPumpState ? 18.5 : 0,
        lastIrrigationTime: newPumpState
          ? `Active Now (${timeStr})`
          : `Completed today at ${timeStr}`,
      },
      activities: [activity, ...s.activities.slice(0, 19)],
    };

    // Step cycle immediately to reflect hydraulic change
    this.stepTelemetryCycle('manual');
    return this.state;
  }

  public selectPlot(plotId: string): BackendFarmState {
    const found = this.state.plots.find((p) => p.id === plotId);
    if (!found) return this.state;

    const activity: FarmActivityEvent = {
      id: `act-plot-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'system',
      description: `Active monitoring plot switched to ${found.name}. Calibrating sensor mesh Node-${plotId.slice(-1)}.`,
      severity: 'info',
    };

    this.state = {
      ...this.state,
      selectedPlotId: plotId,
      soil: {
        ...this.state.soil,
        moisture: found.soilMoisture,
      },
      crop: {
        ...this.state.crop,
        name: found.crop.split('(')[0].trim(),
        variety: found.variety,
        healthIndex: found.cropHealth,
      },
      activities: [activity, ...this.state.activities.slice(0, 19)],
    };

    this.saveStateToDisk();
    return this.state;
  }

  public ingestHardwareTelemetry(payload: HardwareIngestionPayload): BackendFarmState {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const s = this.state;
    const newMoisture = payload.moisture !== undefined ? Number(payload.moisture.toFixed(1)) : s.soil.moisture;
    const newTemp = payload.temperature !== undefined ? Number(payload.temperature.toFixed(1)) : s.environment.temperature;
    const newHum = payload.humidity !== undefined ? Math.round(payload.humidity) : s.environment.humidity;
    const newPh = payload.ph !== undefined ? Number(payload.ph.toFixed(2)) : s.soil.ph;
    const newEc = payload.ec !== undefined ? Number(payload.ec.toFixed(2)) : s.soil.ec;
    const newBattery = payload.battery !== undefined ? Math.round(payload.battery) : s.system.batteryPercent;

    const activity: FarmActivityEvent = {
      id: `act-hw-${Date.now()}`,
      time: timeStr,
      category: 'sensor',
      description: `Hardware ingestion: Ingested packet from node "${payload.deviceId}" (Moisture: ${newMoisture}%, Temp: ${newTemp}°C, pH: ${newPh}).`,
      severity: 'success',
    };

    this.state = {
      ...s,
      dataMode: 'LIVE HARDWARE',
      soil: {
        ...s.soil,
        moisture: newMoisture,
        temperature: newTemp,
        ph: newPh,
        ec: newEc,
      },
      environment: {
        ...s.environment,
        temperature: newTemp,
        humidity: newHum,
      },
      system: {
        ...s.system,
        batteryPercent: newBattery,
        gatewayStatus: 'Connected (Live Backend)',
        packetCount: s.system.packetCount + 1,
        lastPacketTimestamp: timeStr,
        hardwareDeviceName: payload.deviceId,
      },
      activities: [activity, ...s.activities.slice(0, 19)],
      serverStats: {
        ...s.serverStats,
        packetsIngested: s.serverStats.packetsIngested + 1,
      },
    };

    this.saveStateToDisk();
    return this.state;
  }

  public resolveAlert(alertId: string, note?: string): BackendFarmState {
    const s = this.state;
    const alert = s.alerts.find((a) => a.id === alertId);
    const updatedAlerts = s.alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, resolved: true, acknowledged: true };
      }
      return a;
    });

    const activity: FarmActivityEvent = {
      id: `act-alert-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'risk',
      description: `Alert marked as resolved: "${alert?.title || alertId}". ${note || 'Agronomic condition verified.'}`,
      severity: 'success',
    };

    this.state = {
      ...s,
      alerts: updatedAlerts,
      activities: [activity, ...s.activities.slice(0, 19)],
    };

    this.saveStateToDisk();
    return this.state;
  }

  public acknowledgeAlert(alertId: string): BackendFarmState {
    const s = this.state;
    const updatedAlerts = s.alerts.map((a) => {
      if (a.id === alertId) {
        return { ...a, acknowledged: true };
      }
      return a;
    });

    this.state = {
      ...s,
      alerts: updatedAlerts,
    };

    this.saveStateToDisk();
    return this.state;
  }

  public applyRecommendation(recId: string): BackendFarmState {
    const s = this.state;
    const rec = s.recommendations.find((r) => r.id === recId);
    const updatedRecs = s.recommendations.map((r) => {
      if (r.id === recId) {
        return { ...r, applied: true };
      }
      return r;
    });

    const activity: FarmActivityEvent = {
      id: `act-rec-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'crop',
      description: `Farmer executed recommendation: "${rec?.title || recId}" (${rec?.action || 'Action logged'}).`,
      severity: 'success',
    };

    this.state = {
      ...s,
      recommendations: updatedRecs,
      activities: [activity, ...s.activities.slice(0, 19)],
    };

    this.saveStateToDisk();
    return this.state;
  }
}

export const farmBackendEngine = new FarmBackendEngine();
