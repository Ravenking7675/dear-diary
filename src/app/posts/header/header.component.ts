import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  tokenListener : Subscription;
  isTokenized = false;


  constructor(public authService : AuthServiceService) { }


  ngOnDestroy(): void {
      this.tokenListener.unsubscribe();
  }

  ngOnInit(): void {

    this.tokenListener = this.authService.tokenListener()
        .subscribe(tokenObsv => {
            this.isTokenized = tokenObsv;
        })

    this.isTokenized = this.authService.getTokenStatus();

  }

  logout() {
    this.authService.logout();
  }

}
