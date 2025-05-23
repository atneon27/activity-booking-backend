import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    } 
});

export const Booking = mongoose.model("Booking", bookingSchema);