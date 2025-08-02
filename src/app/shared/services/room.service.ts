import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {lastValueFrom, Observable} from 'rxjs';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  http: HttpClient = inject(HttpClient);
  auth: AuthService = inject(AuthService);
  protected messageService: MessageService = inject(MessageService);

  getAllRooms() {
    return this.http.get<any[]>('http://localhost:8080/rooms');
  }

  private readonly apiUrl = 'http://localhost:8080/users';


  addUsersToGroup(groupId: string, userIds: string[]): Observable<any> {
    const bearertoken = this.auth.getToken();

    const payload = {
      userIds: userIds,
      groupId: groupId
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearertoken}`,
      "Content-Type": "application/json"
    });

    return this.http.post<any>(this.apiUrl, payload, {headers, observe: 'response'});
  }


  async createGroup(name: string, year: number, semester: string, icon: string): Promise<any> {
    const apiUrl = `http://localhost:8080/rooms`;
    const bearertoken = this.auth.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearertoken}`,
      "Content-Type": "application/json"
    });
    const body = {
      name: name,
      year: year,
      semester: semester,
      icon: icon
    };
    try {
      return await lastValueFrom(
        this.http.post(apiUrl, body, {headers})
      ).then((response) =>
        this.messageService.add({
          severity: 'success',
          summary: 'Raum erfolgreich erstellt',
          detail: '',
        })
      )
    } catch (err) {
      console.error("Fehler beim Erstellen des Raums:", err);
      throw err;
    }
  }


}
