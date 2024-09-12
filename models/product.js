const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    default: null, 
  },
  image: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  author: {
    type: String,
    required: true,
    default: 'admin',
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'review' }]
}, {
  timestamps: true, 
});

module.exports = mongoose.model('product', productSchema);


