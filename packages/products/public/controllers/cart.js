'use strict';

angular.module('mean.products').controller('CartController', 
  ['$scope', '$stateParams', '$location', 'Global', 'Products', 'shoppingCart',
  function($scope, $stateParams, $location, Global, Products, shoppingCart) {
    $scope.global = Global;
    $scope.shoppingCart = shoppingCart;
    $scope.shown = false;
    $scope.changed = false;

    // can use $scope.$watch
    $scope.toogleCartPanel = function(){
      $scope.shown = ! $scope.shown;
    };

    // can use $scope.$watch
    $scope.watchChange = function(){
    	$scope.changed = true;
    };

    $scope.allItems = function(){
      shoppingCart.loadItems();
      $scope.items = shoppingCart.items;
    };

    $scope.updateItem = function(item){
      console.log(item);
      shoppingCart.updateItem(item, item.quantity);
    };

    $scope.updateCart = function(){
      shoppingCart.storeCart();
      $scope.changed = false;
    };

    $scope.removeItem = function(item){
      shoppingCart.removeItem(item);
    };


  }
]);    