# ion-affix

> Allows for creating affixed (sticky) `ion-list-header` for newest [Ionic framework][1].

Kudos to [Collin Donahue-Oponski][2] and his idea shown in [this gist][3].

[1]: https://ionicframework.com/
[2]: https://github.com/colllin
[3]: https://gist.github.com/colllin/1a0c3a91cc641d8e578f

## See it

[Here][4]

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

and add the directive `ion-affix` to any `ion-list-header` that should be sticky. You also need to provide a reference to the parent `ion-content`.

 ```html
 <ion-content padding #content>
    <ion-list>
        <ion-list-header ion-affix [content]="content" (click)="test()">Group 1</ion-list-header>
        <ion-item *ngFor="let item of items">{{item}}</ion-item>
    </ion-list>
 </ion-content>
 ```

## Explain it

To be able use custom Angular directives on a sticky header I decided to make the original `ion-list-header` element sticky instead of its clone. This is the major difference to the gist shown above and I did it mainly because I have no idea how to do a `$compile(clone)` known from AngularJS with Angular 2. 
