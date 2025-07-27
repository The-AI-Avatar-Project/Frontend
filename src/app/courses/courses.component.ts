import {Component, computed, effect, inject, signal} from '@angular/core';
import {CoursesSearchComponent} from './ui/courses-search/courses-search.component';
import {CoursesPaginationComponent} from './ui/courses-pagination/courses-pagination.component';
import {CourseService} from './data-access/course.service';
import {
  CoursesLoadingPlaceholderComponent
} from './ui/courses-loading-placeholder/courses-loading-placeholder.component';
import {CoursesSemesterFilterComponent} from './ui/courses-semester-filter/courses-semester-filter.component';
import {TranslocoPipe} from '@jsverse/transloco';

//Prime NG
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-courses',
  imports: [
    CoursesSearchComponent,
    CoursesPaginationComponent,
    CoursesLoadingPlaceholderComponent,
    CoursesSemesterFilterComponent,
    TranslocoPipe,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  searchValue = signal('');
  courseService = inject(CourseService);
  coursesLoading = this.courseService.loading;
  semesterList = this.courseService.semesterList;
  selectedSemester = signal<string | undefined>('');

  protected auth: AuthService = inject(AuthService);


  constructor() {
    effect(() => {
      this.selectedSemester.set(this.semesterList().at(0));
    });

    console.log(this.auth.getUserGroups())
    console.log(this.auth.isLoggedIn())
    console.log(this.auth.getFirstName())
    console.log(this.auth.getLastName());
    console.log(this.auth.getProfile())
    console.log(this.auth.getUserGroups())

  }

  onSemesterChange(semester: string) {
    this.selectedSemester.set(semester);
  }

  filteredProfessors = computed(() => {
    const selectedSemester = this.selectedSemester();
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

  selectedSemster() {
    return undefined;
  }
}
