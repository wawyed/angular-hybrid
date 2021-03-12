const app = angular.module('minimal', ['ui.router.upgrade']);

app.run([
  '$stateRegistry',
  '$urlService',
  ($stateRegistry, $urlService) => {
    $urlService.rules.initial({ state: 'app' });

    $stateRegistry.register({
      url: '',
      name: 'app',
      template: `
        <a ui-sref=".ng1" ui-sref-active-eq="active">app.ng1</a>
        <a ui-sref=".ng1.ng2" ui-sref-active-eq="active">app.ng1.ng2</a>
        <a ui-sref=".ng2" ui-sref-active-eq="active">app.ng2</a>
        <a ui-sref=".ng2.ng2" ui-sref-active-eq="active">app.ng2.ng2</a>
        <ui-view></ui-view>
      `,
    });

    // route to ng1 component
    $stateRegistry.register({
      url: '/ng1',
      name: 'app.ng1',
      component: 'ng1Component',
    });
  },
]);

// An AngularJS component
app.component('ng1Component', {
  template: `
      <h1>ng1 component</h1>
      <a ui-sref="app">Back to app</a>
      <ui-view></ui-view>
    `,
  controller: function () {
    this.$onInit = function () {
      console.log('ng1Component.$onInit()');
    };
  },
});
