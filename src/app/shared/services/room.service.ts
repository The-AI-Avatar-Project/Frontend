import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../auth/auth.service';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  http: HttpClient = inject(HttpClient);
  auth:AuthService = inject(AuthService);

  createRoom(){
    const url = 'http://localhost:8080/rooms';
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
    return this.http.get<any[]>('http://localhost:8080/rooms');
  }

  async createGroup(): Promise<any> {
    console.log("Creating Room");
    const apiUrl = `http://localhost:8080/rooms`;
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
