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
  value = input('');
  placeholder = input('Search...');
  loading = input(true);

  valueChange = output<string>();
  search = output<void>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  onSearch(): void {
    this.search.emit();
  }
}
