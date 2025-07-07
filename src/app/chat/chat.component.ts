import { Component, inject, signal } from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { VideoStreamService } from './data-access/stream.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [
    ChatWindowComponent,
    AvatarComponent,
    MatIconModule,
    RouterModule,
    TitleCasePipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private streamService = inject(VideoStreamService);

  firstName = signal<string | undefined>('');
  roomPath = signal<string | undefined>('');
  userInput = signal('');

  // Service data
  videoUrl = this.streamService.videoUrl;
  isStreaming = this.streamService.isStreaming;
  error = this.streamService.error;
  chatLog = this.streamService.messages;

  posterImage = signal<string>('dummyprof1.png');

  ngOnInit(): void {
    this.authService.getFirstName().then((name) => {
      this.firstName.set(name);
    });
    this.route.paramMap.subscribe(params => {
    const roomPath = params.get('roomPath');
    const slicedRoomPath = roomPath?.replaceAll("_", "/").replaceAll("%20", " ")
    this.streamService.resetChat;
    this.roomPath.set(slicedRoomPath);
    console.log(slicedRoomPath)
  });
  }
  onUserInputChange(value: string) {
    this.userInput.set(value);
  }

  onSendMessage() {
    const trimmed = this.userInput().trim();
    if (!trimmed) return;

    this.streamService.startStream(trimmed, this.roomPath()! );
    this.userInput.set('');
  }

  resetChat() {
    this.streamService.resetChat();
  }
}
