import {ChangeDetectorRef, Component, computed, effect, inject, signal} from '@angular/core';
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
import {iconNames} from './data-access/icons';
import {Router} from '@angular/router';

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
    FileUploadModule,
    NgIf,
    MultiSelectModule,
    Select,
    Toast,
    TranslocoPipe,
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
  protected translocoService = inject(TranslocoService);
  protected router = inject(Router);

  cols: Column[] = [];

  referenceModalVisible = false;
  inviteModalVisible = false;
  courseModalVisible = false;

  step1Value = 1;

  newCourse: newCourse = {name: ''};

  users!: User[];
  selectedUser: User[] = [];
  userID = this.auth.getUserId();

  icons: string[] = iconNames;
  selectedIcon: string = '';

  filteredCourses = signal<Course[]>([]);


  selectedRoomId: string = '';


  async ngOnInit() {
    this.auth.getRole()

    await lastValueFrom(
      this.translocoService.load(this.translocoService.getActiveLang())
    );

    this.translocoService.langChanges$.subscribe(() => {
      this.translateItems()
    })

    this.loadRooms();

  }

  private cdr = inject(ChangeDetectorRef);

  loadRooms() {
    this.roomService.getAllRooms().subscribe((rooms) => {
      console.log(rooms)
      const userID = this.auth.getUserId();
      this.filteredCourses.set(
        rooms.filter((room: any) => room.attributes?.owner?.[0] === userID)
      );
      console.log(this.filteredCourses());
      this.cdr.detectChanges(); // 👈 force Angular to re-check
    });
  }


  translateItems() {
    this.translocoService.selectTranslate('settings.lecture').subscribe(translated => {
      this.cols = [
        {field: 'name', header: translated}
      ];
    });
  }

  addUsersToRoom() {
    const groupID = this.selectedRoomId;
    const userIDs: any = this.selectedUser.map((user) => user.id);

    this.roomService.addUsersToGroup(groupID, userIDs).subscribe(response => {
      if (response.ok) {
        this.messageService.add({
          severity: 'success',
          summary: 'User zum Raum hinzugefügt',
          detail: '',
        })
      }
    });
    this.selectedUser = [];
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

  openInviteModal(course: any) {
    this.inviteModalVisible = true;
    this.selectedRoomId = course.id;

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzer:', err);
      },
    });

    this.inviteModalVisible = true;
  }

  // UPLOAD FILES AND SHOW THEM
  // Speichert die echten File-Objekte mit Dateiname als Schlüssel
  fileBlobMap = new Map<string, File>();


  files = signal<FileEntry[]>([]);
  selectedFile!: FileEntry;


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


  uploadMultipleFiles(event: any, roomPath: string) {
    const files: File[] = event.files;

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('roomPath', roomPath);

      fetch('http://localhost:8080/references/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${this.auth.getToken()}`
          // Note: Don't set 'Content-Type' manually with FormData
        }
      }).then(response => {
        if (response.ok) {
          this.messageService.add({
            severity: 'success',
            summary: `Datei ${file.name} erfolgreich hochgeladen`,
            detail: ''
          });
          this.referenceModalVisible = false;
        } else {
          console.error(`Upload fehlgeschlagen für ${file.name}:`, response.status);
        }
      }).catch(error => {
        console.error(`Fehler beim Hochladen von ${file.name}:`, error);
      });
    }
  }

  createGroup(name: any, year: any, semester: any, selectedIcon: string) {


    this.roomService.createGroup(name, year, semester, selectedIcon).subscribe(response => {
      if (response.ok) {
        this.messageService.add({
          severity: 'success',
          summary: 'Raum erfolgreich erstellt',
          detail: '',
        });
        this.courseModalVisible = false;
        this.loadRooms();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Diese Aktion ist Fehlgeschlagen',
          detail: '',
        });
      }

    })


  }

}
