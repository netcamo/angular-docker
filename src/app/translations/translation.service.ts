import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Dictionary } from './dictionary.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = `${environment.apiUrl}/v1/translations`;
  private TRANSLATIONS_KEY = 'translations';

  constructor(private http: HttpClient) { }

  loadTranslations(isoCode: string): Observable<Dictionary> {
    return new Observable(observer => {
      this.http.get<Dictionary>(`${this.apiUrl}/${isoCode}`).subscribe((response: Dictionary) => {
        localStorage.setItem(this.TRANSLATIONS_KEY, JSON.stringify(response));
        observer.next(response);
        observer.complete();
      });
    });
  }

  getTranslation(key: string): string {
    const translations: Dictionary = JSON.parse(localStorage.getItem(this.TRANSLATIONS_KEY) || '{}');
    return translations[key] || key;
  }
}
