import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatWindowComponent } from './ui/chat-window/chat-window.component';
import { AvatarComponent } from './ui/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { VideoChatService } from './data-access/stream.service';
import { AudioRecorderService } from './data-access/audio-recorder.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-chat',
  imports: [
    ChatWindowComponent,
    AvatarComponent,
    CommonModule,
    MatIconModule,
    RouterModule,
    TitleCasePipe,
    TranslocoPipe,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private streamService = inject(VideoChatService);
  private audioService = inject(AudioRecorderService);

  @ViewChild(AvatarComponent) avatar!: AvatarComponent;

  firstName = signal<string | undefined>('');
  roomPath = signal<string | undefined>('');
  userInput = signal('');
  isRecording = signal(false);

  // Service data
  videoUrl = this.streamService.playlistUrl;
  isStreaming = this.streamService.isStreaming;
  error = this.streamService.error;
  chatLog = this.streamService.messages;

  posterImage = signal<string>('dummyprof1.png');

  ngOnInit() {
    this.route.params.subscribe((params) => {
      // Wird bei jedem Param-Wechsel aufgerufen!
      this.streamService.reset();
      // Optional: weitere Logik, z.B. Chat laden
    });
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

  async onAudioRecordedStart() {
    this.isRecording.set(true);

    try {
      await this.audioService.startRecording();
    } catch (err) {
      console.error('Error while starting the recording:', err);
    }
  }

  async onAudioRecordedStop() {
    this.isRecording.set(false);

    console.log('stopped audio');

    try {
      const audioBlob = await this.audioService.stopRecording();
      const audioFile = new File([audioBlob], 'audio.wav', {
        type: 'audio/wav',
      });
      const videoEl = this.avatar.videoPlayer.nativeElement;
      this.streamService.startStreamAudio(audioFile, this.roomPath()!, videoEl);
    } catch (err) {
      console.error('Error while stopping the recording:', err);
    }
  }

  async onCancelRecording() {
    this.isRecording.set(false);
    try {
      await this.audioService.stopRecording();
    } catch (err) {
      console.error('Error while stopping the recording:', err);
    }
  }
}
