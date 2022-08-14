import { Component, OnInit } from '@angular/core'
import templateString from './template.html'
import './banner.component.sass'
@Component({
    selector: 'app-banner',
    template: templateString
})
export class BannerComponent implements OnInit {
    constructor() {}
    ngOnInit() {}
}
