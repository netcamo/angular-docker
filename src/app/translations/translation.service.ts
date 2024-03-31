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

  constructor(private http: HttpClient) { }

  loadTranslations(isoCode: string): Observable<Dictionary> {
    return new Observable(observer => {
      this.http.get<Dictionary>(`${this.apiUrl}/${isoCode}`).subscribe((response: Dictionary) => {
        localStorage.setItem('translations', JSON.stringify(response));
        observer.next(response);
        observer.complete();
      });
    });
  }

  getTranslation(key: string): string {
    const translations: Dictionary = JSON.parse(localStorage.getItem('translations') || '{}');
    console.log(translations[key]);
    return translations[key] || key;
  }
}
