import {signal} from '@angular/core';

export enum SemesterType {
  SoSe = 'Sose',
  WiSe = 'WiSe',
}
export interface Semester {
  year: number;
  semesterType: SemesterType;
  professors: Professor[];
}
export interface Professor {
  name: string;
  image?: string;
  courses: Course[];
}
export interface Course {
  name: string;
  image?: string;
}

export interface CoursesReponse {
  data: Course[];
}

export interface JwtPayload {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    [key: string]: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  name: string;
  groups: string[];
  language: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface newCourse {
  id: string;
  courseID: string;
  name: string;
}

export const SCourse = signal<newCourse[]>([
  { id: '1', courseID: 'C101', name: 'Mathematik Grundlagen' },
  { id: '2', courseID: 'C102', name: 'Physik für Einsteiger' },
  { id: '3', courseID: 'C103', name: 'Einführung in die Informatik' },
  { id: '4', courseID: 'C104', name: 'Chemie Basics' },
  { id: '5', courseID: 'C105', name: 'Literatur des 20. Jahrhunderts' },
  { id: '6', courseID: 'C106', name: 'Geschichte Europas' },
  { id: '7', courseID: 'C107', name: 'Programmieren mit JavaScript' },
  { id: '8', courseID: 'C108', name: 'Statistik und Wahrscheinlichkeiten' },
  { id: '9', courseID: 'C109', name: 'Biologie: Zellstruktur' },
  { id: '10', courseID: 'C110', name: 'Wirtschaft verstehen' },
  { id: '11', courseID: 'C111', name: 'Soziologie und Gesellschaft' },
  { id: '12', courseID: 'C112', name: 'Kunstgeschichte kompakt' },
  { id: '13', courseID: 'C113', name: 'Ethik und Moral' },
]);
