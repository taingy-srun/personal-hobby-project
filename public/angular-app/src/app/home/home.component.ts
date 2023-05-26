import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  title = environment.application_title;
  welcomeTo = environment.home_welcome_to;
  bpSlogan = environment.home_my_bp_slogan;
  bpMembers = environment.home_bp_members;
  bpInYourArea = environment.home_bp_inyourarea;

}
