import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress:{
address:{
    type:String,
    default:null
},
city:{
    type:String,
    default:null
}
  },
  paymentStatus:{
    type: String,
    default:"Pending"
  },
  orderStatus: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });



export const Order = mongoose.model("Order", orderSchema);