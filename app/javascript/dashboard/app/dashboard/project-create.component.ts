import { Component, OnInit, OnDestroy,
         EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Observable, of, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { LocationService } from '../services/location.service';
import $ from 'jquery';
@Component({
    selector: 'app-project-create',
    template: `
    <form action="/api/projects" data-remote="true" method="post" #projectCreate>
        <section id="title">
            <label for="title">Title</label>
            <input type="text" name="title">
        </section>
        <section id="desc">
            <label for="desc">Description</label>
            <textarea placeholder="This field is optional" name="desc"></textarea>
        </section>
        <section id="tos">
            <input type="checkbox" name="tos">
            <span for="tos">I agree to the <a href="#">terms and conditions of service</a>.</span>
        </section>
        <section id="submit">
            <input type="submit" name="commit" value="Create Project" class="button" data-disable-with="Create Project">
        </section>
    </form>
    `
})
export class ProjectCreateComponent implements AfterViewInit {
    protected onDestroy$ = new EventEmitter<void>();
    @ViewChild("projectCreate") formElement:ElementRef;
    constructor(private logger: LoggerService, private locationService: LocationService) { }
    ngAfterViewInit() {
        $( this.formElement.nativeElement ).on("ajax:error", (event:any) => {
            (window as any).detail = event;
            if( ( typeof event.detail[0] ) == "object" && event.detail[0].error ) {
                this.creationError( event.detail );
            } else {
                (window as any).notices.queue("We couldn't create a project for you because something's wrong on our end. Rest assured that we're working on a fix as fast as we can!", true);
                this.logger.dump( "error", "Uncaught exception: Unable to create a project due to unidentifiable error (invalid JSON response from server REST endpoint).", event );
            }
        }).on("ajax:success", (event:any) => {
            this.creationSuccess( event.detail );
        });
    }
    protected creationError( details:any ) {
        if( details.field_error ) {
        }
        (window as any).notices.queue(details[0].error, true);
    }
    protected creationSuccess( details:any ) {
        (window as any).notices.queue(details[0].notice);
        this.locationService.go(`/dashboard/project/${details[0].project_id}`);
    }
}
