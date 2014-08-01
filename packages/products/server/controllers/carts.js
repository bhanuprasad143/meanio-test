'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  Order = mongoose.model('Order'),
  Item = mongoose.model('Item');
  // _ = require('lodash');

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
    // delete(req.session.currentCart);
    // req.session.currentCart = null;
    if (!req.session.cartId) { 
        var currentCart = new Order();
        currentCart.user = req.user;
        currentCart.name = req.user.name;
        currentCart.save(function(err, resp){
            if(err){
                console.log(err);
                return null;
            }
            console.log('req.session.currentCart');
            console.log(resp._id);
            req.session.cartId = resp._id;
        });
    }
    next();
};

// add item to cart
exports.addItem = function(req, res){
    console.log('addItem......');
    try{
        var productId = req.body.product;
        console.log(productId);
        Item.findOne({product: productId, order: req.session.cartId}, function(err, item){
            if(err){
                console.log(err);
                return false;
            }
            if(item){
                item.quantity += 1;
                item.save();
                res.json(item);
                return true;
            }
            Product.findOne({_id: productId}, function(err, product){
                if(err){
                    console.log(err);
                    return false;
                }
                if(!product){
                    console.log('not found product');
                    return false;
                }
                var newItem = new Item({
                    product: product,
                    order: req.session.cartId,
                    quantity: 1
                });
                console.log('req.session.currentCart');
                console.log(req.session);
                newItem.save(function(err2, itm){
                    if(err2){
                        console.log(err2);
                        return false;
                    }
                    res.json(newItem);
                });
            });

        });

     
    }catch(err){
        console.log(err);
    }
};

exports.showItem = function(req, res){
    console.log('showItem..........');
    console.log(req.params);
    Item.findOne({$or: [{_id: req.params.itemId}, {product: req.params.itemId}]}).populate('product', 'name image price_in_cents').exec(function(err, item){
        if(err || !item){
            console.log('not found');
            return false;
        }
        res.json(item);
    });
};

exports.updateItem = function(req, res){
    console.log('updateItem......');
    console.log(req.body);
    Item.findOne({$or: [{_id: req.body._id}, {product: req.body._id}]}).populate('product', 'name image price_in_cents').exec(function(err, item){
        if(err || !item){
            console.log('ERROR: item is not existed!');
            return false;
        }
        item.quantity = req.body.quantity;
        item.save();
        res.json(item);
    });
};

exports.removeItem = function(req, res){
    console.log('removeItem.......');
    console.log(req.params);
    Item.findOne({$or: [{_id: req.params.itemId}, {product: req.params.itemId}]}).populate('product', 'name image price_in_cents').exec(function(err, item){
        if(err || !item){
            console.log('ERROR: item is not existed!');
            return false;
        }
        item.remove(function(err){
            if (err) {
              return res.json(500, {
                error: 'Cannot delete the article'
              });
            }
            res.json(item);

        });
    });
};


exports.clearCart = function(req, res){
    console.log('clearCart.......');
    delete req.session.cart;
    res.json(true);
};

exports.all = function(req, res){
    console.log('alll.......');
    Item.find({order: req.session.cartId}).sort('-created').populate('product', 'name image price_in_cents').exec(function(err, items){
        res.json(items);
    });
};


