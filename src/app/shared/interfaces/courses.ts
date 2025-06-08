export interface Professor {
  id: number;
  name: string;
  image: string;
  courses: Course[];
}
export interface Course {
  id: number;
  name: string;
  image: string;
}

export interface CoursesReponse {
  data: Course[];
}
