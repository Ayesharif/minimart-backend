import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: false, trim: true, default: null },
        description: { type: String, required: false, trim: true, default: null },
        price: { type: Number, required: false, default: null },
        quantity: { type: Number, required: false, default: null },



       images: [{
      imageUrl: { type: String, required: false, default:null },     // Cloudinary URL
      publicId: { type: String, required: false, default: null },  // Cloudinary public ID
    }],


    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);