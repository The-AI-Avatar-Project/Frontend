export interface Course {
  id: number;
  image: string;
  professorName: string;
  courseName: string;
}

export interface CoursesReponse {
  data: Course[];
}
