import { Component, inject, signal } from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { ChatService } from './data-access/chat.service';
import { VideoStreamService } from './data-access/stream.service';


@Component({
  selector: 'app-chat',
  imports: [ChatWindowComponent, AvatarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private streamService = inject(VideoStreamService);

  userInput = signal('');

  // Video stream data
  videoUrl = this.streamService.videoUrl;
  isStreaming = this.streamService.isStreaming;
  error = this.streamService.error;

  onUserInputChange(value: string) {
    this.userInput.set(value);
  }

  onSendMessage() {
    const trimmed = this.userInput().trim();
    if (!trimmed) return;

    this.streamService.startStream(trimmed);
    this.userInput.set('');
  }

  stopStream() {
    this.streamService.stopStream();
  }
}

