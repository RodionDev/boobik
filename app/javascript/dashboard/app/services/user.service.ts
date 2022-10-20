import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { UserInformation } from '../interfaces';
import { LoggerService } from './logger.service';
@Injectable()
export class UserService {
    currentUser = new EventEmitter<UserInformation>();
    constructor(
        private logger: LoggerService,
        private http: HttpClient
    ) {
        this.getAuthenticationDetails(() => {
            Observable
                .interval(60000)
                .do(() => this.getAuthenticationDetails() )
                .subscribe();
        })
    }
    protected getAuthenticationDetails( cb = () => {} ) {
        this.http.get<UserInformation>('/api/user.json', { responseType: 'json' })
            .subscribe(
                (data) => {
                    this.currentUser.next( data );
                    cb();
                },
                (error) => {
                    throw Error( `Unable to fetch authentication details, error: ${error.message}` );
                }
            );
    }
}
