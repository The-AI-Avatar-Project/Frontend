import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Course, CoursesReponse } from '../../shared/interfaces/courses';
import { API_URL } from '../../shared/constants/constants';
import { catchError, EMPTY, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CourseState {
  availableCourses: Course[];
}
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);


  private state = signal<CourseState>({
    availableCourses: [],
  });

  availableCourses = computed(() => this.state().availableCourses);

  private availableCoursesLoaded$ = this.fetchAvailableCourses();

  constructor() {
    this.availableCoursesLoaded$.pipe(takeUntilDestroyed()).subscribe((courses) => this.state.update((state) => ({
      ...state,
      availableCourses: [...state.availableCourses, ...courses]
    })))
  }

  private fetchAvailableCourses() {
    return this.http.get<CoursesReponse>(`${API_URL}/courses`).pipe(
      catchError((err) => EMPTY),
      map((response) => response.data)
    );
  }
}
