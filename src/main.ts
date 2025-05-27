import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthService } from './app/auth/auth.service';

async function main() {
  const authService = new AuthService();
  await authService.init();

  await bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(),
      provideRouter(routes),
      provideZoneChangeDetection({ eventCoalescing: true }),
      { provide: AuthService, useValue: authService }
    ],
  });
}

main();
