import { AgriCrop, AgriDisease, AgriPest, IndianStateAgriProfile } from '../types';

export const INDIAN_STATES_DATA: IndianStateAgriProfile[] = [
  {
    id: 'punjab',
    name: 'Punjab',
    hindiName: 'पंजाब',
    code: 'PB',
    isUT: false,
    capital: 'Chandigarh',
    majorSoils: ['Alluvial Soil', 'Loamy Soil', 'Sandy Loam'],
    annualRainfallMm: 650,
    climateZones: ['Trans-Gangetic Plains Region', 'Semi-Arid Subtropical'],
    primaryCrops: ['Wheat', 'Rice (Basmati & Non-Basmati)', 'Cotton', 'Maize', 'Sugarcane'],
    horticultureCrops: ['Kinnow', 'Guava', 'Potato', 'Peas'],
    kharifCrops: ['Paddy', 'Cotton', 'Maize', 'Moong', 'Groundnut'],
    rabiCrops: ['Wheat', 'Gram', 'Mustard', 'Barley', 'Sunflower'],
    zaidCrops: ['Fodder Maize', 'Moong', 'Vegetables'],
    keyChallenges: ['Groundwater depletion', 'Crop residue management (stubble burning)', 'Soil micronutrient exhaustion'],
    majorInstitutes: ['Punjab Agricultural University (PAU), Ludhiana', 'ICAR-CIPHET']
  },
  {
    id: 'haryana',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    code: 'HR',
    isUT: false,
    capital: 'Chandigarh',
    majorSoils: ['Alluvial Soil', 'Sandy Soil in South', 'Clayey in Ghaggar Basin'],
    annualRainfallMm: 550,
    climateZones: ['Trans-Gangetic Plains', 'Arid to Semi-Arid'],
    primaryCrops: ['Wheat', 'Basmati Rice', 'Mustard', 'Cotton', 'Pearl Millet (Bajra)'],
    horticultureCrops: ['Mushroom', 'Tomato', 'Citrus', 'Ber'],
    kharifCrops: ['Paddy', 'Bajra', 'Cotton', 'Guar'],
    rabiCrops: ['Wheat', 'Mustard', 'Chickpea', 'Barley'],
    zaidCrops: ['Moong', 'Cucumber', 'Watermelon'],
    keyChallenges: ['Soil salinity and alkalinity', 'Water table fluctuations', 'Pest resistance in cotton'],
    majorInstitutes: ['CCS Haryana Agricultural University (HAU), Hisar', 'NDRI Karnal']
  },
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    code: 'UP',
    isUT: false,
    capital: 'Lucknow',
    majorSoils: ['Deep Alluvial Soil', 'Tarai Soil', 'Bundelkhand Black & Mixed Red'],
    annualRainfallMm: 950,
    climateZones: ['Upper Gangetic Plain', 'Middle Gangetic Plain', 'Central Plateau'],
    primaryCrops: ['Sugarcane', 'Wheat', 'Rice', 'Potato', 'Mustard', 'Gram'],
    horticultureCrops: ['Mango (Dasheri)', 'Guava', 'Potato', 'Mentha'],
    kharifCrops: ['Rice', 'Maize', 'Pigeon Pea (Arhar)', 'Pearl Millet'],
    rabiCrops: ['Wheat', 'Mustard', 'Potato', 'Gram', 'Peas'],
    zaidCrops: ['Urad', 'Moong', 'Melons', 'Leafy Vegetables'],
    keyChallenges: ['Uneven rainfall distribution', 'Cane payment delays', 'Cold wave susceptibility during Rabi'],
    majorInstitutes: ['ICAR-IARI regional, Kanpur & Meerut', 'CSAUAT Kanpur', 'IISR Lucknow']
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    code: 'MP',
    isUT: false,
    capital: 'Bhopal',
    majorSoils: ['Medium & Deep Black Soil', 'Mixed Red & Black', 'Alluvial in Chambal'],
    annualRainfallMm: 1050,
    climateZones: ['Central Plateau and Hill Region', 'Western Plateau and Hills'],
    primaryCrops: ['Soybean', 'Wheat (Sharbati)', 'Gram (Chana)', 'Garlic', 'Mustard', 'Cotton'],
    horticultureCrops: ['Orange (Nagpur Mandarin)', 'Coriander', 'Garlic', 'Chilli'],
    kharifCrops: ['Soybean', 'Maize', 'Urad', 'Cotton', 'Paddy'],
    rabiCrops: ['Wheat', 'Gram', 'Mustard', 'Lentil'],
    zaidCrops: ['Summer Moong', 'Sesame', 'Vegetables'],
    keyChallenges: ['Soil erosion in undulating terrain', 'Moisture stress during terminal pod filling', 'Post-harvest storage'],
    majorInstitutes: ['JNKVV Jabalpur', 'RVSKVV Gwalior', 'ICAR-IISR Indore']
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    code: 'MH',
    isUT: false,
    capital: 'Mumbai',
    majorSoils: ['Deep Black Regur Soil', 'Laterite in Konkan', 'Coarse Shallow in Marathwada'],
    annualRainfallMm: 1100,
    climateZones: ['Western Plateau and Hills', 'West Coast Plains and Ghats'],
    primaryCrops: ['Sugarcane', 'Cotton', 'Soybean', 'Sorghum (Jowar)', 'Pigeon Pea (Tur)', 'Onion'],
    horticultureCrops: ['Grapes', 'Pomegranate', 'Alphonso Mango', 'Banana', 'Orange'],
    kharifCrops: ['Cotton', 'Soybean', 'Tur', 'Jowar', 'Paddy in Konkan'],
    rabiCrops: ['Rabi Jowar', 'Gram', 'Wheat', 'Safflower'],
    zaidCrops: ['Summer Groundnut', 'Vegetables'],
    keyChallenges: ['Drought vulnerability in Marathwada & Vidarbha', 'Pink bollworm in Bt Cotton', 'Perishable onion price volatility'],
    majorInstitutes: ['MPKV Rahuri', 'PDKV Akola', 'VNMKV Parbhani', 'ICAR-NRC Grapes Pune']
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    code: 'GJ',
    isUT: false,
    capital: 'Gandhinagar',
    majorSoils: ['Black Cotton Soil', 'Alluvial Soil', 'Coastal Saline Soils', 'Sandy Desert Soil'],
    annualRainfallMm: 800,
    climateZones: ['Gujarat Plains and Hills', 'Western Dry Region'],
    primaryCrops: ['Cotton', 'Groundnut', 'Castor', 'Cumin (Jeera)', 'Wheat', 'Tobacco'],
    horticultureCrops: ['Mango (Kesar)', 'Banana', 'Papaya', 'Chilli', 'Fennel (Saunf)'],
    kharifCrops: ['Cotton', 'Groundnut', 'Castor', 'Sesamum', 'Bajra'],
    rabiCrops: ['Wheat', 'Mustard', 'Gram', 'Cumin', 'Fennel'],
    zaidCrops: ['Summer Bajra', 'Summer Groundnut', 'Vegetables'],
    keyChallenges: ['Coastal salinity ingress', 'Borewell water brackishness in Saurashtra', 'Erratic monsoon onset'],
    majorInstitutes: ['Anand Agricultural University (AAU)', 'Junagadh Agricultural University (JAU)', 'SDAU Sardarkrushinagar']
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    code: 'RJ',
    isUT: false,
    capital: 'Jaipur',
    majorSoils: ['Arid Desert Soil', 'Brown Sandy Soil', 'Red & Yellow in South', 'Black Soil in Hadoti'],
    annualRainfallMm: 500,
    climateZones: ['Western Dry Region', 'Central Plateau and Hills'],
    primaryCrops: ['Mustard', 'Pearl Millet (Bajra)', 'Gram', 'Cluster Bean (Guar)', 'Wheat', 'Soybean'],
    horticultureCrops: ['Mandarin (Jhalawar)', 'Aonla', 'Pomegranate', 'Coriander'],
    kharifCrops: ['Bajra', 'Guar', 'Moth Bean', 'Moong', 'Soybean in Kota'],
    rabiCrops: ['Mustard', 'Gram', 'Wheat', 'Barley', 'Isabgol'],
    zaidCrops: ['Fodder Sorghum', 'Muskmelon', 'Watermelon'],
    keyChallenges: ['Acute water scarcity', 'High evaporative loss', 'Shifting sand dunes in Thar', 'Frost events in January'],
    majorInstitutes: ['SKRAU Bikaner', 'MPUAT Udaipur', 'ICAR-CAZRI Jodhpur', 'ICAR-DRMR Bharatpur']
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    code: 'TN',
    isUT: false,
    capital: 'Chennai',
    majorSoils: ['Red Loam', 'Black Soil', 'Coastal Alluvium', 'Laterite'],
    annualRainfallMm: 950,
    climateZones: ['Southern Plateau and Hills', 'East Coast Plains and Hills'],
    primaryCrops: ['Paddy (Rice)', 'Sugarcane', 'Millets', 'Cotton', 'Groundnut', 'Coconut'],
    horticultureCrops: ['Banana', 'Mango', 'Turmeric', 'Jasmine', 'Tapioca'],
    kharifCrops: ['Kuruvai Paddy', 'Groundnut', 'Millets'],
    rabiCrops: ['Samba / Thaladi Paddy', 'Pulses in Cauvery Delta', 'Gingelly'],
    zaidCrops: ['Navarai Paddy', 'Summer Pulses', 'Vegetables'],
    keyChallenges: ['Inter-state Cauvery water dependency', 'Cyclone risks along Coromandel coast', 'Saline groundwater'],
    majorInstitutes: ['Tamil Nadu Agricultural University (TNAU), Coimbatore', 'ICAR-SBI Coimbatore']
  },
  {
    id: 'andhra-pradesh',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    code: 'AP',
    isUT: false,
    capital: 'Amaravati',
    majorSoils: ['Red Sandy Loam', 'Deep Coastal Alluvium', 'Black Soils in Rayalaseema'],
    annualRainfallMm: 960,
    climateZones: ['East Coast Plains', 'Southern Plateau and Hills'],
    primaryCrops: ['Rice', 'Cotton', 'Groundnut', 'Chilli', 'Tobacco', 'Maize'],
    horticultureCrops: ['Mango (Banganapalle)', 'Sweet Orange (Chittoor)', 'Tomato', 'Oil Palm'],
    kharifCrops: ['Rice', 'Groundnut', 'Cotton', 'Chilli'],
    rabiCrops: ['Rice', 'Blackgram', 'Maize', 'Bengalgram'],
    zaidCrops: ['Sesamum', 'Watermelon', 'Pulses'],
    keyChallenges: ['Rayalaseema drought vulnerability', 'Chilli thrips and viral pest complexes', 'Coastal cyclones'],
    majorInstitutes: ['ANGRAU Guntur', 'Dr. YSR Horticultural University, Venkataramannagudem']
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    code: 'KA',
    isUT: false,
    capital: 'Bengaluru',
    majorSoils: ['Red Sandy Soil', 'Black Soil in North', 'Laterite in Malnad & Coastal'],
    annualRainfallMm: 1200,
    climateZones: ['Southern Plateau and Hills', 'West Coast Plains and Ghats'],
    primaryCrops: ['Coffee', 'Ragi (Finger Millet)', 'Maize', 'Sugarcane', 'Cotton', 'Sunflower'],
    horticultureCrops: ['Arecanut', 'Pomegranate', 'Grapes', 'Pepper', 'Cardamom'],
    kharifCrops: ['Ragi', 'Maize', 'Cotton', 'Soybean', 'Paddy'],
    rabiCrops: ['Rabi Jowar', 'Bengal Gram', 'Wheat', 'Sunflower'],
    zaidCrops: ['Summer Groundnut', 'Vegetables'],
    keyChallenges: ['North Karnataka dryland moisture stress', 'Yellowing & wilt in Arecanut', 'Coffee berry borer'],
    majorInstitutes: ['UAS Bengaluru', 'UAS Dharwad', 'ICAR-IIHR Hessaraghatta']
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    code: 'WB',
    isUT: false,
    capital: 'Kolkata',
    majorSoils: ['Gangetic Alluvial', 'Terai Soils', 'Coastal Saline in Sundarbans', 'Red Laterite in Purulia'],
    annualRainfallMm: 1600,
    climateZones: ['Lower Gangetic Plain', 'Eastern Himalayan Region'],
    primaryCrops: ['Rice (Aman, Aus, Boro)', 'Jute', 'Potato', 'Tea', 'Mustard', 'Maize'],
    horticultureCrops: ['Mango (Malda)', 'Pineapple (North Bengal)', 'Brinjal', 'Betel Vine'],
    kharifCrops: ['Aman Paddy', 'Jute', 'Maize'],
    rabiCrops: ['Boro Paddy', 'Potato', 'Mustard', 'Wheat', 'Lentil'],
    zaidCrops: ['Aus Paddy', 'Til (Sesame)', 'Summer Vegetables'],
    keyChallenges: ['Sundarbans tidal inundation and salinity', 'Boro paddy high pumping costs', 'Potato late blight epidemics'],
    majorInstitutes: ['BCKV Mohanpur', 'UBKV Cooch Behar', 'ICAR-CRIJAF Barrackpore']
  },
  {
    id: 'bihar',
    name: 'Bihar',
    hindiName: 'बिहार',
    code: 'BR',
    isUT: false,
    capital: 'Patna',
    majorSoils: ['North Bihar Calcareous Alluvium', 'South Bihar Old Alluvial', 'Tal and Diara Soils'],
    annualRainfallMm: 1200,
    climateZones: ['Middle Gangetic Plain Region'],
    primaryCrops: ['Rice', 'Wheat', 'Maize (Rabi & Kharif)', 'Sugarcane', 'Lentils', 'Makhana (Fox Nut)'],
    horticultureCrops: ['Shahi Litchi (Muzaffarpur)', 'Makhana', 'Zardalu Mango', 'Banana (Hajipur)'],
    kharifCrops: ['Paddy', 'Maize', 'Arhar', 'Urad'],
    rabiCrops: ['Wheat', 'Rabi Maize', 'Gram', 'Lentil', 'Mustard'],
    zaidCrops: ['Garma Maize', 'Garma Moong', 'Bitter Gourd'],
    keyChallenges: ['Recurring Koshi-Gandak floods in North Bihar', 'Drought in South Bihar', 'Cold injury to winter maize'],
    majorInstitutes: ['Dr. Rajendra Prasad Central Agricultural University (RPCAU), Pusa', 'BAU Sabour']
  },
  {
    id: 'assam',
    name: 'Assam',
    hindiName: 'असम',
    code: 'AS',
    isUT: false,
    capital: 'Dispur',
    majorSoils: ['Acidic Alluvial Soils', 'Brahmaputra Floodplain Silts', 'Hill Red Soils'],
    annualRainfallMm: 2200,
    climateZones: ['Eastern Himalayan Region'],
    primaryCrops: ['Tea', 'Rice (Sali, Ahu, Boro)', 'Jute', 'Rapeseed-Mustard', 'Arecanut'],
    horticultureCrops: ['Assam Lemon (Kaji Nemu)', 'Bhut Jolokia', 'Pineapple', 'Banana'],
    kharifCrops: ['Sali Rice', 'Jute', 'Sesame'],
    rabiCrops: ['Boro Rice', 'Mustard', 'Potato', 'Pulses'],
    zaidCrops: ['Ahu Rice', 'Vegetables'],
    keyChallenges: ['Severe annual Brahmaputra flash floods and siltation', 'Soil acidity (low pH 4.5-5.5)', 'High humidity fungal pressure'],
    majorInstitutes: ['Assam Agricultural University (AAU), Jorhat', 'Tocklai Tea Research Institute']
  },
  {
    id: 'odisha',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    code: 'OD',
    isUT: false,
    capital: 'Bhubaneswar',
    majorSoils: ['Red Lateritic Soil', 'Coastal Alluvial', 'Black Soils in Western Plateau'],
    annualRainfallMm: 1450,
    climateZones: ['Eastern Plateau and Hills', 'East Coast Plains'],
    primaryCrops: ['Paddy (Rice)', 'Pulses (Blackgram, Greengram)', 'Groundnut', 'Ragi', 'Sugarcane'],
    horticultureCrops: ['Cashew', 'Turmeric (Kandhamal)', 'Ginger', 'Coconut'],
    kharifCrops: ['Autumn & Winter Paddy', 'Ragi', 'Maize', 'Arhar'],
    rabiCrops: ['Summer Paddy', 'Greengram', 'Mustard', 'Groundnut'],
    zaidCrops: ['Summer Vegetables', 'Til'],
    keyChallenges: ['Bay of Bengal coastal cyclones', 'Moisture stress in KBK districts', 'Acid soil phosphorus fixation'],
    majorInstitutes: ['OUAT Bhubaneswar', 'ICAR-NRRI Cuttack (National Rice Research Institute)']
  },
  {
    id: 'kerala',
    name: 'Kerala',
    hindiName: 'केरल',
    code: 'KL',
    isUT: false,
    capital: 'Thiruvananthapuram',
    majorSoils: ['Laterite Soil (dominant)', 'Coastal Sand', 'Acid Saline (Kari & Pokkali)'],
    annualRainfallMm: 3000,
    climateZones: ['West Coast Plains and Ghats Region'],
    primaryCrops: ['Rubber', 'Coconut', 'Paddy (Pokkali, Kuttanad)', 'Black Pepper', 'Cardamom', 'Tea'],
    horticultureCrops: ['Banana (Nendran)', 'Jackfruit', 'Ginger', 'Nutmeg', 'Pineapple'],
    kharifCrops: ['Virippu Paddy', 'Ginger', 'Turmeric'],
    rabiCrops: ['Mundakan Paddy', 'Tapioca', 'Vegetables'],
    zaidCrops: ['Puncha Paddy (below sea level)', 'Pulses'],
    keyChallenges: ['Land slope soil erosion', 'Labor shortage and high wage costs', 'Climate extreme flash rains and landslides'],
    majorInstitutes: ['Kerala Agricultural University (KAU), Thrissur', 'ICAR-CPCRI Kasaragod', 'ICAR-IISR Kozhikode']
  },
  {
    id: 'telangana',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    code: 'TS',
    isUT: false,
    capital: 'Hyderabad',
    majorSoils: ['Red Earths (Chalkas)', 'Black Cotton Soils in Adilabad & Nizamabad'],
    annualRainfallMm: 950,
    climateZones: ['Southern Plateau and Hills Region'],
    primaryCrops: ['Paddy (Rice)', 'Cotton', 'Maize', 'Soybean', 'Chilli', 'Red Gram'],
    horticultureCrops: ['Turmeric (Nizamabad)', 'Sweet Orange', 'Mango', 'Guava'],
    kharifCrops: ['Cotton', 'Paddy', 'Soybean', 'Maize', 'Red Gram'],
    rabiCrops: ['Paddy (Yasangi)', 'Bengal Gram', 'Maize', 'Groundnut'],
    zaidCrops: ['Sesamum', 'Watermelon'],
    keyChallenges: ['Excessive borewell exploitation in hard rock aquifers', 'High pesticide loads in commercial crops'],
    majorInstitutes: ['PJTSAU Hyderabad', 'ICRISAT Patancheru', 'ICAR-IIRR Hyderabad']
  },
  {
    id: 'chhattisgarh',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    code: 'CG',
    isUT: false,
    capital: 'Raipur',
    majorSoils: ['Red and Yellow Soils (Matasi)', 'Sandy Loam (Dorsa)', 'Clayey (Kanhar)'],
    annualRainfallMm: 1300,
    climateZones: ['Eastern Plateau and Hills Region'],
    primaryCrops: ['Paddy (The Rice Bowl of Central India)', 'Kodo-Kutki (Minor Millets)', 'Maize', 'Soybean', 'Lathyrus'],
    horticultureCrops: ['Tomato', 'Papaya', 'Ginger', 'Guava', 'Cashew in Bastar'],
    kharifCrops: ['Paddy', 'Soybean', 'Arhar', 'Minor Millets'],
    rabiCrops: ['Gram', 'Lathyrus (Tiura)', 'Wheat', 'Mustard'],
    zaidCrops: ['Moong', 'Vegetables'],
    keyChallenges: ['Low Rabi cropping intensity', 'Terminal drought in rainfed upland paddy', 'Tribal farm mechanization'],
    majorInstitutes: ['IGKV Raipur', 'ICAR-National Institute of Biotic Stress Management (NIBSM)']
  },
  {
    id: 'jharkhand',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    code: 'JH',
    isUT: false,
    capital: 'Ranchi',
    majorSoils: ['Red Soil from Gneiss Rocks', 'Lateritic in Plateau', 'Micaceous in Koderma'],
    annualRainfallMm: 1200,
    climateZones: ['Eastern Plateau and Hills Region'],
    primaryCrops: ['Rice (Tanr & Don lands)', 'Maize', 'Pulses (Pigeonpea, Kulthi)', 'Wheat', 'Mustard'],
    horticultureCrops: ['Green Peas', 'Tomato', 'French Beans', 'Cauliflower'],
    kharifCrops: ['Upland and Lowland Paddy', 'Maize', 'Arhar'],
    rabiCrops: ['Wheat', 'Mustard', 'Gram', 'Linseed'],
    zaidCrops: ['Moong', 'Off-season Vegetables'],
    keyChallenges: ['High surface runoff on undulating plateaus', 'Low irrigation coverage (<15%)', 'Soil acidity'],
    majorInstitutes: ['BAU Kanke, Ranchi', 'ICAR-Indian Institute of Agricultural Biotechnology (IIAB)']
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    code: 'UK',
    isUT: false,
    capital: 'Dehradun',
    majorSoils: ['Mountain Forest Soils', 'Tarai-Bhabar Alluvium', 'Glacial Till Soils'],
    annualRainfallMm: 1550,
    climateZones: ['Western Himalayan Region'],
    primaryCrops: ['Basmati Rice (Dehradun)', 'Wheat', 'Finger Millet (Mandua)', 'Barnyard Millet (Jhangora)', 'Soybean'],
    horticultureCrops: ['Apple', 'Peach', 'Plum', 'Walnut', 'Tejpat'],
    kharifCrops: ['Paddy in Tarai', 'Mandua', 'Jhangora', 'Rajma in Hills'],
    rabiCrops: ['Wheat', 'Barley', 'Mustard', 'Lentil'],
    zaidCrops: ['Vegetables in Valleys'],
    keyChallenges: ['Terrace farming fragmentation', 'Wild animal menace (monkeys, wild boars)', 'Flash cloudbursts'],
    majorInstitutes: ['GBPUAT Pantnagar (India\'s first Agri University)', 'VCSG UUHF Bharsar']
  },
  {
    id: 'himachal-pradesh',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    code: 'HP',
    isUT: false,
    capital: 'Shimla',
    majorSoils: ['Sub-Mountain and Mountain Soils', 'Glacial Soils', 'Alluvial in Paonta Valley'],
    annualRainfallMm: 1250,
    climateZones: ['Western Himalayan Region'],
    primaryCrops: ['Maize', 'Wheat', 'Paddy', 'Barley', 'Buckwheat'],
    horticultureCrops: ['Apple (The Apple State of India)', 'Pear', 'Cherry', 'Off-season Cabbage & Cauliflower'],
    kharifCrops: ['Maize', 'Paddy', 'Pulses (Mash)'],
    rabiCrops: ['Wheat', 'Barley', 'Gram'],
    zaidCrops: ['Off-season Hill Vegetables'],
    keyChallenges: ['Insufficient winter chilling hours for apple bud break', 'Hailstorm damage during fruit set', 'Steep slope transport'],
    majorInstitutes: ['Dr. YS Parmar University of Horticulture and Forestry, Nauni (Solan)', 'CSKHPKV Palampur']
  },
  {
    id: 'jammu-kashmir',
    name: 'Jammu & Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    code: 'JK',
    isUT: true,
    capital: 'Srinagar / Jammu',
    majorSoils: ['Karewa Soils (Lacustrine in Kashmir)', 'Brown Earths', 'Alluvial in Jammu Plains'],
    annualRainfallMm: 1000,
    climateZones: ['Western Himalayan Region'],
    primaryCrops: ['Saffron (Kashmir Valley)', 'Basmati Rice (RS Pura)', 'Maize', 'Wheat', 'Mustard'],
    horticultureCrops: ['Apple', 'Walnut', 'Almond', 'Cherry', 'Kashmiri Red Chilli'],
    kharifCrops: ['Paddy', 'Maize', 'Saffron (planting)'],
    rabiCrops: ['Wheat', 'Mustard', 'Barley', 'Oats'],
    zaidCrops: ['Vegetables in Floating Gardens of Dal Lake'],
    keyChallenges: ['Saffron corm rot', 'Early snow events damaging fruit trees', 'Supply chain bottlenecks along NH44'],
    majorInstitutes: ['SKUAST-Kashmir, Shalimar', 'SKUAST-Jammu, Chatha']
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    hindiName: 'लद्दाख',
    code: 'LA',
    isUT: true,
    capital: 'Leh',
    majorSoils: ['Cold Desert Soils', 'Sandy Skeletal Soils', 'Glacial Outwash Gravels'],
    annualRainfallMm: 100,
    climateZones: ['Cold Arid High Altitude Region'],
    primaryCrops: ['Barley (Grim)', 'Wheat', 'Buckwheat', 'Alfalfa (Lucerne Fodder)'],
    horticultureCrops: ['Sea Buckthorn (Leh Berry)', 'Apricot (Raktsey Karpo)', 'Walnut'],
    kharifCrops: ['Single season: April to September crops'],
    rabiCrops: ['Severe winter freeze: Greenhouses / Trench farming only'],
    zaidCrops: ['Summer Solar Greenhouse Leafy Greens'],
    keyChallenges: ['Extremely short 120-day frost-free growing window', 'Sub-zero winters down to -30°C', 'Glacier melt dependency'],
    majorInstitutes: ['DIHAR (DRDO) Leh', 'SKUAST-K High Altitude Mountain Agriculture Research Station, Leh']
  },
  {
    id: 'delhi',
    name: 'Delhi',
    hindiName: 'दिल्ली',
    code: 'DL',
    isUT: true,
    capital: 'New Delhi',
    majorSoils: ['Yamuna Alluvial Silt', 'Sandy Loam'],
    annualRainfallMm: 600,
    climateZones: ['Trans-Gangetic Plains Region'],
    primaryCrops: ['Wheat', 'Paddy', 'Mustard', 'Vegetables (Yamuna Floodplain)'],
    horticultureCrops: ['Floriculture (Roses, Marigold)', 'Mushroom', 'Peri-urban Vegetables'],
    kharifCrops: ['Paddy', 'Bajra', 'Gourds'],
    rabiCrops: ['Wheat', 'Mustard', 'Spinach', 'Radish'],
    zaidCrops: ['Cucurbits', 'Mint'],
    keyChallenges: ['Rapid urban conversion of arable land', 'Yamuna water pollution & heavy metals', 'High labor cost'],
    majorInstitutes: ['ICAR-IARI Pusa, New Delhi (National Premier Agronomy Institute)']
  }
];

