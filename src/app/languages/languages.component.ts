import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceSettingsService } from '../settings/device-settings.service';
import { LanguageService } from './language.service';
import { Languages } from './language.model';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: 
  [
    CommonModule,
    DragDropModule,
    FormsModule
  ],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css'
})
export class LanguagesComponent {
  isLoading: boolean;
  prefferedLanguageIsoCodes: string[];
  prefferedLanguageIsoCode: string;
  allLanguages: Languages;
  selectedLanguageValue: string;

  constructor(
    private router: Router,
    private deviceSettingsService: DeviceSettingsService,
    private languageService: LanguageService
    ) 
    {
      this.isLoading = true;
      this.prefferedLanguageIsoCodes = this.deviceSettingsService.getPrefferedLanguageIsoCodes();
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
    var remainingLanguageIsoCodes = this.prefferedLanguageIsoCodes.filter(item => item !== isoCode);
    return remainingLanguageIsoCodes.every(languageIsoCode => !this.allLanguages[languageIsoCode]?.isSupported);
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
  
  savePrefferedLanguageIsoCodes(): void {
    this.deviceSettingsService.savePrefferedLanguageIsoCodes(this.prefferedLanguageIsoCodes);
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

  goToNextScreen(): void {
    this.router.navigate(['/']); // Navigate to /languages if production is true
  }
}
