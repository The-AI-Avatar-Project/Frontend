import {Injectable} from '@angular/core';
import Keycloak from 'keycloak-js';
import {environment} from '../environments/environment';
import {jwtDecode} from 'jwt-decode';

@Injectable({providedIn: 'root'})
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

  getRole() {
    const realmAccess: any = this.keycloak.realmAccess?.roles
    let role = "";
    if (realmAccess.includes("student")) {
      role = "student"
    } else if (realmAccess.includes("roomowner")) {
      role = "roomowner"
    }

    return role;

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

  getUserId(): string | undefined {
    return this.keycloak.tokenParsed?.sub;
  }

  getUserGroups(): string[] {
    const groups = this.keycloak.tokenParsed?.['groups'];
    return Array.isArray(groups) ? groups : [];
  }


}
