import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { of } from 'rxjs/observable/of';
import { switchMap, mergeMap } from 'rxjs/operators';
import { DocumentContents, UserInformation } from '../interfaces';
import { LoggerService } from './logger.service';
import { UserService } from './user.service';
import { LocationService } from './location.service';
const DOCUMENT_BASE_URL:string = '/api';
@Injectable()
export class DocumentService {
    currentDocument: Observable<HttpEvent<any>>;
    private lastUrl:string;
    private lastUser:UserInformation;
    protected onUrlUpdate$ = new ReplaySubject<string>(1);
    constructor(
        private locationService: LocationService,
        private userService: UserService,
        private logger: LoggerService,
        private http: HttpClient) {
        this.currentDocument = this.onUrlUpdate$
            .switchMap(url => this.fetchDocumentContents( url ) );
        this.locationService.currentUrl
            .switchMap(url => {
                const splitRegex = /^([^?]*)(\?[^?]+)$/
                if( url.match( splitRegex ) )
                    return of( url.replace( splitRegex, ( input, pre, post ) => ( pre || '/index' ) + ".json" + post ) )
                return of( ( url || "/index" ) + ".json" );
            })
            .do( url => {
                if( url != this.lastUrl )
                    this.onUrlUpdate$.next( url )
            } )
            .subscribe();
    }
    reload() {
        if( !this.lastUrl )
            throw Error('Unable to reload document @ DocumentService; there is no URL on record to reload, wait until after initial load before attempting to reload');
        this.onUrlUpdate$.next( this.lastUrl );
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
                this.lastUrl = url
            })
            .catch(error => {
                if( error.status == 404 ) {
                    this.locationService.replace("404");
                    throw "URL not found, redirecting to 404 - Not Found page";
                } else if( error.status == 401 ) {
                    const UrlWithoutExtension = url.match(/[^.]+/)[0];
                    if( UrlWithoutExtension )
                        this.locationService.replace(`/signin?continue=${UrlWithoutExtension}`);
                    else
                        window.location.reload();
                }
                return of( error );
            });
    }
}
