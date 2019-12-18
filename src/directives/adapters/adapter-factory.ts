import { IonContent } from '@ionic/angular';
import { ContentAdapter } from './content-adapter';
export function adapterFactory(container) {
    if (container instanceof IonContent) {
        return new ContentAdapter(container);
    }
    // else if (container instanceof Scroll) {
    //     return new ScrollAdapter(container);
    // }
    throw 'Invalid container element (only ion-content currently supported)';
}
//# sourceMappingURL=adapter-factory.js.map
