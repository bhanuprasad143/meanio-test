'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Item Schema
 */
var ItemSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    trim: true
  },
  order: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Order'
  }
});

/**
 * Validations
 */
ItemSchema.path('product').validate(function(product) {
  return !!product;
}, 'Product cannot be blank');

ItemSchema.path('quantity').validate(function(quantity) {
  return !!quantity;
}, 'Quantity cannot be blank');

/**
 * Statics
 */
ItemSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('product', 'name').exec(cb);
};

mongoose.model('Item', ItemSchema);
