import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMessageResponse, Sender } from '../../shared/interfaces/chat';

export interface ChatMessage {
  sender: Sender;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class VideoStreamService {
  private http = inject(HttpClient);

  private _messages = signal<ChatMessage[]>([
    { sender: Sender.Bot, message: 'Hallo! Wie kann ich dir helfen?' },
  ]);
  private _isStreaming = signal(false);
  private _error = signal<string | null>(null);
  private _videoUrl = signal<string | null>(null);

  messages = computed(() => this._messages());
  isStreaming = computed(() => this._isStreaming());
  error = computed(() => this._error());
  videoUrl = computed(() => this._videoUrl());

  private socket: WebSocket | null = null;

  constructor() {
    this.initWebSocket();
  }

  private initWebSocket() {
    this.socket = new WebSocket('ws://localhost:8080/ws');
    this.socket.addEventListener('message', (event) => {
      let responseText = event.data;
      try {
        const obj = JSON.parse(event.data) as ChatMessageResponse;
        if (obj && obj.responseText) {
          responseText = obj.responseText;
        }
      } catch {
        // Falls kein JSON, Rohtext nutzen
      }
      this._messages.update((msgs) => [
        ...msgs,
        { sender: Sender.Bot, message: responseText },
      ]);
    });

    this.socket.addEventListener('error', () => {
      this._error.set('WebSocket-Fehler');
    });
  }

  async startStream(userMessage: string) {
    this._isStreaming.set(true);
    this._error.set(null);

    // User-Nachricht ins Log
    this._messages.update((msgs) => [
      ...msgs,
      { sender: Sender.User, message: userMessage },
    ]);

    // Sende User-Message an WebSocket, falls offen
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(userMessage);
    }

    try {
      const apiUrl = 'http://localhost:8080/ai/text/1';

      // HttpClient nutzt automatisch den Interceptor für Bearer Token
      const response = await this.http
        .post(apiUrl, userMessage, {
          responseType: 'blob',  // Blob für Video-Stream
          headers: { 'Content-Type': 'text/plain' },
        })
        .toPromise();

      if (!response) throw new Error('Kein Videostream erhalten');

      const mediaSource = new MediaSource();
      const videoUrl = URL.createObjectURL(response);
      this._videoUrl.set(videoUrl);

      mediaSource.addEventListener('sourceopen', () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(
            'video/mp4; codecs="avc1.64001E, mp4a.40.2"'
          );

          // Bei Blob können wir nicht direkt streamen,
          // sondern fügen das gesamte Blob hinzu
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            sourceBuffer.appendBuffer(new Uint8Array(arrayBuffer));
          };
          reader.onerror = () => {
            this._error.set('Fehler beim Lesen des Videostreams');
            this._isStreaming.set(false);
          };
          reader.readAsArrayBuffer(response);

          sourceBuffer.addEventListener('updateend', () => {
            mediaSource.endOfStream();
            this._isStreaming.set(false);
          });
        } catch (err: any) {
          this._error.set('Fehler beim Video-Stream');
          this._isStreaming.set(false);
        }
      });
    } catch (err: any) {
      this._error.set(err?.message || 'Unbekannter Fehler beim Streamen');
      this._isStreaming.set(false);
    }
  }

  resetChat() {
    this._messages.set([
      { sender: Sender.Bot, message: 'Hallo! Wie kann ich dir helfen?' },
    ]);
    this._isStreaming.set(false);
    this._error.set(null);
    this._videoUrl.set(null);
  }
}
