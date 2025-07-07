import { Semester, SemesterType } from '../../shared/interfaces/courses';
import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ApiCourseResponse {
  path: string;
  name: string;
  attributes: {
    [key: string]: string[]; // Accept any attribute key
  };
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  semesters = signal<Semester[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  semesterList = computed(() =>
    Array.from(
      new Set(this.semesters().map((s) => s.year + s.semesterType))
    ).sort((a, b) => b.localeCompare(a))
  );

  constructor() {
    this.loadCourses();
  }

  private loadCourses() {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<ApiCourseResponse[]>('http://localhost:8080/rooms')
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (response) => {
          const parsedSemesters = this.parseApiResponse(response);
          this.semesters.set(parsedSemesters);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load courses');
          this.loading.set(false);
          console.error('Error loading courses:', err);
        },
      });
  }


  getRooms(){
    this.http.get('http://localhost:8080/rooms')
      .subscribe({
        next: (response) => {
          console.log('Antwort von /rooms', response);
        },
        error: (err) => {
          console.log("Fehler beim Laden der Räume", err)
        }
      })
  }

  private parseApiResponse(courses: ApiCourseResponse[]): Semester[] {
    const semesterMap = new Map<string, Semester>();

    for (const course of courses) {
      const [, year, semesterType, professorName] = course.path.split('/');

      const semesterKey = `${year}-${semesterType}`;

      if (!semesterMap.has(semesterKey)) {
        semesterMap.set(semesterKey, {
          year: Number(year),
          semesterType: semesterType as SemesterType,
          professors: [],
        });
      }

      const semester = semesterMap.get(semesterKey)!;

      let professor = semester.professors.find((p) => p.name === professorName);
      if (!professor) {
        professor = { name: professorName, courses: [] };
        semester.professors.push(professor);
      }

      professor.courses.push({
        name: course.name,
        image: course.attributes.icon?.[0],
      });
    }
    console.log(semesterMap.values())
    return Array.from(semesterMap.values());
  }










}
