// pdf-download.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PdfDownloadService {
  constructor(private http: HttpClient) {}

  downloadPdf(reference: string) {
    const url = `${environment.apiUrl}/references/get${reference.split(":")[0]}`;
    return this.http.get(url, {
      responseType: 'blob' 
    });
  }
}