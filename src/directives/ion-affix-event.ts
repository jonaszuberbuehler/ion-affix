import { IonAffix } from './ion-affix';

/**
 * Fired whenever the state of an IonAffix changes.
 *
 * @author Jonas Zuberbuehler <jonas.zuberbuehler@gmail.com>
 */
export interface IonAffixEvent {

    /**
     * Whether the affix is sticky or not.
     */
    sticky: boolean,
    /**
     * The affected IonAffix.
     */
    affix: IonAffix
}
