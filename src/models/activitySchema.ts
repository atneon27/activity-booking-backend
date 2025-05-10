import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    eventTime: {
        type: Date,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const Activity = mongoose.model("Activity", activitySchema);