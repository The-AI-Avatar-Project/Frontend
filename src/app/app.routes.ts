import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; // Importieren!

export const routes: Routes = [
  {
    path: 'courses',
    canActivate: [authGuard],   // GUARD HINZUFÜGEN
    loadComponent: () =>
      import('./courses/courses.component').then((m) => m.CoursesComponent),
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: '**', redirectTo: 'courses' },
];
