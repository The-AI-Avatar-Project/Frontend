import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-avatar',
  imports: [Button, TranslocoModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly posterImage = input<string>();
  onStopVideoClick = output<void>();
  @ViewChild('videoPlayer', { static: true })
  videoPlayer!: ElementRef<HTMLVideoElement>;

  onStopButtonClick() {
    this.onStopVideoClick.emit();
  }
}
