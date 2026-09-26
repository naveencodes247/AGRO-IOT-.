import React, { useState } from 'react';
import { 
  Globe, 
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
  Info,
  ArrowRight
} from 'lucide-react';
import { AgriCrop, AgriDisease, AgriPest, Language } from '../types';
import { agriIntelligenceService } from '../services/agriIntelligenceService';
import { IndiaMap } from '../components/common/IndiaMap';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
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
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Unified Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'कृषि इंटेलिजेंस' : 'Agriculture Intelligence'}
        subtitle={lang === 'hi'
          ? '28 राज्य, 8 केंद्र शासित प्रदेश, फसल गाइड, कीट एवं रोग प्रबंधन संदर्भ'
          : 'Explore crop, soil, pest and disease information across Indian agro-climatic zones'}
        actions={
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-850 rounded-xl text-xs font-semibold">
            {[
              { id: 'map', label: lang === 'hi' ? 'भारत नक्शा' : 'India Agri Map' },
              { id: 'crops', label: lang === 'hi' ? 'फसलें' : 'Crops' },
              { id: 'pests', label: lang === 'hi' ? 'कीट' : 'Pests' },
              { id: 'diseases', label: lang === 'hi' ? 'रोग' : 'Diseases' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'फसल, कीट या रोग खोजें...' : 'Search crops, pests, diseases or state...'}
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 rounded-xl text-xs sm:text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills (for crops tab) */}
        {activeTab === 'crops' && (
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0fa958] text-white shadow-2xs'
                    : 'bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content 1: India Agricultural Map */}
      {activeTab === 'map' && (
        <Card className="p-4 sm:p-5">
          <IndiaMap
            selectedStateId={selectedStateId}
            onSelectState={setSelectedStateId}
            lang={lang}
          />
        </Card>
      )}

      {/* Tab Content 2: Crops Directory */}
      {activeTab === 'crops' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchResults.crops.map((crop) => (
            <Card
              key={crop.id}
              onClick={() => setSelectedCrop(crop)}
              className="p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {crop.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 italic">
                      {crop.scientificName}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                    {crop.category}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Season:</span>
                    <strong className="text-stone-800 dark:text-stone-200">{crop.season}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Duration:</span>
                    <span>{crop.durationDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Water Need:</span>
                    <span className="text-sky-600 font-semibold">{crop.waterRequirementMm} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Ideal Temp:</span>
                    <span>{crop.idealTempC[0]} - {crop.idealTempC[1]}°C</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-3 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Major: {crop.majorStates.slice(0, 2).join(', ')}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>View Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Content 3: Pests Directory */}
      {activeTab === 'pests' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchResults.pests.map((pest) => (
            <Card
              key={pest.id}
              onClick={() => setSelectedPest(pest)}
              className="p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {pest.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 italic">
                      {pest.scientificName}
                    </p>
                  </div>
                  <StatusBadge status={pest.severity.toUpperCase()} variant={pest.severity === 'critical' ? 'critical' : 'attention'} size="xs" />
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Affected Crops:</span>
                    <strong className="text-stone-800 dark:text-stone-200">{pest.affectedCrops.join(', ')}</strong>
                  </div>
                  <div className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                    {pest.symptoms[0]}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-3 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-bold">IPM Strategy</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Content 4: Diseases Directory */}
      {activeTab === 'diseases' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchResults.diseases.map((dis) => (
            <Card
              key={dis.id}
              onClick={() => setSelectedDisease(dis)}
              className="p-4 sm:p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {dis.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 italic">
                      {dis.causalOrganism}
                    </p>
                  </div>
                  <StatusBadge status={dis.severity.toUpperCase()} variant={dis.severity === 'critical' ? 'critical' : 'attention'} size="xs" />
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Pathogen Type:</span>
                    <strong className="capitalize text-stone-800 dark:text-stone-200">{dis.type}</strong>
                  </div>
                  <div className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                    {dis.symptoms[0]}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 mt-3 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-bold">ICAR Reference</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>Treatment</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal for Crop */}
      {selectedCrop && (
        <Modal
          isOpen={Boolean(selectedCrop)}
          onClose={() => setSelectedCrop(null)}
          title={selectedCrop.name}
          subtitle={selectedCrop.scientificName}
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-stone-50 dark:bg-stone-850">
              <div>Season: <strong>{selectedCrop.season}</strong></div>
              <div>Category: <strong>{selectedCrop.category}</strong></div>
              <div>Duration: <strong>{selectedCrop.durationDays} Days</strong></div>
              <div>Water Need: <strong>{selectedCrop.waterRequirementMm} mm</strong></div>
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Recommended Soil:</span>
              <p className="text-stone-500 mt-0.5">{selectedCrop.soilType}</p>
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Major Producing States:</span>
              <p className="text-stone-500 mt-0.5">{selectedCrop.majorStates.join(', ')}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Modal for Pest */}
      {selectedPest && (
        <Modal
          isOpen={Boolean(selectedPest)}
          onClose={() => setSelectedPest(null)}
          title={selectedPest.name}
          subtitle={selectedPest.scientificName}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">
              Severity: <strong>{selectedPest.severity.toUpperCase()}</strong> • Host Crops: {selectedPest.affectedCrops.join(', ')}
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Symptoms:</span>
              <ul className="list-disc pl-4 text-stone-500 mt-1 space-y-0.5">
                {selectedPest.symptoms.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Biological & Organic Control:</span>
              <p className="text-stone-600 dark:text-stone-300 mt-0.5">{selectedPest.organicControl}</p>
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Chemical Recommendation (CIBRC):</span>
              <p className="text-stone-600 dark:text-stone-300 mt-0.5">{selectedPest.chemicalControl}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Modal for Disease */}
      {selectedDisease && (
        <Modal
          isOpen={Boolean(selectedDisease)}
          onClose={() => setSelectedDisease(null)}
          title={selectedDisease.name}
          subtitle={selectedDisease.causalOrganism}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
              Type: <strong className="capitalize">{selectedDisease.type}</strong> • Host Crops: {selectedDisease.affectedCrops.join(', ')}
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Symptoms:</span>
              <ul className="list-disc pl-4 text-stone-500 mt-1 space-y-0.5">
                {selectedDisease.symptoms.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Organic & Cultural Management:</span>
              <p className="text-stone-600 dark:text-stone-300 mt-0.5">{selectedDisease.organicControl}</p>
            </div>
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200">Chemical Fungicide / Bactericide:</span>
              <p className="text-stone-600 dark:text-stone-300 mt-0.5">{selectedDisease.chemicalControl}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