export const AGRI_CROPS: AgriCrop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं (Triticum aestivum)',
    category: 'Cereals',
    climate: 'Cool winter with moderate sunshine; warm ripening period free of unseasonal rains.',
    soil: 'Well-drained fertile loamy and clayey soils. Neutral pH 6.0 - 7.5.',
    sowingSeason: 'Rabi (November 1 - November 25 optimal in Indo-Gangetic Plains)',
    growingRegions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'],
    idealTemperature: '15°C - 20°C (germination & tillering), 20°C - 25°C (grain filling)',
    waterRequirement: '450 - 650 mm (Critical stages: CRI at 21 DAS, Tillering, Flowering, Milking)',
    growthDurationDays: '120 - 145 days depending on variety (HD-2967, PBW-343, Sharbati)',
    nutrientRequirements: {
      nitrogen: '120 - 150 kg/ha (split in 3 applications)',
      phosphorus: '60 kg/ha at basal placement',
      potassium: '40 kg/ha at basal placement',
      organicMatter: '5 - 10 tons well-decomposed FYM before field preparation'
    },
    commonPests: ['Termites', 'Wheat Aphids', 'Armyworm'],
    commonDiseases: ['Yellow (Stripe) Rust', 'Brown Rust', 'Loose Smut', 'Karnal Bunt'],
    harvestAdvice: 'Harvest when moisture content drops to 14-16% and grains become hard and golden-yellow.',
    storageRecommendation: 'Sun-dry grains to below 10-12% moisture before hermetic bin storage to prevent granary weevils.'
  },
  {
    id: 'paddy-rice',
    name: 'Paddy (Rice)',
    hindiName: 'धान / चावल (Oryza sativa)',
    category: 'Cereals',
    climate: 'Hot, humid tropical to sub-tropical conditions with bright sunlight during grain development.',
    soil: 'Heavy clay or clay-loam soils with impervious subsoil capable of holding standing water.',
    sowingSeason: 'Kharif (Nursery: May-June, Transplanting: June-July), Boro (Nov-Dec), Summer (Feb)',
    growingRegions: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Telangana'],
    idealTemperature: '20°C - 35°C (optimum 25°C - 30°C)',
    waterRequirement: '1200 - 2000 mm (alternate wetting and drying AWD recommended to save water)',
    growthDurationDays: '110 - 155 days (Basmati: Pusa 1121, 1509; Swarna, MTU-1010)',
    nutrientRequirements: {
      nitrogen: '100 - 120 kg/ha (Basal, Tillering, Panicle Initiation)',
      phosphorus: '50 - 60 kg/ha (all basal)',
      potassium: '40 - 50 kg/ha (split basal & panicle)',
      organicMatter: 'Green manuring with Sesbania (Dhaincha) prior to puddling'
    },
    commonPests: ['Yellow Stem Borer', 'Brown Plant Hopper (BPH)', 'Leaf Folder', 'Gall Midge'],
    commonDiseases: ['Rice Blast (Pyricularia oryzae)', 'Bacterial Leaf Blight', 'Sheath Blight', 'False Smut'],
    harvestAdvice: 'Harvest when 80-85% of panicle turns golden and grain moisture is around 20%.',
    storageRecommendation: 'Dry paddy on clean tarpaulins to 12-13% moisture level prior to warehousing.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास (Gossypium hirsutum)',
    category: 'Commercial',
    climate: 'Tropical to subtropical with minimum 180-200 frost-free days and abundant sunshine.',
    soil: 'Deep black cotton soils (Vertisols) with good water retention and adequate drainage.',
    sowingSeason: 'Kharif (North: April-May; Central & South: June-July after first monsoon showers)',
    growingRegions: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Rajasthan', 'Haryana'],
    idealTemperature: '21°C - 30°C (temperatures above 38°C cause boll shedding)',
    waterRequirement: '700 - 1200 mm (sensitive to waterlogging; drip irrigation highly effective)',
    growthDurationDays: '150 - 180 days (Bt Hybrids)',
    nutrientRequirements: {
      nitrogen: '120 - 150 kg/ha',
      phosphorus: '60 kg/ha',
      potassium: '60 kg/ha',
      organicMatter: '8-10 tons compost or vermicompost'
    },
    commonPests: ['Pink Bollworm', 'American Bollworm', 'Whitefly', 'Thrips', 'Aphids'],
    commonDiseases: ['Cotton Leaf Curl Virus (CLCuV)', 'Bacterial Blight', 'Root Rot', 'Grey Mildew'],
    harvestAdvice: 'Pick bolls in the morning hours when dew has evaporated; avoid picking leaf trash and bracts.',
    storageRecommendation: 'Store seed cotton (Kapas) in dry, well-ventilated sheds away from rain or damp floors.'
  },
  {
    id: 'mustard',
    name: 'Mustard / Rapeseed',
    hindiName: 'सरसों / तोरिया (Brassica juncea)',
    category: 'Oilseeds',
    climate: 'Cool subtropical climate with clear sunshine and dry weather during flowering and pod development.',
    soil: 'Light to heavy loam soils. Very responsive to well-drained fertile soils.',
    sowingSeason: 'Rabi (Late September to Mid-October optimal to evade aphid attacks)',
    growingRegions: ['Rajasthan', 'Madhya Pradesh', 'Haryana', 'Uttar Pradesh', 'West Bengal'],
    idealTemperature: '15°C - 25°C',
    waterRequirement: '250 - 400 mm (critical irrigations at pre-flowering and pod formation)',
    growthDurationDays: '105 - 135 days (Varieties: Pusa Bold, Giriraj, Kranti)',
    nutrientRequirements: {
      nitrogen: '60 - 80 kg/ha',
      phosphorus: '40 kg/ha',
      potassium: '20 - 30 kg/ha',
      organicMatter: 'Sulphur application (20-30 kg/ha) essential for oil synthesis'
    },
    commonPests: ['Mustard Aphid (Lipaphis erysimi)', 'Sawfly', 'Painted Bug'],
    commonDiseases: ['White Rust (Albugo candida)', 'Alternaria Blight', 'Downy Mildew', 'Sclerotinia Rot'],
    harvestAdvice: 'Harvest when siliquae (pods) turn yellowish-brown and seeds become hard in early morning.',
    storageRecommendation: 'Dry seeds until moisture content is strictly below 8% to avoid fungal heating and rancidity.'
  },
  {
    id: 'gram-chickpea',
    name: 'Chickpea / Bengal Gram',
    hindiName: 'चना (Cicer arietinum)',
    category: 'Pulses',
    climate: 'Cool and dry climate with mild winter; frost sensitive at flowering stage.',
    soil: 'Well-drained deep loamy to black soils. Highly sensitive to waterlogging and alkalinity.',
    sowingSeason: 'Rabi (October - November)',
    growingRegions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Karnataka'],
    idealTemperature: '18°C - 26°C',
    waterRequirement: '250 - 350 mm (1-2 protective irrigations: branching and pod development)',
    growthDurationDays: '95 - 120 days (Desi varieties: JG-11, JG-16; Kabuli: KAK-2)',
    nutrientRequirements: {
      nitrogen: '20 - 25 kg/ha starter dose (Rhizobium bio-inoculant recommended)',
      phosphorus: '40 - 50 kg/ha (critical for root nodulation)',
      potassium: '20 kg/ha',
      organicMatter: 'Rhizobium and PSB seed treatment mandatory'
    },
    commonPests: ['Gram Pod Borer (Helicoverpa armigera)', 'Cutworm'],
    commonDiseases: ['Fusarium Wilt', 'Ascochyta Blight', 'Dry Root Rot', 'Collar Rot'],
    harvestAdvice: 'Harvest when leaves shed and pods become dry and rattle upon shaking.',
    storageRecommendation: 'Ensure 9-10% seed moisture; treat with neem oil or pulse beetle deterrent bins.'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    hindiName: 'गन्ना (Saccharum officinarum)',
    category: 'Commercial',
    climate: 'Long warm growing season followed by dry, cool and sunny ripening period.',
    soil: 'Deep well-drained loamy and clay-loam soils with high organic matter. pH 6.5 - 7.5.',
    sowingSeason: 'Autumn (Oct-Nov), Spring (Feb-March), Adsali (July-Aug in Maharashtra)',
    growingRegions: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Bihar'],
    idealTemperature: '24°C - 32°C (growth halts below 15°C)',
    waterRequirement: '1500 - 2500 mm (drip irrigation with fertigation saves 40-50% water)',
    growthDurationDays: '10 - 12 months (Planted crop; Adsali takes 15-18 months)',
    nutrientRequirements: {
      nitrogen: '150 - 250 kg/ha (split up to earthing-up)',
      phosphorus: '60 - 80 kg/ha basal',
      potassium: '60 - 80 kg/ha',
      organicMatter: '15 - 20 tons FYM or pressmud compost'
    },
    commonPests: ['Early Shoot Borer', 'Top Borer', 'Pyrilla (Leafhopper)', 'White Grub'],
    commonDiseases: ['Red Rot (Colletotrichum falcatum)', 'Smut', 'Wilt', 'Grassy Shoot Disease'],
    harvestAdvice: 'Harvest at peak sucrose maturity (Brix > 18-20% checked with hand refractometer).',
    storageRecommendation: 'Crush harvested cane within 24-48 hours to prevent sugar inversion and sucrose loss.'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    hindiName: 'टमाटर (Solanum lycopersicum)',
    category: 'Vegetables',
    climate: 'Warm season crop, sensitive to frost, requires moderate humidity and bright light.',
    soil: 'Well-drained rich sandy loam to clay loam rich in organic matter. pH 6.0 - 7.0.',
    sowingSeason: 'Year-round in polyhouses; Open field: Kharif (June-July), Rabi (Oct-Nov), Spring (Jan-Feb)',
    growingRegions: ['Andhra Pradesh', 'Madhya Pradesh', 'Karnataka', 'Odisha', 'Maharashtra', 'Gujarat'],
    idealTemperature: '18°C - 27°C (pollen becomes sterile above 35°C)',
    waterRequirement: '400 - 600 mm (even watering prevents blossom end rot and fruit cracking)',
    growthDurationDays: '90 - 120 days from transplanting',
    nutrientRequirements: {
      nitrogen: '100 - 120 kg/ha',
      phosphorus: '60 - 80 kg/ha',
      potassium: '80 - 100 kg/ha',
      organicMatter: 'Vermicompost + Calcium supplementation for firm skin'
    },
    commonPests: ['Tomato Fruit Borer (Helicoverpa)', 'Whitefly (Bemisia tabaci)', 'Leaf Miner', 'Tuta absoluta'],
    commonDiseases: ['Early Blight (Alternaria)', 'Late Blight (Phytophthora)', 'Tomato Leaf Curl Virus (ToLCV)', 'Bacterial Wilt'],
    harvestAdvice: 'Harvest at breaker/turning stage for long-distance transport, or red-ripe for local consumption.',
    storageRecommendation: 'Store at 12°C - 15°C with 85-90% relative humidity. Never freeze.'
  }
];

