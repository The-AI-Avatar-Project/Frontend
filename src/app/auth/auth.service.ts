import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloak: Keycloak.KeycloakInstance;

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keykloakUrl,
      realm: 'AI-Avatar',
      clientId: 'frontend-client',
    });
  }

  init(): Promise<boolean> {
    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
    });
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak.token;
  }

  getProfile(): Promise<Keycloak.KeycloakProfile | undefined> {
    return this.keycloak.loadUserProfile();
  }

  getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.['preferred_username'];
  }

  getFirstName(): Promise<string | undefined> {
    return this.keycloak.loadUserProfile().then((profile) => profile.firstName);
  }

  getLastName(): Promise<string | undefined> {
    return this.keycloak.loadUserProfile().then((profile) => profile.lastName);
  }

  getUserGroups(): string[] {
    const groups = this.keycloak.tokenParsed?.['groups'];
    return Array.isArray(groups) ? groups : [];
  }
}
