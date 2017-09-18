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
    scrollSubscriptions = [];
    headerElement;
    containerElement;

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    ngAfterViewInit(): void {
        this.headerElement = this.element.nativeElement;
        this.containerElement = this.headerElement.parentElement;
        const headerHeight = this.headerElement.getBoundingClientRect().height;
        const right = window.innerWidth - this.headerElement.getBoundingClientRect().width - this.headerElement.getBoundingClientRect().left;
        const left = this.headerElement.getBoundingClientRect().left;
        let contentScrollTop = this.content.getScrollElement().getBoundingClientRect().top;
        let containerTop = this.containerElement.offsetTop;
        let containerBottom = containerTop + this.containerElement.getBoundingClientRect().height;
        // initially checking if affix needs to be shown
        this.updateSticky(this.content.getScrollElement().scrollTop, containerTop, containerBottom, contentScrollTop, headerHeight, left, right, true);

        const onScroll = event => {
            const scrollTop = this.content.scrollTop;
            contentScrollTop = this.content.getScrollElement().getBoundingClientRect().top;
            containerTop = this.containerElement.offsetTop;
            containerBottom = containerTop + this.containerElement.getBoundingClientRect().height;
            this.updateSticky(scrollTop, containerTop, containerBottom, contentScrollTop, headerHeight, left, right, this.content.directionY === 'down');
        };
        this.scrollSubscriptions.push(this.content.ionScrollStart.subscribe(onScroll));
        this.scrollSubscriptions.push(this.content.ionScroll.subscribe(onScroll));
        this.scrollSubscriptions.push(this.content.ionScrollEnd.subscribe(onScroll));
    }

    private updateSticky(scrollTop, containerTop, containerBottom, contentScrollTop, headerHeight, left, right, downwards) {
        // check if scrollTop is within list boundaries
        if (scrollTop > 0 && scrollTop >= containerTop && scrollTop <= containerBottom) {
            if (!this.clone) {
                this.clone = this.headerElement.cloneNode(true);
                this.containerElement.insertBefore(this.clone, this.headerElement);
                this.content.getNativeElement().appendChild(this.headerElement);
                // for fancy transition efx if scrolling down
                if (downwards) {
                    this.applyStyles(left, right);
                } else {
                    this.applyStyles(0, 0);
                }
                setTimeout(() => {
                    this.renderer.setStyle(this.headerElement, 'right', '0px');
                    this.renderer.setStyle(this.headerElement, 'left', '0px');
                }, 0);
            }
            // transform vertical position to push fixed header up/down
            if (scrollTop <= containerBottom && scrollTop >= (containerBottom - headerHeight)) {
                const delta = contentScrollTop - (scrollTop - (containerBottom - headerHeight));
                this.renderer.setStyle(this.headerElement, 'transform', `translate3d(0px, ${delta}px, 0px)`);
                this.renderer.setStyle(this.headerElement, '-webkit-transform', `translate3d(0px, ${delta}px, 0px)`);
            } else {
                this.renderer.setStyle(this.headerElement, 'transform', `translate3d(0px, ${contentScrollTop}px, 0px)`);
                this.renderer.setStyle(this.headerElement, '-webkit-transform', `translate3d(0px, ${contentScrollTop}px, 0px)`);
            }
        } else {
            this.reset();
        }
    }

    private reset() {
        if (this.clone) {
            this.containerElement.insertBefore(this.headerElement, this.clone);
            this.clearStyles();
            this.clone.remove();
            this.clone = null;
        }
    }

    private applyStyles(left, right) {
        this.renderer.setStyle(this.headerElement, 'right', `${right}px`);
        this.renderer.setStyle(this.headerElement, 'left', `${left}px`);
        this.renderer.setStyle(this.headerElement, 'transition', 'left 0.1s ease-out, right 0.1s ease-out');
        this.renderer.setStyle(this.headerElement, 'z-index', '2');
        this.renderer.setStyle(this.headerElement, 'position', 'absolute');
        this.renderer.setStyle(this.headerElement, 'width', 'auto');
        this.renderer.setStyle(this.headerElement, 'top', '0px');
    }

    private clearStyles() {
        this.renderer.removeStyle(this.headerElement, 'position');
        this.renderer.removeStyle(this.headerElement, 'z-index');
        this.renderer.removeStyle(this.headerElement, 'transition');
        this.renderer.removeStyle(this.headerElement, 'top');
        this.renderer.removeStyle(this.headerElement, 'transform');
        this.renderer.removeStyle(this.headerElement, '-webkit-transform');
        this.renderer.removeStyle(this.headerElement, 'left');
        this.renderer.removeStyle(this.headerElement, 'right');
        this.renderer.removeStyle(this.headerElement, 'width');
    }

    ngOnDestroy(): void {
        this.reset();
        this.scrollSubscriptions.forEach(sub => sub.unsubscribe());
    }
}
