import { Observable } from 'rxjs';

/**
 * Abstraction for scrollable containers an ion-affix can be attached to. Currently only ion-content and ion-scroll.
 *
 * @author Jonas Zuberbuehler <jonas.zuberbuehler@gmail.com>
 *
 */
export interface IonAffixContainer {

    onScroll(): Observable<any>;

    getClientTop(): number;

    getScrollTop(): number;

    appendFixedHeader(headerElement: any): void;

    isScrollingDown(): boolean;

}
