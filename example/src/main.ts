import { Component, NgModule, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserModule } from '@angular/platform-browser';
import { UIRouterUpgradeModule, NgHybridStateDeclaration } from '@uirouter/angular-hybrid';
import { StateRegistry, UrlService } from '@uirouter/core';

const app = window.angular.module('minimal');


// An Angular component
@Component({
  selector: 'ng2-component',
  template: `
    <h1>ng2 component</h1>
    <a uiSref="app">Back to app</a>
    <ui-view></ui-view>
  `,
})
export class Ng2Component {
  ngOnInit() {
    console.log('Ng2Component.ngOnInit()');
  }
}

const nestedState: NgHybridStateDeclaration = {
  url: '/ng2',
  name: 'app.ng2.ng2',
  component: Ng2Component,
};

// The root Angular module
@NgModule({
  imports: [
    BrowserModule,
    // Provide Angular upgrade capabilities
    UpgradeModule,
    // Provides the @uirouter/angular directives
    UIRouterUpgradeModule.forRoot({ states: [nestedState] }),
  ],
  declarations: [Ng2Component],
  entryComponents: [Ng2Component],
})
export class RootModule {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap() {
    // The DOM must be already be available
    this.upgrade.bootstrap(document.body, [app.name]);
  }
}

// Using AngularJS config block, call `deferIntercept()`.
// This tells UI-Router to delay the initial URL sync (until all bootstrapping is complete)
app.config(['$urlServiceProvider', ($urlService) => $urlService.deferIntercept()]);

// Manually bootstrap the Angular app
platformBrowserDynamic()
  .bootstrapModule(RootModule)
  .then((platformRef) => {
    // get() UrlService from DI (this call will create all the UIRouter services)
    const url: UrlService = platformRef.injector.get(UrlService);
    const stateRegistry: StateRegistry = platformRef.injector.get(StateRegistry);

    // nested route to ng2 component
    stateRegistry.register({
      url: '/ng2',
      name: 'app.ng1.ng2',
      component: Ng2Component,
    });

    // route stateService ng2 component
    stateRegistry.register({
      url: '/ng2',
      name: 'app.ng2',
      component: Ng2Component,
    });

    // Instruct UIRouter to listen to URL changes
    function startUIRouter() {
      url.listen();
      url.sync();
    }

    const ngZone: NgZone = platformRef.injector.get(NgZone);
    ngZone.run(startUIRouter);
  });
