import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {Menubar} from 'primeng/menubar';
import {Avatar} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {RoutingService} from '../../../shared/services/routing.service';
import {SelectButton} from 'primeng/selectbutton';
import {SelectButtonModule} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {LanguageService} from '../../../shared/data-access/transloco.service';
import {AuthService} from '../../../auth/auth.service';
import {UserService} from '../../../shared/services/user.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    Menubar,
    Avatar,
    Menu,
    Ripple,
    SelectButton,
    SelectButtonModule,
    FormsModule,
    TranslocoPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  title = 'AI Avatar';

  protected routingService: RoutingService = inject(RoutingService);
  protected translocoService: TranslocoService = inject(TranslocoService);
  protected LanguageService: LanguageService = inject(LanguageService);
  protected userService: UserService = inject(UserService);
  protected auth: AuthService = inject(AuthService);
  protected http: HttpClient = inject(HttpClient);

  items: MenuItem[] | undefined;
  userDropdownItems: MenuItem[] | undefined;

  username: string | undefined;

  //Change Language
  stateOptions: any[] = [
    {label: 'DE', value: 'de'},
    {label: 'EN', value: 'en'},
  ];

  value: string = this.translocoService.getActiveLang();



  ngOnInit(): void {
    this.auth.getFirstName().then((value) => (this.username = value));
      this.items = [
      {
        label: "navbar.courses",
        icon: 'pi pi-search',
        command: () => this.routingService.courses(),
      },
    ];

    // QUICK FIX FOR PRIMENG DROPDOWN TRANSLOCO SOLUTION (anders gehts nicht)
    this.translocoService.selectTranslateObject([
      'settings.lecture',
      'navbar.settings',
      'navbar.avatar',
      'navbar.logOut'
    ]).subscribe(([settingsLecture, navbarSettings, navbarAvatar, navbarLogOut]) => {
      this.userDropdownItems = [{
        label: settingsLecture,
        items: [
          { label: navbarSettings, icon: 'pi pi-cog', command: () => this.routingService.settings() },
          { label: navbarAvatar, icon: 'pi pi-user', command: () => this.routingService.avatar() },
          { label: navbarLogOut, icon: 'pi pi-sign-out', command: () => this.auth.logout() },
        ],
      }];
    });


  }

  setUserLanguage(language: string) {
    this.userService.setUserLanguage(language).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (err) => console.log(err),
    });
  }
}
