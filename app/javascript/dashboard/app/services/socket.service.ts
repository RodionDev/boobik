import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import ActionCable from 'actioncable';
@Injectable()
export class SocketService {
    public actionCable;
	constructor( private logger: LoggerService) {
        this.logger.log("Created consumer");
        ActionCable.startDebugging();
        this.actionCable = ActionCable.createConsumer();
        (window as any).cable = this.actionCable;
    }
    restartCable() {
        this.logger.debug("Reloading socket cable");
        this.actionCable.connect();
    }
    disconnectCable() {
        if( !this.actionCable.connection.disconnected ) {
            this.logger.debug("Disconnecting cable from SocketService");
            this.actionCable.disconnect();
        }
    }
}
