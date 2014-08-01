'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Order Schema
 */
var OrderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Statics
 */
OrderSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Order', OrderSchema);
