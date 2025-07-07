import {Component, effect, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {newCourse, SCourse} from '../shared/interfaces/courses';
import {NgForOf, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Dialog} from 'primeng/dialog';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {FileUpload} from 'primeng/fileupload';
import {Listbox} from 'primeng/listbox';
import {MultiSelectModule} from 'primeng/multiselect';
import {UserService} from '../shared/services/user.service';
import {User} from '../shared/interfaces/user';
import {CourseService} from '../courses/data-access/course.service';
import {RoomService} from '../shared/services/room.service';
import {AuthService} from '../auth/auth.service';

interface Column {
  field: string;
  header: string;
}

interface FileEntry {
  name: string;
  code: string;
}



@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    NgForOf,
    Button,
    Dialog,
    InputText,
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    FileUpload,
    NgIf,
    Listbox,
    MultiSelectModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  cols: Column[] = [];

  addModalVisible = false;
  editModalVisible = false;
  deleteModalVisible = false;
  inviteModalVisible = false;

  selectedCourse: newCourse | null = null;
  newCourse: newCourse = {id: '', courseID: '', name: ''};
  editedCourse: newCourse = {id: '', courseID: '', name: ''};

  // Signal accessor for the courses
  courses = SCourse;


  protected userService: UserService = inject(UserService);
  protected courseService: CourseService = inject(CourseService);
  protected roomService: RoomService = inject(RoomService);
  protected auth: AuthService = inject(AuthService);

  users!: User[];

  selectedUser?: User[];


  showAllRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.error('Fehler beim Laden der Räume:', err);
      }
    });
  }



  ngOnInit() {
    this.cols = [
      {field: 'courseID', header: 'Kurs Bezeichnung'},
      {field: 'name', header: 'Vorlesung'},
    ];

    this.roomService.createGroup();

  }


  showCourse(course: newCourse) {
    console.log('Show:', course);
  }

  openAddModal() {
    this.newCourse = {id: this.generateId(), courseID: '', name: ''};
    this.addModalVisible = true;
  }


  addCourse() {
    SCourse.update(current => [...current, this.newCourse]);
    this.addModalVisible = false;
  }

  openEditModal(course: newCourse) {
    this.editedCourse = {...course};
    this.editModalVisible = true;
  }

  openInviteModal(course: newCourse) {

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Antwort von /users:', this.users);
      },
      error: (err) => { console.error('Fehler beim Laden der Benutzer:', err);
      }
    });

    this.inviteModalVisible = true;
  }

  inviteUser() {
    this.inviteModalVisible = false;

    this.selectedUser?.forEach(user => {
      console.log(user.email)
    })

    this.selectedUser = []

  }


  updateCourse() {
    SCourse.update(current =>
      current.map(c => (c.id === this.editedCourse.id ? this.editedCourse : c))
    );
    this.editModalVisible = false;
  }

  openDeleteModal(course: newCourse) {
    this.selectedCourse = course;
    this.deleteModalVisible = true;
  }

  deleteCourse() {
    if (!this.selectedCourse) return;
    SCourse.update(current =>
      current.filter(c => c.id !== this.selectedCourse!.id)
    );
    this.deleteModalVisible = false;
    this.selectedCourse = null;
  }

  generateId(): string {
    return Date.now().toString();
  }


/// UPLOAD IMAGE
  previewUrl: string | ArrayBuffer | null = null;

  // Fired before upload, when a file is selected
  onImageSelect(event: any): void {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
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

  audioUrl: string | null = null;
  isRecording = false;

  async startRecording() {
    this.audioUrl = null; // Reset previous recording

    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, {type: 'audio/webm'});
      this.audioUrl = URL.createObjectURL(audioBlob);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

  //RECORD AUDIO


  // UPLOAD FILES AND SHOW THEM


  // Speichert die echten File-Objekte mit Dateiname als Schlüssel
  fileBlobMap = new Map<string, File>();

  constructor() {
    // Effekt: Wenn sich selectedFile ändert → Datei downloaden
    effect(() => {
      if (this.selectedFile) {
        this.downloadFile(this.selectedFile.name);
      }
    });
  }

  files = signal<FileEntry[]>([]);
  selectedFile!: FileEntry;

  onMockUpload(event: any, uploader: any) {
    for (let file of event.files) {
      const entry: FileEntry = {
        name: file.name,
        code: file.name.replace(/\W/g, '').toUpperCase().slice(0, 6)
      };

      this.files.update((list) => [...list, entry]);
      this.fileBlobMap.set(file.name, file); // Datei speichern
    }

    uploader.clear()

  }

  downloadFile(fileName: string) {
    const file = this.fileBlobMap.get(fileName);
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }


  onFileSelect(event: any) {
    const selected: FileEntry = event.value;
    if (selected) {
      this.downloadFile(selected.name);
    }
  }


}
