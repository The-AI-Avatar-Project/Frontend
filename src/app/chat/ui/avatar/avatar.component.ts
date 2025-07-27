import { Component, ElementRef, input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  readonly posterImage = input<string>();
  @ViewChild('videoPlayer', { static: true })
  videoPlayer!: ElementRef<HTMLVideoElement>;
}
