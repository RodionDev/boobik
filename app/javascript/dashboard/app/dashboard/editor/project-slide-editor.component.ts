import { Component, OnInit, Input, HostBinding,
         OnDestroy, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { LoggerService } from '../../services/logger.service';
import { ProjectService } from '../../services/project.service';
@Component({
    selector: 'app-project-slide-editor',
    template: ``,
    animations: []
})
export class ProjectSlideEditorComponent implements OnInit, OnDestroy {
    protected onDestroy$ = new EventEmitter<void>();
    constructor(
        private logger: LoggerService,
        private projectService: ProjectService
    ) { }
    ngOnInit() { }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
}
