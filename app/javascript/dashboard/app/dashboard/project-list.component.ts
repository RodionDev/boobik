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
    <section id="projects" *ngIf="!fetchError">
        <h2 class="section-title">{{sectionTitle}}</h2>
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
                <div class="empty" id="no-projects">
                    <h2>No projects</h2>
                    <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                    <a href="/dashboard/create" id="create" class="button">Create Project</a>
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
                        animate('200ms ease-out', style({ opacity: 1, marginTop: '0' }))
                    ])
                ], {optional: true}),
                query(':leave', [
                    stagger(100, [
                        animate('250ms', style({ opacity: 0 }))
                    ])
                ], {optional: true})
            ])
        ]),
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
            const fetchingTimeout = setTimeout( () => this.isFetching = true, 200 )
            this.queryProjectMetadata(() => {
                clearTimeout( fetchingTimeout )
                this.isFetching = false;
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
            .do(meta => this.projectMetadata = meta)
            .catch(err => {
                this.fetchError = `${err.name} - ${err.status}: ${err.message}`;
                throw `Failed to fetch ${err.message}`;
            })
            .do(data => successCb())
            .subscribe();
    }
}
