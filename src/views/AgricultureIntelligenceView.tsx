import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Sprout, 
  Bug, 
  ShieldAlert, 
  Sun, 
  Droplets, 
  Filter, 
  X, 
  ExternalLink,
  Info
} from 'lucide-react';
import { AgriCrop, AgriDisease, AgriPest, IndianStateAgriProfile, Language } from '../types';
import { agriIntelligenceService, INDIAN_STATES_DATA, AGRI_CROPS, AGRI_PESTS, AGRI_DISEASES } from '../services/agriIntelligenceService';
import { IndiaMap } from '../components/common/IndiaMap';
import { Modal } from '../components/common/Modal';

interface AgricultureIntelligenceViewProps {
  lang: Language;
}

export const AgricultureIntelligenceView: React.FC<AgricultureIntelligenceViewProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'crops' | 'pests' | 'diseases'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStateId, setSelectedStateId] = useState<string>('punjab');
  
  // Selected detail modal
  const [selectedCrop, setSelectedCrop] = useState<AgriCrop | null>(null);
  const [selectedPest, setSelectedPest] = useState<AgriPest | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<AgriDisease | null>(null);

  const searchResults = agriIntelligenceService.searchAll(searchQuery, {
    cropCategory: selectedCategory
  });

  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial', 'Vegetables'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'भारतीय राष्ट्रीय कृषि ज्ञानकोश' : 'National Agriculture Intelligence System'}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ICAR Grounded
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? '28 राज्य, 8 केंद्र शासित प्रदेश, फसल गाइड, कीट एवं रोग प्रबंधन संदर्भ'
              : 'Verified agronomic repository for Indian agro-climatic zones, cropping systems, and IPM'}
          </p>
        </div>

        {/* Sub-navigation tabs (Map, Crops, Pests, Diseases) */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'भारत मानचित्र' : 'India Agri Map'}
          </button>
          <button
            onClick={() => setActiveTab('crops')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'crops'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'फसलें' : 'Crops Directory'}
          </button>
          <button
            onClick={() => setActiveTab('pests')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'pests'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'कीट' : 'Pests'}
          </button>
          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'diseases'
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            {lang === 'hi' ? 'रोग' : 'Diseases'}
          </button>
        </div>
      </div>

      {/* Global Agriculture Search Bar */}
      <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'फसल, कीट, रोग, राज्य या मिट्टी का नाम खोजें...' : 'Search by Crop, Pest, Disease, State, Soil, or Season...'}
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {activeTab === 'crops' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-stone-500 whitespace-nowrap mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Areas */}

      {/* Tab 1: Interactive India Map */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <IndiaMap
            selectedStateId={selectedStateId}
            onSelectState={(state) => setSelectedStateId(state.id)}
            lang={lang}
          />
        </div>
      )}

      {/* Tab 2: Crops Directory */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {searchResults.crops.map((crop) => (
            <div
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs hover:border-emerald-500/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {crop.name}
                  </h3>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {crop.hindiName}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {crop.category}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Sowing Season: </strong>
                  {crop.sowingSeason}
                </div>
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Ideal Temp: </strong>
                  {crop.idealTemperature}
                </div>
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Growth Duration: </strong>
                  {crop.growthDurationDays}
                </div>
                <div className="truncate">
                  <strong className="text-stone-800 dark:text-stone-200">Key Regions: </strong>
                  {crop.growingRegions.join(', ')}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>View Full Agronomy Guide</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Pests Directory */}
      {activeTab === 'pests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {searchResults.pests.map((pest) => (
            <div
              key={pest.id}
              onClick={() => setSelectedPest(pest)}
              className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs hover:border-amber-500/50 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {pest.name}
                  </h3>
                  <div className="text-xs text-stone-500 italic">
                    {pest.scientificName} · {pest.hindiName}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <Bug className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Host Crops: </strong>
                  {pest.affectedCrops.join(', ')}
                </div>
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Favorable Climate: </strong>
                  {pest.favorableConditions}
                </div>
                <div className="line-clamp-2">
                  <strong className="text-stone-800 dark:text-stone-200">Primary Damage: </strong>
                  {pest.symptoms[0]}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px] truncate">Ref: {pest.referenceSource}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">IPM Strategy →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Diseases Directory */}
      {activeTab === 'diseases' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {searchResults.diseases.map((dis) => (
            <div
              key={dis.id}
              onClick={() => setSelectedDisease(dis)}
              className="p-5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs hover:border-rose-500/50 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {dis.name}
                  </h3>
                  <div className="text-xs text-stone-500 italic">
                    {dis.causalOrganism} · {dis.hindiName}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Susceptible Crops: </strong>
                  {dis.affectedCrops.join(', ')}
                </div>
                <div>
                  <strong className="text-stone-800 dark:text-stone-200">Weather Triggers: </strong>
                  {dis.favorableConditions}
                </div>
                <div className="line-clamp-2">
                  <strong className="text-stone-800 dark:text-stone-200">Pathology: </strong>
                  {dis.symptoms[0]}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px] truncate">Ref: {dis.referenceSource}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Fungicide & Cultural Care →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedCrop(null)}
          title={`${selectedCrop.name} (${selectedCrop.hindiName})`}
          subtitle={`Category: ${selectedCrop.category} · Season: ${selectedCrop.sowingSeason}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px] block">Optimal Climate</span>
                <p className="text-stone-800 dark:text-stone-200 mt-0.5">{selectedCrop.climate}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold uppercase text-[10px] block">Soil Requirement</span>
                <p className="text-stone-800 dark:text-stone-200 mt-0.5">{selectedCrop.soil}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Ideal Temperature</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-1 block">{selectedCrop.idealTemperature}</span>
              </div>
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Water Requirement</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-1 block">{selectedCrop.waterRequirement}</span>
              </div>
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Growth Duration</span>
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm mt-1 block">{selectedCrop.growthDurationDays}</span>
              </div>
            </div>

            {/* Nutrients */}
            <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-emerald-900 dark:text-emerald-300 font-bold uppercase text-[10px]">
                Recommended N-P-K & Manure Baseline
              </span>
              <div className="grid grid-cols-2 gap-2 text-stone-700 dark:text-stone-300 pt-1">
                <div>Nitrogen (N): <strong>{selectedCrop.nutrientRequirements.nitrogen}</strong></div>
                <div>Phosphorus (P): <strong>{selectedCrop.nutrientRequirements.phosphorus}</strong></div>
                <div>Potassium (K): <strong>{selectedCrop.nutrientRequirements.potassium}</strong></div>
                <div>Organic Matter: <strong>{selectedCrop.nutrientRequirements.organicMatter}</strong></div>
              </div>
            </div>

            {/* Harvest & Storage */}
            <div className="space-y-2">
              <div>
                <strong className="text-stone-900 dark:text-stone-100">Harvesting Guidelines: </strong>
                <span className="text-stone-600 dark:text-stone-400">{selectedCrop.harvestAdvice}</span>
              </div>
              <div>
                <strong className="text-stone-900 dark:text-stone-100">Post-Harvest Storage: </strong>
                <span className="text-stone-600 dark:text-stone-400">{selectedCrop.storageRecommendation}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Pest Detail Modal */}
      {selectedPest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPest(null)}
          title={`${selectedPest.name} (${selectedPest.hindiName})`}
          subtitle={`Scientific: ${selectedPest.scientificName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 font-bold uppercase text-[10px] block">Field Identification</span>
              <p className="text-stone-800 dark:text-stone-200 mt-1">{selectedPest.identification}</p>
            </div>

            <div>
              <span className="text-stone-900 dark:text-stone-100 font-bold block mb-1">Symptoms of Damage:</span>
              <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                {selectedPest.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* IPM Trio */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-700">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 block uppercase text-[10px]">
                Integrated Pest Management (IPM) Schedule
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  <strong>Cultural / Mechanical: </strong>{selectedPest.generalManagement.cultural}
                </div>
                <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <strong>Biological Control: </strong>{selectedPest.generalManagement.biological}
                </div>
                <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                  <strong>Chemical Spray (At Economic Threshold): </strong>{selectedPest.generalManagement.chemical}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 italic pt-2">
              Reference Authority: {selectedPest.referenceSource}
            </div>
          </div>
        </Modal>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDisease(null)}
          title={`${selectedDisease.name} (${selectedDisease.hindiName})`}
          subtitle={`Causal Organism: ${selectedDisease.causalOrganism}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-stone-900 dark:text-stone-100 font-bold block mb-1">Pathological Symptoms:</span>
              <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400">
                {selectedDisease.symptoms.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 font-bold uppercase text-[10px] block">Favorable Weather Conditions</span>
              <p className="text-stone-800 dark:text-stone-200 mt-1">{selectedDisease.favorableConditions}</p>
            </div>

            {/* Disease Management */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-700">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 block uppercase text-[10px]">
                Recommended Disease Management
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  <strong>Preventive: </strong>{selectedDisease.generalManagement.preventive}
                </div>
                <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                  <strong>Cultural Practices: </strong>{selectedDisease.generalManagement.cultural}
                </div>
                <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
                  <strong>Fungicidal Spray: </strong>{selectedDisease.generalManagement.fungicidal}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 italic pt-2">
              Reference Authority: {selectedDisease.referenceSource}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
