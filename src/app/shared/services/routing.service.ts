import {Injectable, inject} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {


  protected router: Router = inject(Router);


  home(){
    this.router.navigate(['']);
  }

  courses(){
    this.router.navigate(['/courses']);
  }

  settings(){
    this.router.navigate(['/settings']);
  }

  chat(){
    this.router.navigate(['/chat']);
  }


}
