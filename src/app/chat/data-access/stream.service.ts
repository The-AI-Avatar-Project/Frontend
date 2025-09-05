// src/app/services/video-chat.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import Hls from 'hls.js';
import { AuthService } from '../../auth/auth.service';
import { ChatMessageDTO, Sender } from '../../shared/interfaces/chat';
import { environment } from '../../environments/environment';
import { TranslocoService } from '@jsverse/transloco';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class VideoChatService {
  private authService = inject(AuthService);
  private transloco = inject(TranslocoService);

  private _messages = signal<ChatMessageDTO[]>([
    {
      message: this.transloco.translate('chat.initalMessage'),
      sender: Sender.Bot,
    },
  ]);
  private _isStreaming = signal(false);
  private _error = signal<string | null>(null);
  private _playlistUrl = signal<string | null>(null);

  readonly messages = computed(() => this._messages());
  readonly isStreaming = computed(() => this._isStreaming());
  readonly error = computed(() => this._error());
  readonly playlistUrl = computed(() => this._playlistUrl());

  private hls: Hls | null = null;
  private wss: WebSocket | null = null;

  reset(): void {
    this._messages.set([
      {
        message: this.transloco.translate('chat.initalMessage'),
        sender: Sender.Bot,
      },
    ]);
    this._isStreaming.set(false);
    this._error.set(null);
    this._playlistUrl.set(null);
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
  }

  stopStream(): void {
    this._isStreaming.set(false);

    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    this._playlistUrl.set(null);
  }

  async startStream(
    userText: string,
    roomPath: string,
    videoEl: HTMLVideoElement
  ): Promise<void> {
    this._error.set(null);
    this._isStreaming.set(true);

    // 1) Push user
    this._messages.update((m) => [
      ...m,
      { sender: Sender.User, message: userText },
    ]);

    // 2) POST /ai/text
    let json: {
      responseText: { response: string; references: string[] };
      streamingUUID: string;
    };
    try {
      const token = this.authService.getToken();
      const body = JSON.stringify({
        text: userText,
        // HIER den führenden Slash hinzufügen:
        roomPath: '/' + roomPath,
      });
      const res = await fetch(`${API_URL}/ai/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      json = await res.json();
    } catch (e: any) {
      this._error.set(e.message);
      this._isStreaming.set(false);
      return;
    }

    // 3) Push bot
    const { responseText, streamingUUID } = json;
    this._messages.update((m) => [
      ...m,
      {
        sender: Sender.Bot,
        message: responseText.response,
        references: responseText.references.length
          ? responseText.references
          : undefined,
      },
    ]);

    // 4) Poll for playlist
    const url = `${API_URL}/stream/${streamingUUID}/playlist.m3u8`;
    this._playlistUrl.set(url);
    try {
      const token = this.authService.getToken();
      await this.waitForPlaylist(url, 20_000, token!);
    } catch (e: any) {
      this._error.set('Playlist not available: ' + e.message);
      this._isStreaming.set(false);
      return;
    }

    // 5) start HLS
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    try {
      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(url);
        this.hls.attachMedia(videoEl);
        this._isStreaming.set(false);
        this.hls.startLoad();
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url;
      } else {
        throw new Error('HLS not supported');
      }
    } catch (e: any) {
      this._error.set('Error while starting stream');
      this._isStreaming.set(false);
      return;
    }

    // 6) WebSocket for updating video
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    const HOST_AND_PORT = API_URL.replace(/^https?:\/\//, '');
    this.wss = new WebSocket(`wss://${HOST_AND_PORT}/ws/${streamingUUID}`);
    this.wss.onmessage = (ev) => {
      if (ev.data === 'update' && this.hls) {
        this.hls.startLoad();
        this.hls.startLoad(-1);
        this._isStreaming.set(false);
      }
    };
    this.wss.onerror = () => this._error.set('Websocket Error');
    this.wss.onclose = () => {
      this._isStreaming.set(false);
      console.log('stopped streaming');
    };
  }

  async startStreamAudio(
    file: File,
    roomPath: string,
    videoEl: HTMLVideoElement
  ): Promise<void> {
    this._error.set(null);
    this._isStreaming.set(true);

    // 2) POST /ai/text
    let json: {
      requestText: string;
      responseText: { response: string; references: string[] };
      streamingUUID: string;
    };
    try {
      const token = this.authService.getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomPath', '/' + roomPath);
      const res = await fetch(`${API_URL}/ai/audio`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      json = await res.json();
    } catch (e: any) {
      this._error.set(e.message);
      this._isStreaming.set(false);
      return;
    }

    // 3) Push bot
    const { requestText, responseText, streamingUUID } = json;
    this._messages.update((m) => [
      ...m,
      {
        sender: Sender.User,
        message: requestText,
      },
      {
        sender: Sender.Bot,
        message: responseText.response,
        references: responseText.references.length
          ? responseText.references
          : undefined,
      },
    ]);

    // 4) Poll for playlist
    const url = `${API_URL}/stream/${streamingUUID}/playlist.m3u8`;
    this._playlistUrl.set(url);
    try {
      const token = this.authService.getToken();
      await this.waitForPlaylist(url, 20_000, token!);
    } catch (e: any) {
      this._error.set('Playlist not available: ' + e.message);
      this._isStreaming.set(false);
      return;
    }

    // 5) start HLS
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    try {
      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(url);
        this.hls.attachMedia(videoEl);
        this.hls.startLoad();
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url;
      } else {
        throw new Error('HLS not supported');
      }
    } catch (e: any) {
      this._error.set('Error while starting stream');
      this._isStreaming.set(false);
      return;
    }

    // 6) WebSocket for updating video
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    const HOST_AND_PORT = API_URL.replace(/^https?:\/\//, '');
    this.wss = new WebSocket(`wss://${HOST_AND_PORT}/ws/${streamingUUID}`);
    this.wss.onmessage = (ev) => {
      if (ev.data === 'update' && this.hls) {
        this.hls.startLoad();
        this.hls.startLoad(-1);
        this._isStreaming.set(false);
      }
    };
    this.wss.onerror = () => this._error.set('Websocket Error');
    this.wss.onclose = () => {
      this._isStreaming.set(false);
      console.log('stopped streaming');
    };
  }

  private async waitForPlaylist(
    url: string,
    timeout: number,
    token: string
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const r = await fetch(url, {
          method: 'HEAD',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (r.ok) return;
      } catch {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error('Timeout');
  }
}
