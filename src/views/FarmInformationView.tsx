import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Sprout, 
  Droplets, 
  Plus, 
  Radio, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Smartphone,
  Cpu,
  User,
  Phone
} from 'lucide-react';
import { Farm, FarmPlot, Language } from '../types';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';

interface FarmInformationViewProps {
  farm: Farm | null;
  onConnectFarm: (data: Partial<Farm>) => void;
  onAddPlot: (farmId: string, plot: Omit<FarmPlot, 'id' | 'sensorNodeId' | 'healthScore'>) => void;
  lang: Language;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const FarmInformationView: React.FC<FarmInformationViewProps> = ({
  farm,
  onConnectFarm,
  onAddPlot,
  lang,
}) => {
  const [isAddPlotModalOpen, setIsAddPlotModalOpen] = useState(false);
  const [isConnectFarmModalOpen, setIsConnectFarmModalOpen] = useState(false);

  // New Farm form state
  const [farmName, setFarmName] = useState('Guru Nanak Krishi Farm');
  const [farmerName, setFarmerName] = useState('Jaswinder Singh');
  const [phone, setPhone] = useState('+91 9301929218');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [totalAcres, setTotalAcres] = useState(12.5);

  // New Plot form state
  const [plotName, setPlotName] = useState('');
  const [plotAcres, setPlotAcres] = useState(4);
  const [cropName, setCropName] = useState('Wheat (HD-3086)');
  const [cropStage, setCropStage] = useState<FarmPlot['cropStage']>('Tillering');
  const [soilType, setSoilType] = useState('Alluvial Loam');
  const [irrigationType, setIrrigationType] = useState<FarmPlot['irrigationType']>('Drip');

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnectFarm({
      name: farmName,
      farmerName,
      phone,
      state,
      district,
      totalAcres: Number(totalAcres),
    });
    setIsConnectFarmModalOpen(false);
  };

