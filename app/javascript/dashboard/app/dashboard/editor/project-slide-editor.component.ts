import { Component, OnInit, Input, HostBinding,
         OnDestroy, EventEmitter, HostListener } from '@angular/core'
import { Observable, of, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
        </div>-->
    </div>
    <div class="slide-editor">
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
    ) {}
    ngOnInit() {
        setTimeout( () => this.onResize(), 0 );
    }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
    @HostListener('window:resize')
    onResize() {
        let scale = 1;
        const containerWidth = $(".content").width();
        const containerHeight = $(".content").height();
        const contentWidth = $(".slide-editor").width();
        const contentHeight = $(".slide-editor").height();
        if( containerWidth < contentWidth || containerHeight < contentHeight ) {
            scale = Math.min( Math.min( containerWidth / contentWidth, containerHeight / contentHeight ), 1 );
        }
        $(".slide-editor").css("transform", `translate( -50%, -50% ) scale(${scale})`);
    }
}
