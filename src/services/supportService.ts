import { SupportTicket } from '../types';

export const HELPLINE_NUMBER = '+91 93019 29218';
export const HELPLINE_TEL_HREF = 'tel:+919301929218';
export const KISAN_TOLLFREE_NUMBER = '1800-180-1551';
export const KISAN_TOLLFREE_HREF = 'tel:18001801551';
export const WHATSAPP_NUMBER = '+91 93019 29218';
export const WHATSAPP_CHAT_URL = 'https://wa.me/919301929218?text=Hello%20AGRO-IoT%20Team%2C%20I%20need%20expert%20assistance%20with%20my%20smart%20farm%20setup';

export interface VerifiedAgronomist {
  id: string;
  name: string;
  hindiName: string;
  designation: string;
  hindiDesignation: string;
  institution: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  consultationsCount: number;
  availableNow: boolean;
  avatarBadge: string;
  contactNumber: string;
}

export const VERIFIED_AGRONOMISTS: VerifiedAgronomist[] = [
  {
    id: 'agro-1',
    name: 'Dr. Rameshwar Sharma',
    hindiName: 'डॉ. रामेश्वर शर्मा',
    designation: 'Senior Soil & Water Agronomist',
    hindiDesignation: 'वरिष्ठ मृदा एवं जल वैज्ञानिक',
    institution: 'ICAR - Krishi Vigyan Kendra (KVK)',
    specialization: 'Soil Chemistry, NPK Micro-nutrients, Sub-surface Drip',
    experienceYears: 18,
    rating: 4.9,
    consultationsCount: 1420,
    availableNow: true,
    avatarBadge: '👨‍🔬',
    contactNumber: '+91 93019 29218'
  },
  {
    id: 'agro-2',
    name: 'Er. Ananya Verma',
    hindiName: 'इंजी. अनन्या वर्मा',
    designation: 'Lead IoT Hardware & Embedded Systems',
    hindiDesignation: 'प्रमुख आईओटी हार्डवेयर एवं एम्बेडेड इंजीनियर',
    institution: 'AGRO-IoT Edge Systems Lab',
    specialization: 'ESP32 Nodes, LoRaWAN 865MHz, Solar Relay Controllers',
    experienceYears: 9,
    rating: 4.9,
    consultationsCount: 980,
    availableNow: true,
    avatarBadge: '👩‍💻',
    contactNumber: '+91 93019 29218'
  },
  {
    id: 'agro-3',
    name: 'Dr. Gurpreet Singh',
    hindiName: 'डॉ. गुरप्रीत सिंह',
    designation: 'Plant Pathologist & IPM Specialist',
    hindiDesignation: 'पादप रोग विशेषज्ञ एवं कीट प्रबंधन विशेषज्ञ',
    institution: 'Punjab Agricultural University (PAU)',
    specialization: 'Foliar Blights, Rusts, Downy Mildews, Organic Bio-pesticides',
    experienceYears: 15,
    rating: 5.0,
    consultationsCount: 2150,
    availableNow: false,
    avatarBadge: '🌾',
    contactNumber: '+91 93019 29218'
  }
];

