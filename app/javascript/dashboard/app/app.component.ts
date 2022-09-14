import { Component, ElementRef, HostBinding, HostListener,
         OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DocumentService } from './services/document.service';
import { LoggerService } from './services/logger.service';
import { UserService } from './services/user.service';
import { LocationService } from './services/location.service';
import { DocumentContents } from './interfaces';
import templateString from './template.html';
@Component({
    selector: 'bikboo-shell',
    template: templateString
})
export class AppComponent implements OnInit {
    protected DOMConfig = {
        banner: false as any,
        subBanner: false as any
    };
    isStarting:boolean = true;
    isFetching:boolean = false;
    isRendering:boolean = false;
    private progressBarTimeout:any;
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
                }, 200 )
            }
        })
        this.documentService.currentDocument.subscribe(doc => this.currentDocument = doc);
    }
    onDocumentReceived(){
        clearTimeout( this.progressBarTimeout );
        if( this.isFetching ) {
            this.isFetching = false;
            this.isRendering = true;
        }
    }
    onDocumentPrepared(){ }
    onDocumentRemoved(){ }
    onDocumentInserted() {
        setTimeout(() => this.updateHost(), 0);
    }
    onDocumentSwapComplete(){
        setTimeout(() => {
            this.isStarting = false
            this.updateHost()
        }, 0);
        setTimeout(() => {
            this.isRendering = false;
        }, 500);
    }
    updateHost() {
        const pageSlug = this.currentUrl ? /^\/*(.+?)\/*$/g.exec( this.currentUrl )[1].replace(/\
        this.DOMConfig.banner = pageSlug != "index"
        this.DOMConfig.subBanner = this.currentDocument.sub_title;
        this.hostClasses = [
            `page-${pageSlug}`,
            `tree-${pageSlug.match(/[^-]+/)[0]}`,
            `${this.isStarting ? "not-" : ""}ready`
        ].join(' ')
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
