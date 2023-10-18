import { Component, OnInit, Input, HostBinding,
         OnDestroy, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { ProjectData } from '../../interfaces';
import { LoggerService } from '../../services/logger.service';
import { ProjectService } from '../../services/project.service';
import $ from 'jquery'
@Component({
    selector: 'app-project-slide-editor',
    template: `
    <div class="wrapper" id="slide-container">
        <!-- TODO: Handle slides created
        <div class="slide new-placeholder">
            .content
        </div>-->
    </div>
    <div class="slide-editor">
        <div class="toolbar">
            <ul class="toolbar-controls">
                <!--<li><a href="#" class="control"></a></li>
                <li><a href="#" class="control"></a></li>
                <li><a href="#" class="control"></a></li>
                <li><a href="#" class="control"></a></li>
                <li><a href="#" class="control"></a></li>-->
            </ul>
        </div>
        <div id="workspace">
        </div>
    </div>
    `,
    animations: []
})
export class ProjectSlideEditorComponent implements OnInit, OnDestroy {
    protected onDestroy$ = new EventEmitter<void>();
    protected htmlString:string = "<div class='test'><a href='#'>Foobar</a></div>";
    questionMarkSrc = require("images/question-mark.png");
    @Input() projectData:ProjectData;
    constructor(
        private logger: LoggerService,
        private projectService: ProjectService
    ) { }
    ngOnInit() {
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
}
