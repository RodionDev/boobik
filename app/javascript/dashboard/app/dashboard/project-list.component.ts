import { Component, OnInit, OnDestroy,
         EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
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
    <section id="projects">
        <h2 class="section-title">{{sectionTitle}}</h2>
        <div class="content">
            <div class="loading" *ngIf="isFetching">
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
            <div class="projects" *ngIf="projectMetadata && !isFetching && !fetchError">
                <app-project-tile *ngFor="let project of projectMetadata.projects" [project]="project"></app-project-tile>
            </div>
        </div>
    </section>
    `
})
export class ProjectListComponent implements OnInit, OnDestroy {
    projectMetadata:ProjectMetadataList;
    isStarting:boolean = true;
    isFetching:boolean = false;
    fetchError:string = '';
    protected onDestroy$ = new EventEmitter<void>();
    protected void$ = of<void>(undefined);
    get sectionTitle() : string {
        if( this.isStarting ) {
            return "Spinning Up"
        } else if ( this.isFetching ) {
            return "Fetching Projects"
        }
        return "Projects"
    }
    constructor(private logger: LoggerService, private projectService: ProjectService) {}
    ngOnInit() {
        this.isStarting = false;
        this.queryProjectMetadata(() => {
            this.logger.debug("Initial project metadata load successful. Starting periodic updates.")
            Observable
                .interval(60000)
                .do(() => this.queryProjectMetadata() )
                .takeUntil(this.onDestroy$)
                .subscribe();
        })
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    protected queryProjectMetadata(successCb = () => {}) {
        const fetchingTimeout = setTimeout(() => this.isFetching = true, 200);
        return this.void$
            .switchMap(() => this.projectService.getProjectMetadata() )
            .do(meta => this.projectMetadata = meta)
            .do(() => { this.isFetching = false; clearTimeout( fetchingTimeout ) } )
            .catch(err => {
                this.fetchError = `${err.name} - ${err.status}: ${err.message}`;
                throw `Failed to fetch ${err.message}`;
            })
            .do(data => successCb())
            .subscribe();
    }
}
