import { SupportTicket } from '../types';

export const HELPLINE_NUMBER = '+91 9301929218';
export const HELPLINE_TEL_HREF = 'tel:+919301929218';

export interface FAQItem {
  id: string;
  category: 'farm_connection' | 'crop_analyzer' | 'sensors' | 'offline_sync';
  question: string;
  hindiQuestion: string;
  answer: string;
  hindiAnswer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'farm_connection',
    question: 'How do I connect an ESP32 or LoRaWAN sensor node to AGRO-IOT?',
    hindiQuestion: 'एग्रो-आईओटी से ESP32 या LoRaWAN सेंसर कैसे कनेक्ट करें?',
    answer: 'Turn on your farm gateway device within 500 meters of the field nodes. Open Farm Information > Connect Device, enter your Gateway MAC / ID printed on the casing, and click Pair. No internet is required for local field data transmission.',
    hindiAnswer: 'अपने खेत के पास गेटवे डिवाइस चालू करें। "खेत की जानकारी" में जाकर "डिवाइस कनेक्ट करें" पर क्लिक करें और गेटवे पर लिखा कोड डालें।'
  },
  {
    id: 'faq-2',
    category: 'sensors',
    question: 'Where should soil moisture sensors be placed in the soil profile?',
    hindiQuestion: 'मिट्टी की नमी सेंसर खेत में किस गहराई पर लगाने चाहिए?',
    answer: 'Install two probes: one at 15 cm (active root zone for early vegetative stages) and a second probe at 30-45 cm (sub-surface reservoir for root tap roots and waterlogging detection). Avoid air pockets around the sensor tines.',
    hindiAnswer: 'दो गहराई पर सेंसर लगाएं: 15 सेमी (ऊपरी जड़ें) और 30 सेमी (गहरी जड़ें)। सेंसर के चारों तरफ मिट्टी अच्छी तरह दबाएं।'
  },
  {
    id: 'faq-3',
    category: 'crop_analyzer',
    question: 'How do I get the most accurate leaf scan in the Crop Analyzer?',
    hindiQuestion: 'फसल विश्लेषक से सही रोग पहचान के लिए पत्ता कैसे स्कैन करें?',
    answer: 'Take the photo in morning natural daylight with the sun behind your camera. Place the affected leaf against a plain background (such as your palm or a notebook page) and ensure lesion margins are sharply focused.',
    hindiAnswer: 'सुबह की धूप में पत्ते की साफ फोटो लें। पत्ते को हाथ की हथेली या सादे कागज पर रखकर फोटो लें जिससे रोग के धब्बे साफ दिखें।'
  },
  {
    id: 'faq-4',
    category: 'offline_sync',
    question: 'Does AGRO-IOT work when my field has zero mobile internet signal?',
    hindiQuestion: 'क्या इंटरनेट या मोबाइल सिग्नल न होने पर भी यह काम करता है?',
    answer: 'Yes. AGRO-IOT is architected offline-first. The local farm controller records sensor telemetry, executes irrigation logic, and presents advisory notifications locally on your device via local Wi-Fi / Bluetooth. Telemetry synchronizes to cloud storage once connectivity returns.',
    hindiAnswer: 'हाँ, यह बिना इंटरनेट के भी पूरी तरह काम करता है। स्थानीय कंट्रोलर सीधे आपके फोन पर जानकारी भेजता है और इंटरनेट आने पर डेटा सिंक होता है।'
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
      createdAt: new Date().toLocaleString(),
    };
    this.tickets = [newTicket, ...this.tickets];
    localStorage.setItem('agro_iot_support_tickets', JSON.stringify(this.tickets));
    return newTicket;
  }
}

export const supportService = new SupportService();
