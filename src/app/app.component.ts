import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DeviceSettingsService } from './settings/device-settings.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  template: `<router-outlet/>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private router: Router,
    private deviceSettingsService: DeviceSettingsService
    ) 
    {
      if (this.deviceSettingsService.getPrefferedLanguageIsoCodes().length == 0) {
        this.router.navigate(['/languages']); // Navigate to /languages if production is true
      }
  }
}
