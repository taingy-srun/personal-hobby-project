import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  labelWelcome = environment.label_welcome;
  labelLogout = environment.label_logout;

  
  constructor(private _authenticationService: AuthenticationService, private _router: Router) {}

  public getName(): string {
    return this._authenticationService.getName();
  }

  public logout() {
    this._authenticationService.logout();
    this.goHome();
  }

  private goHome() {
    this._router.navigate([""]);
  }
}
