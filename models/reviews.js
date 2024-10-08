const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    createdAt: { type: Date, default: Date.now }
}
)

module.exports = mongoose.model('review', reviewSchema)