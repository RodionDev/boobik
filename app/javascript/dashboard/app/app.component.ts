import { Component, ElementRef, HostBinding, HostListener,
         OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DocumentService } from './services/document.service';
import { LoggerService } from './services/logger.service';
import { UserService } from './services/user.service';
import { LocationService } from './services/location.service';
import templateString from './template.html';
@Component({
    selector: 'bikboo-shell',
    template: templateString
})
export class AppComponent implements OnInit {
    isStarting:boolean = true;
    isFetching:boolean = false;
    navigationEnabled: boolean = false;
    currentUrl: string;
    currentUrlParams: string;
    constructor(
        private documentService: DocumentService,
        private userService: UserService,
        private locationService: LocationService,
        private logger: LoggerService,
        private hostElement: ElementRef,
    ) {}
    ngOnInit() {
        this.locationService.currentUrl.subscribe(url => {
            this.logger.debug("LocationService has delivered new URL to AppComponent. New URL is ", url);
            this.currentUrl = url;
        })
    }
    @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey'])
    onClick( eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean ) {
        if( button !== 0 || ctrlKey || metaKey ) {
            return true
        }
        let current: HTMLElement|null = eventTarget;
        while( current && !( current instanceof HTMLAnchorElement ) ) {
            current = current.parentElement;
        }
        if( current instanceof HTMLAnchorElement ) {
            return this.locationService.handleAnchorClick( current )
        }
    }
}
