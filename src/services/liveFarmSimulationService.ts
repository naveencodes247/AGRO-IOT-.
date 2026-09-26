/**
 * AGRO-IOT Stateful Farm Simulation Engine
 * Models realistic agricultural physics, diurnal cycles, irrigation hydraulics,
 * and correlated sensor telemetry for the Command Center.
 * Clearly marked as DEMO SIMULATION.
 */

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
  gatewayStatus: 'Waiting for Hardware' | 'Demo Simulator Online';
  sensorMeshNodes: number;
  activeSensors: number;
  packetCount: number;
  lastPacketTimestamp: string;
  rssiSignalDbm: number;
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
  xPercent: number; // for map coordinate placement
  yPercent: number;
}

export interface FarmActivityEvent {
  id: string;
  time: string;
  category: 'sensor' | 'irrigation' | 'risk' | 'system' | 'crop';
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
}

export interface FarmRecommendationItem {
  id: string;
  title: string;
  reason: string;
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Irrigation' | 'Nutrient' | 'Scouting' | 'Protection';
}

export interface HistoryPoint {
  timeLabel: string;
  moisture: number;
  temperature: number;
  humidity: number;
  waterFlow: number;
}

export interface LiveFarmState {
  farmName: string;
  location: string;
  dataMode: 'DEMO SIMULATION';
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
}

class LiveFarmSimulationEngine {
  private state: LiveFarmState;
  private listeners: Set<(state: LiveFarmState) => void> = new Set();
  private timer: any = null;

  constructor() {
    this.state = this.createInitialState();
    this.startBackgroundCycle();
  }

  private createInitialState(): LiveFarmState {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const initialHistory: HistoryPoint[] = [
      { timeLabel: '02:00', moisture: 44.5, temperature: 27.2, humidity: 68, waterFlow: 0 },
      { timeLabel: '02:05', moisture: 44.1, temperature: 27.8, humidity: 67, waterFlow: 0 },
      { timeLabel: '02:10', moisture: 43.8, temperature: 28.5, humidity: 66, waterFlow: 0 },
      { timeLabel: '02:15', moisture: 43.4, temperature: 29.1, humidity: 65, waterFlow: 0 },
      { timeLabel: '02:20', moisture: 43.1, temperature: 29.8, humidity: 64, waterFlow: 0 },
      { timeLabel: '02:25', moisture: 42.8, temperature: 30.2, humidity: 63, waterFlow: 0 },
      { timeLabel: '02:30', moisture: 42.5, temperature: 30.4, humidity: 62, waterFlow: 0 },
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
        description: 'ESP32 simulated gateway packet handshake verified (RSSI -74 dBm).',
        severity: 'success',
      },
      {
        id: 'act-4',
        time: '02:18:50',
        category: 'irrigation',
        description: 'Auto-standby check: Solenoid Valve #1 closed. Zero line pressure loss.',
        severity: 'info',
      },
    ];

