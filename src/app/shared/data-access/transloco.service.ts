import {inject, Injectable} from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translocoService: TranslocoService) { }

  http: HttpClient = inject(HttpClient);
  auth:AuthService = inject(AuthService);

  switchLanguage(language: string) {
    this.translocoService.setActiveLang(language);
    localStorage.setItem('lang', language);
  }






  createRoom(){
    const url = `${environment.apiUrl}/rooms`;
    const body = {
      name: "Mathe1",
      year: 2025,
      semester: "SoMe",
      icon: "5"
    }
    const token = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(url, body, { headers });
  }



}
