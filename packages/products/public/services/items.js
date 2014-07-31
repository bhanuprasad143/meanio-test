'use strict';

angular.module('mean.products').factory('Items', ['$resource',
  function($resource) {
    return $resource('items/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
