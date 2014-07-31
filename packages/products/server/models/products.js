'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Product Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true,
    default: 'http://buzzsmile.com/wp-content/uploads/2013/07/beautiful-girls-make-the-world-go-around/beautiful-girls-make-the-world-go-around_640x400_c8e7.jpg'
  },
  price_in_cents: {
    type: Number,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Validations
 */
ProductSchema.path('name').validate(function(name) {
  return !!name;
}, 'Name cannot be blank');

ProductSchema.path('price_in_cents').validate(function(price_in_cents) {
  if(!price_in_cents || price_in_cents < 0){
    return false;
  }else{
    return true;
  }
}, 'Price cannot be blank');

ProductSchema.path('description').validate(function(description) {
  return !!description;
}, 'Description cannot be blank');

/**
 * Statics
 */
ProductSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

ProductSchema.methods.price = function(){
  return (this.price_in_cents/100.0).toFixed(2);
};
// ProductSchema.methods.setPrice = function(){
//   return this.price*100.0;
// };

mongoose.model('Product', ProductSchema);
