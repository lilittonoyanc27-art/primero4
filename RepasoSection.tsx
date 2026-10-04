import React, { useState } from 'react';
import { GRAMMATICAL_CATEGORIES } from './repasoData';
import { Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { speakSpanish } from './AudioHelper';

interface RepasoSectionProps {
  showTranslationsGlobal: boolean;
}

export const RepasoSection: React.FC<RepasoSectionProps> = ({
  showTranslationsGlobal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden mb-8 max-w-full">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 sm:px-6 py-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-200 flex items-center justify-between cursor-pointer select-none gap-3 flex-wrap min-w-0"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            📖
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight break-words">
                Repaso rápido — Կարճ կրկնություն
              </h2>
              <span className="text-xs sm:text-sm font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
                7 Categorías
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium break-words">
              Հիմնական 7 կարգերը՝ սահմանումներով, իսպաներեն հնչողությամբ և օրինակներով
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-7 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 min-w-0">
            {GRAMMATICAL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : cat.id)
                  }
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between min-w-0 max-w-full ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-md'
                      : 'border-slate-200 bg-slate-50/60 hover:border-amber-400 hover:bg-white shadow-xs'
                  }`}
                >
                  <div className="min-w-0">
                    {/* Title with speech button */}
                    <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-2xl shrink-0">{cat.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-slate-900 text-base sm:text-lg break-words">
                            {cat.nameEs}
                          </h3>
                          <span className="text-sm sm:text-base font-bold text-blue-700 break-words block">
                            {cat.nameHy}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakSpanish(cat.nameEs);
                        }}
                        className="p-2 text-slate-400 hover:text-amber-700 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200 shrink-0"
                        title="Լսել իսպաներեն"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Spanish definition (Click to toggle/view) */}
                    <div className="space-y-2 text-sm sm:text-base text-slate-800 my-3 min-w-0">
                      <p className="leading-relaxed font-medium break-words">
                        <span className="font-extrabold text-amber-700">🇪🇸</span> {cat.defEs}
                      </p>
                      {(showTranslationsGlobal || isSelected) && (
                        <p className="leading-relaxed text-blue-950 bg-blue-50/90 p-3 rounded-xl border border-blue-200 font-semibold break-words">
                          <span className="font-bold text-blue-700">🇦🇲</span> {cat.defHy}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="pt-3 border-t border-slate-200 min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 block mb-1.5">
                      Ejemplos / Օրինակներ:
                    </span>
                    <div className="flex flex-wrap gap-2 min-w-0">
                      {cat.examplesEs.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakSpanish(ex);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-sm sm:text-base font-bold text-slate-800 hover:border-amber-400 hover:text-amber-800 hover:bg-amber-50/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs break-words"
                          title="Սեղմի՛ր՝ լսելու համար"
                        >
                          <span className="break-words">{ex}</span>
                          <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-sm sm:text-base text-slate-700 flex items-center justify-between flex-wrap gap-2 leading-relaxed break-words">
            <span>
              💡 <strong>Հուշում.</strong> Կտտացրո՛ւ ցանկացած կարգի վրա՝ նրա մանրամասն հայերեն թարգմանությունն ու բացատրությունը բացելու համար, կամ սեղմի՛ր բառերի վրա՝ արտասանությունը լսելու համար։
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