  const handleAddPlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm) return;
    onAddPlot(farm.id, {
      name: plotName || `Plot #${farm.plots.length + 1}`,
      sizeAcres: Number(plotAcres),
      cropName,
      sowingDate: new Date().toISOString().split('T')[0],
      cropStage,
      soilType,
      irrigationType,
    });
    setIsAddPlotModalOpen(false);
    setPlotName('');
  };

  const currentFarm = farm || {
    id: 'farm-pb-104',
    name: 'Kisan Shanti Krishi Farm',
    farmerName: 'Sardar Gurpreet Singh',
    phone: '+91 9301929218',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samrala Kalan',
    totalAcres: 12.5,
    status: 'active' as const,
    dataSource: 'demo' as const,
    gatewayId: 'AGRO-ESP32-GW-901',
    batteryLevel: 94,
    signalStrength: 82,
    plots: [
      {
        id: 'plot-1',
        name: 'North Block (Wheat)',
        sizeAcres: 5.5,
        cropName: 'Wheat (HD-3086)',
        cropVariety: 'Pusa Gautami',
        sowingDate: '2026-11-12',
        cropStage: 'Tillering' as const,
        soilType: 'Loamy Alluvial',
        irrigationType: 'Drip' as const,
        sensorNodeId: 'NODE-ESP32-W1',
        healthScore: 88,
      },
      {
        id: 'plot-2',
        name: 'South Terrace (Mustard)',
        sizeAcres: 4.0,
        cropName: 'Mustard (Giriraj)',
        cropVariety: 'DRMRIJ-31',
        sowingDate: '2026-10-20',
        cropStage: 'Flowering' as const,
        soilType: 'Sandy Loam',
        irrigationType: 'Sprinkler' as const,
        sensorNodeId: 'NODE-ESP32-M2',
        healthScore: 82,
      },
      {
        id: 'plot-3',
        name: 'Riverbank Sector (Potato)',
        sizeAcres: 3.0,
        cropName: 'Potato (Kufri Jyoti)',
        cropVariety: 'Kufri Jyoti Early',
        sowingDate: '2026-10-28',
        cropStage: 'Vegetative' as const,
        soilType: 'Alluvial Silt',
        irrigationType: 'Flood / Furrow' as const,
        sensorNodeId: 'NODE-ESP32-P3',
        healthScore: 74,
      }
    ]
  };

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'खेत की जानकारी' : 'Farm Information'}
        subtitle={lang === 'hi'
          ? 'खेत की भौगोलिक स्थिति, मिट्टी और फसल का विवरण'
          : 'Geographic parcel coordinates, soil characteristics, and active plots'}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddPlotModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] active:bg-[#0d8f4a] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'hi' ? 'प्लॉट जोड़ें' : 'Add Plot'}</span>
            </button>
            <button
              onClick={() => setIsConnectFarmModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141b16] hover:bg-stone-50 text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-2xs cursor-pointer transition-all"
            >
              <span>{lang === 'hi' ? 'खेत संपादित करें' : 'Edit Farm'}</span>
            </button>
          </div>
        }
      />

      {/* Farm Overview Card */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {currentFarm.name}
              </h2>
              <StatusBadge status="ACTIVE" variant="healthy" size="xs" dot={true} />
            </div>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentFarm.village}, {currentFarm.district}, {currentFarm.state} • India</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Total Area</span>
              <span className="font-extrabold text-stone-800 dark:text-stone-200">{currentFarm.totalAcres} Acres</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Gateway</span>
              <span className="font-mono text-emerald-600 font-bold">{currentFarm.gatewayId}</span>
            </div>
          </div>
        </div>

        {/* 4-column quick specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Farmer</span>
            <div className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">{currentFarm.farmerName}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Contact</span>
            <div className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">{currentFarm.phone}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Sensor Nodes</span>
            <div className="font-bold text-stone-800 dark:text-stone-100 mt-0.5">{currentFarm.plots.length} Deployed</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60">
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Telemetry Frequency</span>
            <div className="font-bold text-emerald-600 mt-0.5">2-Min Sync Interval</div>
          </div>
        </div>
      </Card>

      {/* Field Plots Grid */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0fa958]" />
            <span>Field Plots ({currentFarm.plots.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentFarm.plots.map((plot) => (
            <Card key={plot.id} className="p-4 sm:p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {plot.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-medium">
                      {plot.sizeAcres} Acres • {plot.cropStage}
                    </p>
                  </div>
                  <StatusBadge
                    status={plot.healthScore >= 80 ? 'Healthy' : 'Attention'}
                    variant={plot.healthScore >= 80 ? 'healthy' : 'attention'}
                    size="xs"
                    dot={true}
                  />
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Crop:</span>
                    <strong>{plot.cropName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Variety:</span>
                    <span>{plot.cropVariety}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Soil Type:</span>
                    <span>{plot.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Irrigation:</span>
                    <span className="text-sky-600 font-semibold">{plot.irrigationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Node ID:</span>
                    <span className="font-mono text-stone-500">{plot.sensorNodeId}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-3 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Health Index: <strong className="text-emerald-600">{plot.healthScore}%</strong></span>
                <span className="text-stone-400">Sown: {plot.sowingDate}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Plot Modal */}
      <Modal
        isOpen={isAddPlotModalOpen}
        onClose={() => setIsAddPlotModalOpen(false)}
        title="Add Field Plot"
        subtitle="Configure crop parameters and soil zone"
      >
        <form onSubmit={handleAddPlotSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Plot Name</label>
            <input
              type="text"
              required
              placeholder="e.g. East Terrace Block 4"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Size (Acres)</label>
              <input
                type="number"
                step="0.1"
                required
                value={plotAcres}
                onChange={(e) => setPlotAcres(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Crop</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setIsAddPlotModalOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white font-bold cursor-pointer shadow-xs"
            >
              Save Plot
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Farm Modal */}
      <Modal
        isOpen={isConnectFarmModalOpen}
        onClose={() => setIsConnectFarmModalOpen(false)}
        title="Edit Farm Profile"
        subtitle="Update farm registration details"
      >
        <form onSubmit={handleConnectSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Farm Name</label>
            <input
              type="text"
              required
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Farmer Name</label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={() => setIsConnectFarmModalOpen(false)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0fa958] hover:bg-[#13b963] text-white font-bold cursor-pointer shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
