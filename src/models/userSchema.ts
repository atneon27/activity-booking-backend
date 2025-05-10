import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const User = mongoose.model("User", userSchema);

