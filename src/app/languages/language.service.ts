import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Languages } from './language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private apiUrl = `${environment.apiUrl}/v1/allLanguages`;

  constructor(private http: HttpClient) { }

  getLanguages(isoCode: string): Observable<Languages> {
    isoCode = isoCode || window.navigator.language;
    return this.http.get<Languages>(`${this.apiUrl}/${isoCode}`);
  }
}
