import { Component, OnInit, OnDestroy,
         EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ProjectMetadataList } from '../interfaces';
import { LoggerService } from '../services/logger.service';
import { ProjectService } from '../services/project.service';
@Component({
    selector: 'app-project-list',
    template: `
    <section id="error" *ngIf="fetchError">
        <h2 class="section-title">Fetch Failed</h2>
        <p>We were unable to fetch project information from the remote server, please try again later.</p>
        <p>Error message received: <code>{{fetchError}}</code></p>
    </section>
    <section id="projects" class="main" *ngIf="!fetchError">
        <h2 class="section-title" *ngIf="projectMetadata.projects?.length || isFetching">{{sectionTitle}}</h2>
        <div class="content">
            <div class="loading" *ngIf="isFetching" [@loadingPlaceholders]>
                <div class="project placeholder">
                    <div class="line title" style="width: 40%;"></div>
                    <div class="line" style="width: 70%;"></div>
                    <div class="line" style="width: 60%;"></div>
                    <div class="line last-edit" style="width: 15%;"></div>
                </div>
                <div class="project placeholder">
                    <div class="line title" style="width: 60%;"></div>
                    <div class="line" style="width: 70%;"></div>
                    <div class="line" style="width: 40%;"></div>
                    <div class="line last-edit" style="width: 15%;"></div>
                </div>
            </div>
            <div class="projects" *ngIf="projectMetadata.projects?.length && !isFetching" [@tileAnimation]="projectMetadata.projects.length">
                <app-project-tile *ngFor="let project of projectMetadata.projects" [project]="project"></app-project-tile>
            </div>
            <div class="projects" *ngIf="projectMetadata.projects?.length == 0 && !isFetching">
                <div class="modal-notice" id="no-projects">
                    <div class="wrapper clearfix">
                        <div id="left">
                            <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                        </div>
                        <div id="right">
                            <h2>No Projects</h2>
                            <p>You haven't got any projects yet. Let's fix that now by creating one!</p>
                            <a href="/dashboard/create" id="create" class="button">Create Project</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `,
    animations: [
        trigger('tileAnimation', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, marginTop: '50px' }),
                    stagger(75, [
                        animate('200ms 200ms ease-out', style({ opacity: 1, marginTop: '0' }))
                    ])
                ], {optional: true}),
                query(':leave', [
                    stagger(100, [
                        animate('150ms', style({ opacity: 0 }))
                    ])
                ], {optional: true})
            ])
        ]),
        trigger('loadingPlaceholders', [
            transition(':enter', [
                style({opacity: 0}),
                animate('100ms 150ms ease-out', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('200ms ease-in', style({opacity: 0}))
            ])
        ])
    ]
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projectMetadata:ProjectMetadataList = <ProjectMetadataList>{};
    questionMarkSrc = require("images/question-mark.png");
    isFetching:boolean = false;
    fetchError:string = '';
    protected onDestroy$ = new EventEmitter<void>();
    protected void$ = of<void>(undefined);
    get sectionTitle() : string {
        return ( this.isFetching ? "Fetching " : "" ) + "Projects"
    }
    constructor(private logger: LoggerService, private projectService: ProjectService) {}
    ngOnInit() {
        setTimeout( () => {
            const fetchingTimeout = setTimeout( () => this.isFetching = true, 200 );
            this.queryProjectMetadata(() => {
                clearTimeout( fetchingTimeout );
                Observable
                    .interval(60000)
                    .do(() => this.queryProjectMetadata() )
                    .takeUntil(this.onDestroy$)
                    .subscribe();
            })
        }, 350 )
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    protected queryProjectMetadata(successCb = () => {}) {
        return this.void$
            .switchMap(() => this.projectService.getProjectMetadata() )
            .do(meta => {
                if( this.isFetching ) {
                    setTimeout( () => {
                        this.isFetching = false
                        this.projectMetadata = meta
                    }, 500 );
                } else {
                    this.projectMetadata = meta;
                }
            })
            .catch(err => {
                this.fetchError = `${err.name} - ${err.status}: ${err.message}`;
                this.logger.dump("error", "Failed to fetch project metadata", err);
                return of(err);
            })
            .do(data => successCb())
            .subscribe();
    }
}
