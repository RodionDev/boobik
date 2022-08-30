import { Component, OnInit, Input } from '@angular/core'
import { ProjectMetadata } from '../interfaces';
import { LoggerService } from '../services/logger.service';
@Component({
    selector: 'app-project-tile',
    template: `
    <div class="project">
        <div class="details">
            <h2 class="project-title clearfix"><span class="title" [class.empty]="!project.title">{{project.title || 'No Title'}}</span><span *ngIf="project.status" [class.success]="project.status == 3" [class.error]="project.status == 4" class="status">{{ formattedStatus }}</span></h2>
            <p [class.empty]="!project.desc" class="project-desc">{{ project.desc || "No description" }}</p>
            <div class="last-edit">Last edited <span class="time">{{ project.formatted_updated_at }}</span> ago</div>
        </div>
        <div class="edit">
            <a href="/dashboard/project/{{project.id}}">
                <div class="wrapper">
                    <div [inlineSVG]="imageSrc"></div>
                    <span>Edit</span>
                </div>
            </a>
        </div>
    </div>
    `
})
export class ProjectTileComponent implements OnInit {
    @Input() project:ProjectMetadata;
    imageSrc = require("images/edit.svg");
    get formattedStatus() {
        switch( this.project.status ) {
            case 1:
                return "Submitted for Approval"
            case 2:
                return "Processing"
            case 3:
                return "Video Complete"
            case 4:
                return "Request Rejected"
            default:
                return "Unknown Status"
        }
    }
    constructor(private logger: LoggerService) {}
    ngOnInit() {}
}
