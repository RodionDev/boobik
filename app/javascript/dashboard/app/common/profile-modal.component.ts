import { Component, OnInit, Input, Output, ElementRef } from '@angular/core'
import { UserInformation } from '../interfaces'
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
    selector: 'app-profile-modal',
    template: `
        <div id="profile-modal" *ngIf="isOpen" [@modalState]>
            <div class="wrapper">
                <div id="top" class="clearfix">
                    <div id="image">
                        <img bind-src="loggedInUser.image_url" alt="Profile avatar">
                    </div>
                    <div id="profile" class="vertical-centre">
                        <div class="wrapper">
                            <h1>{{loggedInUser.name}}</h1>
                            <a href="/dashboard">Dashboard</a>
                            <span>&mdash;</span>
                            <a href="/account">Account</a>
                        </div>
                    </div>
                </div>
                <a href="/signout" class="button inplace no-follow" id="signout">Sign out</a>
            </div>
        </div>
    `,
    animations: [
        trigger("modalState", [
            transition(':enter', [
                style({ opacity: 0, top: "45px"}),
                animate('100ms ease-out', style({opacity: 1, top: "55px"}))
            ]),
            transition(':leave', [
                style({opacity: 1, top: "55px"}),
                animate('100ms ease-in', style({opacity: 0, top: "45px"}))
            ])
        ])
    ]
})
export class ProfileModalComponent implements OnInit {
    @Input("user") loggedInUser: UserInformation;
    @Output() isOpen:boolean = false;
    nativeElement:HTMLElement;
    constructor(elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }
    ngOnInit() {}
    toggle() {
        this.isOpen = !this.isOpen
    }
}
