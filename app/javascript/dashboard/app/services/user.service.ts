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
    }
    protected getAuthenticationDetails( cb = (user?) => {} ) {
        this.http.get<any>('/api/user.json', { responseType: 'json' })
            .subscribe(
                (data) => {
                    this.currentUser.next( data.user );
                    cb(data.user);
                    this.determineSocket( data.user );
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
            this.destroySocketConnection( true );
    }
    protected establishSocketConnection() {
        if( this.socket ) return
        this.socket = this.socketService.actionCable.subscriptions.create( "UserChannel", {
            received: (data) => {
                setTimeout( () => {
                    switch( data.action ) {
                        case 'destroy_session': {
                            return this.getAuthenticationDetails((user) => {
                                if( !user )
                                    (window as any).notices.queue("Signed out in another tab!");
                            });
                        }
                        case 'revoke_auth_token': {
                            return this.getAuthenticationDetails((user) => {
                                if( !user )
                                    (window as any).notices.queue("Account authentication token has been revoked. Please sign in again to issue a new token.", true);
                            })
                        }
                    }
                }, 250 );
            },
            disconnected: ({willAttemptReconnect}) => {
                if( !willAttemptReconnect )
                    this.destroySocketConnection();
            }
        });
    }
    protected destroySocketConnection( uninstall = false ) {
        if( this.socket ) {
            this.socket.unsubscribe()
            this.socket = undefined;
        }
        if( uninstall )
            this.socketService.disconnectCable();
    }
}
