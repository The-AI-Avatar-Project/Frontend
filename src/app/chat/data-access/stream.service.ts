import { Injectable, signal, computed } from '@angular/core';
import { ChatMessageResponse, Sender } from '../../shared/interfaces/chat';


export interface ChatMessage {
  sender: Sender;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class VideoStreamService {
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
    // Versuche, das JSON zu parsen
    const obj = JSON.parse(event.data) as ChatMessageResponse;
    if (obj && obj.responseText) {
      responseText = obj.responseText;
    }
  } catch {
    // Falls kein JSON, nimm den Rohtext
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

    // Sende User-Message an den WebSocket (falls gewünscht)
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(userMessage);
    }

    try {
      const apiUrl = 'http://localhost:8080/ai/text/1';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: userMessage,
      });

      if (!response.body) throw new Error('Kein Videostream erhalten');

      const mediaSource = new MediaSource();
      const videoUrl = URL.createObjectURL(mediaSource);
      this._videoUrl.set(videoUrl);

      mediaSource.addEventListener('sourceopen', async () => {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(
            'video/mp4; codecs="avc1.64001E, mp4a.40.2"'
          );
          const reader = response.body!.getReader();

          const readChunk = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                mediaSource.endOfStream();
                this._isStreaming.set(false);
                return;
              }
              sourceBuffer.appendBuffer(value!);

              if (!sourceBuffer.updating) {
                readChunk();
              } else {
                sourceBuffer.addEventListener(
                  'updateend',
                  () => readChunk(),
                  { once: true }
                );
              }
            });
          };

          readChunk();
        } catch (err: any) {
          this._error.set('Fehler beim Video-Stream');
          this._isStreaming.set(false);
        }
      });
    } catch (err: any) {
      this._error.set(
        err?.message || 'Unbekannter Fehler beim Streamen'
      );
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
