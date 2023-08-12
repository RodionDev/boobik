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
import { UserService } from '../../services/user.service';
@Component({
    selector: 'app-project-overview',
    template: `
    <div class="wrapper">
        <section class="hero">
            <div class="image">
                <img src="{{projectData.image_url || userService.user.image_url}}" alt="Project thumbnail"/>
            </div>
            <h2 class="title">{{projectData.title}}</h2>
            <p class="desc">{{projectData.desc}}</p>
        </section>
        <section class="submission modal-notice inplace">
            <div class="wrapper clearfix">
                <div id="left">
                    <img src="{{questionMarkSrc}}" alt="Question mark image"/>
                </div>
                <div id="right">
                    <h2>Get Sliding!</h2>
                    <p>Unfortunately, you need to have at least 10 slides in your project. Head over to the slide editor to add some more.</p>
                    <a href="#!slides" class="button">Slide Editor</a>
                </div>
            </div>
        </section>
    </div>
    `,
    animations: []
})
export class ProjectOverviewComponent implements OnInit, OnDestroy {
    protected onDestroy$ = new EventEmitter<void>();
    questionMarkSrc = require("images/question-mark.png");
    @Input() projectData:ProjectData;
    constructor(
        private logger: LoggerService,
        private projectService: ProjectService,
        private userService: UserService
    ) { }
    ngOnInit() { }
    ngOnDestroy() {
        this.onDestroy$.emit();
    }
}
