'use strict';

angular.module('mean.products').controller('CartController', 
  ['$scope', '$stateParams', '$location', 'Global', 'Products', 'shoppingCart',
  function($scope, $stateParams, $location, Global, Products, shoppingCart) {
    $scope.global = Global;
    $scope.shoppingCart = shoppingCart;
  }
]);    