import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Filter, 
  Clock, 
  AlertCircle, 
  Droplets, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, Recommendation, RecommendationPriority, RecommendationCategory } from '../types';
import { DemoBadge } from '../components/common/DemoBadge';
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {lang === 'hi' ? 'कृषि विज्ञान सिफारिशें' : 'Agronomic Decision Recommendations'}
            </h2>
            <DemoBadge mode={isDemoMode ? 'demo' : 'waiting'} onToggleMode={onToggleDemoMode} />
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'hi'
              ? 'सेंसर अवलोकन, फसल चरण और मौसम स्थिति पर आधारित विशेषज्ञ कार्रवाई'
              : 'Rule-based decision support correlating soil moisture, microclimate, and crop growth stage'}
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg text-xs font-semibold">
            {['All', 'Critical', 'High', 'Medium'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-xs ${
                  selectedPriority === p
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          {lang === 'hi' ? 'श्रेणी फ़िल्टर' : 'Filter Category'}:
        </span>
        {[
          { id: 'All', label: 'All Categories' },
          { id: 'irrigation', label: 'Irrigation' },
          { id: 'fertilizer', label: 'Fertilizer & Nutrition' },
          { id: 'pest_control', label: 'Pest & Disease' },
          { id: 'soil_health', label: 'Soil Health' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-750 hover:bg-stone-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title={lang === 'hi' ? 'कोई सिफारिश उपलब्ध नहीं है' : 'No Recommendations Found'}
          description={lang === 'hi'
            ? 'चयनित फ़िल्टर के अनुसार कोई सिफारिश नहीं मिली। या खेत डेटा कनेक्ट होने की प्रतीक्षा करें।'
            : 'No agronomic recommendations match the selected filters, or waiting for farm sensor connection.'}
          actionLabel={lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filters'}
          onAction={() => { setSelectedPriority('All'); setSelectedCategory('All'); }}
          secondaryActionLabel={!isDemoMode ? (lang === 'hi' ? 'डेमो डेटा लोड करें' : 'Load Demo Recommendations') : undefined}
          onSecondaryAction={!isDemoMode ? onToggleDemoMode : undefined}
        />
      ) : (
        /* Structured Recommendation Cards adhering strictly to:
           OBSERVATION, REASON, ACTION, PRIORITY, TIME */
        <div className="grid grid-cols-1 gap-5">
          {filtered.map((rec) => {
            const isApplied = rec.status === 'applied';

            return (
              <div
                key={rec.id}
                className={`p-6 rounded-xl border bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-xs transition-all ${
                  isApplied 
                    ? 'border-emerald-300 dark:border-emerald-900/60 opacity-80' 
                    : 'border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/40'
                }`}
              >
                {/* Header line: Title, Category, Priority, Time */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        {rec.title}
                      </h3>
                      {rec.plotName && (
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                          Plot Target: {rec.plotName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {rec.time}
                    </span>

                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      rec.priority === 'critical' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' :
                      rec.priority === 'high' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300' :
                      'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    }`}>
                      PRIORITY: {rec.priority}
                    </span>
                  </div>
                </div>

                {/* Structured Body: OBSERVATION -> REASON -> ACTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                  {/* OBSERVATION */}
                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-950/60 border border-stone-200/70 dark:border-stone-800 space-y-1">
                    <div className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-[10px]">
                      {lang === 'hi' ? 'निरीक्षण (OBSERVATION)' : 'OBSERVATION'}
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                      {rec.observation}
                    </p>
                  </div>

                  {/* REASON */}
                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-950/60 border border-stone-200/70 dark:border-stone-800 space-y-1">
                    <div className="font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-[10px]">
                      {lang === 'hi' ? 'कृषि वैज्ञानिक कारण (REASON)' : 'REASON'}
                    </div>
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-800 space-y-1">
                    <div className="font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 text-[10px]">
                      {lang === 'hi' ? 'अनुशंसित कार्रवाई (ACTION)' : 'ACTION'}
                    </div>
                    <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed font-bold">
                      {rec.action}
                    </p>
                  </div>
                </div>

                {/* Action status & execution button */}
                <div className="pt-3 border-t border-stone-200/70 dark:border-stone-800 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Agronomic Engine: Verified Wheat/Mustard Guidance Model</span>
                  </div>

                  <button
                    onClick={() => onApplyRecommendation(rec.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isApplied ? (lang === 'hi' ? 'कार्रवाई पूर्ण' : 'Action Recorded') : (lang === 'hi' ? 'कार्रवाई लागू करें' : 'Mark as Applied')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
