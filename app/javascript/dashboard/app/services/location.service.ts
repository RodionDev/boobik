import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from './logger.service';
@Injectable()
export class LocationService {
    urlObservable = new ReplaySubject<string>(1);
    currentUrl = this.urlObservable.pipe(map(url => this.location.normalize( url )));
    constructor( private location: Location, private logger: LoggerService ) {
        this.urlObservable.next( location.path( false ) );
        this.location.subscribe(state => {
            return this.urlObservable.next( state.url || '' );
        })
    }
    handleAnchorClick( target: HTMLAnchorElement ) : boolean {
        if(
            target.classList.contains('no-follow') ||
            target.download ||
            target.host !== window.location.host ||
            target.protocol !== window.location.protocol ) {
            return true;
        }
        this.go( target.pathname + target.search + target.hash );
        return false;
    }
    go( url: string ) {
        if(/^http/.test( url )) {
            window.location.assign( url );
        } else {
            this.location.go( url );
            this.urlObservable.next( url );
        }
    }
    replace(url: string) {
        window.location.replace( url );
    }
}
