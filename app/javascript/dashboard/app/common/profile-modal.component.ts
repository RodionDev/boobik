import { Component, OnInit, Input } from '@angular/core'
import { UserInformation } from '../interfaces'
@Component({
    selector: 'app-profile-modal',
    template: `
        <div id="profile-modal">
            <div class="wrapper">
                <div id="top" class="clearfix">
                    <div id="image">
                        <img src="" alt="Profile avatar">
                    </div>
                    <div id="profile" class="vertical-centre">
                        <div class="wrapper">
                            <h1>Placeholder</h1>
                            <a href="/dashboard">Dashboard</a>
                            <span>&mdash;</span>
                            <a href="/account">Account</a>
                        </div>
                    </div>
                </div>
                <a href="/signout" class="button inplace" id="signout">Sign out</a>
            </div>
        </div>
    `
})
export class ProfileModalComponent implements OnInit {
    @Input("user") loggedInUser: UserInformation;
    constructor() {}
    ngOnInit() {}
}
