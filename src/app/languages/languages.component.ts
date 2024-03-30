import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceSettingsService } from '../settings/device-settings.service';
import { LanguageService } from './language.service';
import { Languages } from './language.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.css'
})
export class LanguagesComponent {
  prefferedLanguageIsoCodes: string[];
  prefferedLanguageIsoCode: string;
  allLanguages: Languages;

  constructor(
    private router: Router,
    private deviceSettingsService: DeviceSettingsService,
    private languageService: LanguageService
    ) 
    {
      this.prefferedLanguageIsoCodes = this.deviceSettingsService.getPrefferedLanguageIsoCodes();
      this.allLanguages = {};
      this.prefferedLanguageIsoCode = this.prefferedLanguageIsoCodes[0];
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
        },
        error: err => {
          console.error(err);
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
    }
  }

  hideFromDeletion(isoCode: string): boolean {
    var remainingLanguageIsoCodes = this.prefferedLanguageIsoCodes.filter(item => item !== isoCode);
    return remainingLanguageIsoCodes.every(languageIsoCode => !this.allLanguages[languageIsoCode]?.isSupported);
  }

  moveLanguage(isoCode: string, newIndex: number) {
    const oldIndex = this.prefferedLanguageIsoCodes.indexOf(isoCode);
    if (oldIndex > -1) {
      // Remove the language from the old position
      this.prefferedLanguageIsoCodes.splice(oldIndex, 1);
      // Insert the language at the new position
      this.prefferedLanguageIsoCodes.splice(newIndex, 0, isoCode);
      this.savePrefferedLanguageIsoCodes();
    }
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
}