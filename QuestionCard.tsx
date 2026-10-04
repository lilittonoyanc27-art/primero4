import React, { useState } from 'react';
import { BaseQuestion } from './types';
import { BilingualText } from './BilingualText';
import { Check, X, HelpCircle, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: BaseQuestion;
  globalShowTranslation: boolean;
  globalShowAnswer: boolean;
  onAnswerChange?: (questionId: string, isCorrect: boolean) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  globalShowTranslation,
  globalShowAnswer,
  onAnswerChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isRevealedTranslation, setIsRevealedTranslation] = useState<boolean>(false);

  // Sync with global control if changed
  React.useEffect(() => {
    if (globalShowAnswer) {
      setShowAnswer(true);
    }
  }, [globalShowAnswer]);

  const isAnswerActive = showAnswer || globalShowAnswer;
  const isTranslationActive = isRevealedTranslation || globalShowTranslation;

  const handleSelectOption = (key: string) => {
    setSelectedOption(key);
    const correct = key === question.correctOptionKey;
    if (onAnswerChange) {
      onAnswerChange(question.id, correct);
    }
  };

  const handleInputChange = (val: string) => {
    setUserInput(val);
    if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
      const match = question.acceptableAnswers.some(
        (ans) => ans.trim().toLowerCase() === val.trim().toLowerCase()
      );
      if (onAnswerChange) {
        onAnswerChange(question.id, match);
      }
    }
  };

  const isUserCorrect = (): boolean | null => {
    if (question.options && question.correctOptionKey) {
      if (!selectedOption) return null;
      return selectedOption === question.correctOptionKey;
    }
    if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
      if (!userInput.trim()) return null;
      return question.acceptableAnswers.some(
        (ans) => ans.trim().toLowerCase() === userInput.trim().toLowerCase()
      );
    }
    return null;
  };

  const userStatus = isUserCorrect();

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden mb-6 max-w-full">
      {/* Top Bar of the question */}
      <div className="px-4 sm:px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-3 flex-wrap min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center tabular-nums shadow-xs shrink-0">
            {question.number}
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-800 break-words flex-1 min-w-0">
            {question.instructionEs}
          </span>
        </div>

        {/* Translation toggle indicator */}
        <button
          type="button"
          onClick={() => setIsRevealedTranslation(!isRevealedTranslation)}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors border cursor-pointer shrink-0 ${
            isTranslationActive
              ? 'bg-blue-50 border-blue-300 text-blue-800'
              : 'bg-white border-slate-300 text-slate-700 hover:text-slate-950 hover:border-slate-400'
          }`}
          title="Փոխարկել հայերեն թարգմանությունը"
        >
          {isTranslationActive ? '🇦🇲 Հայերեն: Բացված' : '🇦🇲 Թարգմանել'}
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5 min-w-0">
        {/* Armenian instruction if translation active */}
        {isTranslationActive && (
          <p className="text-sm sm:text-base font-semibold text-blue-950 bg-blue-50 border border-blue-200 rounded-xl p-3.5 leading-relaxed break-words">
            🇦🇲 {question.instructionHy}
          </p>
        )}

        {/* Sentence or Target Phrase */}
        {question.sentenceEs && (
          <BilingualText
            es={question.sentenceEs}
            hy={question.sentenceHy}
            showTranslationDefault={isTranslationActive}
            size="md"
          />
        )}

        {/* Prompt specific for questions with blanks */}
        {question.targetPromptEs && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-0">
            <p className="text-base sm:text-lg font-bold text-slate-800 break-words">
              {question.targetPromptEs}
            </p>
            {isTranslationActive && question.targetPromptHy && (
              <p className="text-sm sm:text-base text-slate-700 font-medium mt-1 break-words">
                {question.targetPromptHy}
              </p>
            )}
          </div>
        )}

        {/* Options / Multiple choice */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isCorrectOpt = isAnswerActive && opt.key === question.correctOptionKey;
              const isWrongOpt = isAnswerActive && isSelected && opt.key !== question.correctOptionKey;

              let btnStyle = 'border-slate-200 bg-white text-slate-900 hover:border-amber-400 hover:bg-amber-50/20';

              if (isCorrectOpt) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500';
              } else if (isWrongOpt) {
                btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
              } else if (isSelected) {
                btnStyle = 'border-slate-900 bg-slate-900 text-white';
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectOption(opt.key)}
                  className={`text-left p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer min-w-0 break-words ${btnStyle}`}
                >
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0 ${
                      isSelected
                        ? isCorrectOpt
                          ? 'bg-emerald-600 text-white'
                          : isWrongOpt
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-slate-900'
                        : isCorrectOpt
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <div className="flex-1 min-w-0 break-words">
                    <div className="font-bold text-base sm:text-lg break-words">{opt.labelEs}</div>
                    {isTranslationActive && opt.labelHy && (
                      <div className={`text-xs sm:text-sm font-medium mt-0.5 break-words ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                        {opt.labelHy}
                      </div>
                    )}
                  </div>
                  {isCorrectOpt && <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                  {isWrongOpt && <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Input box for open questions / fill in / pronoun substitution */}
        {!question.options && (
          <div className="pt-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-2.5 min-w-0">
              <input
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Գրի՛ր քո պատասխանը այստեղ / Escribe tu respuesta..."
                className="flex-1 min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base sm:text-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:bg-white transition-all font-medium"
              />
              {userInput.trim().length > 0 && !isAnswerActive && (
                <button
                  type="button"
                  onClick={() => setShowAnswer(true)}
                  className="px-5 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                >
                  Ստուգել
                </button>
              )}
            </div>

            {/* Quick helper category chips if it's a fill-category question */}
            {question.type === 'fill-category' && !isAnswerActive && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                <span className="text-slate-500 font-semibold">Արագ ընտրություն:</span>
                {[
                  'sustantivo',
                  'adjetivo',
                  'verbo',
                  'adverbio',
                  'nexo',
                  'pronombre',
                  'determinante',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleInputChange(cat)}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-800 font-medium transition-colors cursor-pointer border border-slate-200 break-words"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Status Feedback before full answer is opened */}
        {userStatus !== null && !isAnswerActive && (
          <div
            className={`p-3.5 rounded-2xl text-sm font-bold flex flex-wrap items-center justify-between gap-2 ${
              userStatus
                ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                : 'bg-rose-50 text-rose-950 border border-rose-300'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {userStatus ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="break-words">
                {userStatus ? 'Ճիշտ է! ¡Correcto!' : 'Փորձի՛ր կրկին կամ բացի՛ր պատասխանը: Inténtalo de nuevo.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAnswer(true)}
              className="underline font-bold hover:opacity-80 cursor-pointer ml-auto shrink-0"
            >
              Տեսնել պատասխանը
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* MANDATORY DEDICATED ANSWER BUTTON: "кнопка ответ было Да" */}
        {/* ============================================================== */}
        <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium flex-wrap">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Պատասխանի կարգավիճակ:</span>
            <span
              className={`font-bold ml-1 ${
                isAnswerActive ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              {isAnswerActive ? 'ԱՅՈ (Բացված է)' : 'ՈՉ (Փակ է)'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowAnswer(!isAnswerActive)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                isAnswerActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-600/30'
                  : 'bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-500/30 active:scale-95'
              }`}
            >
              <span className="break-words">Պատասխան: {isAnswerActive ? 'ԱՅՈ (ԴԱ)' : 'Ցույց տալ (ԱՅՈ / ДА)'}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-extrabold shrink-0">
                {isAnswerActive ? 'Փակել' : 'SÍ'}
              </span>
            </button>
          </div>
        </div>

        {/* Revealed Answer Box */}
        {isAnswerActive && (
          <div className="mt-4 p-4 sm:p-5 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-3.5 animate-in fade-in duration-200 min-w-0">
            <div className="flex items-start sm:items-center gap-2.5 flex-wrap min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider shrink-0">
                Պատասխան / Respuesta
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-950 break-words flex-1 min-w-0">
                {question.correctAnswerText}
              </span>
            </div>

            {question.correctAnswerHy && (
              <div className="text-sm sm:text-base font-semibold text-emerald-950 bg-white/80 border border-emerald-200 p-3 rounded-xl break-words">
                🇦🇲 Հայերեն՝ <span className="font-bold text-emerald-800 break-words">{question.correctAnswerHy}</span>
              </div>
            )}

            {/* Word-by-word Breakdown if present */}
            {question.breakdown && question.breakdown.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-300 p-4 mt-2 min-w-0">
                <div className="text-sm font-bold text-slate-800 mb-3 break-words">
                  Բառ առ բառ վերլուծություն / Análisis palabra por palabra:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm min-w-0">
                  {question.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 gap-1.5 min-w-0"
                    >
                      <span className="font-extrabold text-slate-900 text-base break-words">{item.word}</span>
                      <div className="text-right break-words min-w-0">
                        <span className="font-bold text-amber-800 mr-1.5 break-words">
                          {item.category}
                        </span>
                        <span className="text-slate-600 text-xs sm:text-sm font-medium break-words">
                          ({item.categoryHy})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation in Spanish and Armenian */}
            {(question.explanationEs || question.explanationHy) && (
              <div className="text-sm sm:text-base space-y-2 pt-1 text-slate-800 min-w-0">
                {question.explanationEs && (
                  <p className="leading-relaxed break-words">
                    <span className="font-bold text-slate-950">🇪🇸 Explicación:</span>{' '}
                    {question.explanationEs}
                  </p>
                )}
                {question.explanationHy && (
                  <p className="leading-relaxed text-blue-950 font-medium break-words">
                    <span className="font-bold text-blue-900">🇦🇲 Բացատրություն:</span>{' '}
                    {question.explanationHy}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
