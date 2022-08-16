import { Component, ViewContainerRef, OnInit,
         ElementRef, ComponentRef, OnDestroy, DoCheck,
         EventEmitter } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { DocumentService } from '../services/document.service';
import { EmbeddedComponentsService } from '../services/embeddedComponents.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import { DocumentContents } from '../interfaces';
const ANIMATIONS:boolean = true;
const ANIMATION_EXCLUDE:string = 'no-animations';
@Component({
    selector: 'app-document-viewer',
    template: ''
})
export class DocumentViewerComponent implements OnInit, DoCheck, OnDestroy {
    private hostElement: HTMLElement;
    protected embeddedComponents: ComponentRef<any>[];
    private void$ = of<void>(undefined);
    private onDestroy$ = new EventEmitter<void>();
    private docContents = new EventEmitter<DocumentContents>();
    protected currentView: HTMLElement = document.createElement('div');
    protected pendingView: HTMLElement = document.createElement('div');
    constructor(
        elementRef: ElementRef,
        private logger: LoggerService,
        private documentService: DocumentService,
        private embeddedService: EmbeddedComponentsService
    ) {
        this.hostElement = elementRef.nativeElement;
    }
    ngOnInit() {}
    ngDoCheck() {}
    ngOnDestroy() {}
    protected disassembleView() {
    }
    protected rotateViews() {
    }
    protected loadNextView() {
    }
}
