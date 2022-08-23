import { Component, OnInit } from '@angular/core'
import { LoggerService } from '../services/logger.service';
@Component({
    selector: 'app-project-tile',
    template: '<p>This is a project tile!</p>'
})
export class ProjectTileComponent implements OnInit {
    constructor(private logger: LoggerService) {
        this.logger.warn("Project tile created!");
    }
    ngOnInit() {
        this.logger.warn("Project tile INIT! I'm in the DOM!");
    }
}
