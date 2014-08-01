'use strict';

angular.module('mean.products').factory('Items', ['$resource',
  function($resource) {
    return $resource('items/:itemId', {
      itemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
