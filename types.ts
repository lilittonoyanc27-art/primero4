export type GrammaticalCategory =
  | 'sustantivo'
  | 'adjetivo'
  | 'verbo'
  | 'adverbio'
  | 'nexo'
  | 'pronombre'
  | 'determinante';

export interface CategoryInfo {
  id: GrammaticalCategory;
  nameEs: string;
  nameHy: string;
  defEs: string;
  defHy: string;
  examplesEs: string[];
  color: string;
  icon: string;
}

export type QuestionType =
  | 'multiple-choice'
  | 'find-word'
  | 'word-by-word'
  | 'odd-one-out'
  | 'replace-pronoun'
  | 'det-or-pron'
  | 'fill-category'
  | 'text-analysis'
  | 'reasoning';

export interface BaseQuestion {
  id: string;
  number: number | string;
  type: QuestionType;
  instructionEs: string;
  instructionHy: string;
  sentenceEs?: string;
  sentenceHy?: string;
  targetPromptEs?: string;
  targetPromptHy?: string;
  options?: { key: string; labelEs: string; labelHy?: string }[];
  correctOptionKey?: string;
  correctAnswerText: string;
  correctAnswerHy?: string;
  explanationEs?: string;
  explanationHy?: string;
  breakdown?: { word: string; category: string; categoryHy: string }[];
  acceptableAnswers?: string[];
}

export interface ExerciseSection {
  id: string;
  sectionNumber: number;
  titleEs: string;
  titleHy: string;
  descriptionEs?: string;
  descriptionHy?: string;
  contextEs?: string;
  contextHy?: string;
  questions: BaseQuestion[];
}

export interface PartData {
  id: string;
  partNumber: number;
  titleEs: string;
  titleHy: string;
  subtitleEs: string;
  subtitleHy: string;
  sections: ExerciseSection[];
}
