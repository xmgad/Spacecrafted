import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    plan: {
        type: String,
        enum: ['Premium Monthly', 'Premium Pay-as-you-go'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => Date.now() + 30 * 24 * 60 * 60 * 1000
    },

    numStagings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

subscriptionSchema.methods.canChangePlan = function () {
    // Check if today's date is after or on the endDate
    return new Date() >= this.endDate;
};

export default mongoose.model('Subscription', subscriptionSchema);
