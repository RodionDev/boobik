import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';
import ActionCable from 'actioncable';
@Injectable()
export class SocketService {
    public actionCable;
	constructor( private logger: LoggerService ) {
        this.logger.log("Created consumer");
        ActionCable.startDebugging();
        this.actionCable = ActionCable.createConsumer();
    }
}
