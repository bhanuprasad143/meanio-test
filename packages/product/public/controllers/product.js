'use strict';

angular.module('mean.product').controller('ProductController', ['$scope', 'Global', 'Product',
  function($scope, Global, Product) {
    $scope.global = Global;
    $scope.package = {
      name: 'product'
    };
  }
]);
