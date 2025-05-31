import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoStreamService {
  private state = signal({
    videoUrl: null as string | null,
    isStreaming: false,
    error: null as string | null,
  });

  // Selectors
  videoUrl = computed(() => this.state().videoUrl);
  isStreaming = computed(() => this.state().isStreaming);
  error = computed(() => this.state().error);

  private mediaSource: MediaSource | null = null;
  private sourceBuffer: SourceBuffer | null = null;

  async startStream(message: string): Promise<void> {
    try {
      this.state.update(s => ({ ...s, isStreaming: true, error: null }));

      this.mediaSource = new MediaSource();
      const videoUrl = URL.createObjectURL(this.mediaSource);
      this.state.update(s => ({ ...s, videoUrl }));

      await new Promise<void>(resolve => {
        this.mediaSource!.addEventListener('sourceopen', () => {
          this.sourceBuffer = this.mediaSource!.addSourceBuffer(
            'video/mp4; codecs="avc1.64001E, mp4a.40.2"'
          );
          resolve();
        });
      });

      const response = await fetch('http://localhost:8080/ai/text/1', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: message,
      });

      const reader = response.body!.getReader();
      this.readChunks(reader);
    } catch (error) {
      this.state.update(s => ({
        ...s,
        error: `Stream failed: ${error}`,
        isStreaming: false
      }));
    }
  }

  private async readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const { done, value } = await reader.read();

    if (done) {
      this.mediaSource?.endOfStream();
      this.state.update(s => ({ ...s, isStreaming: false }));
      return;
    }

    if (this.sourceBuffer?.updating) {
      await new Promise(resolve =>
        this.sourceBuffer!.addEventListener('updateend', resolve, { once: true })
      );
    }

    this.sourceBuffer?.appendBuffer(value!);
    this.readChunks(reader);
  }

  stopStream(): void {
    this.mediaSource?.endOfStream();
    if (this.state().videoUrl) {
      URL.revokeObjectURL(this.state().videoUrl!);
    }
    this.state.set({ videoUrl: null, isStreaming: false, error: null });
  }
}
