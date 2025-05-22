import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses-item',
  imports: [RouterModule],
  templateUrl: './courses-item.component.html',
  styleUrl: './courses-item.component.scss',
})
export class CoursesItemComponent {
  image = input.required<string>();
  name = input.required<string>();
}
