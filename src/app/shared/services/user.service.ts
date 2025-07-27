import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../environments/environment';

//DELETE
export interface Room {
  name: string;
  year: number;
  semester: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  protected auth: AuthService = inject(AuthService);

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users`);
  }

  setUserLanguage(language: string): Observable<any> {
    const apiUrl = `${environment.apiUrl}/language`;
    const token = this.auth.getToken();
    const body = language;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(apiUrl, body, { headers });
  }
}
