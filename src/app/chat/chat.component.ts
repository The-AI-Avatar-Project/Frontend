import { Component, inject, signal } from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { VideoStreamService } from './data-access/stream.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [ChatWindowComponent, AvatarComponent, MatIconModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private streamService = inject(VideoStreamService);

  userInput = signal('');

  // Service data
  videoUrl = this.streamService.videoUrl;
  isStreaming = this.streamService.isStreaming;
  error = this.streamService.error;
  chatLog = this.streamService.messages;

  posterImage = signal<string>('dummyprof1.png');

  onUserInputChange(value: string) {
    this.userInput.set(value);
  }

  onSendMessage() {
    const trimmed = this.userInput().trim();
    if (!trimmed) return;

    this.streamService.startStream(trimmed);
    this.userInput.set('');
  }

  resetChat() {
    this.streamService.resetChat();
  }
}