export interface FAQItem {
  id: string;
  category: 'farm_connection' | 'crop_analyzer' | 'sensors' | 'irrigation_relay' | 'schemes';
  question: string;
  hindiQuestion: string;
  answer: string;
  hindiAnswer: string;
  tag: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'farm_connection',
    question: 'How do I connect an ESP32 or LoRaWAN sensor node to AGRO-IOT?',
    hindiQuestion: 'एग्रो-आईओटी से ESP32 या LoRaWAN सेंसर कैसे कनेक्ट करें?',
    answer: 'Turn on your farm gateway device within 500 meters of field nodes. Open the Hardware & API Gateway bar in the header, verify the Gateway ID (e.g., ESP32-GW-901), and confirm the LoRa 865MHz band is active. Telemetry packets will automatically stream into the dashboard without internet required for local transmission.',
    hindiAnswer: 'अपने खेत के पास गेटवे डिवाइस चालू करें। हेडर में हार्डवेयर गेटवे बार खोलें, गेटवे आईडी की पुष्टि करें और सुनिश्चित करें कि 865MHz बैंड सक्रिय है। डेटा बिना इंटरनेट के भी सीधे स्थानीय कंट्रोलर पर आता रहेगा।',
    tag: 'ESP32 / LoRa'
  },
  {
    id: 'faq-2',
    category: 'sensors',
    question: 'Where should soil moisture sensors be placed in the soil profile?',
    hindiQuestion: 'मिट्टी की नमी सेंसर खेत में किस गहराई पर लगाने चाहिए?',
    answer: 'Install two probes: one at 15 cm (active root zone for early vegetative stages) and a second probe at 30-45 cm (sub-surface reservoir for root tap roots and waterlogging detection). Avoid air pockets around the sensor tines by packing slurry soil around probe blades.',
    hindiAnswer: 'दो गहराई पर सेंसर लगाएं: 15 सेमी (ऊपरी जड़ें) और 30 सेमी (गहरी जड़ें)। सेंसर के चारों तरफ मिट्टी अच्छी तरह दबाएं ताकि हवा के बुलबुले न रहें।',
    tag: 'Capacitive Probes'
  },
  {
    id: 'faq-3',
    category: 'crop_analyzer',
    question: 'How do I get the most accurate leaf scan in the Crop Analyzer?',
    hindiQuestion: 'फसल विश्लेषक से सही रोग पहचान के लिए पत्ता कैसे स्कैन करें?',
    answer: 'Select your crop type from the dropdown (available in English & हिन्दी). Click "Open Real Camera" or upload a photo taken in natural daylight. Position the affected leaf in the center viewfinder so diseased spots and lesions are clearly in focus, then click "Analyze Leaf Health".',
    hindiAnswer: 'ड्रॉपडाउन से अपनी फसल चुनें। "कैमरा चालू करें" पर क्लिक करें या फोटो अपलोड करें। रोगग्रस्त हिस्से को कैमरे के केंद्र में रखें ताकि धब्बे साफ दिखें, फिर "पत्ता स्वास्थ्य विश्लेषण" पर क्लिक करें।',
    tag: 'AI Diagnostics'
  },
  {
    id: 'faq-4',
    category: 'irrigation_relay',
    question: 'How does the motor auto-cutoff and dry-run protection work?',
    hindiQuestion: 'मोटर का ऑटो-कटऑफ और ड्राई-रन सुरक्षा कैसे काम करती है?',
    answer: 'When water tank capacity drops below 15% or the inline flow meter detects 0 L/min while the pump relay is commanded ON, the Edge AI system automatically triggers an emergency shutoff in 1.2 seconds to prevent motor burnout.',
    hindiAnswer: 'यदि पानी की टंकी 15% से कम हो जाए या पंप चालू होने पर भी पानी न बहे, तो एज एआई सिस्टम मोटर को जलने से बचाने के लिए 1.2 सेकंड में स्वतः बंद कर देता है।',
    tag: 'Pump Protection'
  },
  {
    id: 'faq-5',
    category: 'sensors',
    question: 'How often do soil NPK and pH probes need calibration?',
    hindiQuestion: 'एनपीके (NPK) और पीएच (pH) सेंसर को कितने दिनों में कैलिब्रेट करना होता है?',
    answer: 'Optical/electrochemical NPK probes should be cleaned with distilled water every 30 days during active growing seasons. Soil pH probes should be recalibrated every 60 days using standard pH 4.0 and pH 7.0 buffer solutions.',
    hindiAnswer: 'हर 30 दिन में सेंसर को साफ पानी से धोएं। पीएच सेंसर को हर 60 दिन में बफर घोल (pH 4.0 और 7.0) से दोबारा सेट करें।',
    tag: 'Calibration'
  },
  {
    id: 'faq-6',
    category: 'schemes',
    question: 'How can I get government subsidy for solar pumps and IoT sensors?',
    hindiQuestion: 'सोलर पंप और स्मार्ट सेंसर पर सरकारी सब्सिडी कैसे प्राप्त करें?',
    answer: 'Under the PM-KUSUM Scheme (Component B & C) and State Precision Agriculture Missions, farmers can receive up to 60% capital subsidy for solar pumps, micro-irrigation drip systems, and smart telemetry controllers through their local Krishi Vigyan Kendra.',
    hindiAnswer: 'पीएम-कुसुम योजना और राज्य सूक्ष्म सिंचाई मिशन के तहत किसानों को सोलर पंप और ड्रिप सिस्टम पर 60% तक सब्सिडी मिलती है। अपने नजदीकी कृषि विज्ञान केंद्र में संपर्क करें।',
    tag: 'PM-KUSUM Subsidy'
  }
];

class SupportService {
  private tickets: SupportTicket[] = [];

  constructor() {
    const saved = localStorage.getItem('agro_iot_support_tickets');
    if (saved) {
      try {
        this.tickets = JSON.parse(saved);
      } catch {
        this.tickets = [];
      }
    } else {
      // Seed an initial demo ticket so farmers see how it works
      this.tickets = [
        {
          id: 'TKT-894102',
          farmerName: 'Gurwinder Sandhu',
          phone: '+91 98140-52319',
          issueCategory: 'farm_connection',
          message: 'ESP32 node in Plot A4 needs antenna re-orientation for 865MHz signal boost.',
          preferredTime: 'Morning (9 AM - 12 PM)',
          status: 'in_review',
          createdAt: 'Today, 08:30 AM'
        }
      ];
      localStorage.setItem('agro_iot_support_tickets', JSON.stringify(this.tickets));
    }
  }

  getTickets(): SupportTicket[] {
    return this.tickets;
  }

  createTicket(data: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>): SupportTicket {
    const newTicket: SupportTicket = {
      ...data,
      id: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'submitted',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
    };
    this.tickets = [newTicket, ...this.tickets];
    localStorage.setItem('agro_iot_support_tickets', JSON.stringify(this.tickets));
    return newTicket;
  }
}

export const supportService = new SupportService();
