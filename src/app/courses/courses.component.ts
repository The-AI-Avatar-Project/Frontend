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
    { name: 'Prof. Gelb', image: 'demoProfPicture.png' },
    { name: 'Prof. Beige', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
    { name: 'Prof. Test', image: 'demoProfPicture.png' },
  ]);
}
