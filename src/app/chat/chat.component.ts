import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { VideoStreamService } from './data-access/stream.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { VideoChatService } from './data-access/newStream.service';

@Component({
  selector: 'app-chat',
  imports: [
    ChatWindowComponent,
    AvatarComponent,
    CommonModule,
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
  private streamService = inject(VideoChatService);

  @ViewChild(AvatarComponent) avatar!: AvatarComponent;

  firstName = signal<string | undefined>('');
  roomPath = signal<string | undefined>('');
  userInput = signal('');

  // Service data
  videoUrl = this.streamService.playlistUrl;
  isStreaming = this.streamService.isStreaming;
  error = this.streamService.error;
  chatLog = this.streamService.messages;

  posterImage = signal<string>('dummyprof1.png');

  ngOnInit() {
    this.authService.getFirstName().then((n) => this.firstName.set(n));
    this.route.paramMap.subscribe((params) => {
      const rp = params.get('roomPath')!;
      this.roomPath.set(rp.replaceAll('_', '/').replaceAll('%20', ' '));
    });
  }

  onUserInputChange(value: string) {
    this.userInput.set(value);
  }

  onSendMessage() {
    const txt = this.userInput().trim();
    if (!txt) return;
    const videoEl = this.avatar.videoPlayer.nativeElement;
    this.streamService.startStream(txt, this.roomPath()!, videoEl);
    this.userInput.set('');
  }
}
