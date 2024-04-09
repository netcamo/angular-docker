// language.model.ts
export interface Language {
    isSelected: boolean;
    displayName: string;
  }
  
  export interface Languages {
    [key: string]: Language;
  }
  