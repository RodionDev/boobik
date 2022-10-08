import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { DocumentContents } from '../interfaces';
import { LoggerService } from './logger.service';
import { LocationService } from './location.service';
const DOCUMENT_BASE_URL:string = '/api';
@Injectable()
export class DocumentService {
    currentDocument: Observable<HttpEvent<any>>;
    constructor(
        private locationService: LocationService,
        private logger: LoggerService,
        private http: HttpClient) {
        this.currentDocument = locationService.currentUrl
            .switchMap(url => {
                const splitRegex = /^([^?]*)(\?[^?]+)$/
                if( url.match( splitRegex ) )
                    return of( url.replace( splitRegex, ( input, pre, post ) => ( pre || '/index' ) + ".json" + post ) )
                return of( ( url || "/index" ) + ".json" );
            })
            .switchMap(url => this.fetchDocumentContents( url ));
    }
    private fetchDocumentContents(url: string) {
        if( !url )
            throw Error(`No URL provided to fetchDocumentContents, unable to continue with fetch`)
        const req = new HttpRequest('GET', `${DOCUMENT_BASE_URL}${url}`, {
            reportProgress: true,
            observe: 'response'
        })
        return this.http.request( req )
            .do(data => {
                if( !data || typeof data !== 'object' ) {
                    throw Error('Invalid JSON data received from ' + url);
                }
            })
            .catch(error => {
                if( error.status == 404 ) {
                    this.locationService.replace("404");
                    throw "URL not found, redirecting to 404 - Not Found page";
                }
                return of(error);
            });
    }
}
