import { Component, computed, inject, signal } from '@angular/core';
import { Course, Professor } from '../shared/interfaces/courses';
import { CoursesSearchComponent } from './ui/courses-search/courses-search.component';
import { CoursesPaginationComponent } from './ui/courses-pagination/courses-pagination.component';
import { dummyCourseData } from './data-access/dummyCourseData';
import { CourseService } from './data-access/course.service';

@Component({
  selector: 'app-courses',
  imports: [CoursesSearchComponent, CoursesPaginationComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  searchValue = signal('');
  professors = signal<Professor[]>(dummyCourseData);
  courseService = inject(CourseService);

  yearList: string[] = Array.from({ length: 4 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  selectedYear = signal<string>(this.yearList[0]);

  filteredProfessors = computed(() => {
    const search = this.searchValue().trim().toLowerCase();
    if (!search) {
      return this.professors();
    }
    return this.professors().filter((prof) =>
      prof.name.toLowerCase().includes(search)
    );
  });

  onSearchValueChange(newValue: string) {
    this.searchValue.set(newValue);
  }
}
