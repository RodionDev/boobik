import { Component } from '@angular/core';
import templateString from './template.html';
@Component({
  selector: 'app-root',
  template: templateString
})
export class AppComponent {
  title = 'Dashboard'
  section_title = 'Projects'
}
