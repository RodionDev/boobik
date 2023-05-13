import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoggerService } from './logger.service';
import { SidebarStatus } from '../interfaces';
@Injectable()
export class SidebarService {
    status = new EventEmitter<SidebarStatus>();
    protected isActive:boolean = false;
    set active( active:boolean ) {
        this.isActive = active;
        this.deploy();
    }
    protected isCollapsed:boolean = false;
    set collapsed( collapsed:boolean ) {
        this.isCollapsed = collapsed;
        this.deploy();
    }
    constructor( private logger: LoggerService ) {};
    protected deploy() {
        this.status.next(<SidebarStatus>{active: this.isActive, collapsed: this.isCollapsed});
    }
}
