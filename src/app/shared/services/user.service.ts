import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../interfaces/user';
import {AuthService} from '../../auth/auth.service';

//DELETE
export interface Room {
  name: string;
  year: number;
  semester: string;
  icon: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  protected auth:AuthService = inject(AuthService);

  getUsers(): Observable<User[]> {
    return this.http.get<any[]>('http://localhost:8080/users');
  }

  setUserLanguage(language: string): Observable<any> {
    const apiUrl = "http://localhost:8080/language";
    const token = this.auth.getToken();
    const body = language;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });



    return this.http.post(apiUrl, body, { headers });
  }




}
