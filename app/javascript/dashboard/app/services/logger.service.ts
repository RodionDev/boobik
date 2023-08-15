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
        console.warn( `[WARN] ${value}`, ...rest );
    }
    error( value: any, ...rest: any[] ) {
        console.error( `[EXCEPTION] ${value}`, ...rest );
    }
    dump( method: string, message: string, dump: any ) {
        if( typeof( this[method] ) == "function" ) {
            this[method]( message );
        } else {
            this.error( message );
        }
        this.debug("Dump object for above error follows:", dump);
    }
}
