import { provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/auth/auth.service';
import { mergeApplicationConfig } from '@angular/core';
import { appConfig } from './app/app.config';
import { inject } from '@angular/core';
import {MessageService} from 'primeng/api';

const authInitConfig = {
  providers: [
    AuthService,
    MessageService,
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init();
    })
  ]
};

const mergedConfig = mergeApplicationConfig(appConfig, authInitConfig);

bootstrapApplication(AppComponent, mergedConfig);
