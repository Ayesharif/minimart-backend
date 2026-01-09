import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false,
        trim: true,
        default: null

    },

    city: {
        type: String,
        required: false,
        trim: true,
        default: null

    },
    email: {
        type: String,
        required: false,
        trim: true,
        default: null,
        lowercase: true,
    },
    password: {
        type: String,
        required: false,
        trim: true,
        default: null,
        select: false
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },


},{ timestamps: true });

export const User = mongoose.model('User', userSchema);