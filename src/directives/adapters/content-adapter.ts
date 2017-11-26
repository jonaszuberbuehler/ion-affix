import { IonAffixContainer } from '../ion-affix-container';
import { Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';

/**
 * Adapter for ion-content.
 *
 * @author Jonas Zuberbuehler <jonas.zuberbuehler@gmail.com>
 */
export class ContentAdapter implements IonAffixContainer {

    constructor(public content: Content) {
    }

    onScroll(): Observable<any> {
        return Observable.merge(this.content.ionScrollStart, this.content.ionScroll, this.content.ionScrollEnd);
    }

    getClientTop(): number {
        return this.content.getScrollElement().getBoundingClientRect().top;
    }

    getScrollTop(): number {
        return this.content.getScrollElement().scrollTop;
    }

    appendFixedHeader(headerElement: any): void {
        this.content.getNativeElement().appendChild(headerElement);
    }

    isScrollingDown(): boolean {
        return this.content.directionY === 'down';
    }
}
