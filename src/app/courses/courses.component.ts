import { Component, signal } from '@angular/core';
import { Course } from '../shared/interfaces/courses';
import { CoursesItemComponent } from './ui/courses-item/courses-item.component';

@Component({
  selector: 'app-courses',
  imports: [CoursesItemComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss'
})
export class CoursesComponent {
  courses = signal<Course[]>([{name: "Prof. Gelb", image: "demoProfPicture.png"}, {name: "Prof. Beige", image: "demoProfPicture.png"}, {name: "Prof. Test", image: "demoProfPicture.png"}]);

}
