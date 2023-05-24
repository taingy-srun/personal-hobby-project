import { Component } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private _sessionService: SessionService) {}

  public getName(): string {
    return this._sessionService.getName();
  }

  public logout() {
    this._sessionService.setName("");
    this._sessionService.setToken("");
  }
}
