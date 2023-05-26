import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {


  navHome = environment.nav_home;
  navAlbums = environment.nav_albums;
  navSolo = environment.nav_solo;
  navProfile = environment.nav_profile;
  navRegister = environment.nav_register;

  constructor(private _authenticationService: AuthenticationService) {}

  public isLoggedIn() {
    return this._authenticationService.isLoggedIn();
  }

}
