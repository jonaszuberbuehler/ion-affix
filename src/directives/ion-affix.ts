import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Content } from 'ionic-angular';

/**
 * Directive for creating affixed list headers. Apply it to ion-list-header and pass a reference to ion-content to it.
 *
 * @example
 * <ion-content #content>
 *     <ion-list>
 *         <ion-list-header ion-affix [content]="content">Group 1</ion-list-header>
 *         <ion-item *ngFor="let item of items">{{item}}</ion-item>
 *     </ion-list>
 * </ion-content>
 *
 * @author Jonas Zuberbuehler <jonas.zuberbuehler@gmail.com>
 *
 */
@Directive({
    selector: '[ion-affix]'
})
export class IonAffix implements AfterViewInit, OnDestroy {

    @Input('content') content: Content;
    clone;
    scrollSubscription;

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    ngAfterViewInit(): void {
        const headerElement = this.element.nativeElement;
        const containerElement = headerElement.parentElement;
        const containerTop = containerElement.offsetTop;
        const containerBottom = containerTop + containerElement.getBoundingClientRect().height;
        const headerHeight = headerElement.getBoundingClientRect().height;
        const right = window.innerWidth - headerElement.getBoundingClientRect().width - headerElement.getBoundingClientRect().left;
        const left = headerElement.getBoundingClientRect().left;

        this.scrollSubscription = this.content.ionScroll.subscribe(event => {
            const scrollTop = event.scrollTop;
            const contentScrollTop = this.content.getScrollElement().getBoundingClientRect().top;

            // check if scrollTop is within list boundaries
            if (scrollTop >= containerTop && scrollTop <= containerBottom) {
                if (!this.clone) {
                    this.clone = headerElement.cloneNode(true);
                    containerElement.insertBefore(this.clone, headerElement);
                    this.applyStyles(headerElement, left, right);
                    this.content.getNativeElement().appendChild(headerElement);
                    // for fancy transition efx
                    setTimeout(() => {
                        this.renderer.setStyle(headerElement, 'right', '0px');
                        this.renderer.setStyle(headerElement, 'left', '0px');
                    }, 0);
                }
                // transform vertical position to push fixed header up/down
                if (scrollTop <= containerBottom && scrollTop >= (containerBottom - headerHeight)) {
                    const delta = contentScrollTop - (scrollTop - (containerBottom - headerHeight));
                    this.renderer.setStyle(headerElement, 'transform', `translate3d(0px, ${delta}px, 0px)`);
                } else {
                    this.renderer.setStyle(headerElement, 'transform', `translate3d(0px, ${contentScrollTop}px, 0px`);
                }
            } else {
                if (this.clone) {
                    containerElement.insertBefore(headerElement, this.clone);
                    this.clearStyles(headerElement);
                    this.clone.remove();
                    this.clone = null;
                }
            }
        });
    }

    private applyStyles(headerElement, left, right) {
        this.renderer.setStyle(headerElement, 'right', `${right}px`);
        this.renderer.setStyle(headerElement, 'left', `${left}px`);
        this.renderer.setStyle(headerElement, 'transition', 'left 0.1s ease-out, right 0.1s ease-out');
        this.renderer.setStyle(headerElement, 'z-index', '2');
        this.renderer.setStyle(headerElement, 'position', 'absolute');
        this.renderer.setStyle(headerElement, 'width', 'auto');
        this.renderer.setStyle(headerElement, 'top', '0px');
    }

    private clearStyles(headerElement) {
        this.renderer.removeStyle(headerElement, 'position');
        this.renderer.removeStyle(headerElement, 'z-index');
        this.renderer.removeStyle(headerElement, 'transition');
        this.renderer.removeStyle(headerElement, 'top');
        this.renderer.removeStyle(headerElement, 'transform');
        this.renderer.removeStyle(headerElement, 'left');
        this.renderer.removeStyle(headerElement, 'right');
        this.renderer.removeStyle(headerElement, 'width');
    }

    ngOnDestroy(): void {
        this.scrollSubscription.unsubscribe();
    }
}
