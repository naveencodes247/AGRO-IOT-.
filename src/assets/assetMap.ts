// Asset map for generated and localized images
import farmerBgImage from './images/indian_farmer_field_1790366637818.jpg';
import sampleWheatRust from './images/crop_sample_wheat_rust_1790366660681.jpg';
import sampleHealthyPaddy from './images/crop_healthy_paddy_1790366671611.jpg';
import satelliteAerialMap from './images/farm_satellite_aerial_1790369687155.jpg';
import taskIrrigationSprinkler from './images/task_irrigation_sprinkler_1790369720153.jpg';
import taskSoilNutrient from './images/task_soil_nutrient_1790369758286.jpg';
import taskTomatoHarvest from './images/task_tomato_harvest_1790369777210.jpg';

export const ASSETS = {
  farmerBackground: farmerBgImage,
  satelliteMap: satelliteAerialMap,
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
