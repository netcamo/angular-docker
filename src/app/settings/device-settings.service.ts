import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceSettingsService {
  private SETTINGS_KEY = 'deviceSettings';

  constructor() { 
    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (event: StorageEvent) => {
    if (event.key === this.SETTINGS_KEY) {
      location.reload();
    }
  };
  
  private getSettings(): any {
    return JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || "{}");
  }

  getPrefferedLanguageIsoCodes(): string[] {
    const settings = this.getSettings();
    
    return settings.languages || [];
  }

  savePrefferedLanguageIsoCodes(languages: string[]): void {
    const settings = this.getSettings();

    settings.languages = languages;
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}
