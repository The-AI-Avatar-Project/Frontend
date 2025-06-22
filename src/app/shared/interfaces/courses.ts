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
