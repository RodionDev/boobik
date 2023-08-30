import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import ActionCable from 'actioncable';
@Injectable()
export class SocketService {
    public actionCable;
	constructor( private logger: LoggerService) {
        if ( process.env.NODE_ENV != "production" )
            ActionCable.startDebugging();
        this.actionCable = ActionCable.createConsumer();
        (window as any).cable = this.actionCable;
    }
    restartCable() {
        this.actionCable.connect();
    }
    disconnectCable() {
        this.actionCable.disconnect();
    }
}
