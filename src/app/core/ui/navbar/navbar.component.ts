import {Component, inject} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {Menubar} from 'primeng/menubar';
import {NgClass, NgIf} from '@angular/common';
import {Avatar} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import {Menu} from 'primeng/menu';
import {Ripple} from 'primeng/ripple';
import {InputText} from 'primeng/inputtext';
import {RoutingService} from '../../../shared/services/routing.service';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    Menubar,
    NgIf,
    NgClass,
    Avatar,
    Menu,
    Ripple,
    InputText,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  title = 'AI Avatar';

  protected routingService: RoutingService = inject(RoutingService)

  items: MenuItem[] | undefined;
  userDropdownItems: MenuItem[] | undefined;



  ngOnInit(): void {

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.routingService.home()
      },
      {
        label: 'Courses',
        icon: 'pi pi-search',
        command: () => this.routingService.courses()

      },
    ];

    this.userDropdownItems = [
      {
        label: 'Options',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => this.routingService.settings()
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
          }
        ]
      }
    ];

  }




}
