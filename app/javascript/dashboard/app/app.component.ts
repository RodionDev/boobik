import { Component, ElementRef, HostBinding, HostListener,
         OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProfileModalComponent } from './common/profile-modal.component';
import { DocumentService } from './services/document.service';
import { LoggerService } from './services/logger.service';
import { UserService } from './services/user.service';
import { LocationService } from './services/location.service';
import { SocketService } from './services/socket.service';
import { DocumentContents, UserInformation } from './interfaces';
import templateString from './template.html';
@Component({
    selector: 'bikboo-shell',
    template: templateString,
    animations: [
        trigger("navState", [
            transition(':enter', [
                style({transform: 'translateY(-10%)', opacity: 0}),
                animate('200ms ease', style({transform: 'translateY(0)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translateY(0)', opacity: 1}),
                animate('200ms ease', style({transform: 'translateY(-10%)', opacity: 0}))
            ])
        ]),
        trigger("progressFade", [
            transition(':enter', [
                style({opacity: 0}),
                animate('200ms ease-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('500ms ease-in', style({opacity: 0}))
            ])
        ])
    ]
})
export class AppComponent implements OnInit {
    protected DOMConfig = {
        banner: false as any,
        subBanner: '' as string
    };
    isStarting:boolean = true;
    isFetching:boolean = true;
    fetchProgress:number = 0;
    protected requestContentLength:number = 0;
    private progressBarTimeout:any;
    loggedInUser:UserInformation;
    @ViewChild( ProfileModalComponent )
    profileModal:ProfileModalComponent;
    @ViewChild( 'profileToggle' ) profileToggle:ElementRef;
    currentUrl:string;
    currentDocument:DocumentContents;
    @HostBinding('class')
    protected hostClasses:string = '';
    constructor(
        private documentService: DocumentService,
        private userService: UserService,
        private locationService: LocationService,
        private logger: LoggerService,
        private hostElement: ElementRef,
    ) {}
    ngOnInit() {
        this.locationService.currentUrl.subscribe(url => {
            if( url == this.currentUrl ) {
            } else {
                this.currentUrl = url;
                clearTimeout( this.progressBarTimeout )
                this.progressBarTimeout = setTimeout( () => {
                    this.isFetching = true;
                }, 300 )
            }
        });
        this.documentService.currentDocument.subscribe( ( event:HttpEvent<any> ) => {
            switch( event.type ) {
                case HttpEventType.Sent:
                    this.fetchProgress = 0.2;
                    break;
                case HttpEventType.ResponseHeader:
                    this.fetchProgress = 0.4;
                    this.requestContentLength = parseInt( event.headers.get('content-length') ) || 1;
                    break;
                case HttpEventType.DownloadProgress:
                    this.fetchProgress = Math.max( this.fetchProgress, Math.min( event.loaded / this.requestContentLength, 0.9 ) );
                    break;
                case HttpEventType.Response:
                    this.fetchProgress = 0.9;
                    this.requestContentLength = 0;
                    this.currentDocument = event.body;
            }
        });
        this.userService.currentUser.subscribe( (data) => {
            const user = data.user
            if( !user && this.loggedInUser ) {
                this.documentService.reload();
                ( window as any ).notices.queue("Account has been logged out in another tab, refreshed page");
            }
            this.loggedInUser = user;
        } );
    }
    onDocumentReceived(){}
    onDocumentPrepared(){
        clearTimeout( this.progressBarTimeout );
    }
    onDocumentRemoved(){}
    onDocumentInserted() {
        setTimeout(() => this.updateHost(), 0);
    }
    onDocumentSwapComplete(){
        this.fetchProgress = 1;
        setTimeout(() => {
            this.isStarting = false
            this.updateHost()
        }, 0);
        setTimeout(() => {
            this.isFetching = false
        }, 500);
    }
    updateHost() {
        const urlWithoutSearch = this.currentUrl.match(/[^?]*/)[0];
        const pageSlug = urlWithoutSearch ? /^\/*(.+?)\/*$/g.exec( urlWithoutSearch )[1].replace(/\
        this.DOMConfig.banner = pageSlug != "index"
        this.DOMConfig.subBanner = this.currentDocument.sub_title;
        this.hostClasses = [
            `page-${pageSlug}`,
            `tree-${pageSlug.match(/[^-]+/)[0]}`,
            `${this.isStarting ? "not-" : ""}ready`
        ].join(' ')
    }
    toggleProfileModal() {
        this.profileModal.toggle();
    }
    @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey'])
    onClick( eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean ) {
        if( button !== 0 || ctrlKey || metaKey ) {
            return true
        }
        if(
            this.profileModal && this.profileModal.isOpen &&
            !( this.profileModal.nativeElement.contains( eventTarget ) || this.profileToggle.nativeElement.contains( eventTarget ) )
        ) {
            this.profileModal.toggle();
            return false;
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
