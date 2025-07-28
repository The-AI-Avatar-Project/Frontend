import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {NgIf} from '@angular/common';
import {FileUpload} from 'primeng/fileupload';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AudioService} from '../shared/services/audio.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';

@Component({
  selector: 'app-avatar',
  imports: [
    Button,
    Step,
    StepList,
    StepPanel,
    StepPanels,
    Stepper,
    NgIf,
    FileUpload,
    TranslocoPipe
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  //Angular magt keine Blobs in Signals
  sanitizer: DomSanitizer = inject(DomSanitizer);
  protected audioService = inject(AudioService);
  protected auth = inject(AuthService);
  protected http: HttpClient = inject(HttpClient);
  protected translocoService = inject(TranslocoService)

  //File BASE64
  imageURL: string | ArrayBuffer | null = null;
  wavURL: any = null;

  imageBlob: Blob | null = null;
  wavBlob: Blob | null = null;

  avatarModalVisible = false;

  step1Value = 1;
  step2Value = 2;

  openAvatarModal() {
    this.step2Value = 1;
    this.avatarModalVisible = true;
  }


  showImage() {
    console.log("Image:", this.imageURL);
  }


  // Fired before upload, when a file is selected
  onImageSelect(event: any): void {
    const file = event.files[0];
    this.imageBlob = file;  // direkt Blob/File speichern

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onBasicUploadAuto(event: any): void {
    console.log('Upload complete', event);
    // Optionally clear preview after upload or keep it
  }

  /// UPLOAD IMAGE


  //RECORD AUDIO

  private mediaRecorder!: MediaRecorder;
  private audioChunks: Blob[] = [];

  audioUrl = signal<SafeUrl | null>(null)
  isRecording = false;

  async startRecording() {
    this.audioUrl.set(null)

    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, {type: 'audio/webm'});
      this.wavBlob = await this.audioService.convertToWav(audioBlob);

      const wavUrl = URL.createObjectURL(this.wavBlob);
      this.audioUrl.set(this.sanitizer.bypassSecurityTrustUrl(wavUrl));

      const reader = new FileReader();
      reader.onload = () => {
        this.wavURL = reader.result;
      };
      reader.readAsDataURL(this.wavBlob);
    }

    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  async createAvatar() {
    try {
      const apiUrl = `http://localhost:8080/avatar/create`;
      const bearertoken = this.auth.getToken();


      // Create FormData and append blobs
      const formData = new FormData();
      formData.append('face_image', this.imageBlob!, 'face_image.jpeg');
      formData.append('voice', this.wavBlob!, 'voice.wav');

      const headers = new HttpHeaders({
        Authorization: `Bearer ${bearertoken}`
        // Do NOT set 'Content-Type' header, browser sets it automatically for multipart/form-data
      });

      const response = await lastValueFrom(
        this.http.post(apiUrl, formData, { headers })
      );

      console.log('Avatar Created:', response);
      return response;

    } catch (err) {
      console.error('Fehler beim Erstellen des Avatars:', err);
      throw err;
    }
  }



  // async createAvatar() {
  //   console.log(this.imageURL);
  //   console.log(this.wavURL)
  //     try {
  //
  //       const imageBase64 = this.imageURL;
  //       const voiceBase64 = this.wavURL;
  //
  //       const apiUrl = `http://localhost:8080/avatar/create`;
  //       const bearertoken = this.auth.getToken();
  //
  //       const headers = new HttpHeaders({
  //         Authorization: `Bearer ${bearertoken}`,
  //         "Content-Type": "application/json"
  //       });
  //
  //
  //
  //
  //       const response = await lastValueFrom(
  //         this.http.post(apiUrl, body, { headers })
  //       );
  //
  //       console.log("Avatar Created:", response);
  //       return response;
  //
  //     } catch (err) {
  //       console.error("Fehler beim Erstellen des Avatars:", err);
  //       throw err;
  //     }
  //   }


}
