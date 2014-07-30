'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Article Schema
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
  description: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Validations
 */
ProductSchema.path('name').validate(function(title) {
  return !!title;
}, 'Name cannot be blank');

ProductSchema.path('description').validate(function(content) {
  return !!content;
}, 'Description cannot be blank');

/**
 * Statics
 */


mongoose.model('Product', ProductSchema);
