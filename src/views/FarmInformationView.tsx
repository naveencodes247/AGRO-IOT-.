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
  Cpu
} from 'lucide-react';
import { Farm, FarmPlot, Language } from '../types';
import { DemoBadge } from '../components/common/DemoBadge';
import { EmptyState } from '../components/common/EmptyState';
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
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [isAddPlotModalOpen, setIsAddPlotModalOpen] = useState(false);
  const [isConnectFarmModalOpen, setIsConnectFarmModalOpen] = useState(false);

  // New Farm form state
  const [farmName, setFarmName] = useState('Guru Nanak Krishi Farm');
  const [farmerName, setFarmerName] = useState('Jaswinder Singh');
  const [phone, setPhone] = useState('+91 9301929218');
  const [state, setState] = useState('Punjab');
  const [district, setDistrict] = useState('Ludhiana');
  const [totalAcres, setTotalAcres] = useState(10);

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

  if (!farm || !isDemoMode) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {lang === 'hi' ? 'खेत की जानकारी एवं व्यवस्था' : 'Farm Profile & Plot Management'}
              </h2>
              <DemoBadge mode="waiting" onToggleMode={onToggleDemoMode} />
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'hi' ? 'खेत की भौगोलिक स्थिति, मिट्टी और फसल का विवरण' : 'Geographic parcel coordinates, soil characteristics, and active plots'}
            </p>
          </div>

          <button
            onClick={() => setIsConnectFarmModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            {lang === 'hi' ? 'नया खेत जोड़ें' : 'Connect Farm'}
          </button>
        </div>

        <EmptyState
          icon={Layers}
          badge="NO FARM CONNECTED YET"
          title={lang === 'hi' ? 'कोई खेत कनेक्टेड नहीं है' : 'No Farm Registered Yet'}
          description={lang === 'hi'
            ? 'निगरानी शुरू करने के लिए अपने खेत और भूखंड का विवरण दर्ज करें, अथवा पूर्वावलोकन के लिए डेमो खेत लोड करें।'
            : 'Register your land coordinates, soil classification, and active seasonal crops to start telemetry monitoring, or load the demo farm to inspect the interface.'}
          actionLabel={lang === 'hi' ? 'खेत पंजीकृत करें' : 'Register New Farm'}
          onAction={() => setIsConnectFarmModalOpen(true)}
          secondaryActionLabel={lang === 'hi' ? 'डेमो खेत देखें' : 'View Demo Farm'}
          onSecondaryAction={onToggleDemoMode}
        />

        {/* Connect Farm Modal */}
        <Modal
          isOpen={isConnectFarmModalOpen}
          onClose={() => setIsConnectFarmModalOpen(false)}
          title={lang === 'hi' ? 'खेत कनेक्शन विज़ार्ड' : 'Register Farm & Field Gateway'}
          subtitle="Pair local ESP32 controller and set regional agronomic parameters"
        >
          <form onSubmit={handleConnectSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Farm or Holding Name
              </label>
              <input
                type="text"
                required
                value={farmName}
                onChange={e => setFarmName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                placeholder="e.g. Kisan Model Farm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Contact Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Total Land (Acres)
                </label>
                <input
                  type="number"
                  required
                  value={totalAcres}
                  onChange={e => setTotalAcres(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConnectFarmModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
              >
                Save & Initialize Farm
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'खेत की जानकारी एवं भूखंड' : 'Farm Information & Field Parcels'}
            </h2>
            <DemoBadge mode="demo" onToggleMode={onToggleDemoMode} />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'खेत का प्रशासनिक पता, मिट्टी की संरचना और सक्रिय फसल भूखंड'
              : 'Land records, soil typology, crop growth stage, and sensor pairing'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddPlotModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'नया भूखंड (Plot) जोड़ें' : 'Add Field Plot'}</span>
          </button>
        </div>
      </div>

      {/* Farm Profile Summary Banner */}
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Farm & Landholder
            </span>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {farm.name}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Owner: {farm.farmerName} ({farm.phone})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Location & Jurisdiction
            </span>
            <div className="flex items-center gap-1.5 text-xs text-stone-800 dark:text-stone-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{farm.village}, {farm.district}</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {farm.state} (Indo-Gangetic Plain)
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Holding Extent & Season
            </span>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
              {farm.totalAcres} Acres ({farm.plots.length} Sub-Plots)
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Season: Rabi 2026-2027
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              IoT Hardware Status
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Radio className="w-3.5 h-3.5" />
              <span>Gateway: {farm.gatewayId}</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Battery: {farm.batteryLevel}% · Signal: Good
            </p>
          </div>
        </div>
      </div>

      {/* Plot Breakdown Cards */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Active Agricultural Plots ({farm.plots.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farm.plots.map((plot) => (
            <div
              key={plot.id}
              className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs space-y-4 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {plot.name}
                  </h4>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Area: {plot.sizeAcres} Acres
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {plot.cropStage}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Crop Cultivar:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">{plot.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Soil Type:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{plot.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Irrigation Method:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">{plot.irrigationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 dark:text-stone-400">Sensor Node:</span>
                  <span className="font-mono text-stone-700 dark:text-stone-300">{plot.sensorNodeId}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[11px] text-stone-500">Plot Health Index:</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {plot.healthScore}/100 (Optimal)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Plot Modal */}
      <Modal
        isOpen={isAddPlotModalOpen}
        onClose={() => setIsAddPlotModalOpen(false)}
        title={lang === 'hi' ? 'नया भूखंड (Plot) जोड़ें' : 'Register Sub-Plot to Farm'}
        subtitle={`Assign crops, soil type, and node configuration for ${farm.name}`}
      >
        <form onSubmit={handleAddPlotSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
              Plot Identification Name
            </label>
            <input
              type="text"
              required
              value={plotName}
              onChange={e => setPlotName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              placeholder="e.g. East Terrace Block #4"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Crop & Variety
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Area in Acres
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={plotAcres}
                onChange={e => setPlotAcres(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Crop Phenological Stage
              </label>
              <select
                value={cropStage}
                onChange={e => setCropStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Germination">Germination</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Tillering">Tillering</option>
                <option value="Flowering">Flowering</option>
                <option value="Grain Filling">Grain Filling</option>
                <option value="Maturity">Maturity</option>
                <option value="Harvest">Harvest</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationType}
                onChange={e => setIrrigationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler System</option>
                <option value="Flood / Furrow">Flood / Furrow</option>
                <option value="Canal">Canal Feeder</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddPlotModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Add Plot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
