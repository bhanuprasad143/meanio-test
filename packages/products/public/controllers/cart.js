'use strict';

angular.module('mean.products').controller('CartController', 
  ['$scope', '$stateParams', '$location', 'Global', 'Products', 'shoppingCart',
  function($scope, $stateParams, $location, Global, Products, shoppingCart) {
    $scope.global = Global;
    $scope.shoppingCart = shoppingCart;
    $scope.shown = false;
    $scope.toogleCartPanel = function(){
    	$scope.shown = ! $scope.shown;
    	console.log($scope.shoppingCart.items.keys);
    	console.log($scope.shown);
    };

  }
]);    