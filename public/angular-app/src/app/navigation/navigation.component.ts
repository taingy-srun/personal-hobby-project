import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(private _authenticationService: AuthenticationService) {}

  public isLoggedIn() {
    return this._authenticationService.isLoggedIn();
  }

}
