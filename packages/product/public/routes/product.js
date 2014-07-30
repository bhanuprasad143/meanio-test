'use strict';

angular.module('mean.product').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('products-page', {
      url: '/products',
      templateUrl: 'product/views/index.html'
    });
  }
]);
