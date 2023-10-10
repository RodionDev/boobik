import { Component, OnInit, Input, HostBinding,
         ElementRef, OnDestroy, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ProjectData, SidebarStatus } from '../interfaces';
import { LoggerService } from '../services/logger.service';
import { ProjectService } from '../services/project.service';
import { DocumentService } from '../services/document.service';
import { LocationService } from '../services/location.service';
const DEFAULT_PAGE:string = "overview";
@Component({
    selector: 'app-project-viewer',
    template: `
    <section class="main" [ngSwitch]="currentPage">
        <div id="sidebar">
            <div class="options">
                <ul id="top-level">
                    <li><a href="#!overview" [class.active]="currentPage == 'overview'" class="clearfix"><div [inlineSVG]="overviewImageSrc"></div><span>Overview</span></a></li>
                    <li><a href="#!slides" [class.active]="currentPage == 'slides'" class="clearfix"><div [inlineSVG]="editorImageSrc"></div><span>Slide Editor</span></a></li>
                    <li><a href="#!help" [class.active]="currentPage == 'help'" class="clearfix"><div [inlineSVG]="helpImageSrc"></div><span>Help</span></a></li>
                    <li><a href="#!settings" [class.active]="currentPage == 'settings'" class="clearfix"><div [inlineSVG]="settingsImageSrc"></div><span>Settings</span></a></li>
                </ul>
            </div>
        </div>
        <div class="content" [ngSwitch]="currentPage" *ngIf="projectData && !isFetching">
            <app-project-overview [projectData]="projectData" *ngSwitchCase="'overview'"></app-project-overview>
            <app-project-slide-editor [projectData]="projectData" *ngSwitchCase="'slides'"></app-project-slide-editor>
            <app-project-settings [projectData]="projectData" *ngSwitchCase="'settings'"></app-project-settings>
            <div class="modal-notice" id="help-missing" *ngSwitchCase="'help'">
                <div class="wrapper clearfix">
                    <div id="left">
                        <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                    </div>
                    <div id="right">
                        <h2>Under Construction</h2>
                        <p>Sorry! We're still working on the editors help content.</p>
                        <a href="#overview" class="button">Project Overview</a>
                    </div>
                </div>
            </div>
            <div class="modal-notice" id="unknown-page" *ngSwitchDefault>
                <div class="wrapper clearfix">
                    <div id="left">
                        <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                    </div>
                    <div id="right">
                        <h2>Unknown page</h2>
                        <p>The page <b>{{currentPage}}</b> couldn't be found. It may be an error in the URL used to access this page.</p>
                        <a href="#overview" class="button">Project Overview</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
    animations: [
        trigger('loadingPlaceholders', [
            transition(':enter', [
                style({opacity: 0}),
                animate('100ms ease-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('100ms ease-in', style({opacity: 0}))
            ])
        ])
    ]
})
export class ProjectViewerComponent implements OnInit, OnDestroy {
    projectID:string = '';
    questionMarkSrc = require("images/question-mark.png");
    overviewImageSrc = require("images/house-outline.svg");
    editorImageSrc = require("images/editor.svg");
    helpImageSrc = require("images/help.svg");
    settingsImageSrc = require("images/settings.svg");
    arrowImageSrc = require("images/left-arrow.svg");
    private baseUrl:string;
    protected projectData:ProjectData;
    protected isFetching:boolean = false;
    protected fetchError:Error;
    protected onDestroy$ = new EventEmitter<void>();
    protected validPages:string[] = [ "overview", "slides", "help", "settings" ];
    protected _currentPage:string = DEFAULT_PAGE;
    set currentPage( page:string ) {
        if( page == this._currentPage )
            return;
        else if( this.validPages.indexOf( page ) > -1 )
            this._currentPage = page;
        else
            window.location.hash = `#!${DEFAULT_PAGE}`;
    }
    get currentPage() : string {
        return this._currentPage;
    }
    get sectionTitle() : string {
        return this.isFetching ? "Fetching Project" : "Project Breakdown"
    }
    constructor(
        private el: ElementRef,
        private logger: LoggerService,
        private projectService: ProjectService,
        private documentService: DocumentService,
        private locationService: LocationService
    ) {
        this.projectID = el.nativeElement.attributes.project.value;
        this.baseUrl = window.location.pathname;
        this.locationService.currentUrl
            .do( url => {
                if( window.location.pathname != this.baseUrl ) return;
                this.currentPage = ( /^#?!/.test( window.location.hash ) ) ? window.location.hash.substr( 2 ) : DEFAULT_PAGE;
            } )
            .takeUntil( this.onDestroy$ )
            .subscribe();
    }
    ngOnInit() {
        this.isFetching = true
        this.queryProjectInfo(() => {
            this.isFetching = false;
            Observable
                .interval(60000)
                .do(() => this.queryProjectInfo() )
                .takeUntil(this.onDestroy$)
                .subscribe();
        })
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    protected queryProjectInfo(successCb = () => {}) {
        return this.projectService.getProjectInformation( this.projectID )
            .do(meta => this.projectData = meta)
            .do(() => this.logger.debug( "Project data loaded", this.projectData ))
            .catch(err => {
                this.logger.dump("error", "Failed to fetch project information; reloading document", err);
                this.documentService.reload();
                return of( err );
            })
            .do(data => successCb())
            .subscribe();
    }
}
