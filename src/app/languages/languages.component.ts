import { Component, AfterViewInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { DeviceSettingsService } from '../settings/device-settings.service';
import { LanguageService } from './language.service';
import { Languages } from './language.model';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../translations/translation.service';
import { LanguageMultiSelectorComponent } from './language-multi-selector/language-multi-selector.component';


@Component({
  selector: 'app-languages',
  standalone: true,
  imports: 
  [
    CommonModule,
    DragDropModule,
    FormsModule,
    LanguageMultiSelectorComponent
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css'
})
export class LanguagesComponent implements AfterViewInit{
  @ViewChild(LanguageMultiSelectorComponent) languageMultiSelector! : LanguageMultiSelectorComponent;

  ngAfterViewInit() {
  }

  isLoading: boolean;
  prefferedLanguageIsoCodes: string[];
  prefferedLanguageIsoCode: string;
  allLanguages: Languages;
  selectedLanguageValue: string;
  sortLanguagesPromptValue: string;
  choosePreferredLanguagesPromptValue: string;
  nextButtonText: string;
  isLanguageMultiSelectorModalOpen: boolean = false;

  constructor(
    private router: Router,
    private deviceSettingsService: DeviceSettingsService,
    private languageService: LanguageService,
    private translationService: TranslationService
    ) 
    {
      this.isLoading = true;
      this.prefferedLanguageIsoCodes = this.deviceSettingsService.getPrefferedLanguageIsoCodes();
      this.sortLanguagesPromptValue = "";
      this.choosePreferredLanguagesPromptValue = "";
      this.nextButtonText = "";
      this.allLanguages = {};
      this.prefferedLanguageIsoCode = this.prefferedLanguageIsoCodes[0];
      this.selectedLanguageValue = "";
      

      this.languageService.getLanguages(this.prefferedLanguageIsoCode).subscribe({
        next: response => {
          this.allLanguages = response; // Store the response here
          
          // Iterate over the keys (ISO codes) of the allLanguages object
          for (let isoCode in this.allLanguages) {
            // If the language is selected and it's not already in the prefferedLanguageIsoCodes array
            if (this.allLanguages[isoCode].isSelected && !this.prefferedLanguageIsoCodes.includes(isoCode)) {
              // Add the ISO code to the beginning of the prefferedLanguageIsoCodes array
              this.prefferedLanguageIsoCodes.unshift(isoCode);
              this.savePrefferedLanguageIsoCodes();
              break;
            }
          }
          this.loadTranslations();
          this.isLoading = false;
          
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  addLanguage(isoCode: string) {
    // Only add the language if it's not already in the array
    if (isoCode && !this.prefferedLanguageIsoCodes.includes(isoCode)) {
      this.prefferedLanguageIsoCodes.push(isoCode);
      this.savePrefferedLanguageIsoCodes();
    }
  }

  deleteLanguage(isoCode: string) {
    // Only add the language if it's not already in the array
    if (isoCode && this.prefferedLanguageIsoCodes.includes(isoCode)) {
      this.prefferedLanguageIsoCodes = this.prefferedLanguageIsoCodes.filter(item => item !== isoCode);
      this.savePrefferedLanguageIsoCodes();
      this.selectedLanguageValue = "";
    }
  }

  hideFromDeletion(isoCode: string): boolean {
    //var remainingLanguageIsoCodes = this.prefferedLanguageIsoCodes.filter(item => item !== isoCode);
    return this.prefferedLanguageIsoCodes.length <= 1;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.prefferedLanguageIsoCodes, event.previousIndex, event.currentIndex);
    this.savePrefferedLanguageIsoCodes();
  }

  get languageIsoCodesNotInPreferred(): string[] {
    return Object.keys(this.allLanguages).filter(
      isoCode => !this.prefferedLanguageIsoCodes.includes(isoCode)
    );
  }

  loadTranslations(): void {
    this.translationService.loadTranslations(this.supportedLanguageIsoCode()).subscribe(() => {
      this.sortLanguagesPromptValue = this.translationService.getTranslation("SortLanguagesPrompt");
      this.choosePreferredLanguagesPromptValue = this.translationService.getTranslation("ChoosePreferredLanguagesPrompt");
      this.nextButtonText = this.translationService.getTranslation("NextButtonText");
    });
  }
  
  savePrefferedLanguageIsoCodes(): void {
    this.selectedLanguageValue = "";
    this.deviceSettingsService.savePrefferedLanguageIsoCodes(this.prefferedLanguageIsoCodes);
    this.loadTranslations();

    if(this.prefferedLanguageIsoCode !== this.prefferedLanguageIsoCodes[0])
    {
      this.prefferedLanguageIsoCode = this.prefferedLanguageIsoCodes[0]
      this.languageService.getLanguages(this.prefferedLanguageIsoCode).subscribe({
        next: response => {
          this.allLanguages = response; // Store the response here
        },
        error: err => {
          console.error(err);
        }
      });
    }
  }

  supportedLanguageIsoCode(): string {
    return this.prefferedLanguageIsoCodes[0] || "en";
  }

  goToNextScreen(): void {
    this.router.navigate(['/']); // Navigate to /languages if production is true
  }

  openLanguageMultiSelectorModal(): void {
    this.isLanguageMultiSelectorModalOpen = true;
  }
  closeLanguageMultiSelectorModal(): void {
    this.isLanguageMultiSelectorModalOpen = false;
  }

  updateprefferedLanguageIsoCodes(selected: string[]): void { 
    this.prefferedLanguageIsoCodes = Array.from(new Set([...this.prefferedLanguageIsoCodes, ...selected]));
    this.savePrefferedLanguageIsoCodes(); 
    this.closeLanguageMultiSelectorModal(); 
  }
}
