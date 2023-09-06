import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { LoggerService } from './logger.service';
import { SidebarStatus } from '../interfaces';
@Injectable()
export class SidebarService {
    status = new EventEmitter<SidebarStatus>();
    type:number = 1;
    data:any = false;
    protected isActive:boolean = false;
    set active( active:boolean ) {
        this.isActive = active;
        this.deploy();
    }
    get active() : boolean {
        return this.isActive;
    }
    protected isCollapsed:boolean = false;
    set collapsed( collapsed:boolean ) {
        this.isCollapsed = collapsed;
        this.deploy();
    }
    get collapsed() : boolean {
        return this.isCollapsed;
    }
    constructor( private logger: LoggerService ) {};
    protected deploy() {
        this.status.next(<SidebarStatus>{active: this.isActive, collapsed: this.isCollapsed});
    }
    toggle() {
        this.collapsed = !this.isCollapsed;
    }
}
