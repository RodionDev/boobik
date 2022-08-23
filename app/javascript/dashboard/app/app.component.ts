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
    isStarting:boolean = true;
    isFetching:boolean = false;
    isRendering:boolean = false;
    private progressBarTimeout:any;
    navigationEnabled: boolean = false;
    currentUrl: string;
    currentDocument: DocumentContents;
    constructor(
        private documentService: DocumentService,
        private userService: UserService,
        private locationService: LocationService,
        private logger: LoggerService,
        private hostElement: ElementRef,
    ) {}
    ngOnInit() {
        this.locationService.currentUrl.subscribe(url => {
            this.currentUrl = url;
            clearTimeout( this.progressBarTimeout )
            this.progressBarTimeout = setTimeout( () => {
                this.isFetching = true;
            }, 200 )
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
    onDocumentPrepared(){
        this.logger.debug("[Embedded Document] Prepared");
    }
    onDocumentRemoved(){
        this.logger.debug("[Embedded Document] Removed");
    }
    onDocumentInserted(){
        this.logger.debug("[Embedded Document] Inserted");
    }
    onDocumentSwapComplete(){
        setTimeout(() => {
            this.isRendering = false;
        }, 500);
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
