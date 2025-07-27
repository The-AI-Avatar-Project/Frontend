import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, Sender } from '../../../shared/interfaces/chat';
import { MatIconModule } from '@angular/material/icon';
import { PdfDownloadService } from '../../data-access/pdf-download.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgClass, FormsModule, TranslocoPipe],
})
export class ChatWindowComponent {
  @Input() chatLog: ChatMessage[] = [];
  @Input() userInput = '';
  @Input() loading = false;
  @Output() userInputChange = new EventEmitter<string>();
  @Output() sendMessage = new EventEmitter<void>();

  pdfDownloadService = inject(PdfDownloadService);

  apiUrl = environment.apiUrl;

  public Sender = Sender;

  download(reference: string): void {
    this.pdfDownloadService.downloadPdf(reference).subscribe((blob) => {
      const fileName = reference.split(':')[0];
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.userInputChange.emit(value);
  }

  onSend(): void {
    this.sendMessage.emit();
  }
}
