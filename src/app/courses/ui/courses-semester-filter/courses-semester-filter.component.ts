import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-courses-semester-filter',
  imports: [CommonModule],
  templateUrl: './courses-semester-filter.component.html',
  styleUrl: './courses-semester-filter.component.scss'
})
export class CoursesSemesterFilterComponent {
  semesterList = input<string[]>([]);
  selectedSemester = input<string>();
  onSemesterChange = output<string>();

  onSemesterClick(semester: string) {
    this.onSemesterChange.emit(semester);
  }
}
