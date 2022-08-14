import { Component } from '@angular/core';
import templateString from './template.html';
@Component({
  selector: 'bikboo-shell',
  template: templateString
})
export class AppComponent {
  title = 'Dashboard'
  section_title = 'Projects'
}
