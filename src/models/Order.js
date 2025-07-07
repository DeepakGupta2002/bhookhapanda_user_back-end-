const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            image: {
                type: String,
                default: ''
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    razorpayOrderId: {
        type: String,
        default: null
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    razorpaySignature: {
        type: String,
        default: null
    },

    deliveryInstructions: {
        type: [String],
        default: []
    },
    orderedAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for order summary
orderSchema.virtual('summary').get(function () {
    return `${this.items.length} items - ₹${this.totalAmount}`;
});

// Update timestamps when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('orderStatus')) {
        if (this.orderStatus === 'Delivered' && !this.deliveredAt) {
            this.deliveredAt = new Date();
        }
        if (this.orderStatus === 'Cancelled' && !this.cancelledAt) {
            this.cancelledAt = new Date();
        }
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);