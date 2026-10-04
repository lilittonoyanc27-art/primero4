import React, { useState, useMemo } from 'react';
import { PART_1_DATA } from './part1Data';
import { PART_2_DATA } from './part2Data';
import { QuestionCard } from './QuestionCard';
import { RepasoSection } from './RepasoSection';
import { BilingualText } from './BilingualText';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
  RotateCcw,
  Languages,
  Search,
  Check,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2'>('part1');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Font size scale: 'normal' | 'large' | 'xlarge'
  const [fontScale, setFontScale] = useState<'large' | 'xlarge'>('large');

  // Global settings
  const [globalShowTranslation, setGlobalShowTranslation] = useState<boolean>(false);
  const [globalShowAnswer, setGlobalShowAnswer] = useState<boolean>(false);

  // User score/tracking state
  const [userAnswers, setUserAnswers] = useState<Record<string, boolean>>({});

  const currentPart = activeTab === 'part1' ? PART_1_DATA : PART_2_DATA;

  // Filter sections and questions
  const filteredSections = useMemo(() => {
    return currentPart.sections
      .map((section) => {
        if (selectedSectionId !== 'all' && section.id !== selectedSectionId) {
          return null;
        }

        if (!searchQuery.trim()) {
          return section;
        }

        const qMatch = section.questions.filter((q) => {
          const query = searchQuery.toLowerCase();
          return (
            q.instructionEs.toLowerCase().includes(query) ||
            q.instructionHy.toLowerCase().includes(query) ||
            (q.sentenceEs && q.sentenceEs.toLowerCase().includes(query)) ||
            (q.sentenceHy && q.sentenceHy.toLowerCase().includes(query)) ||
            q.correctAnswerText.toLowerCase().includes(query)
          );
        });

        if (qMatch.length === 0) return null;

        return {
          ...section,
          questions: qMatch,
        };
      })
      .filter(Boolean) as typeof currentPart.sections;
  }, [currentPart, selectedSectionId, searchQuery]);

  const totalQuestionsInPart = useMemo(() => {
    return currentPart.sections.reduce((acc, s) => acc + s.questions.length, 0);
  }, [currentPart]);

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(Boolean).length;

  const handleAnswerChange = (questionId: string, isCorrect: boolean) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: isCorrect,
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setGlobalShowAnswer(false);
  };

  const fontScaleClass = fontScale === 'xlarge' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans ${fontScaleClass}`}>
      {/* ============================================================== */}
      {/* 1. TOP BAR CONTRACT: Brand — Nav Links — Actions */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 min-h-16 flex items-center justify-between gap-3 flex-wrap min-w-0">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
              🇪🇸
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-slate-900 truncate">
                  Categorías Gramaticales
                </span>
                <span className="hidden sm:inline text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 shrink-0">
                  1º ESO / 7-րդ դաս.
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm sm:text-base font-semibold text-slate-600 shrink-0">
            <button
              onClick={() => {
                setActiveTab('part1');
                setSelectedSectionId('all');
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'part1'
                  ? 'text-amber-600 font-extrabold border-b-2 border-amber-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Մաս 1. Գործնական (1–50)
            </button>
            <button
              onClick={() => {
                setActiveTab('part2');
                setSelectedSectionId('all');
              }}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'part2'
                  ? 'text-amber-600 font-extrabold border-b-2 border-amber-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Մաս 2. Քննական (1–41)
            </button>
          </nav>

          {/* Zone 3: Global Actions (Font size, Translation toggle & Answers YES/NO) */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Font Size Toggle Button */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setFontScale('large')}
                className={`px-2 py-1 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  fontScale === 'large'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Մեծ տառաչափ"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontScale('xlarge')}
                className={`px-2 py-1 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                  fontScale === 'xlarge'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Շատ մեծ տառաչափ"
              >
                A+
              </button>
            </div>

            {/* Global Translation Toggle */}
            <button
              type="button"
              onClick={() => setGlobalShowTranslation(!globalShowTranslation)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                globalShowTranslation
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:text-blue-700'
              }`}
              title="Ցույց տալ բոլոր հայերեն թարգմանությունները"
            >
              <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Թարգմանություն:</span>
              <span>{globalShowTranslation ? 'Միացված' : 'Սեղմումով'}</span>
            </button>

            {/* Global Answer "ДА / ԱՅՈ" toggle button */}
            <button
              type="button"
              onClick={() => setGlobalShowAnswer(!globalShowAnswer)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 ${
                globalShowAnswer
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-600/30'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
              title="Բացել բոլոր պատասխանները"
            >
              {globalShowAnswer ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Պատասխան: ԱՅՈ</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Պատասխան: ԱՅՈ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-7">
        {/* Banner with Instructions */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-9 text-white shadow-md relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-amber-200 text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-5 h-5" />
              <span>Իսպաներենի քերականական ուղեցույց և վարժարան</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Categorías gramaticales — Քերականական կարգեր
            </h1>
            <p className="text-amber-100 text-base sm:text-lg leading-relaxed font-medium">
              <strong>7 կարգեր՝</strong> sustantivo (գոյական), adjetivo (ածական), verbo (բայ), adverbio (մակբայ), nexos (կապակցիչներ), pronombres (դերանուններ), determinantes (որոշիչներ)։
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <div className="bg-white/20 backdrop-blur-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                <span>💡</span>
                <span>Կտտացրո՛ւ իսպաներեն ցանկացած տեքստին՝ հայերեն թարգմանությունը տեսնելու համար։</span>
              </div>
              <div className="bg-white/20 backdrop-blur-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                <span>✅</span>
                <span>Յուրաքանչյուր հարց ունի առանձին «Պատասխան (ԱՅՈ / ДА)» կոճակ։</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. REPASO RÁPIDO SECTION */}
        <RepasoSection showTranslationsGlobal={globalShowTranslation} />

        {/* 2. PRACTICE PART CONTROLLER TABS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-sm min-w-0">
          {/* Main Part Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-100 p-1.5 rounded-2xl min-w-0">
            <button
              onClick={() => {
                setActiveTab('part1');
                setSelectedSectionId('all');
              }}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer min-w-0 ${
                activeTab === 'part1'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span className="truncate">Մաս 1 (1–50)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('part2');
                setSelectedSectionId('all');
              }}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer min-w-0 ${
                activeTab === 'part2'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span className="truncate">Մաս 2. Քննական (1–41)</span>
            </button>
          </div>

          {/* Section Filter Dropdown */}
          <div className="flex items-center gap-2.5 min-w-0 w-full md:w-auto justify-between md:justify-end">
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="flex-1 md:flex-initial max-w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer truncate"
            >
              <option value="all">Բոլոր բաժինները ({currentPart.sections.length})</option>
              {currentPart.sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titleEs} — {s.titleHy}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer shrink-0"
                title="Վերսկսել առաջադրանքները"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Progress Stats */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-sm sm:text-base min-w-0">
          <div className="relative w-full sm:w-80 md:w-96 min-w-0">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Փնտրել բառ, հարց կամ բացատրություն..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-medium flex-wrap text-xs sm:text-sm">
            <span>Ընդհանուր հարցեր՝ <strong className="text-slate-950 font-extrabold tabular-nums">{totalQuestionsInPart}</strong></span>
            {answeredCount > 0 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
                  <Check className="w-4 h-4" />
                  <span className="tabular-nums">{correctCount}</span> / <span className="tabular-nums">{answeredCount}</span> ճիշտ
                </span>
              </>
            )}
          </div>
        </div>

        {/* 3. SECTIONS & QUESTIONS LIST */}
        <div className="space-y-9">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="bg-white/60 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs"
            >
              {/* Section Header */}
              <div className="mb-6 pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-amber-600">{section.titleEs}</span>
                  </h3>
                  <div className="text-sm sm:text-base font-bold text-blue-900">
                    🇦🇲 {section.titleHy}
                  </div>
                  {section.descriptionEs && (
                    <p className="text-sm sm:text-base text-slate-600 font-medium pt-0.5">
                      {section.descriptionEs}
                    </p>
                  )}
                </div>

                <div className="text-sm font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl tabular-nums border border-slate-200">
                  {section.questions.length} հարց
                </div>
              </div>

              {/* Context Text if present (e.g. Section 8 Exam Text) */}
              {section.contextEs && (
                <div className="mb-7 p-5 sm:p-6 bg-gradient-to-br from-amber-50 to-blue-50/60 border border-amber-200 rounded-3xl space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs sm:text-sm font-extrabold text-amber-900 uppercase tracking-wider bg-amber-200 px-2.5 py-1 rounded-lg">
                        Տեքստ / Texto
                      </span>
                      <span className="text-sm text-slate-600 font-medium">
                        Կարդա՛ տեքստը և պատասխանի՛ր հարցերին
                      </span>
                    </div>
                  </div>

                  <BilingualText
                    es={section.contextEs}
                    hy={section.contextHy}
                    showTranslationDefault={globalShowTranslation}
                    size="lg"
                  />
                </div>
              )}

              {/* List of Question Cards */}
              <div className="space-y-5">
                {section.questions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    globalShowTranslation={globalShowTranslation}
                    globalShowAnswer={globalShowAnswer}
                    onAnswerChange={handleAnswerChange}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <p className="text-slate-600 text-base sm:text-lg font-semibold">
                Համապատասխան հարցեր չգտնվեցին:
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSectionId('all');
                }}
                className="px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-2xl hover:bg-amber-600 transition-colors cursor-pointer"
              >
                Մաքրել ֆիլտրերը
              </button>
            </div>
          )}
        </div>

        {/* Quick Reference Summary at the bottom */}
        <footer className="mt-14 pt-8 border-t border-slate-200 text-center text-sm sm:text-base text-slate-600 space-y-2 pb-10">
          <p className="font-bold text-slate-800">
            Categorías gramaticales: sustantivo, adjetivo, verbo, adverbio, nexos, pronombres y determinantes.
          </p>
          <p className="font-medium">
            Նախատեսված է 1º ESO / 7-րդ դասարանի աշակերտների համար (🇪🇸 Իսպաներեն + 🇦🇲 Հայերեն)։
          </p>
        </footer>
      </main>
    </div>
  );
}
