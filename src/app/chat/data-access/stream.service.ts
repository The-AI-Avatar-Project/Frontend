import { Injectable, signal, computed, inject } from '@angular/core';
import { ChatMessageResponse, Sender } from '../../shared/interfaces/chat';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../shared/constants/constants';
import { AuthService } from '../../auth/auth.service'

export interface ChatMessage {
  sender: Sender;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class VideoStreamService {
  private authService = inject(AuthService);
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
    if (this.socket) {
      this.socket.close();
    }

    this.socket = new WebSocket('ws://localhost:8080/ws');

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this._error.set(null);
    });

    this.socket.addEventListener('message', (event) => {
      console.log('WebSocket message received:', event.data);
      let responseText = event.data;
      try {
        const obj = JSON.parse(event.data) as ChatMessageResponse;
        if (obj && obj.responseText) {
          responseText = obj.responseText;
        }
      } catch (e) {
        console.warn('Could not parse WebSocket message as JSON:', e);
      }
      this._messages.update((msgs) => [
        ...msgs,
        { sender: Sender.Bot, message: responseText },
      ]);
    });

    this.socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
      this._error.set('Error with WebSocket connection');
    });

    this.socket.addEventListener('close', (event) => {
      console.warn(`WebSocket closed: ${event.code} ${event.reason}`);
      // Reconnect after a short delay
      setTimeout(() => this.initWebSocket(), 3000);
    });
  }

  async startStream(userMessage: string) {
    this._isStreaming.set(true);
    this._error.set(null);

    // pushing user message to log
    this._messages.update((msgs) => [
      ...msgs,
      { sender: Sender.User, message: userMessage },
    ]);

    // Check socket state and reconnect if needed
    if (
      !this.socket ||
      this.socket.readyState === WebSocket.CLOSED ||
      this.socket.readyState === WebSocket.CLOSING
    ) {
      this.initWebSocket();
      // Wait a bit for connection
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(userMessage);
      } catch (e) {
        console.error('Error sending message via WebSocket:', e);
        this._error.set('Failed to send message');
      }
    } else {
      this._error.set(
        `WebSocket not ready (state: ${this.socket?.readyState})`
      );
      console.warn('WebSocket not ready, message not sent');
    }

    try {
      const apiUrl = `${API_URL}/ai/text/1`;
      const token = this.authService.getToken()
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', 'Authorization': `Bearer ${token}`, },
        body: userMessage,
      });

      if (!response.body) throw new Error('No video stream received');

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
                sourceBuffer.addEventListener('updateend', () => readChunk(), {
                  once: true,
                });
              }
            });
          };

          readChunk();
        } catch (err: any) {
          this._error.set('Error with video stream');
          this._isStreaming.set(false);
        }
      });
    } catch (err: any) {
      this._error.set(err?.message || 'Error with video stream');
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