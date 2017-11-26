import { Content, Scroll } from 'ionic-angular';
import { ContentAdapter } from './content-adapter';
import { ScrollAdapter } from './scroll-adapter';

export function adapterFactory (container) {
    if (container instanceof Content) {
        return new ContentAdapter(container);
    } else if (container instanceof Scroll) {
        return new ScrollAdapter(container);
    }
    throw 'Invalid container element (only ion-content and ion-scroll currently supported)';
}
