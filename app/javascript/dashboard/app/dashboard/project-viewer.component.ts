import { Component, OnInit, Input, HostBinding,
         ElementRef, OnDestroy, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ProjectMetadata } from '../interfaces';
import { LoggerService } from '../services/logger.service';
import { ProjectService } from '../services/project.service';
@Component({
    selector: 'app-project-viewer',
    template: `
    <div id="fetch-errors" [ngSwitch]="fetchError?.status" *ngIf="fetchError">
        <section id="error" *ngSwitchCase="404">
            <h2 class="section-title">Project Not Found</h2>
            <p>The request for this projects details failed with 404 - not found. Please check that the URL for this project is correct, and that it hasn't moved or been removed.</p>
        </section>
        <section id="error" *ngSwitchCase="401">
            <h2 class="section-title">Permission denied</h2>
            <p>Unable to access project, request sender was deemed unauthorized by the server. Please check that the URL you accessed is correct.</p>
        </section>
        <section id="error" *ngSwitchDefault>
            <h2 class="section-title">Fetch Failed</h2>
            <p>We were unable to fetch project information from the remote server, please try again later.</p>
            <p>Error message received: <code>{{fetchError}}</code></p>
        </section>
    </div>
    <section class="main" *ngIf="!fetchError">
        <div class="content">
            <div class="loading" *ngIf="isFetching" [@loadingPlaceholders]>
                <p>Loading...</p>
            </div>
            <div *ngIf="projectMetadata && !isFetching">
                <section id="header-notice" *ngIf="!projectMetadata.project.status">
                    <div class="wrapper warning" *ngIf="projectMetadata.slides.length > 1 && projectMetadata.slides.length < 10">
                        <p>Unable to submit project for creation because you haven't got enough slides; you need at least 10 slides to submit</p>
                    </div>
                    <div class="wrapper info" *ngIf="projectMetadata.slides.length >= 10">
                        <p>All done creating slides? Submit your project for creation!</p>
                    </div>
                </section>
                <div id="slide-container" [ngSwitch]="projectMetadata.slides.length">
                    <div id="slide-notice" class="empty-notice" *ngSwitchCase="0">
                        <h2>No Slides</h2>
                        <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                        <a href="/editor/project/{{projectID}}" id="edit" class="button">Create Slides</a>
                    </div>
                    <div id="slides" *ngSwitchDefault>
                        <h2 class="section-title">Project Slides</h2>
                        <p>Test</p>
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
export class ProjectViewerComponent implements OnInit {
    projectID:string = '';
    projectMetadata:ProjectMetadata;
    isFetching:boolean = false;
    questionMarkSrc = require("images/question-mark.png");
    fetchError:Error;
    protected onDestroy$ = new EventEmitter<void>();
    protected void$ = of<void>(undefined);
    get sectionTitle() : string {
        return this.isFetching ? "Fetching Project" : "Project Breakdown"
    }
    constructor(
        private el: ElementRef,
        private logger: LoggerService,
        private projectService: ProjectService
    ) {
        this.projectID = el.nativeElement.attributes.project.value;
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
        return this.void$
            .switchMap(() => this.projectService.getProjectInformation( this.projectID ) )
            .do(meta => this.projectMetadata = meta)
            .do(() => console.log( this.projectMetadata ))
            .catch(err => {
                this.fetchError = err;
                throw `Failed to fetch ${err.message}`;
            })
            .do(data => successCb())
            .subscribe();
    }
}
