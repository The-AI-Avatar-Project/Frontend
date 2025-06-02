import { Component, inject, signal } from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { ChatService } from './data-access/chat.service';
import { AuthService } from '../auth/auth.service';
import { VideoStreamService } from './data-access/stream.service';

@Component({
  selector: 'app-chat',
  imports: [ChatWindowComponent, AvatarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {

  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  dummyVideo = signal<string>('dummyExample.mp4');
  userInput = signal('');

  // load service data
  firstName = signal<string | undefined>(undefined);
  chatLog = this.chatService.messages;
  loading = this.chatService.loading;
  error = this.chatService.error;
  private streamService = inject(VideoStreamService);




  videoUrl = this.streamService.videoUrl;
  isStreaming = this.streamService.isStreaming;


  ngOnInit(): void {
    this.authService.getFirstName().then(name => {
      this.firstName.set(name);
    });
  }

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
