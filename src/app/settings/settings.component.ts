import {Component, effect, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Course, newCourse} from '../shared/interfaces/courses';
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
import {Select} from 'primeng/select';

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
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    FileUpload,
    NgIf,
    Listbox,
    MultiSelectModule,
    Select
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {


  protected userService: UserService = inject(UserService);
  protected courseService: CourseService = inject(CourseService);
  protected roomService: RoomService = inject(RoomService);
  protected auth: AuthService = inject(AuthService);


  cols: Column[] = [];

  addModalVisible = false;
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


  ngOnInit() {


    this.cols = [
      {field: 'name', header: 'Vorlesung'},
      {field: 'id', header: 'Id'},
    ];


    this.icons = [
      {name: 'Naturwissenschaft', path: 'course_icon_1.png'},
      {name: 'Soziologie', path: 'course_icon_2.png'},
      {name: 'Psychologie', path: 'course_icon_3.png'},
      {name: 'Englisch', path: 'course_icon_4.png'},
      {name: 'Software Engineering', path: 'course_icon_5.png'}
    ];

    const userId = this.auth.getUserId();

    this.roomService.getAllRooms().subscribe(rooms => {
      const ownedGroups = rooms.filter(
        (room: any) => room.attributes?.owner?.[0] === userId
      );

      console.log('Groups owned by current user:', ownedGroups);

      this.filteredCourses = ownedGroups; // 👈 Store it for the table
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


  showCourse(course: newCourse) {
    console.log('Show:', course);
  }

  openAddModal() {
    this.addModalVisible = true;
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


  openDeleteModal(course: newCourse) {
    this.selectedCourse = course;
    this.deleteModalVisible = true;
  }

  // deleteCourse() {
  //   if (!this.selectedCourse) return;
  //   SCourse.update(current =>
  //     current.filter(c => c.id !== this.selectedCourse!.id)
  //   );
  //   this.deleteModalVisible = false;
  //   this.selectedCourse = null;
  // }


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
