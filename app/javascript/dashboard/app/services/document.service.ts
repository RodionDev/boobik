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
const ERROR_CONTENT:string = `
<div class="STATUSCODE" id="error-content">
    <div class="error">
        <h1 id="statusText">STATUSTEXT</h1>
        <span id="statusCode">STATUSCODE</span>
        <p id="error">ERROR</p>
    </div>
</div>
`
const ERROR_CONTENT_MAP = {
    404: "Requested URL cannot be found, please check the location of the page you're trying to access and try again.<br><br>The page may have moved to a different location, or been deleted.",
    500: "Well, this is embarrassing. Our server had a little trouble processing your request.<br><br>This is often caused by an issue with the request; try clearing your cache and trying the request again."
};
@Injectable()
export class DocumentService {
    currentDocument: Observable<HttpEvent<any>>;
    lastUrl:string;
    private currentUser:UserInformation;
    onUrlUpdate$ = new ReplaySubject<string>(1);
    constructor(
        private locationService: LocationService,
        private userService: UserService,
        private logger: LoggerService,
        private http: HttpClient) {
        this.currentDocument = this.onUrlUpdate$
            .switchMap(url => this.fetchDocumentContents( url ) );
        this.userService.currentUser.subscribe({
            next: (user) => { this.currentUser = user }
        });
        this.locationService.currentUrl
            .switchMap( url => of( this.formatUrl( url ) ) )
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
    formatUrl( url:string ) : string {
        url = url.replace( /#.*$/, "" );
        const splitRegex = /^([^?]*)(\?[^?]+)$/
        if( url.match( splitRegex ) )
            url = url.replace( splitRegex, ( input, pre, post ) => ( pre || '/index' ) + ".json" + post );
        return ( url || "/index" ) + ".json";
    }
    private fetchDocumentContents(url: string): Observable<HttpEvent<any>> {
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
                console.error("DocumentService received error while trying to fetch document contents for", url);
                console.debug(error);
                let doc_response:DocumentContents = {
                    content: ERROR_CONTENT.replace(/STATUSTEXT/g, error.statusText)
                                          .replace(/STATUSCODE/g, error.status),
                    title: error.statusText,
                    no_banner: true
                }
                if( error.status == 401 ) {
                    const UrlWithoutExtension = url.match(/[^.]+/)[0];
                    if( this.currentUser ) {
                        doc_response.content = doc_response.content.replace(/ERROR/g, `Your user account is not privelleged enough to access this protected resource as elevated privelleges are required.<br><br>Ensure you're logged in to the correct account.`);
                    } else {
                        doc_response.content = doc_response.content.replace(/ERROR/g, `Your request to access a protected resource was rejected because you're not logged in. Click the button below to login and continue to the specified resource.<br><br><a class="button sub" href="/">Cancel</a><a class="button no-follow" href="/signin?continue=${UrlWithoutExtension}" style="margin-left: 1rem;">Login and continue</a>`);
                    }
                } else {
                    doc_response.content = doc_response.content.replace(/ERROR/g, ERROR_CONTENT_MAP[error.status] || "Unknown exception occurred.");
                }
                return of( { type: HttpEventType.Response, body: doc_response } as HttpEvent<any> );
            });
    }
}
