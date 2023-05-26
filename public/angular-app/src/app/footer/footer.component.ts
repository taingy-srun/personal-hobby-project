import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

    currentYear = new Date().getFullYear();
    authorLabel = environment.footer_author_label;
    authorName = environment.footer_author_name;
    copyright = environment.footer_copyright;

}
