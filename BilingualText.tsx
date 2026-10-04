import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakSpanish } from './AudioHelper';

interface BilingualTextProps {
  es: string;
  hy?: string;
  className?: string;
  showTranslationDefault?: boolean;
  inline?: boolean;
  enableAudio?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  es,
  hy,
  className = '',
  showTranslationDefault = false,
  inline = false,
  enableAudio = true,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(showTranslationDefault);

  // Sync if prop changes
  React.useEffect(() => {
    setIsOpen(showTranslationDefault);
  }, [showTranslationDefault]);

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakSpanish(es);
  };

  const toggle = () => {
    if (hy) {
      setIsOpen(!isOpen);
    }
  };

  const textClasses =
    size === 'lg'
      ? 'text-xl sm:text-2xl font-bold tracking-tight'
      : size === 'sm'
      ? 'text-base font-medium'
      : 'text-lg sm:text-xl font-medium';

  if (inline) {
    return (
      <span className={`inline-flex flex-wrap items-center gap-2 max-w-full break-words ${className}`}>
        <span
          onClick={toggle}
          title={hy ? 'Սեղմի՛ր հայերեն թարգմանությունը տեսնելու համար' : undefined}
          className={`cursor-pointer underline decoration-dotted decoration-amber-500 underline-offset-4 hover:text-amber-700 transition-colors font-medium break-words ${textClasses}`}
        >
          {es}
        </span>
        {enableAudio && (
          <button
            type="button"
            onClick={handleAudio}
            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Լսել իսպաներեն արտասանությունը"
            aria-label="Escuchar pronunciación"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
        {isOpen && hy && (
          <span className="text-amber-900 bg-amber-50 border border-amber-300 px-2 py-1 rounded-lg text-sm sm:text-base font-medium animate-in fade-in duration-150 break-words max-w-full">
            🇦🇲 {hy}
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      onClick={toggle}
      className={`group relative rounded-2xl border transition-all cursor-pointer select-text p-4 sm:p-5 max-w-full overflow-hidden ${
        isOpen
          ? 'bg-amber-50/80 border-amber-300 shadow-sm'
          : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/30'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
              🇪🇸 ES
            </span>
            <span className="text-xs font-medium text-slate-500 truncate">
              {isOpen ? 'Սեղմի՛ր թարգմանությունը ծածկելու համար' : '💡 Սեղմի՛ր՝ հայերեն թարգմանությունը տեսնելու համար'}
            </span>
          </div>
          <p className={`text-slate-900 leading-relaxed font-semibold break-words ${textClasses}`}>{es}</p>
        </div>

        {enableAudio && (
          <button
            type="button"
            onClick={handleAudio}
            className="p-2.5 text-slate-400 hover:text-amber-700 hover:bg-white rounded-xl transition-all shrink-0 cursor-pointer shadow-xs border border-transparent hover:border-slate-200"
            title="Escuchar en español"
            aria-label="Escuchar pronunciación"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && hy && (
        <div className="mt-3.5 pt-3.5 border-t border-amber-200 flex items-start gap-3 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md shrink-0 mt-0.5">
            🇦🇲 HY
          </span>
          <p className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed break-words flex-1 min-w-0">{hy}</p>
        </div>
      )}
    </div>
  );
};