export const AGRI_PESTS: AgriPest[] = [
  {
    id: 'stem-borer',
    name: 'Yellow Stem Borer',
    scientificName: 'Scirpophaga incertulas',
    hindiName: 'तना छेदक (धान)',
    affectedCrops: ['Paddy (Rice)'],
    symptoms: [
      'Dead hearts: Central shoot turns dry and brown during vegetative phase',
      'White heads: Panicle turns completely white and chaffy with empty grains during flowering',
      'Tiny entry pinholes visible at the basal node of the tiller'
    ],
    identification: 'Female moth has bright yellow/straw-colored wings with a distinct black spot on each forewing and an orange anal tuft.',
    favorableConditions: 'Warm, humid weather (25°C-30°C and >80% RH), dense plant spacing, high nitrogen fertilization.',
    generalManagement: {
      cultural: 'Clip seedling tips before transplanting to remove egg masses. Maintain alternate wetting and drying. Avoid excessive nitrogenous fertilizers.',
      biological: 'Release egg parasitoid Trichogramma japonicum @ 100,000/ha at weekly intervals starting 30 days after transplanting.',
      chemical: 'Apply Cartap Hydrochloride 4G @ 25 kg/ha or Chlorantraniliprole 0.4% G @ 10 kg/ha when dead heart threshold exceeds 5%.'
    },
    referenceSource: 'Directorate of Plant Protection, Quarantine & Storage (DPPQS) & ICAR-NRRI'
  },
  {
    id: 'pink-bollworm',
    name: 'Pink Bollworm',
    scientificName: 'Pectinophora gossypiella',
    hindiName: 'गुलाबी सुंडी (कपास)',
    affectedCrops: ['Cotton', 'Okra (Ladyfinger)'],
    symptoms: [
      'Rosette flowers: Petals twisted and sealed together like a rosette',
      'Premature boll opening and stained lint',
      'Double seeds formed due to larva webbing two seeds together',
      'Exit holes bored in mature bolls'
    ],
    identification: 'Mature larva is pinkish-red with brown head capsule, measuring 12-15 mm inside developing cotton seeds.',
    favorableConditions: 'Extended crop season, stubble left in field, late monsoon showers with warm nights.',
    generalManagement: {
      cultural: 'Adopt timely terminated crop (stop irrigation by December). Shred cotton stubbles promptly after picking. Install pheromone traps (Gossyplure) @ 5/ha for monitoring.',
      biological: 'Release Trichogrammatoidea bactrae @ 150,000/ha at 45 and 60 days after emergence.',
      chemical: 'Spray Emamectin Benzoate 5% SG @ 220 g/ha or Profenofos 50% EC @ 1500 ml/ha at ETL (>8 moths/trap/night for 3 days or 10% rosette flowers).'
    },
    referenceSource: 'Central Institute for Cotton Research (ICAR-CICR), Nagpur'
  },
  {
    id: 'mustard-aphid',
    name: 'Mustard Aphid',
    scientificName: 'Lipaphis erysimi',
    hindiName: 'माहू / चेपा (सरसों)',
    affectedCrops: ['Mustard', 'Cabbage', 'Cauliflower', 'Radish'],
    symptoms: [
      'Dense colonies of tiny greenish nymphs and adults covering flowers and tender pods',
      'Yellowing and curling of inflorescence',
      'Sticky honeydew secretion followed by black sooty mold growth',
      'Poor seed setting and shriveled pods'
    ],
    identification: 'Small, soft-bodied yellowish-green pear-shaped insects, 1.5 - 2.5 mm long, with two posterior cornicles.',
    favorableConditions: 'Cloudy, overcast skies with cool temperatures (10°C - 20°C) and calm wind during January-February.',
    generalManagement: {
      cultural: 'Early sowing (before October 15) escapes peak aphid infestation. Plant yellow sticky traps @ 20-25/ha across the field borders.',
      biological: 'Conserve natural predators: Ladybird beetles (Coccinella septempunctata), Syrphid fly maggots, and Chrysoperla carnea.',
      chemical: 'Spray Dimethoate 30% EC @ 1 ml/L or Thiamethoxam 25% WG @ 0.2 g/L when aphid colony exceeds 25 insects per 10 cm terminal shoot.'
    },
    referenceSource: 'ICAR-Directorate of Rapeseed-Mustard Research (DRMR), Bharatpur'
  },
  {
    id: 'whitefly',
    name: 'Whitefly',
    scientificName: 'Bemisia tabaci',
    hindiName: 'सफेद मक्खी',
    affectedCrops: ['Cotton', 'Tomato', 'Chilli', 'Okra', 'Soybean', 'Pulses'],
    symptoms: [
      'Chlorotic spots on leaves, stunted plant growth',
      'Vector of dreaded viral diseases: Cotton Leaf Curl Virus (CLCuV) and Tomato Yellow Leaf Curl Virus (TYLCV)',
      'Black sooty mold covering leaf canopy, hindering photosynthesis'
    ],
    identification: 'Tiny (1 mm) moth-like insects with powdery white wings held tent-like over body, flying quickly when disturbed.',
    favorableConditions: 'Hot and dry weather (30°C - 38°C) with low relative humidity, prolonged dry spells during vegetative stage.',
    generalManagement: {
      cultural: 'Install yellow sticky traps @ 30/ha. Destroy alternative weed hosts like Abutilon indicum. Grow border barrier rows of Bajra or Maize.',
      biological: 'Spray Neem Seed Kernel Extract (NSKE 5%) or Neem oil (1500 ppm) @ 3-5 ml/L.',
      chemical: 'Spray Diafenthiuron 50% WP @ 1.25 g/L or Pyriproxyfen 10% EC @ 2 ml/L or Dinotefuran 20% SG @ 0.4 g/L strictly based on threshold.'
    },
    referenceSource: 'Indian Council of Agricultural Research (ICAR)'
  }
];

