import { Component, OnInit, Input, HostBinding,
         OnDestroy, EventEmitter } from '@angular/core'
import { Observable, of, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProjectData } from '../../interfaces';
import { LoggerService } from '../../services/logger.service';
import { ProjectService } from '../../services/project.service';
@Component({
    selector: 'app-project-settings',
    template: `
    <div class="modal-notice" id="settings-nyi">
        <div class="wrapper clearfix">
            <div id="left">
                <img src="{{questionMarkSrc}}" alt="Question mark image"/>
            </div>
            <div id="right">
                <h2>Under Construction</h2>
                <p>Sorry! We're still working on the project settings page.</p>
                <a href="#overview" class="button">Project Overview</a>
            </div>
        </div>
    </div>
    `,
    animations: []
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {
    protected onDestroy$ = new EventEmitter<void>();
    questionMarkSrc = require("images/question-mark.png");
    @Input() projectData:ProjectData;
    constructor(
        private logger: LoggerService,
        private projectService: ProjectService
    ) { }
    ngOnInit() { }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
}
