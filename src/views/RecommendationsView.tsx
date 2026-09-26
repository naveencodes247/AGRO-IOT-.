import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Filter, 
  Clock, 
  Droplets, 
  ShieldAlert, 
  Sparkles,
  ArrowRight,
  Sprout,
  Check
} from 'lucide-react';
import { Language, Recommendation } from '../types';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
  onApplyRecommendation: (id: string) => void;
  lang: Language;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
  onApplyRecommendation,
  lang,
  isDemoMode,
  onToggleDemoMode,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = recommendations.filter(r => {
    if (selectedPriority !== 'All' && r.priority !== selectedPriority.toLowerCase()) return false;
    if (selectedCategory !== 'All' && r.category !== selectedCategory.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-5 select-none font-sans pb-10">
      {/* Page Header */}
      <PageHeader
        title={lang === 'hi' ? 'कृषि विज्ञान सिफारिशें' : 'Recommendations'}
        subtitle={lang === 'hi'
          ? 'सेंसर अवलोकन, फसल चरण और मौसम स्थिति पर आधारित विशेषज्ञ कार्रवाई'
          : 'Rule-based decision support correlating soil moisture, microclimate, and crop growth stage'}
        actions={
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-850 rounded-xl text-xs font-semibold">
            {['All', 'Critical', 'High', 'Medium'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedPriority === p
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      />

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Category:</span>
        </span>
        {[
          { id: 'All', label: 'All Categories' },
          { id: 'irrigation', label: 'Irrigation' },
          { id: 'fertilizer', label: 'Nutrition & Fertilizer' },
          { id: 'pest_control', label: 'Pest & Disease' },
          { id: 'soil_health', label: 'Soil Health' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-[#0fa958] text-white shadow-2xs'
                : 'bg-white dark:bg-[#141b16] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No recommendations match the filter"
          description="All current field conditions are within safe agronomic parameters. Check back when microclimate alerts trigger."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedPriority('All');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((rec) => {
            const isCritical = rec.priority === 'critical' || rec.priority === 'high';
            return (
              <Card key={rec.id} className="p-4 sm:p-5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                        : 'bg-emerald-50 dark:bg-emerald-950/60 text-[#0fa958]'
                    }`}>
                      {rec.category === 'irrigation' ? (
                        <Droplets className="w-5 h-5" />
                      ) : (
                        <Sprout className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {rec.title}
                        </h3>
                        <StatusBadge
                          status={rec.priority.toUpperCase()}
                          variant={rec.priority === 'critical' ? 'critical' : rec.priority === 'high' ? 'high' : 'medium'}
                          size="xs"
                        />
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                          {rec.plotName}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                        {rec.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-700 dark:text-stone-300 mt-2">
                        <strong className="text-emerald-700 dark:text-emerald-400 mr-1.5 font-bold">Recommended Action:</strong>
                        <span>{rec.suggestedAction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.time}</span>
                    </span>

                    {rec.status === 'applied' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1.5 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
                        <Check className="w-3.5 h-3.5" />
                        <span>Action Executed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onApplyRecommendation(rec.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0fa958] hover:bg-[#13b963] active:bg-[#0d8f4a] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                      >
                        Apply Action
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
