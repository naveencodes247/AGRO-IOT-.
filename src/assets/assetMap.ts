// Asset map for generated and localized images
import farmerBgImage from './images/farmer_tablet_smart_field.jpg';
import sampleWheatRust from './images/crop_sample_wheat_rust_1790366660681.jpg';
import sampleHealthyPaddy from './images/crop_healthy_paddy_1790366671611.jpg';
import satelliteAerialMap from './images/precision_agri_satellite_map.jpg';
import taskIrrigationSprinkler from './images/task_irrigation_sprinkler_1790369720153.jpg';
import taskSoilNutrient from './images/task_soil_nutrient_1790369758286.jpg';
import taskTomatoHarvest from './images/task_tomato_harvest_1790369777210.jpg';
import officialLogoImage from './images/agro_iot_official_logo.jpg';
import wheatEarSpikeImage from './images/wheat_ear_spike.jpg';

export const ASSETS = {
  officialLogo: officialLogoImage,
  farmerBackground: farmerBgImage,
  satelliteMap: satelliteAerialMap,
  wheatSpike: wheatEarSpikeImage,
  tasks: {
    irrigation: taskIrrigationSprinkler,
    soil: taskSoilNutrient,
    harvest: taskTomatoHarvest,
  },
  samples: {
    wheatRust: sampleWheatRust,
    healthyPaddy: sampleHealthyPaddy,
  },
};
