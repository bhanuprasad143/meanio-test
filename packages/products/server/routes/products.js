'use strict';

var products = require('../controllers/products');
var carts = require('../controllers/carts');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  next();
};

module.exports = function(Products, app, auth) {


  app.route('/products')
    .get(products.all)
    .post(auth.requiresLogin, products.create);
  app.route('/products/:productId')
    .get(products.show)
    .put(auth.requiresLogin, hasAuthorization, products.update)
    .delete(auth.requiresLogin, hasAuthorization, products.destroy);


  app.route('/items')
    .get(carts.all)
    .post(auth.requiresLogin, carts.currentCart, carts.addItem);
  app.route('/items/:itemId')
    .get(auth.requiresLogin, carts.currentCart, carts.showItem);
  app.route('/items/:itemId')
    .put(auth.requiresLogin, carts.currentCart, carts.updateItem)
    .delete(auth.requiresLogin, carts.currentCart, carts.removeItem);
  app.route('/cart')
    .delete(auth.requiresLogin, carts.currentCart, carts.clearCart);

  // Finish with setting up the productId param
  app.param('productId', products.product);
  // app.param('itemId', carts.item);

};
