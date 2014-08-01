'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  // Order = mongoose.model('Order'),
  Item = mongoose.model('Item'),
  _ = require('lodash');

// helper
// cache cart counter and calculator
function calcCartCaching(req, res){
    _.each(req.session.cart.items, function (itm) {
        req.session.cart.count = req.session.cart.count + itm.quantity;
        req.session.cart.total = req.session.cart.total + (itm.price * itm.quantity);
    });

}
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
    // we should not store temp cart in db, that would be redundant
    // currentCart should store all cart in session, it will be remove in short time
    if (!req.session.cart) { 
      req.session.cart = {
          items: {},
          count: 0,
          total: 0
      };
    }
    next();
};

// add item to cart
exports.addItem = function(req, res){
    console.log('addItem......');
    try{
        var productId = req.body.product;
        Product.findOne(productId, function(err, product){
            if(err){
                console.log(err);
                return false;
            }
            var item = req.session.cart.items[productId];
            // add item if not existed
            if(!item){
                item = {
                    id: product._id,
                    name: product.name,
                    image: product.image,
                    price_in_cents: product.price_in_cents,
                    quantity: 1
                };
            }else{
                // increment if existed
                item.quantity += 1;
            }
            // re-fill to cart
            req.session.cart.items[productId] = item;

            // calc cache cart
            // _.each(req.session.cart.items, function (itm) {
            //     req.session.cart.count = req.session.cart.count + itm.quantity;
            //     req.session.cart.total = req.session.cart.total + (itm.price * itm.quantity);
            // });

            calcCartCaching(req,res);
    
            // we could sync angularjs cart and express cart
            // by response to whole things on cart
            // but that must be bulk traffic
            // so we only send what was changed
            res.json(item);

        });
    }catch(err){
        console.log(err);
    }
};

exports.updateItem = function(req, res){
    console.log('updateItem......');
    var item = req.session.cart.items[req.body.product];
    if(!item){
        console.log('ERROR: item is not existed!');
        return false;
    }
    item.quantity = req.body.quantity;
    req.session.cart.items[req.body.product] = item;
    calcCartCaching(req, res);
    res.json(item);
};

exports.removeItem = function(req, res){
    console.log('removeItem.......');
    var item = req.session.cart.items[req.body.product];
    if(!item){
        console.log('ERROR: item is not existed!');
        return false;
    }
    delete(req.session.cart[req.body.product]);
    calcCartCaching(req, res);
    res.json(true);
};


exports.clearCart = function(req, res){
    console.log('clearCart.......');
    delete req.session.cart;
    res.json(true);
};

exports.all = function(req, res){
    console.log('alll.......');
    res.json(_.values(req.session.cart.items));
};

// exports.create = function(){
//     console.log('creating......');
// };

// // Add product to cart
// exports.addProduct = function(req, res) {
//     try {
//     // Get product from database for given id
//     Product.findOne(req.body.product, function(err, product) { 
//         if (err) {
//             console.log(err);
//             return false;
//         }
        
        
//         // Check if product already in cart
//         if (!req.session.cart.products[req.body.product]) {
        
//             // Add product if not
//             req.session.cart.products[req.body.product] = {
//                 id: product.id,
//                 name: product.name,
//                 price_in_cents: product.price_in_cents,
//                 quantity: 1  
//             };
        
//         } else {
        
//             // Increment count if already added
//             req.session.cart.products[req.body.product].quantity = req.session.cart.products[req.body.product].quantity + 1;
//         }
        
//         // Total cart
//         req.session.cart.count = 0;
//         req.session.cart.total = 0;
//         _.each(req.session.cart.products, function (product) {
//             req.session.cart.count = req.session.cart.count + product.quantity;
//             req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
//         });
//         res.json(req.session.cart);
//         // Respond with rendered cart
    
//     });
//     } catch(err) {
//         console.log(err);
//     }
// };

// // Remove product from cart
// exports.remProduct = function(req, res) {
        
//     // Check item count
//     if (req.session.cart.products[req.body.product].quantity > 1) {

//         // Reduce count if already added
//         req.session.cart.products[req.body.product].quantity = req.session.cart.products[req.body.product].quantity - 1;
        
//     } else {
        
//         // Remove product 
//         delete req.session.cart.products[req.body.product];
        
//     }

//     // Total cart
//     req.session.cart.count = 0;
//     req.session.cart.total = 0;
//     _.each(req.session.cart.products, function (product) {
//         req.session.cart.count = req.session.cart.count + product.quantity;
//         req.session.cart.total = req.session.cart.total + (product.price * product.quantity);
//     });

//     // Remove cart if empty
//     if (req.session.cart.count === 0) {
//         delete req.session.cart;
//         res.render('cart', {cart: undefined});
//     } 

//     // Respond with rendered cart
//     res.render('cart/cart', {cart: req.session.cart});

// };

