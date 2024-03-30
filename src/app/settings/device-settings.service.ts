import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService {
  private SETTINGS_KEY = 'deviceSettings';

  constructor() { }
  
  private getSettings(): any {
    return JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || "{}");
  }

  getPrefferedLanguageIsoCodes(): string[] {
    const settings = this.getSettings();
    
    return settings.languages || [];
  }

  savePrefferedLanguageIsoCodes(languages: string[]): void {
    console.log(languages);
    const settings = this.getSettings();

    settings.languages = languages;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}