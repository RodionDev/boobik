import { Component, ViewContainerRef, ElementRef,
         ComponentRef, OnDestroy, DoCheck,
         EventEmitter, Input, Output, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LoggerService } from '../services/logger.service';
import { DocumentService } from '../services/document.service';
import { EmbeddedComponentsService } from '../services/embeddedComponents.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import $ from 'jquery';
import { DocumentContents } from '../interfaces';
const ANIMATIONS:boolean = true;
const ANIMATION_EXCLUDE:string = 'no-animations';
@Component({
    selector: 'app-document-viewer',
    template: ``
})
export class DocumentViewerComponent implements DoCheck, OnDestroy {
    hostElement: HTMLElement;
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
    @Input() hasBanner:boolean;
    constructor(
        elementRef: ElementRef,
        @Inject( ViewContainerRef ) private viewContainerRef,
        private titleService: Title,
        private logger: LoggerService,
        private documentService: DocumentService,
        private embeddedService: EmbeddedComponentsService
    ) {
        this.hostElement = elementRef.nativeElement;
        $( this.currentView ).addClass("dynamic");
        $( this.pendingView ).addClass("dynamic");
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
        this.embeddedComponents.forEach(comp => comp.destroy());
        this.embeddedComponents = [];
    }
    protected rotateViews() {
        const animationsEnabled = ANIMATIONS && !this.hostElement.classList.contains( ANIMATION_EXCLUDE )
        function runAnimation(target:HTMLElement, animatingIn:boolean, duration:number = 200) {
            if( animationsEnabled ) {
                return of(target)
                    .do(() => {
                        $( target )[ animatingIn ? "addClass" : "removeClass" ]( "active" )
                    })
                    .delay(duration);
            } else {
                return of(target)
            }
        }
        return of(this.currentView)
            .switchMap(view => {
                if( view.parentElement ) {
                    return runAnimation( view, false )
                        .do(() => view.parentElement.removeChild( view ))
                        .do(() => this.docRemoved.emit())
                        .switchMap(() => of( this.pendingView ) )
                }
                return of( this.pendingView );
            })
            .do(view => this.hostElement.appendChild( view ))
            .do(() => this.docInserted.emit())
            .switchMap(pending => {
                const old = this.currentView;
                this.currentView = pending;
                this.pendingView = old;
                this.pendingView.innerHTML = '';
                return of( pending )
            })
            .delay( animationsEnabled ? 200 : 0 )
            .switchMap(view => {
                return runAnimation( view, true )
                    .do(() => this.viewSwapped.emit())
            })
            .catch(err => {
                this.logger.error( `[Document viewer] Unable to rotate views, error: ${ err.message || err.stack || err }` )
                return of( err )
            });
    }
    protected loadNextView(doc: DocumentContents) : Observable<DocumentContents> {
        this.docReceived.emit();
        this.pendingView.innerHTML = doc.content || '';
        return of(doc)
            .switchMap(() => this.embeddedService.createEmbedded( this.pendingView, this.viewContainerRef ) )
            .do(comps => {
                this.disassembleView()
                this.embeddedComponents = comps
                this.docPrepared.emit()
            })
            .do(() => this.titleService.setTitle( "Bikboo \u2014 " + doc.title || 'No Title' ) )
            .switchMap(() => this.rotateViews())
            .catch(err => {
                this.logger.error(`Failed to load next view for document titled "${doc.title}", error: "${err.stack || err}".`);
                return of( err );
            });
    }
}
