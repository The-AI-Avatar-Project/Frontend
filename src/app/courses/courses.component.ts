import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Course } from '../shared/interfaces/courses';

import { AuthService } from '../auth/auth.service';
import { CoursesSearchComponent } from './ui/courses-search/courses-search.component';
import { CoursesPaginationComponent } from './ui/courses-pagination/courses-pagination.component';

@Component({
  selector: 'app-courses',
  imports: [CoursesSearchComponent, CoursesPaginationComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit {
  private authService = inject(AuthService);

  courses = signal<Course[]>([]);

  ngOnInit(): void {
    const groups = this.authService.getUserGroups();
    const mappedCourses: Course[] = groups.map(group => ({
      name: group,
      image: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(group)}`
    }));
    this.courses.set(mappedCourses);
  }
}
