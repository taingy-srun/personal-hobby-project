import { Component } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(private _sessionService: SessionService) {}

  public isLogin() {
    return !this._sessionService.isLogin();
  }

}
