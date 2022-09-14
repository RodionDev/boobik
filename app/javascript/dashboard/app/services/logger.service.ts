import { Injectable } from '@angular/core';
@Injectable()
export class LoggerService {
    constructor() {}
    debug( value: any, ...rest: any[] ) {
        if( process.env.NODE_ENV != 'production' ) {
            console.debug( "[debug] " + value, ...rest );
        }
    }
    log( value: any, ...rest: any[] ) {
        console.log( value, ...rest );
    }
    warn( value: any, ...rest: any[] ) {
        console.warn( value, ...rest );
    }
    error( value: any, ...rest: any[] ) {
        console.error( value, ...rest );
    }
}
