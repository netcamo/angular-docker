// language.model.ts
export interface Language {
    isSelected: boolean;
    languageIsoCodesWithLocales: Record<string, string>;
  }
  
  export interface Languages {
    [key: string]: Language;
  }
  