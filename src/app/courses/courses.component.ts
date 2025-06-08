import { Component, signal } from '@angular/core';
import { Course } from '../shared/interfaces/courses';
import { CoursesSearchComponent } from './ui/courses-search/courses-search.component';
import { CoursesPaginationComponent } from './ui/courses-pagination/courses-pagination.component';

@Component({
  selector: 'app-courses',
  imports: [CoursesSearchComponent, CoursesPaginationComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  courses = signal<Course[]>([
   { id: 1, professorName: 'Prof. Grün', courseName: "Baumpflanzlehre", image: 'demoProfPicture.png' },
  { id: 2, professorName: 'Prof. Blau', courseName: "Wasserökologie", image: 'demoProfPicture.png' },
  { id: 3, professorName: 'Prof. Rot', courseName: "Bodenkunde", image: 'demoProfPicture.png' },
  { id: 4, professorName: 'Prof. Gelb', courseName: "Lichtphysik", image: 'demoProfPicture.png' },
  { id: 5, professorName: 'Prof. Schwarz', courseName: "Forstwirtschaft", image: 'demoProfPicture.png' },
  { id: 6, professorName: 'Prof. Weiß', courseName: "Pflanzenpathologie", image: 'demoProfPicture.png' },
  { id: 7, professorName: 'Prof. Braun', courseName: "Holztechnologie", image: 'demoProfPicture.png' },
  { id: 8, professorName: 'Prof. Lila', courseName: "Pilzkunde", image: 'demoProfPicture.png' },
  { id: 9, professorName: 'Prof. Orange', courseName: "Obstbau", image: 'demoProfPicture.png' },
  { id: 10, professorName: 'Prof. Silber', courseName: "Umweltrecht", image: 'demoProfPicture.png' },
  { id: 11, professorName: 'Prof. Kupfer', courseName: "Klimatologie", image: 'demoProfPicture.png' }
  ]);
}
