import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { interval } from 'rxjs/observable/interval';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/interval';
import { UserInformation } from '../interfaces';
import { LoggerService } from './logger.service';
import { SocketService } from './socket.service';
@Injectable()
export class UserService {
    currentUser = new EventEmitter<UserInformation>();
    private socket;
    constructor(
        private logger: LoggerService,
        private http: HttpClient,
        private socketService: SocketService
    ) {
        this.getAuthenticationDetails(() => {
            Observable
                .interval(60000)
                .do(() => this.getAuthenticationDetails() )
                .subscribe();
        });
        this.currentUser
            .do( user => this.determineSocket( user ) )
            .subscribe();
    }
    protected getAuthenticationDetails( cb = (user?) => {} ) {
        this.http.get<any>('/api/user.json', { responseType: 'json' })
            .subscribe(
                (data) => {
                    this.currentUser.next( data.user );
                    cb(data.user);
                },
                (error) => {
                    throw Error( `Unable to fetch authentication details, error: ${error.message}` );
                }
            );
    }
    protected determineSocket( user ) {
        if( user )
            this.establishSocketConnection()
        else
            this.destroySocketConnection();
    }
    protected establishSocketConnection() {
        console.log("attempting to connect to socket")
        if( !this.socket ) {
            this.socket = this.socketService.actionCable.subscriptions.create( "UserChannel", {
                initialized: () => {
                    console.log("WEB SOCKET INIT");
                },
                received: (data) => {
                    console.log("WEB SOCKET RECEIVED");
                    console.log( data )
                    switch( data.action ) {
                        case 'destroy_session': {
                            this.logger.warn("User session destroy detected")
                            return this.getAuthenticationDetails( this.determineSocket );
                        }
                    }
                },
                rejected: () => {
                    console.warn("WEB SOCKET REJECTED");
                },
                connected: () => {
                },
                disconnected: ({willAttemptReconnect}) => {
                    console.log("disconnected", willAttemptReconnect);
                }
            })
        } else {
            this.socketService.actionCable.subscriptions.add( this.socket );
        }
    }
    protected destroySocketConnection() {
        if( this.socket )
            this.socket.unsubscribe()
    }
}
