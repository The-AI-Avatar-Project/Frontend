import { computed, inject, Injectable, signal } from '@angular/core';
import {
  Course,
  JwtPayload,
  Professor,
  Semester,
  SemesterType,
} from '../../shared/interfaces/courses';
import { AuthService } from '../../auth/auth.service';
import { jwtDecode } from 'jwt-decode';

export interface CourseState {
  availableCourses: Course[];
}
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private authService = inject(AuthService);

  private state = signal<CourseState>({
    availableCourses: [],
  });

  availableCourses = computed(() => this.state().availableCourses);

  constructor() {
    const jwtToken = this.authService.getToken();
    const payload = this.decodeToken(jwtToken || '');
    const semesters: Semester[] = this.parseGroups(payload?.groups || ['']);
    console.log(semesters)
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Invalid JWT:', error);
      return null;
    }
  }

  parseGroups(groups: string[]): Semester[] {
    const semesterMap = new Map<string, Semester>();

    for (const group of groups) {
      const [, year, semesterType, professorName, courseName] =
        group.split('/');

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

      professor.courses.push({ name: courseName });
    }

    return Array.from(semesterMap.values());
  }
}
