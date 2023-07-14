import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { ProjectMetadataList, ProjectData } from '../interfaces';
import { LoggerService } from './logger.service';
const PROJECT_BASE_URL:string = '/api/projects';
@Injectable()
export class ProjectService {
    constructor(
        private logger: LoggerService,
        private http: HttpClient
    ) {}
    getProjectMetadata() : Observable<ProjectMetadataList> {
        return this.http.get<ProjectMetadataList>(`${PROJECT_BASE_URL}/metadata.json`, { responseType: 'json' });
    }
    getProjectInformation( projectID: string ) : Observable<ProjectData> {
        return this.http.get<ProjectData>(`${PROJECT_BASE_URL}/${projectID}.json`, { responseType: 'json' });
    }
}
