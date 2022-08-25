import { Injectable, InjectionToken, Inject, Injector,
         ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { LoggerService } from './logger.service';
import { of } from 'rxjs/observable/of';
export const EMBEDDED_COMPONENTS = new InjectionToken('EMBEDDED_COMPONENTS');
@Injectable()
export class EmbeddedComponentsService {
    private componentFactories = new Map();
    constructor(
        private logger: LoggerService,
        private injector: Injector,
        private componentFactoryResolver: ComponentFactoryResolver,
        @Inject(EMBEDDED_COMPONENTS) private embeddedComponentsPairs: any[]) {}
    createEmbedded( element: HTMLElement, viewRef: ViewContainerRef ) {
        const matchedComponents = Object.keys( this.embeddedComponentsPairs )
            .filter(selector => element.querySelector( this.embeddedComponentsPairs[selector].__annotations__[0].selector ) )
            .map(selector => this.embeddedComponentsPairs[selector])
        if( !matchedComponents.length ) {
            return of( [] );
        } else {
            matchedComponents.map(comp => {
                const factory = this.componentFactoryResolver.resolveComponentFactory( comp );
                this.componentFactories.set( factory.selector, factory )
            });
            return of( this.createComponents( element, viewRef ) );
        }
    }
    protected createComponents( element: HTMLElement, viewRef: ViewContainerRef ) : ComponentRef<any>[] {
        const componentRefs: ComponentRef<any>[] = [];
        this.componentFactories.forEach(({ selector, factory }) => {
            const components : NodeList = element.querySelectorAll( selector );
            for( let i = 0; i < components.length; i++ ) {
                if( components[i] instanceof HTMLElement ) {
                    componentRefs.push( factory.create( this.injector, [], components[i], viewRef ) );
                }
            }
        })
        return componentRefs;
    }
}
