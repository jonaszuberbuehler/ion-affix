import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { IonAffixEvent } from './ion-affix-event';
import { IonAffixContainer } from './ion-affix-container';
import { adapterFactory } from './adapters/adapter-factory';

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

    @Input('content') content;
    @Output() onSticky = new EventEmitter<IonAffixEvent>();
    clone;
    scrollSubscription;
    // header that should be made sticky
    headerElement;
    // direct parent of header (can be ion-list, ion-card etc.)
    containerElement;
    // the element that scrolls (i.e., ion-content or ion-scroll)
    scrollContainer: IonAffixContainer;

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    ngAfterViewInit(): void {
        // getting container
        this.scrollContainer = adapterFactory(this.content);
        this.headerElement = this.element.nativeElement;
        this.containerElement = this.headerElement.parentElement;
        const headerHeight = this.headerElement.getBoundingClientRect().height;
        const right = window.innerWidth - this.headerElement.getBoundingClientRect().width - this.headerElement.getBoundingClientRect().left;
        const left = this.headerElement.getBoundingClientRect().left;
        let scrollClientTop = this.scrollContainer.getClientTop();
        let containerTop = this.containerElement.offsetTop;
        let containerBottom = containerTop + this.containerElement.getBoundingClientRect().height;
        // initially checking if affix needs to be shown
        this.updateSticky(this.scrollContainer.getScrollTop(), containerTop, containerBottom, scrollClientTop, headerHeight, left, right, true);

        const onScroll = () => {
            const scrollTop = this.scrollContainer.getScrollTop();
            scrollClientTop = this.scrollContainer.getClientTop();
            containerTop = this.containerElement.offsetTop;
            containerBottom = containerTop + this.containerElement.getBoundingClientRect().height;
            this.updateSticky(scrollTop, containerTop, containerBottom, scrollClientTop, headerHeight, left, right, this.scrollContainer.isScrollingDown());
        };
        // subscribing to scroll events
        this.scrollSubscription = this.scrollContainer.onScroll().subscribe(onScroll);
    }

    private updateSticky(scrollTop, containerTop, containerBottom, scrollClientTop, headerHeight, left, right, downwards) {
        // check if scrollTop is within list boundaries
        if (scrollTop > 0 && scrollTop >= containerTop && scrollTop <= containerBottom) {
            if (!this.clone) {
                this.clone = this.headerElement.cloneNode(true);
                this.containerElement.insertBefore(this.clone, this.headerElement);
                this.scrollContainer.appendFixedHeader(this.headerElement);
                this.onSticky.emit({sticky: true, affix: this});
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
                const delta = scrollClientTop - (scrollTop - (containerBottom - headerHeight));
                this.renderer.setStyle(this.headerElement, 'transform', `translate3d(0px, ${delta}px, 0px)`);
                this.renderer.setStyle(this.headerElement, '-webkit-transform', `translate3d(0px, ${delta}px, 0px)`);
            } else {
                this.renderer.setStyle(this.headerElement, 'transform', `translate3d(0px, ${scrollClientTop}px, 0px)`);
                this.renderer.setStyle(this.headerElement, '-webkit-transform', `translate3d(0px, ${scrollClientTop}px, 0px)`);
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
            this.onSticky.emit({sticky: false, affix: this});
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
        this.scrollSubscription.unsubscribe();
    }
}
