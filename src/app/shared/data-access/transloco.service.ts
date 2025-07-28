import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translocoService: TranslocoService) {}

  http: HttpClient = inject(HttpClient);
  auth: AuthService = inject(AuthService);

  switchLanguage(language: string) {
    this.translocoService.setActiveLang(language);
    localStorage.setItem('lang', language);
  }



}
