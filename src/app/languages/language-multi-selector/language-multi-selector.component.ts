import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Languages } from '../language.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: 
  [
    FormsModule,
    CommonModule
  ],
  selector: 'app-language-multi-selector',
  templateUrl: './language-multi-selector.component.html',
  styleUrl: './language-multi-selector.component.css'
})
export class LanguageMultiSelectorComponent {
  @Input() allLanguages!: Languages;
  @Input() languageIsoCodesNotInPreferred!: string[];
  @Output() save = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();

  searchFilter: string = '';
  selectedLanguages: { [key: string]: boolean } = {};

    
  get filteredLanguageIsoCodesNotInPreferred(): string[] {
    if (!this.searchFilter) {
      return this.languageIsoCodesNotInPreferred;
    }
  
    const lowerCaseFilter = this.searchFilter.toLowerCase();
  
    return this.languageIsoCodesNotInPreferred.filter(languageIsoCode =>
      this.allLanguages[languageIsoCode]?.displayName?.toLowerCase()?.includes(lowerCaseFilter) ||
      languageIsoCode?.toLowerCase()?.includes(lowerCaseFilter)
    );
  }

  get selectedLanguagesDisplayNamesCommaSeparated(): string {
    return this.selectedLanguageIsoCodes.map(isoCode => this.allLanguages[isoCode]?.displayName || isoCode).join(', ');
  }

  get selectedLanguageIsoCodes(): string[] {
    return Object.keys(this.selectedLanguages).filter(isoCode => this.selectedLanguages[isoCode]);
  }

  closeModal() {
    this.resetAndEmit(true);
  }

  saveLanguages() {
    this.resetAndEmit(false);
  }

  private resetAndEmit(closeOnly: boolean) {
    this.save.emit(closeOnly ? [] : this.selectedLanguageIsoCodes);
    this.searchFilter = '';
    this.selectedLanguages = {};
  }
}
