import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {lastValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  http: HttpClient = inject(HttpClient);
  auth: AuthService = inject(AuthService);

  createRoom(name: string, year: number, semester: string, icon: string) {
    const url = 'http://localhost:8080/rooms';
    const body = {
      name: name,
      year: year,
      semester: semester,
      icon: icon
    }
    const token = this.auth.getToken();

    console.log(body)
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(url, body, {headers});
  }


  getAllRooms() {
    return this.http.get<any[]>('http://localhost:8080/rooms');
  }

  private readonly apiUrl = 'http://localhost:8080/users';


  addUsersToGroup(groupId: string, userIds: string[]): Observable<void> {
    const bearertoken = this.auth.getToken();

    const payload = {
      userIds: userIds,
      groupId: groupId
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearertoken}`,
      "Content-Type": "application/json"
    });

    return this.http.post<void>(this.apiUrl, payload, {headers});
  }


  async createGroup(name: string, year: number, semester: string, icon: string): Promise<any> {
    console.log("Creating Room");
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
      const response = await lastValueFrom(
        this.http.post(apiUrl, body, {headers})
      );

      console.log("Room created:", response);
      return response;

    } catch (err) {
      console.error("Fehler beim Erstellen des Raums:", err);
      throw err;
    }
  }


}
