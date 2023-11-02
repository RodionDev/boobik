import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, interval, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserInformation } from '../interfaces';
import { LoggerService } from './logger.service';
import { LocationService } from './location.service';
import { SocketService } from './socket.service';
@Injectable()
export class UserService {
    currentUser = new EventEmitter<UserInformation>();
    user:UserInformation;
    private socket;
    private signingOut:boolean;
    constructor(
        private logger: LoggerService,
        private http: HttpClient,
        private socketService: SocketService,
        private locationService: LocationService
    ) {
        timer(0, 60000).pipe(
            tap(() => this.getAuthenticationDetails())
        ).subscribe();
    }
    signOut() {
        this.signingOut = true;
        this.http.get<any>('/signout.json', { responseType: 'json' } )
            .subscribe({
                next: (data) => {
                    this.getAuthenticationDetails( (userData) => {
                        if( userData ) {
                            this.logger.error("De-authentication flow has FAILED. Server still reports signed in user. Sending user to root via reload.");
                            return this.locationService.replace("/");
                        }
                        this.logger.debug("User signed out successfully. Resetting flow indicator to 'false'");
                        (window as any).notices.queue("Signed out!");
                        this.locationService.go("/");
                        this.signingOut = false;
                    } );
                },
                error: (error) => {
                    this.logger.dump("error", "Failure while trying to sign out current user. Not able to continue de-auth process.", error);
                }
            });
    }
    protected getAuthenticationDetails( cb = (user?) => {} ) {
        this.http.get<any>('/api/user.json', { responseType: 'json' })
            .subscribe(
                (data) => {
                    this.currentUser.next( data.user );
                    cb(data.user);
                    this.determineSocket( data.user );
                    this.user = data.user;
                },
                (error) => {
                    this.logger.dump("error", "Failure while trying to fetch authentication details from server.", error);
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
        this.logger.debug("Attempting to open socket connection");
        this.socket = this.socketService.actionCable.subscriptions.create( "UserChannel", {
            received: (data) => {
                this.logger.debug("Socket ping:", data);
                if( this.signingOut ) {
                    this.logger.debug("Incoming web-socket ping is being ignored because the deauthentication flow is running");
                    return;
                }
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
            },
            disconnected: ({willAttemptReconnect}) => {
                if( !willAttemptReconnect )
                    this.destroySocketConnection();
            }
        });
        (window as any).socket = this.socket;
        (window as any).service = this.socketService;
    }
    protected destroySocketConnection( uninstall = false ) {
        if( this.socket ) {
            this.logger.debug("Unsubscribing from socket");
            this.socket.unsubscribe()
            this.socket = undefined;
        }
        if( uninstall ) {
            this.logger.debug("Uninstalling action cable");
            this.socketService.disconnectCable();
        }
    }
}
