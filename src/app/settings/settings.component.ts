import {Component, effect, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Course, newCourse} from '../shared/interfaces/courses';
import {NgForOf, NgIf} from '@angular/common';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Dialog} from 'primeng/dialog';
import {FileUploadModule} from 'primeng/fileupload';
import {MultiSelectModule} from 'primeng/multiselect';
import {UserService} from '../shared/services/user.service';
import {User} from '../shared/interfaces/user';
import {CourseService} from '../courses/data-access/course.service';
import {RoomService} from '../shared/services/room.service';
import {AuthService} from '../auth/auth.service';
import {Select} from 'primeng/select';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {lastValueFrom} from 'rxjs';

interface Column {
  field: string;
  header: string;
}

interface FileEntry {
  name: string;
  code: string;
}

interface RoomIcon {
  path: string;
  name: string;
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
    FileUploadModule,
    NgIf,
    MultiSelectModule,
    Select,
    Toast,
    TranslocoPipe
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {


  protected userService: UserService = inject(UserService);
  protected courseService: CourseService = inject(CourseService);
  protected roomService: RoomService = inject(RoomService);
  protected auth: AuthService = inject(AuthService);
  protected messageService: MessageService = inject(MessageService);
  protected translocoService = inject(TranslocoService)


  cols: Column[] = [];

  referenceModalVisible = false;
  editModalVisible = false;
  deleteModalVisible = false;
  inviteModalVisible = false;


  courseModalVisible = false;

  step1Value = 1;
  step2Value = 2;

  selectedCourse: newCourse | null = null;
  newCourse: newCourse = {name: ''};
  editedCourse: newCourse = {name: ''};

  users!: User[];
  selectedUser: User[] = []

  icons!: RoomIcon[] | undefined;
  selectedIcons!: RoomIcon | undefined;

  filteredCourses!: Course[];
  selectedRoomId: string = ""

  translateItems() {
    this.icons = [
      {name: 'Naturwissenschaft', path: 'course_icon_1.png'},
      {name: 'Soziologie', path: 'course_icon_2.png'},
      {name: 'Psychologie', path: 'course_icon_3.png'},
      {name: 'Englisch', path: 'course_icon_4.png'},
      {name: 'Software Engineering', path: 'course_icon_5.png'}
    ];

    this.translocoService.selectTranslate('settings.lecture').subscribe(translated => {
      this.cols = [
        { field: 'name', header: translated }
      ];
    });

  }

  async ngOnInit() {

    await lastValueFrom(this.translocoService.load(this.translocoService.getActiveLang()));

    console.log(this.translocoService.translate('settings.lecture'))

    this.translocoService.langChanges$.subscribe(() => {
      this.translateItems()
    })


    const userId = this.auth.getUserId();

    this.roomService.getAllRooms().subscribe(rooms => {
      this.filteredCourses = rooms.filter(
        (room: any) => room.attributes?.owner?.[0] === userId
      ); // 👈 Store it for the table
    });


  }


  addUsersToRoom() {
    const groupID = this.selectedRoomId;
    const userIDs: any = this.selectedUser.map(user => user.id);

    this.roomService.addUsersToGroup(groupID, userIDs).subscribe({
      next: () => console.log('Users added!'),
      error: err => console.error('Error:', err)
    });
    this.selectedUser = []
    this.inviteModalVisible = false;
  }


  openCourseModal() {
    this.step1Value = 1;
    this.courseModalVisible = true;
  }

  selectedRoomPath: string = '';

  openReferenceModal(course: any) {
    this.referenceModalVisible = true;
    this.selectedRoomPath = course.path;
  }

  openEditModal(course: newCourse) {
    this.editedCourse = {...course};
    this.editModalVisible = true;
  }

  openInviteModal(course: any) {
    this.inviteModalVisible = true
    this.selectedRoomId = course.id

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Antwort von /users:', this.users);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzer:', err);
      }
    });

    this.inviteModalVisible = true;
  }


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

  selectedUploadFile!: File;

  uploadMultipleFiles(event: any, roomPath: string) {
    const formData = new FormData();
    const files: File[] = event.files;

    for (const file of files) {
      formData.append('file', file); // append each file individually
    }

    formData.append('roomPath', roomPath);

    fetch('http://localhost:8080/references/upload', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    }).then(response => {
      if (response.ok) {
        this.messageService.add({severity: 'info', summary: 'Upload erfolgreich', detail: ''});
        console.log('Alle Dateien erfolgreich hochgeladen');
      } else {
        console.error('Upload fehlgeschlagen:', response.status);
      }
    });
  }


}