export const AGRI_DISEASES: AgriDisease[] = [
  {
    id: 'yellow-rust',
    name: 'Stripe Rust / Yellow Rust',
    causalOrganism: 'Puccinia striiformis f. sp. tritici (Fungus)',
    hindiName: 'पीला रतुआ / पीला गेरुई (गेहूं)',
    affectedCrops: ['Wheat', 'Barley'],
    symptoms: [
      'Bright yellow, linear stripes of powdery pustules (uredinia) arranged parallel along leaf veins',
      'Yellow powder rubs off easily onto farmer fingers or white cloth',
      'Early premature leaf desiccation, resulting in shriveled grains and severe yield decline up to 70%'
    ],
    favorableConditions: 'Cool weather (10°C - 15°C), high humidity (>85%), night dew or intermittent drizzle during December to February in Northern Plains and Foothills.',
    generalManagement: {
      cultural: 'Cultivate rust-resistant varieties approved by PAU/IARI (such as HD-3086, DBW-187, DBW-222, PBW-725). Avoid excessive nitrogenous top-dressing.',
      preventive: 'Regular field scouting in riverine belts and shaded tree corners where microclimate triggers early infection foci.',
      fungicidal: 'At first appearance of yellow pustules, spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25.9% EC @ 1 ml/L in 200 liters of water per acre.'
    },
    referenceSource: 'ICAR-Indian Institute of Wheat and Barley Research (IIWBR), Karnal'
  },
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    causalOrganism: 'Magnaporthe oryzae (Pyricularia oryzae)',
    hindiName: 'धान का झोंका रोग (ब्लास्ट)',
    affectedCrops: ['Paddy (Rice)', 'Finger Millet (Ragi)'],
    symptoms: [
      'Spindle-shaped / diamond-shaped lesions on leaves with brown/reddish margins and grey/whitish centers',
      'Neck blast: Panicle node turns blackish-brown and rots, causing lodging of the grain head',
      'Node blast: Blackened, brittle stem nodes that easily break under wind'
    ],
    favorableConditions: 'High relative humidity (>90%), cool nights (20°C - 24°C), prolonged leaf wetness due to fog or dew, heavy nitrogen application.',
    generalManagement: {
      cultural: 'Seed treatment with Trichoderma viride @ 5 g/kg seed or Carbendazim @ 2 g/kg seed. Avoid applying entire urea in one single application; split into three stages.',
      preventive: 'Adopt resistant cultivars. Maintain clean irrigation channels free of alternate graminaceous weed hosts.',
      fungicidal: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L immediately when diamond lesions appear on leaves or prior to heading.'
    },
    referenceSource: 'ICAR-National Rice Research Institute (NRRI), Cuttack'
  },
  {
    id: 'late-blight-potato',
    name: 'Late Blight of Potato',
    causalOrganism: 'Phytophthora infestans (Oomycete)',
    hindiName: 'आलू की पछेती झुलसा',
    affectedCrops: ['Potato', 'Tomato'],
    symptoms: [
      'Water-soaked dark lesions appearing at tips and margins of leaves',
      'White downy fungal mildew on underside of leaves in morning under damp conditions',
      'Rapid rotting of foliage emitting characteristic decaying odor; tuber brown dry rot'
    ],
    favorableConditions: 'Cloudy damp weather, temperatures between 12°C - 21°C with relative humidity >85% lasting consecutively for 24-48 hours.',
    generalManagement: {
      cultural: 'Plant certified disease-free tubers from verified cold stores. High earthing up prevents zoospores from washing down into tubers.',
      preventive: 'Spray Mancozeb 75% WP @ 2.5 g/L as prophylactic shield when cool cloudy weather sets in.',
      fungicidal: 'Spray Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L or Dimethomorph 50% WP @ 1 g/L or Metalaxyl-M + Mancozeb @ 2.5 g/L on disease appearance.'
    },
    referenceSource: 'ICAR-Central Potato Research Institute (CPRI), Shimla'
  }
];

