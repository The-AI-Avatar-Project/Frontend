import { Injectable, signal, computed, inject } from '@angular/core';
import { ChatMessage, ChatMessageResponse, Sender } from '../../shared/interfaces/chat';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class VideoStreamService {
  private _messages = signal<ChatMessage[]>([
    { sender: Sender.Bot, message: 'Hey! How can I assist you today?' },
  ]);
  private _isStreaming = signal(false);
  private _error = signal<string | null>(null);
  private _videoUrl = signal<string | null>(null);
  private authservice =  inject(AuthService)

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
    const HOST_AND_PORT = environment.apiUrl.replace(/^https?:\/\//, '');
    this.socket = new WebSocket(`ws://${HOST_AND_PORT}/ws`);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      this._error.set(null);
    });


this.socket.addEventListener('message', (event) => {
  console.log('WebSocket message received:', event.data);
  try {
    const { responseText } = JSON.parse(event.data);
    this._messages.update((msgs) => [
      ...msgs,
      {
        sender: Sender.Bot,
        message: responseText.response,
        references: responseText.references?.length ? responseText.references : undefined,
      },
    ]);
  } catch (e) {
    this._messages.update((msgs) => [
      ...msgs,
      { sender: Sender.Bot, message: event.data },
    ]);
  }
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

  async startStream(userMessage: string, roomPath: string) {
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
      const apiUrl = `${environment.apiUrl}/ai/text`;
      const bearertoken = this.authservice.getToken();
       const body = JSON.stringify({
      text: userMessage,
      roomPath: "/" + roomPath,
      chatId: "1",
    });
  const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearertoken}`,
      },
      body,
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
