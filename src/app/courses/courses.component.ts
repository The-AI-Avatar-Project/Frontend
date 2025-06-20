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
  courseService = inject(CourseService);

  yearList = this.courseService.yearList;
  selectedYear = computed(() => this.yearList().at(0));

  filteredProfessors = computed(() => {
    console.log(this.courseService.semesters());
    let profs = this.courseService
      .semesters()
      .filter((semester) => semester.year === this.selectedYear())
      .flatMap((semester) => semester.professors);
    console.log(profs);
    const search = this.searchValue().trim().toLowerCase();
    if (!search) {
      return profs;
    }
    return profs.filter((prof) => prof.name.toLowerCase().includes(search));
  });

  onSearchValueChange(newValue: string) {
    this.searchValue.set(newValue);
  }
}