// Integration-ready Agricultural Service Layer
export const agriIntelligenceService = {
  getStates: (): IndianStateAgriProfile[] => {
    return INDIAN_STATES_DATA;
  },

  getStateById: (id: string): IndianStateAgriProfile | undefined => {
    return INDIAN_STATES_DATA.find(s => s.id === id || s.code.toLowerCase() === id.toLowerCase());
  },

  getCrops: (): AgriCrop[] => {
    return AGRI_CROPS;
  },

  getCropById: (id: string): AgriCrop | undefined => {
    return AGRI_CROPS.find(c => c.id === id);
  },

  getPests: (): AgriPest[] => {
    return AGRI_PESTS;
  },

  getDiseases: (): AgriDisease[] => {
    return AGRI_DISEASES;
  },

  searchAll: (query: string, filters?: { state?: string; cropCategory?: string }) => {
    const q = query.trim().toLowerCase();
    
    let matchingCrops = AGRI_CROPS;
    if (filters?.cropCategory && filters.cropCategory !== 'All') {
      matchingCrops = matchingCrops.filter(c => c.category === filters.cropCategory);
    }
    
    if (q) {
      matchingCrops = matchingCrops.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.hindiName.toLowerCase().includes(q) ||
        c.growingRegions.some(r => r.toLowerCase().includes(q)) ||
        c.soil.toLowerCase().includes(q) ||
        c.sowingSeason.toLowerCase().includes(q)
      );
    }

    let matchingStates = INDIAN_STATES_DATA;
    if (q) {
      matchingStates = matchingStates.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.hindiName.toLowerCase().includes(q) ||
        s.primaryCrops.some(pc => pc.toLowerCase().includes(q)) ||
        s.majorSoils.some(ms => ms.toLowerCase().includes(q))
      );
    }

    let matchingPests = AGRI_PESTS;
    if (q) {
      matchingPests = matchingPests.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.hindiName.toLowerCase().includes(q) ||
        p.affectedCrops.some(ac => ac.toLowerCase().includes(q)) ||
        p.symptoms.some(s => s.toLowerCase().includes(q))
      );
    }

    let matchingDiseases = AGRI_DISEASES;
    if (q) {
      matchingDiseases = matchingDiseases.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.hindiName.toLowerCase().includes(q) ||
        d.affectedCrops.some(ac => ac.toLowerCase().includes(q)) ||
        d.symptoms.some(s => s.toLowerCase().includes(q))
      );
    }

    return {
      crops: matchingCrops,
      states: matchingStates,
      pests: matchingPests,
      diseases: matchingDiseases
    };
  }
};
