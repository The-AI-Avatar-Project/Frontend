import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {lastValueFrom} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  http: HttpClient = inject(HttpClient);
  auth:AuthService = inject(AuthService);

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


  getAllRooms(){
    return this.http.get<any[]>(`${environment.apiUrl}/rooms`);
  }

  async createGroup(): Promise<any> {
    console.log("Creating Room");
    const apiUrl = `${environment.apiUrl}/room`;
    const bearertoken = this.auth.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearertoken}`,
      "Content-Type": "application/json"
    });

    const body = {
      name: "Okan3",
      year: 2026,
      semester: "SoSe",
      icon: "TESTING.PNG"
    };

    try {
      const response = await lastValueFrom(
        this.http.post(apiUrl, body, { headers })
      );

      console.log("Room created:", response);
      return response;

    } catch (err) {
      console.error("Fehler beim Erstellen des Raums:", err);
      throw err;
    }
  }







}
