export interface HistoricalPoint {
  date: string;
  soilMoisture15: number;
  soilMoisture30: number;
  temperature: number;
  humidity: number;
  cropHealthIndex: number;
  irrigationHours: number;
}

export const DEMO_HISTORY_POINTS: HistoricalPoint[] = [
  { date: 'Mon', soilMoisture15: 34, soilMoisture30: 38, temperature: 22, humidity: 74, cropHealthIndex: 88, irrigationHours: 1.5 },
  { date: 'Tue', soilMoisture15: 31, soilMoisture30: 36, temperature: 23, humidity: 70, cropHealthIndex: 88, irrigationHours: 0 },
  { date: 'Wed', soilMoisture15: 28, soilMoisture30: 34, temperature: 24, humidity: 66, cropHealthIndex: 87, irrigationHours: 0 },
  { date: 'Thu', soilMoisture15: 25, soilMoisture30: 32, temperature: 25, humidity: 62, cropHealthIndex: 86, irrigationHours: 2.0 },
  { date: 'Fri', soilMoisture15: 35, soilMoisture30: 39, temperature: 23, humidity: 72, cropHealthIndex: 89, irrigationHours: 0 },
  { date: 'Sat', soilMoisture15: 32, soilMoisture30: 37, temperature: 24, humidity: 69, cropHealthIndex: 89, irrigationHours: 0 },
  { date: 'Sun', soilMoisture15: 28, soilMoisture30: 34, temperature: 25, humidity: 68, cropHealthIndex: 88, irrigationHours: 0 }
];

export const analyticsService = {
  getHistoricalData: (mode: 'demo' | 'empty'): HistoricalPoint[] => {
    if (mode === 'empty') {
      return [];
    }
    return DEMO_HISTORY_POINTS;
  }
};
