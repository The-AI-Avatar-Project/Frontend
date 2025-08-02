import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {lastValueFrom, Observable} from 'rxjs';
import {MessageService} from 'primeng/api';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  http: HttpClient = inject(HttpClient);
  auth: AuthService = inject(AuthService);
  protected messageService: MessageService = inject(MessageService);

  getAllRooms() {
    return this.http.get<any[]>(`${environment.apiUrl}/rooms`);
  }

  addUsersToGroup(groupId: string, userIds: string[]): Observable<any> {
    const bearertoken = this.auth.getToken();

    const body = {
      userIds: userIds,
      groupId: groupId
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearertoken}`,
      "Content-Type": "application/json"
    });

    return this.http.post<any[]>(`${environment.apiUrl}/users`, body, {headers, observe: 'response'});

  }


   createGroup(name: string, year: number, semester: string, icon: string): Observable<any> {
    const apiUrl = `http://localhost:8080/rooms`;
    const token = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    const body = { name, year, semester, icon };

     return this.http.post<any[]>(`${environment.apiUrl}/rooms`, body, {headers, observe: 'response'});

  }


}
