import { Component, computed, input, signal } from '@angular/core';
import { Professor } from '../../../shared/interfaces/courses';
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

  professors = input.required<Professor[]>();
  selectedSemester = input<string>();
  ELEMENTS_PER_PAGE = signal(3);

  currentPage = signal(1);

  totalPages = computed(() =>
    Math.ceil(this.professors().length / this.ELEMENTS_PER_PAGE())
  );

  displayedProfessors = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.ELEMENTS_PER_PAGE();
    const endIndex = startIndex + this.ELEMENTS_PER_PAGE();
    return this.professors().slice(startIndex, endIndex);
  });
}
