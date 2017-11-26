[![npm](https://img.shields.io/npm/l/ion-affix.svg)](https://www.npmjs.com/package/ion-affix/)
[![npm](https://img.shields.io/npm/v/ion-affix.svg)](https://www.npmjs.com/package/ion-affix/)
[![npm](https://img.shields.io/npm/dt/ion-affix.svg)](https://www.npmjs.com/package/ion-affix)
[![npm](https://img.shields.io/npm/dm/ion-affix.svg)](https://www.npmjs.com/package/ion-affix)

# ion-affix

> Allows for creating affixed (sticky) `ion-list-header`, `ion-item-divider` and `ion-card` for newest [Ionic framework][1].

Kudos to [Collin Donahue-Oponski][2] and his initial idea shown in [this gist][3].

[1]: https://ionicframework.com/
[2]: https://github.com/colllin
[3]: https://gist.github.com/colllin/1a0c3a91cc641d8e578f

## See it

[Here][4], the source can be found at https://github.com/jonaszuberbuehler/ion-affix-demo.

[4]: https://jonaszuberbuehler.github.io/ion-affix/demo/www/demo.html

## Get it

from npm

```bash
npm install --save ion-affix
```
## Use it

Import `IonAffixModule` in your `app.module.ts`

```typescript
@NgModule({
    ...
    imports: [
        IonAffixModule
    ]
    ...
})
export class AppModule {
}
```

and add the directive `ion-affix` to any `ion-list-header`, `ion-item-divider` or `ion-item` (inside `ion-card`) that should be sticky. You also need to provide a reference to the parent `ion-content`.

 ```html
<ion-content padding #content>
    <ion-list>
        <ion-list-header ion-affix [content]="content" (click)="test()">Group 1</ion-list-header>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-list>
    <ion-list>
        <ion-list-header ion-affix [content]="content">Group 2</ion-list-header>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-list>
</ion-content>
 ```
 
 ```html
<ion-content padding #content>
    <ion-item-group>
        <ion-item-divider ion-affix [content]="content" (click)="test()">Group 1 (click me!)</ion-item-divider>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-item-group>
    <ion-item-group>
        <ion-item-divider ion-affix [content]="content">Group 2</ion-item-divider>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-item-group>
</ion-content>
 ```
 
```html
<ion-content padding #content>
    <ion-card>
        <ion-item ion-affix [content]="content" no-lines>
            <ion-avatar item-start>
                <img src="assets/img/marty-avatar.png">
            </ion-avatar>
            <h2>Marty McFly</h2>
            <p>November 5, 1955</p>
        </ion-item>
        <img src="assets/img/advance-card-bttf.png">
        <ion-card-content>
            <p>Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.</p>
        </ion-card-content>
        <ion-row>
            <ion-col>
                <button ion-button color="primary" clear small icon-start>
                    <ion-icon name='thumbs-up'></ion-icon>
                    12 Likes
                </button>
            </ion-col>
            <ion-col>
                <button ion-button color="primary" clear small icon-start>
                    <ion-icon name='text'></ion-icon>
                    4 Comments
                </button>
            </ion-col>
            <ion-col align-self-center text-center>
                <ion-note>
                    11h ago
                </ion-note>
            </ion-col>
        </ion-row>
    </ion-card>
</ion-content>
```

### ion-scroll

If you need sticky headers within an `ion-scroll` make sure you're using a version of this module >=1.1.0 and pass the reference of it instead of `ion-content`. You most likely also want to add `style="overflow:hidden"` to the `ion-scroll`, otherwise the pushing up/pulling down of headers looks a bit strange.

### Events

In case you need to know whether a certain element gets sticky or not you can subscribe to `onSticky(IonAffixEvent)` event:

 ```html
<ion-content padding #content>
    <ion-list>
        <ion-list-header ion-affix [content]="content" (onSticky)="handleOnSticky($event)">Group 1</ion-list-header>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-list>
    <ion-list>
        <ion-list-header ion-affix [content]="content">Group 2</ion-list-header>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-list>
</ion-content>
 ```
 
`IonAffixEvent` has two properties:

#### `sticky`
(boolean) Whether the affix is sticky or not.

#### `affix`
(IonAffix) The affected element (in case you need to manipulate it).

## Explain it

To be able use custom Angular directives on a sticky header I decided to make the original `ion-list-header` element sticky instead of its clone. This is the major difference to the gist shown above and I did it mainly because I have no idea how to do a `$compile(clone)` known from AngularJS with Angular 2. 

## Note it

To make it work on iOS use the [cordova-plugin-wkwebview-engine][5] plugin. Otherwise the scroll events are only fired once scrolling stops.

[5]: https://github.com/ionic-team/cordova-plugin-wkwebview-engine
