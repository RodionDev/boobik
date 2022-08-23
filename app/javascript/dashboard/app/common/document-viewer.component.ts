import { Component, ViewContainerRef, ElementRef,
         ComponentRef, OnDestroy, DoCheck,
         EventEmitter, Input, Output } from '@angular/core';
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
export class DocumentViewerComponent implements DoCheck, OnDestroy {
    private hostElement: HTMLElement;
    protected embeddedComponents: ComponentRef<any>[] = [];
    private void$ = of<void>(undefined);
    private onDestroy$ = new EventEmitter<void>();
    private docContents$ = new EventEmitter<DocumentContents>();
    protected currentView: HTMLElement = document.createElement('div');
    protected pendingView: HTMLElement = document.createElement('div');
    @Output() docReceived = new EventEmitter<void>();
    @Output() docPrepared = new EventEmitter<void>();
    @Output() docRemoved = new EventEmitter<void>();
    @Output() docInserted = new EventEmitter<void>();
    @Output() viewSwapped = new EventEmitter<void>();
    @Input()
    set doc(document: DocumentContents) {
        if( document ) {
            this.docContents$.emit( document );
        }
    }
    constructor(
        elementRef: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private logger: LoggerService,
        private documentService: DocumentService,
        private embeddedService: EmbeddedComponentsService
    ) {
        this.hostElement = elementRef.nativeElement;
        this.docContents$
            .switchMap( doc => this.loadNextView( doc ) )
            .takeUntil( this.onDestroy$ ) 
            .subscribe(); 
    }
    ngDoCheck() {
        this.embeddedComponents.forEach(comp => comp.changeDetectorRef.detectChanges());
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    protected disassembleView() {
    }
    protected rotateViews() {
        if( this.currentView.parentElement ) {
            this.currentView.parentElement.removeChild( this.currentView );
            this.docRemoved.emit()
        }
        return this.void$
            .do(() => this.hostElement.appendChild( this.pendingView ) )
            .do(() => this.docInserted.emit() )
            .do(() => {
                const old = this.currentView
                this.currentView = this.pendingView
                this.pendingView = old
                this.pendingView.innerHTML = '';
            })
            .do(() => this.viewSwapped.emit() );
    }
    protected loadNextView(doc: DocumentContents) : Observable<void> {
        return this.void$
            .do(() => this.docReceived.emit() )
            .do(() => this.pendingView.innerHTML = doc.content || '')
            .switchMap(() => this.embeddedService.createEmbedded( this.pendingView, this.viewContainerRef ) )
            .do(comps => this.embeddedComponents = comps)
            .do(() => this.docPrepared.emit() )
            .switchMap(() => this.rotateViews())
            .catch(err => {
                this.logger.error(`Failed to load next view for document titled "${doc.title}", error: "${err.stack || err}".`);
                return this.void$;
            });
    }
}
