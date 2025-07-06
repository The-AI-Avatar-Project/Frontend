// pdf-download.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../shared/constants/constants';

@Injectable({ providedIn: 'root' })
export class PdfDownloadService {
  constructor(private http: HttpClient) {}

  downloadPdf(reference: string) {
    const url = `${API_URL}/references/get${reference.split(":")[0]}`;
    return this.http.get(url, {
      responseType: 'blob' 
    });
  }
}