    return {
      farmName: 'Kisan Shanti Krishi Farm (किसान शांति कृषि फार्म)',
      location: 'Indore Malwa Agro-Climatic Zone, Madhya Pradesh (ICAR Zone VII)',
      dataMode: 'DEMO SIMULATION',
      isAutoUpdateEnabled: true,
      selectedPlotId: 'plot-uttar-1',
      soil: {
        moisture: 42.5,
        moistureTrend: 'falling',
        moistureDelta: -0.3,
        temperature: 27.4,
        ph: 6.7,
        ec: 0.82,
        nitrogen: 24,
        phosphorus: 10,
        potassium: 18,
        status: 'Normal',
      },
      environment: {
        temperature: 30.4,
        temperatureTrend: 'rising',
        temperatureDelta: 0.6,
        humidity: 62.0,
        humidityTrend: 'falling',
        humidityDelta: -1.2,
        pressure: 1012,
        lightLux: 48500,
        solarRadiation: 640,
        rainfallMm: 0.0,
        isRaining: false,
        windSpeedKmh: 8.4,
        windDirection: 'NE',
        timeOfDay: 'afternoon',
        environmentalRisk: 'Low',
        dewPoint: 22.1,
      },
      water: {
        tankLevelPercent: 74,
        flowRateLpm: 0,
        pumpActive: false,
        valveOpen: false,
        dailyUsageLitres: 1240,
        mode: 'AUTO',
        lastIrrigationTime: '06:15 AM today',
      },
      crop: {
        name: 'Soybean',
        variety: 'JS-335 (Certified Breeder Seed)',
        stage: 'Vegetative Growth (V4)',
        daysSown: 32,
        healthIndex: 94,
        overallCondition: 'Healthy',
        cropStress: 'Low',
        waterStress: 'Low',
        environmentalStress: 'Moderate',
        leafWetnessHours: 1.4,
        canopyTemp: 28.9,
        cameraStatus: 'Ready (Standby)',
      },
      system: {
        batteryPercent: 92,
        solarWatts: 14.8,
        gatewayStatus: 'Demo Simulator Online',
        sensorMeshNodes: 4,
        activeSensors: 12,
        packetCount: 148,
        lastPacketTimestamp: timeStr,
        rssiSignalDbm: -74,
      },
      plots: initialPlots,
      activities: initialActivities,
      alerts: [
        {
          id: 'alert-1',
          severity: 'warning',
          title: 'Plot B Soil Moisture Entering Attention Band',
          description: 'Plot B wheat field moisture is at 27.8%, nearing the 25% threshold.',
          time: '12 min ago',
          plotName: 'Poorvi Khet — Plot B (पूर्वी खेत)',
          action: 'Inspect lateral line or schedule 30m drip pulse.',
        },
      ],
      recommendations: [
        {
          id: 'rec-1',
          title: 'Maintain Current Irrigation Standby',
          reason: 'Primary root depth moisture is 42.5% (field capacity is 45%). Zero water deficit.',
          action: 'No manual intervention required today. Scout border rows for early aphid migration.',
          priority: 'Low',
          category: 'Irrigation',
        },
        {
          id: 'rec-2',
          title: 'Schedule Plot B Wheat Pre-Irrigation',
          reason: 'Moisture drift in Plot B indicates depletion within next 4 hours.',
          action: 'Enable Zone 2 automated solenoid relay prior to sunset.',
          priority: 'Medium',
          category: 'Irrigation',
        },
      ],
      history: initialHistory,
      overallFarmHealthScore: 74,
      overallHealthBreakdown: {
        soil: 86,
        water: 78,
        environment: 82,
        crop: 90,
        system: 94,
      },
    };
  }

  public getState(): LiveFarmState {
    return this.state;
  }

  public subscribe(listener: (state: LiveFarmState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.state));
  }

  private startBackgroundCycle() {
    // Light background tick every 6 seconds to update clock and simulate micro-movements
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.state.isAutoUpdateEnabled) {
        this.stepMicroSimulation();
      }
    }, 6000);
  }

  /**
   * Toggles simulated Irrigation ON or OFF.
   * Hydraulically correlated:
   * When ON: pump starts, valve opens, flow increases, tank level depletes,
   * soil moisture gradually increases, events are logged, and alerts resolve.
   */
  public toggleIrrigation(forcedState?: boolean) {
    const newState = forcedState !== undefined ? forcedState : !this.state.water.pumpActive;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (newState) {
      // Irrigation turning ON
      this.state.water.pumpActive = true;
      this.state.water.valveOpen = true;
      this.state.water.flowRateLpm = 18.5;
      this.state.water.lastIrrigationTime = nowTime;

      // Log activity
      this.logActivity(
        'irrigation',
        `Irrigation Pump engaged. Solenoid Valve #1 OPEN (Flow: 18.5 L/min).`,
        'success'
      );
    } else {
      // Irrigation turning OFF
      this.state.water.pumpActive = false;
      this.state.water.valveOpen = false;
      this.state.water.flowRateLpm = 0.0;

      this.logActivity(
        'irrigation',
        `Irrigation cycle completed. Solenoid Valve #1 CLOSED.`,
        'info'
      );
    }

    this.recalculateFarmStatus();
    this.notify();
  }

  /**
   * Toggles simulated Rain
   * Rain increases soil moisture, spikes humidity, and reduces irrigation need.
   */
  public toggleRain() {
    const newRain = !this.state.environment.isRaining;
    this.state.environment.isRaining = newRain;

    if (newRain) {
      this.state.environment.rainfallMm += 4.5;
      this.state.environment.humidity = Math.min(95, this.state.environment.humidity + 18);
      this.state.soil.moisture = Math.min(65, this.state.soil.moisture + 5.2);
      this.logActivity('sensor', `Precipitation sensor active: 4.5mm rain detected. Irrigation suspended.`, 'info');
    } else {
      this.logActivity('sensor', `Precipitation stopped. Atmospheric drainage resuming.`, 'info');
    }

    this.recalculateFarmStatus();
    this.notify();
  }

  /**
   * Sets Time of Day (morning, afternoon, evening, night)
   * Modulates temperature, humidity, solar charging, and light.
   */
  public setTimeOfDay(time: 'morning' | 'afternoon' | 'evening' | 'night') {
    this.state.environment.timeOfDay = time;
    switch (time) {
      case 'morning':
        this.state.environment.temperature = 25.4;
        this.state.environment.humidity = 76.0;
        this.state.environment.lightLux = 28000;
        this.state.system.solarWatts = 11.2;
        break;
      case 'afternoon':
        this.state.environment.temperature = 31.8;
        this.state.environment.humidity = 58.0;
        this.state.environment.lightLux = 62000;
        this.state.system.solarWatts = 18.5;
        break;
      case 'evening':
        this.state.environment.temperature = 26.2;
        this.state.environment.humidity = 70.0;
        this.state.environment.lightLux = 8500;
        this.state.system.solarWatts = 3.4;
        break;
      case 'night':
        this.state.environment.temperature = 21.0;
        this.state.environment.humidity = 84.0;
        this.state.environment.lightLux = 0;
        this.state.system.solarWatts = 0.0;
        break;
    }
    this.recalculateFarmStatus();
    this.notify();
  }

  /**
   * Selects a plot for detailed telemetry inspection
   */
  public selectPlot(plotId: string) {
    this.state.selectedPlotId = plotId;
    const plot = this.state.plots.find((p) => p.id === plotId);
    if (plot) {
      this.state.crop.name = plot.crop.split(' ')[0];
      this.state.crop.variety = plot.variety;
      this.state.soil.moisture = plot.soilMoisture;
      this.state.crop.healthIndex = plot.cropHealth;
      this.logActivity('crop', `Focus shifted to ${plot.name} (${plot.crop}).`, 'info');
    }
    this.notify();
  }

  /**
   * Performs the primary 2-minute cycle step
   * Evapotranspiration, soil moisture depletion, hydraulic drain,
   * and correlated temperature/humidity drifts.
   */
  public stepTelemetryCycle() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.state.system.packetCount += 1;
    this.state.system.lastPacketTimestamp = timeStr;

    // 1. Hydraulic response if irrigation is running
    if (this.state.water.pumpActive) {
      // Flow consumes water from tank
      this.state.water.tankLevelPercent = Math.max(10, Math.round(this.state.water.tankLevelPercent - 0.5));
      this.state.water.dailyUsageLitres += 37;
      // Moisture rises gradually
      const prevMoisture = this.state.soil.moisture;
      this.state.soil.moisture = Math.min(54.0, Number((this.state.soil.moisture + 0.6).toFixed(1)));
      this.state.soil.moistureDelta = Number((this.state.soil.moisture - prevMoisture).toFixed(1));
      this.state.soil.moistureTrend = 'rising';

      // Update plot moistures
      this.state.plots.forEach((p) => {
        p.soilMoisture = Math.min(58, Number((p.soilMoisture + 0.5).toFixed(1)));
        if (p.soilMoisture >= 30 && p.status === 'Attention') {
          p.status = 'Healthy';
          p.statusReason = 'Soil moisture restored by active irrigation.';
        }
      });
    } else {
      // Natural soil moisture depletion via evapotranspiration
      const prevMoisture = this.state.soil.moisture;
      const depletionRate = this.state.environment.temperature > 30 ? 0.2 : 0.1;
      this.state.soil.moisture = Math.max(22.0, Number((this.state.soil.moisture - depletionRate).toFixed(1)));
      this.state.soil.moistureDelta = Number((this.state.soil.moisture - prevMoisture).toFixed(1));
      this.state.soil.moistureTrend = this.state.soil.moistureDelta < 0 ? 'falling' : 'stable';

      // Plot depletion
      this.state.plots.forEach((p) => {
        p.soilMoisture = Math.max(20, Number((p.soilMoisture - 0.15).toFixed(1)));
        if (p.soilMoisture < 28 && p.status === 'Healthy') {
          p.status = 'Attention';
          p.statusReason = 'Soil moisture entering lower threshold (<28%).';
        }
      });
    }

    // 2. Microclimate natural drift
    const tempNoise = (Math.random() * 0.4 - 0.2);
    const prevTemp = this.state.environment.temperature;
    this.state.environment.temperature = Number((Math.max(22, Math.min(36, this.state.environment.temperature + tempNoise))).toFixed(1));
    this.state.environment.temperatureDelta = Number((this.state.environment.temperature - prevTemp).toFixed(1));
    this.state.environment.temperatureTrend = this.state.environment.temperatureDelta > 0 ? 'rising' : 'falling';

    // Humidity negatively correlates with temperature
    const humidityDelta = -tempNoise * 2.5;
    this.state.environment.humidity = Number((Math.max(45, Math.min(85, this.state.environment.humidity + humidityDelta))).toFixed(0));

    // 3. Soil temperature lags air temperature
    this.state.soil.temperature = Number((this.state.environment.temperature * 0.85 + 2.5).toFixed(1));

    // 4. Update History buffer (keeps 8 recent points)
    this.state.history.push({
      timeLabel,
      moisture: this.state.soil.moisture,
      temperature: this.state.environment.temperature,
      humidity: this.state.environment.humidity,
      waterFlow: this.state.water.flowRateLpm,
    });
    if (this.state.history.length > 8) {
      this.state.history.shift();
    }

    // 5. Log activity
    this.logActivity(
      'sensor',
      `Telemetry Cycle #${this.state.system.packetCount}: Moisture ${this.state.soil.moisture}%, Temp ${this.state.environment.temperature}°C.`,
      'info'
    );

    this.recalculateFarmStatus();
    this.notify();
  }

  /**
   * Micro simulation step between full cycles
   */
  private stepMicroSimulation() {
    // Battery micro drain or solar charge
    if (this.state.system.solarWatts > 5) {
      this.state.system.batteryPercent = Math.min(100, this.state.system.batteryPercent + 0.1);
    } else {
      this.state.system.batteryPercent = Math.max(30, this.state.system.batteryPercent - 0.05);
    }

    // If pump is active, increment usage
    if (this.state.water.pumpActive) {
      this.state.water.dailyUsageLitres += 2;
    }
  }

  private recalculateFarmStatus() {
    const moisture = this.state.soil.moisture;
    const temp = this.state.environment.temperature;

    // Soil status
    if (moisture < 25) {
      this.state.soil.status = 'Deficit';
      this.state.crop.waterStress = 'Severe';
      this.state.crop.overallCondition = 'Attention';
    } else if (moisture > 52) {
      this.state.soil.status = 'Saturated';
      this.state.crop.waterStress = 'Low';
    } else {
      this.state.soil.status = 'Normal';
      this.state.crop.waterStress = 'Low';
      this.state.crop.overallCondition = 'Healthy';
    }

    // Environmental risk
    if (temp > 34) {
      this.state.environment.environmentalRisk = 'High';
      this.state.crop.environmentalStress = 'High';
    } else if (temp > 31 || this.state.environment.humidity > 80) {
      this.state.environment.environmentalRisk = 'Moderate';
      this.state.crop.environmentalStress = 'Moderate';
    } else {
      this.state.environment.environmentalRisk = 'Low';
      this.state.crop.environmentalStress = 'Low';
    }

    // Recalculate health index
    const soilScore = Math.max(50, Math.min(100, Math.round(moisture * 1.9)));
    const waterScore = Math.round(this.state.water.tankLevelPercent * 0.9);
    const envScore = temp > 33 ? 65 : 88;
    const cropScore = this.state.crop.waterStress === 'Severe' ? 70 : 94;
    const sysScore = Math.round(this.state.system.batteryPercent);

    this.state.overallHealthBreakdown = {
      soil: soilScore,
      water: waterScore,
      environment: envScore,
      crop: cropScore,
      system: sysScore,
    };

    this.state.overallFarmHealthScore = Math.round(
      (soilScore * 0.3 + waterScore * 0.2 + envScore * 0.2 + cropScore * 0.2 + sysScore * 0.1)
    );

    // Alerts generation
    const newAlerts: FarmAlertItem[] = [];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (this.state.soil.moisture < 26) {
      newAlerts.push({
        id: 'alt-moisture-crit',
        severity: 'critical',
        title: 'Critical Soil Moisture Deficit',
        description: `Soil moisture at ${this.state.soil.moisture}%, entering permanent wilting risk.`,
        time: nowTime,
        plotName: 'Plot A — North Sector',
        action: 'Trigger irrigation pump immediately.',
      });
    }

    if (this.state.environment.temperature > 34) {
      newAlerts.push({
        id: 'alt-heatwave',
        severity: 'warning',
        title: 'Elevated Canopy Thermal Stress',
        description: `Ambient temp ${this.state.environment.temperature}°C with high VPD.`,
        time: nowTime,
        plotName: 'All Plots',
        action: 'Schedule light afternoon misting.',
      });
    }

    if (this.state.water.tankLevelPercent < 20) {
      newAlerts.push({
        id: 'alt-tank-low',
        severity: 'critical',
        title: 'Irrigation Header Tank Depleted',
        description: `Tank level has dropped to ${this.state.water.tankLevelPercent}%.`,
        time: nowTime,
        plotName: 'Central Manifold',
        action: 'Check borehole refill pump.',
      });
    }

    this.state.alerts = newAlerts;

    // Recommendations generation
    const newRecs: FarmRecommendationItem[] = [];
    if (this.state.soil.moisture < 30 && !this.state.water.pumpActive) {
      newRecs.push({
        id: 'rec-water-needed',
        title: 'Engage Zone 1 Drip Cycle',
        reason: `Soil moisture is at ${this.state.soil.moisture}% (recommended band: 38-48%).`,
        action: 'Switch Irrigation Mode to ON or verify scheduled cycle.',
        priority: 'High',
        category: 'Irrigation',
      });
    } else if (this.state.water.pumpActive) {
      newRecs.push({
        id: 'rec-water-active',
        title: 'Irrigation Currently Active',
        reason: `Pump discharging at ${this.state.water.flowRateLpm} L/min. Soil moisture is rising.`,
        action: 'Disengage pump once moisture passes 44% to avoid root anaerobiosis.',
        priority: 'Low',
        category: 'Irrigation',
      });
    } else {
      newRecs.push({
        id: 'rec-optimal-standing',
        title: 'Optimal Field Growth Window',
        reason: 'Root hydration, soil respiration, and ambient temperature are well balanced.',
        action: 'Maintain automated sensor logging and conduct routine physical leaf scouting.',
        priority: 'Low',
        category: 'Scouting',
      });
    }
    this.state.recommendations = newRecs;
  }

  private logActivity(
    category: 'sensor' | 'irrigation' | 'risk' | 'system' | 'crop',
    description: string,
    severity: 'info' | 'warning' | 'alert' | 'success'
  ) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.state.activities.unshift({
      id: `act-${Date.now()}`,
      time,
      category,
      description,
      severity,
    });
    if (this.state.activities.length > 20) {
      this.state.activities.pop();
    }
  }
}

export const liveFarmSimulation = new LiveFarmSimulationEngine();
