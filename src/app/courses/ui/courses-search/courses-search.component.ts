import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-courses-search',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './courses-search.component.html',
  styleUrl: './courses-search.component.scss',
})
export class CoursesSearchComponent {
  searchValue = input('');
  searchValueChange = output<string>();



  onSearchValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValueChange.emit(value);
  }
}
