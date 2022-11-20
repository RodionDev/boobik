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
        this.logger.debug("Fetching authentication details...")
        this.http.get<any>('/api/user.json', { responseType: 'json' })
            .subscribe(
                (data) => {
                    this.logger.debug("user authentication details retrieved", data.user);
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
        this.logger.debug("Determining socket state using user", user)
        if( user ) {
            this.logger.debug("Attempting to open socket")
            this.establishSocketConnection()
        } else {
            this.logger.debug("Attempting to close socket")
            this.destroySocketConnection( true );
        }
    }
    protected establishSocketConnection() {
        console.log("attempting to connect to socket")
        if( !this.socket ) {
            this.logger.debug("Creating socket subscription")
            this.socket = this.socketService.actionCable.subscriptions.create( "UserChannel", {
                received: (data) => {
                    switch( data.action ) {
                        case 'destroy_session': {
                            this.logger.warn("User session destroy detected")
                            return this.getAuthenticationDetails();
                        }
                    }
                },
                disconnected: ({willAttemptReconnect}) => {
                    console.log("disconnected", willAttemptReconnect);
                    if( !willAttemptReconnect ) {
                        this.destroySocketConnection();
                    }
                }
            });
            (window as any).soc = this.socket
        } else {
            this.logger.debug("Refusing to establishSocketConnection; a socket already exists")
        }
    }
    protected destroySocketConnection( uninstall = false ) {
        this.logger.debug("Attempting to destroy socket")
        if( this.socket ) {
            this.logger.debug("unsubscribing socket")
            this.socket.unsubscribe()
            this.socket = undefined;
        }
        if( uninstall ) {
            this.socketService.disconnectCable();
        }
    }
}
