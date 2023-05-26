import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  labelProfile = environment.label_profile;
  labelName = environment.label_name;

  constructor(private _authenticationService: AuthenticationService) {}

  public getName(): string {
    return this._authenticationService.getName();
  }

}
