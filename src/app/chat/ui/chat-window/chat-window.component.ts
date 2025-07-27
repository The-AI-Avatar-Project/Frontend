import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChatMessage,
  ChatMessageDTO,
  Sender,
} from '../../../shared/interfaces/chat';
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
  chatLog = input<ChatMessageDTO[]>([]);
  userInput = input<string>('');
  loading = input<boolean>(false);

  audioRecordStart = output<void>();
  audioRecordStop = output<void>();
  audioRecordCancel = output<void>();
  isRecording = input<boolean>();

  userInputChange = output<string>();
  sendMessage = output<void>();

  constructor() {
    effect(() => console.log(this.chatLog()));
    effect(() => console.log(this.chatLogUnified()));
  }

  chatLogUnified = computed(() => {
    return this.chatLog().map((chat: ChatMessageDTO) => {
      let referencesMap = new Map<string, number[]>();

      chat.references?.forEach((ref: string) => {
        const [page, pageNumber] = ref.split(':');
        referencesMap.set(page, [
          ...(referencesMap.get(page) ?? []),
          Number(pageNumber),
        ]);
      });

      return {
        message: chat.message,
        sender: chat.sender,
        references: Array.from(referencesMap, ([page, pageNumbers]) => ({
          page,
          pageNumbers,
        })),
      };
    });
  });

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

  onStartRecord() {
    this.audioRecordStart.emit();
  }

  onAcceptRecording() {
    this.audioRecordStop.emit();
  }

  onCancelRecording() {
    this.audioRecordCancel.emit();
  }
}
