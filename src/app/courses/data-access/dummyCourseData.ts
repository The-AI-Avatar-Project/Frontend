import { Professor } from '../../shared/interfaces/courses';

export const dummyCourseData: Professor[] = [
  {
    id: 1,
    name: 'Prof. Grün',
    image: 'dummyprof1.png',
    courses: [
      { id: 101, name: 'Mathematik 1', image: 'dummylecture2.png' },
      { id: 102, name: 'Lineare Algebra', image: 'dummylecture1.png' },
      { id: 102, name: 'Tomaten werfen', image: 'dummylecture4.png' },
      { id: 102, name: 'Tomaten werfen', image: 'dummylecture4.png' },
      { id: 102, name: 'Tomaten werfen', image: 'dummylecture4.png' },
      { id: 102, name: 'Tomaten werfen', image: 'dummylecture4.png' },
    ],
  },
  {
    id: 2,
    name: 'Prof. Beige',
    image: 'dummyprof2.png',
    courses: [
      { id: 103, name: 'Informatik 1', image: 'dummylecture3.png' },
      {
        id: 104,
        name: 'Algorithmen und Datenstrukturen',
        image: 'dummylecture1.png',
      },
    ],
  },
  {
    id: 3,
    name: 'Prof. Türkis',
    image: 'dummyprof3.png',
    courses: [{ id: 105, name: 'Statistik', image: 'dummylecture4.png' }],
  },
  {
    id: 4,
    name: 'Prof. Magenta',
    image: 'dummyprof4.png',
    courses: [
      { id: 106, name: 'Theoretische Informatik', image: 'dummylecture2.png' },
      { id: 107, name: 'Formale Sprachen', image: 'dummylecture3.png' },
    ],
  },
  {
    id: 5,
    name: 'Prof. Ocker',
    image: 'dummyprof1.png',
    courses: [
      { id: 108, name: 'Datenbanken', image: 'dummylecture1.png' },
      { id: 109, name: 'Software Engineering', image: 'dummylecture4.png' },
    ],
  },
  {
    id: 6,
    name: 'Prof. Lila',
    image: 'dummyprof2.png',
    courses: [{ id: 110, name: 'Betriebssysteme', image: 'dummylecture2.png' }],
  },
  {
    id: 7,
    name: 'Prof. Zinnoberrot',
    image: 'dummyprof3.png',
    courses: [
      { id: 111, name: 'Rechnernetze', image: 'dummylecture3.png' },
      { id: 112, name: 'IT-Sicherheit', image: 'dummylecture4.png' },
    ],
  },
  {
    id: 8,
    name: 'Prof. Smaragd',
    image: 'dummyprof4.png',
    courses: [
      { id: 113, name: 'Künstliche Intelligenz', image: 'dummylecture1.png' },
    ],
  },
];
