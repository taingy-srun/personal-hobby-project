import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

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
