import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses.component').then((m) => m.CoursesComponent),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: '**', redirectTo: 'courses' },
];
