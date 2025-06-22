import { Component, computed, effect, inject, signal } from '@angular/core';
import { CoursesSearchComponent } from './ui/courses-search/courses-search.component';
import { CoursesPaginationComponent } from './ui/courses-pagination/courses-pagination.component';
import { CourseService } from './data-access/course.service';
import { CoursesLoadingPlaceholderComponent } from './ui/courses-loading-placeholder/courses-loading-placeholder.component';
import { CoursesSemesterFilterComponent } from './ui/courses-semester-filter/courses-semester-filter.component';

@Component({
  selector: 'app-courses',
  imports: [
    CoursesSearchComponent,
    CoursesPaginationComponent,
    CoursesLoadingPlaceholderComponent,
    CoursesSemesterFilterComponent
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  searchValue = signal('');
  courseService = inject(CourseService);
  coursesLoading = this.courseService.loading;

  semesterList = this.courseService.semesterList;
  selectedSemster = signal<string | undefined>('');

  constructor() {
    effect(() => {
      this.selectedSemster.set(this.semesterList().at(0));
    });
  }

  onSemesterChange(semester: string) {
    this.selectedSemster.set(semester);
  }

  filteredProfessors = computed(() => {
    const selectedSemester = this.selectedSemster();
    const search = this.searchValue().trim().toLowerCase();

    const professors = this.courseService
      .semesters()
      .filter(
        (semester) => semester.year + semester.semesterType === selectedSemester
      )
      .flatMap((semester) => semester.professors);

    if (!search) {
      return professors;
    }

    return professors.filter(
      (prof) =>
        prof.name.toLowerCase().includes(search) ||
        prof.courses.some((course) =>
          course.name.toLowerCase().includes(search)
        )
    );
  });

  onSearchValueChange(newValue: string) {
    this.searchValue.set(newValue);
  }
}
