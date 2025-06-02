import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/auth/auth.service';
import { appConfig } from './app/app.config';

async function main() {
  const authService = new AuthService();
  await authService.init();

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: AuthService, useValue: authService },
      ...appConfig.providers!
    ],
  });
}

main();
