import { Component, OnInit, Input } from '@angular/core'
import { UserInformation } from '../interfaces'
@Component({
    selector: 'app-navigation',
    template: `
    <nav>
        <div class="min-container" id="navigation">
            <a class="title" href="/">Bikboo</a>
            <a href="#">About</a>
            <a href="#">Pricing</a>
            <a id="profile" href="#" class="right" *ngIf="loggedInUser">
                <img src="{{loggedInUser.image_url}}?size=40">
                <span>&#x25BC;</span>
            </a>
            <app-profile-modal [user]="loggedInUser"></app-profile-modal>
        </div>
        <div id="sub-banner">
            <div class="min-container">
                <h1 class="page-title">Loading</h1>
            </div>
        </div>
    </nav>
    `
})
export class NavigationComponent implements OnInit {
    @Input() loggedInUser: UserInformation;
    constructor() {}
    ngOnInit() {}
}
