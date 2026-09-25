import { EnvironmentalRisk, SimulationScenario } from '../types';

export interface ScenarioTelemetry {
  cropHealth: number;
  cropHealthStatus: string;
  soilMoisture: number;
  soilMoistureStatus: string;
  temperature: number;
  temperatureStatus: string;
  humidity: number;
  humidityStatus: string;
  rainProbability: number;
  rainForecast: string;
  irrigationStatus: string;
  valveState: 'OPEN' | 'CLOSED' | 'PULSE';
  risks: EnvironmentalRisk;
  advisory: {
    title: string;
    why: string;
    actionPlan: string[];
    priority: 'Informational' | 'Warning' | 'High' | 'Critical';
  };
}

export const SCENARIO_DATA: Record<SimulationScenario, ScenarioTelemetry> = {
  normal: {
    cropHealth: 95,
    cropHealthStatus: 'Optimal',
    soilMoisture: 58.7,
    soilMoistureStatus: 'Optimal',
    temperature: 26.7,
    temperatureStatus: 'Normal',
    humidity: 64.1,
    humidityStatus: 'Normal',
    rainProbability: 15,
    rainForecast: 'Dry',
    irrigationStatus: 'Optimal',
    valveState: 'CLOSED',
    risks: {
      diseaseRisk: 'Low',
      pestRisk: 'Low',
      heatStress: 'Low',
      waterStress: 'Low',
      floodRisk: 'Low',
    },
    advisory: {
      title: 'Optimal Field Growth Conditions',
      why: 'Soil moisture (58.7%), temperature (26.7°C), and humidity (64.1%) are well balanced.',
      actionPlan: [
        'Maintain routine daily scouting and automated sensor telemetry logging.',
        'Keep drip lines in auto-standby mode.',
        'Record any visual changes or flower counts via the Crop Scan tool.',
      ],
      priority: 'Informational',
    },
  },

  water_stress: {
    cropHealth: 72,
    cropHealthStatus: 'Warning',
    soilMoisture: 18.4,
    soilMoistureStatus: 'Deficit',
    temperature: 33.2,
    temperatureStatus: 'Elevated',
    humidity: 34.5,
    humidityStatus: 'Low RH',
    rainProbability: 5,
    rainForecast: 'Dry / Clear',
    irrigationStatus: 'Deficit Alert',
    valveState: 'OPEN',
    risks: {
      diseaseRisk: 'Low',
      pestRisk: 'Moderate',
      heatStress: 'Moderate',
      waterStress: 'Severe',
      floodRisk: 'Low',
    },
    advisory: {
      title: 'Critical Root Zone Water Deficit',
      why: 'Soil moisture has dropped to 18.4%, approaching permanent wilting point for active crop root uptake.',
      actionPlan: [
        'Automatic drip irrigation valve #1 engaged for 45-minute restorative cycle.',
        'Verify manifold line pressure and inspect sub-surface emitters.',
        'Suspend chemical foliar fertilizer application until cellular hydration recovers.',
      ],
      priority: 'Critical',
    },
  },

  pest_risk: {
    cropHealth: 83,
    cropHealthStatus: 'Attention Needed',
    soilMoisture: 55.2,
    soilMoistureStatus: 'Optimal',
    temperature: 29.8,
    temperatureStatus: 'Warm',
    humidity: 72.4,
    humidityStatus: 'Humid',
    rainProbability: 25,
    rainForecast: 'Scattered Clouds',
    irrigationStatus: 'Optimal',
    valveState: 'CLOSED',
    risks: {
      diseaseRisk: 'Moderate',
      pestRisk: 'High',
      heatStress: 'Low',
      waterStress: 'Low',
      floodRisk: 'Low',
    },
    advisory: {
      title: 'High Whitefly & Sucking Pest Pressure',
      why: 'Ambient warmth and elevated humidity have crossed regional Economic Threshold Levels (ETL) for vector activity.',
      actionPlan: [
        'Deploy yellow sticky pheromone traps at 15 units per acre along plot perimeter.',
        'Administer organic Neem Seed Kernel Extract (NSKE 5%) prophylactic spray.',
        'Scout leaf undersides in the northern sector for initial nymph colonies.',
      ],
      priority: 'High',
    },
  },

  heatwave: {
    cropHealth: 76,
    cropHealthStatus: 'Heat Stressed',
    soilMoisture: 42.1,
    soilMoistureStatus: 'Rapid Evaporation',
    temperature: 41.8,
    temperatureStatus: 'Severe Heatwave',
    humidity: 21.0,
    humidityStatus: 'Desiccating',
    rainProbability: 0,
    rainForecast: 'Extreme Sun',
    irrigationStatus: 'Cooling Standby',
    valveState: 'PULSE',
    risks: {
      diseaseRisk: 'Low',
      pestRisk: 'Low',
      heatStress: 'Extreme',
      waterStress: 'Moderate',
      floodRisk: 'Low',
    },
    advisory: {
      title: 'Extreme Canopy Heatwave & Evaporative Surge',
      why: 'Ambient temperature at 41.8°C with vapor pressure deficit (VPD > 2.9 kPa) causing acute stomatal closure.',
      actionPlan: [
        'Execute pulse micro-sprinkling cycles (10 min every 2 hrs) to alleviate ambient heat.',
        'Apply organic straw or stubble mulching along furrow beds to protect root zone biology.',
        'Postpone all midday agricultural field operations and nitrogen application.',
      ],
      priority: 'High',
    },
  },

  disease_risk: {
    cropHealth: 78,
    cropHealthStatus: 'Pathogen Warning',
    soilMoisture: 72.8,
    soilMoistureStatus: 'Saturated',
    temperature: 19.2,
    temperatureStatus: 'Cool Damp',
    humidity: 92.6,
    humidityStatus: 'High Foliar Wetness',
    rainProbability: 75,
    rainForecast: 'Persistent Rain',
    irrigationStatus: 'Idle (Saturated)',
    valveState: 'CLOSED',
    risks: {
      diseaseRisk: 'High',
      pestRisk: 'Low',
      heatStress: 'Low',
      waterStress: 'Low',
      floodRisk: 'Moderate',
    },
    advisory: {
      title: 'Elevated Foliar Spore Germination Window',
      why: 'Continuous canopy leaf wetness duration has exceeded 6 hours at 19.2°C, accelerating fungal spore incubation.',
      actionPlan: [
        'Ensure inter-plot drainage ditches are cleared to avoid stagnant root waterlogging.',
        'Prophylactic spray of Trichoderma harzianum @ 5g/L bio-fungicide formulation.',
        'Conduct immediate leaf scan via Crop Scan tool to detect early chlorotic pustules.',
      ],
      priority: 'Critical',
    },
  },
};
