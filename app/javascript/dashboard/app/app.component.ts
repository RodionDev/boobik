import { Component, ElementRef, HostBinding, HostListener,
         OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProfileModalComponent } from './common/profile-modal.component';
import { DocumentViewerComponent } from './common/document-viewer.component';
import ActionCable from 'actioncable';
import { DocumentService } from './services/document.service';
import { LoggerService } from './services/logger.service';
import { UserService } from './services/user.service';
import { LocationService } from './services/location.service';
import { SocketService } from './services/socket.service';
import { SidebarService } from './services/sidebar.service';
import { DocumentContents, UserInformation, SidebarStatus } from './interfaces';
import $ from 'jquery';
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
        ]),
        trigger("linkState", [
            transition(':enter', [
                style({transform: 'translate(20%, -50%)', opacity: 0}),
                animate('200ms ease', style({transform: 'translate(0, -50%)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'translate(0, -50%)', opacity: 1}),
                animate('200ms ease', style({transform: 'translate(20%, -50%)', opacity: 0}))
            ])
        ])
    ]
})
export class AppComponent implements OnInit {
    DOMConfig = {
        banner: false as boolean,
        subBanner: '' as string,
        bannerLink: false as any,
        breadcrumbs: [] as any[],
        sidebarActive: false as boolean,
        sidebarCollapsed: false as boolean
    };
    isStarting:boolean = true;
    isFetching:boolean = true;
    fetchProgress:number = 0;
    protected isSwapping:boolean = false;
    protected requestContentLength:number = 0;
    private progressBarTimeout:any;
    loggedInUser:UserInformation;
    @ViewChild( ProfileModalComponent )
    profileModal:ProfileModalComponent;
    @ViewChild( 'profileToggle' ) profileToggle:ElementRef;
    @ViewChild( DocumentViewerComponent )
    docViewer:DocumentViewerComponent;
    currentUrl:string;
    currentDocument:DocumentContents;
    protected newUrl:string|boolean;
    private resizeTimeout:any;
    @HostBinding('class')
    protected hostClasses:string = '';
    constructor(
        private documentService: DocumentService,
        private userService: UserService,
        private locationService: LocationService,
        private logger: LoggerService,
        private hostElement: ElementRef,
        private sidebarService: SidebarService
    ) {}
    ngOnInit() {
        this.documentService.onUrlUpdate$.subscribe( url => {
            this.newUrl = window.location.pathname;
        } );
        this.sidebarService.status.subscribe( ( status:SidebarStatus ) => {
            this.DOMConfig.sidebarActive = status.active;
            this.DOMConfig.sidebarCollapsed = status.collapsed;
            this.updateHost();
        } );
        this.documentService.currentDocument.subscribe( ( event:HttpEvent<any> ) => {
            this.logger.log( event )
            switch( event.type ) {
                case HttpEventType.Sent:
                    this.logger.log("Request sent")
                    this.isFetching = true
                    this.fetchProgress = 0.2;
                    break;
                case HttpEventType.ResponseHeader:
                    this.logger.log("Request response headers received")
                    this.fetchProgress = 0.4;
                    this.requestContentLength = parseInt( event.headers.get('content-length') ) || 1;
                    break;
                case HttpEventType.DownloadProgress:
                    this.logger.log("Request download progress report")
                    this.fetchProgress = Math.max( this.fetchProgress, Math.min( event.loaded / this.requestContentLength, 0.8 ) );
                    break;
                case HttpEventType.Response:
                    this.logger.log("Request response")
                    this.fetchProgress = 0.9;
                    this.requestContentLength = 0;
                    this.currentDocument = event.body;
            }
        });
        this.userService.currentUser.subscribe( (user) => {
            if( ( !user && this.loggedInUser ) || ( user && !this.loggedInUser ) || ( user && this.loggedInUser && user.id != this.loggedInUser.id ) )
                this.documentService.reload();
            this.loggedInUser = user;
        } );
    }
    onDocumentReceived(){
        this.isSwapping = true;
    }
    onDocumentPrepared(){
        clearTimeout( this.progressBarTimeout );
    }
    onDocumentRemoved(){}
    onDocumentInserted() {
        if( this.newUrl ) {
            this.currentUrl = <string>this.newUrl;
            this.newUrl = false;
        }
        this.updateHost();
    }
    onDocumentSwapComplete(){
        this.fetchProgress = 1;
        this.isSwapping = false;
        setTimeout(() => {
            this.isStarting = false
            this.updateHost()
        }, 0);
        setTimeout(() => {
            this.isFetching = false
        }, 500);
    }
    updateHost() {
        setTimeout( () => {
            const urlWithoutSearch = (this.currentUrl || '').match(/[^?]*/)[0];
            const pageSlug = urlWithoutSearch ? /^\/*(.+?)\/*$/g.exec( urlWithoutSearch )[1].replace(/\
            this.DOMConfig.banner = pageSlug != "index" && !this.currentDocument.no_banner
            this.DOMConfig.subBanner = this.currentDocument.sub_title;
            this.DOMConfig.bannerLink = this.currentDocument.banner_link;
            this.DOMConfig.breadcrumbs = this.currentDocument.breadcrumbs || [];
            this.hostClasses = [
                `page-${pageSlug}`,
                `tree-${pageSlug.match(/[^-]+/)[0]}`,
                `${this.isStarting ? "not-" : ""}ready`,
                this.isSwapping ? 'swapping' : 'idle',
                `sidebar-${this.DOMConfig.sidebarActive ? 'active' : 'inactive'}`,
                ( this.DOMConfig.sidebarCollapsed && this.DOMConfig.sidebarActive ) ? `sidebar-collapsed` : null,
            ].join(' ')
            this.onResize();
        }, 0 );
    }
    toggleProfileModal() {
        this.profileModal.toggle();
    }
    @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey'])
    onClick( eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean ) {
        if( button !== 0 || ctrlKey || metaKey ) {
            return true
        }
        let modalOpen:boolean = this.profileModal && this.profileModal.isOpen;
        if( modalOpen && !( this.profileModal.nativeElement.contains( eventTarget ) || this.profileToggle.nativeElement.contains( eventTarget ) ) ) {
            this.profileModal.toggle();
            return false;
        }
        let current: HTMLElement|null = eventTarget;
        while( current && !( current instanceof HTMLAnchorElement ) ) {
            current = current.parentElement;
        }
        if( current instanceof HTMLAnchorElement ) {
            if( !this.locationService.handleAnchorClick( current ) ) {
                if( modalOpen ) {
                    this.profileModal.toggle();
                }
                return false;
            }
            return true
        }
    }
    @HostListener('window:resize')
    onResize() {
        clearTimeout( this.resizeTimeout );
        this.resizeTimeout = setTimeout( () => {
            const activeDiv = $( this.docViewer.hostElement ).find("div.dynamic-nav-padding");
            activeDiv.css("padding-top", this.DOMConfig.banner && $("nav").outerHeight() || 0);
        }, 50 );
    }
}
