import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { DocumentContents } from '../interfaces';
import { LoggerService } from './logger.service';
import { LocationService } from './location.service';
const DOCUMENT_BASE_URL:string = '/api/';
@Injectable()
export class DocumentService {
    currentDocument: Observable<DocumentContents>;
    constructor(
        locationService: LocationService,
        private logger: LoggerService,
        private http: HttpClient) {
        this.currentDocument = locationService.currentUrl.switchMap(url => this.fetchDocumentContents( url ));
    }
    private fetchDocumentContents(url: string) : Observable<DocumentContents> {
        return this.http.get<DocumentContents>( `${DOCUMENT_BASE_URL}${url || 'index'}.json`, { responseType: 'json' } )
            .do(data => {
                if( !data || typeof data !== 'object' ) {
                    throw Error('Invalid JSON data received from ' + url);
                }
            });
    }
}
