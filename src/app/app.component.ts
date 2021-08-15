import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import {Post} from './posts/posts.model';
import { routeTransitionAnimations } from './route-transition-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations]
})
export class AppComponent implements OnInit {
  ngOnInit(): void {

    this.authService.autoAuthUser()

  }


  constructor(public authService : AuthServiceService) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
   }
}
