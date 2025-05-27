import { Component, computed, input, signal } from '@angular/core';
import { Course } from '../../../shared/interfaces/courses';
import { CoursesItemComponent } from '../courses-item/courses-item.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-courses-pagination',
  imports: [CoursesItemComponent, NgClass],
  templateUrl: './courses-pagination.component.html',
  styleUrl: './courses-pagination.component.scss',
})
export class CoursesPaginationComponent {
  Array = Array;

  courses = input.required<Course[]>();

  ELEMENTS_PER_PAGE = signal(8);

  currentPage = signal(1);

  totalPages = computed(() =>
    Math.ceil(this.courses().length / this.ELEMENTS_PER_PAGE())
  );

  displayedCourses = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.ELEMENTS_PER_PAGE();
    const endIndex = startIndex + this.ELEMENTS_PER_PAGE();
    return this.courses().slice(startIndex, endIndex);
  });
}
