import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Professor } from '../../../shared/interfaces/courses';

@Component({
  selector: 'app-courses-item',
  imports: [RouterModule],
  templateUrl: './courses-item.component.html',
  styleUrl: './courses-item.component.scss',
})
export class CoursesItemComponent {
  professor = input.required<Professor>();
  selectedSemester = input<string>();
  formatSemester(semester: string | undefined | null): string {
    if (!semester || semester.length < 5) {
      return '';
    }
    return semester.slice(0, 4) + '_' + semester.slice(4);
  }
}
