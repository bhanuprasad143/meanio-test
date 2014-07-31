'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  // Order = mongoose.model('Order'),
  Item = mongoose.model('Item'),
  _ = require('lodash');

/**
 * Find item by id
 */
exports.item = function(req, res, next, id) {
  Item.load(id, function(err, item) {
    if (err) return next(err);
    if (!item) return next(new Error('Failed to load item ' + id));
    req.item = item;
    next();
  });
};


exports.currentCart = function(req, res, next) {
  if (!req.session.cart) { 
      req.session.cart = {
          products: {},
          count: 0,
          total: 0
      };
  }
  next();
};

exports.all = function(){
    console.log('alll.......');
};

exports.create = function(){
    console.log('creating......');
};
// Add product to cart
exports.addProduct = function(req, res) {
    try {
    // Get product from database for given id
    Product.findOne(req.body.product, function(err, product) { 
        if (err) {
            console.log(err);
            return false;
        }
        
        
        // Check if product already in cart
        if (!req.session.cart.products[req.body.product]) {
        
            // Add product if not
            req.session.cart.products[req.body.product] = {
                id: product.id,
                name: product.name,
                price_in_cents: product.price_in_cents,
                quantity: 1  
            };
        
        } else {
        
            // Increment count if already added
            req.session.cart.products[req.body.product].quantity = req.session.cart.products[req.body.product].quantity + 1;
        }
        
        // Total cart
        req.session.cart.count = 0;
        req.session.cart.total = 0;
        _.each(req.session.cart.products, function (product) {
            req.session.cart.count = req.session.cart.count + product.quantity;
            req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
        });
        res.json(req.session.cart);
        // Respond with rendered cart
    
    });
    } catch(err) {
        console.log(err);
    }
};

// Remove product from cart
exports.remProduct = function(req, res) {
        
    // Check item count
    if (req.session.cart.products[req.body.product].quantity > 1) {

        // Reduce count if already added
        req.session.cart.products[req.body.product].quantity = req.session.cart.products[req.body.product].quantity - 1;
        
    } else {
        
        // Remove product 
        delete req.session.cart.products[req.body.product];
        
    }

    // Total cart
    req.session.cart.count = 0;
    req.session.cart.total = 0;
    _.each(req.session.cart.products, function (product) {
        req.session.cart.count = req.session.cart.count + product.quantity;
        req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
    });

    // Remove cart if empty
    if (req.session.cart.count === 0) {
        delete req.session.cart;
        res.render('cart', {cart: undefined});
    } 

    // Respond with rendered cart
    res.render('cart/cart', {cart: req.session.cart});

};

