
import { Order } from "../model/Order.js";
import { Product } from "../model/Product.js";
import { User } from "../model/User.js";
import bcrypt from "bcryptjs";
export const updateUser= async(req, res)=>{
  
  try{
    
    const    userId =req.user._id;
    console.log(userId);
    
    const updateData = { ...req.body };
   console.log(updateData);
   
    const StoredUser = await User.findOne({ _id: userId});
    

    if (!StoredUser) {
      return res.status(500).send({
        status: 0,
        message: "User Not Found"
        })
      }   

// if (req.file) {
//   //console.log(updateData);
  
//   // 🗑️ Delete the old image from Cloudinary (if it exists)
//   if (updateData.imageId) {
//     await deleteImage(updateData.imageId);
//  delete updateData.imageId;
//   }


//   // 🌩️ Save the new image info
//   updateData.image = {
//     image: req.file.path, // Cloudinary hosted URL
//     publicId: req.file.filename, // Cloudinary public_id (used for deleting later)
//   };
// }
    
const userUpdate = await User.updateOne({ _id: userId }, {$set:updateData});



    if (userUpdate.modifiedCount > 0) {

      return res.status(200).send({
        status: 1,
        message: "user updated successfully",

      });
    } else {
      return res.status(200).send({
        status: 1,
        message: "No changes made to profile",
      });
    }
  }catch(error){console.log(error.message);
  

   return res.status(500).send({
    message: error.message,
    status: 0
  }) 
  }

}
export const updatePassword= async(req, res)=>{
  
  try{
                const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const    userId =req.user._id;
    console.log(userId);
    
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
   console.log(oldPassword);
   
   if(!newPassword.match(passwordValidation)){
          return res.status(400).send({
        status: 0,
        message: "Weak Password"
        })
   }
   if(newPassword !== confirmNewPassword){
       return res.status(400).send({
        status: 0,
        message: "Password do not match"
        })
   }
    const StoredUser = await User.findOne({ _id: userId});
    

    if (!StoredUser) {
      return res.status(500).send({
        status: 0,
        message: "User Not Found"
        })
      }   
        const user = await User.findOne({_id:StoredUser._id}).select("+password")
        // console.log(user);
        
        if(!user){
              return res.status(400).send({ 
        status : 0,
        message : "Email is not registered!"
      })
        }
   const matchPassword = await bcrypt.compareSync(oldPassword, user.password)
    if(!matchPassword){
      return res.status(401).send({
        status : 0,
        message : "Email or Password is incorrect"
      })
    }

               const hashedPassword = await bcrypt.hashSync(newPassword)
const userUpdate = await User.updateOne({ _id: userId }, {$set:{password:hashedPassword}});



    if (userUpdate.modifiedCount > 0) {

      return res.status(200).send({
        status: 1,
        message: "user updated successfully",

      });
    } else {
      return res.status(200).send({
        status: 1,
        message: "No changes made to profile",
      });
    }
  }catch(error){console.log(error.message);
  

   return res.status(500).send({
    message: error.message,
    status: 0
  }) 
  }

}
export const placeOrder = async (req, res) => {
  try {
    const { userId, totalAmount, deliveryAddress } = req.body;
let items = req.body.items;
if (typeof items === "string") {
  items = JSON.parse(items);
}
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to order." });
    }


    // Optional: fetch products from DB to get current price (better than trusting client)
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item._id);
        if (!product) {
          throw new Error(`Product not found: ${item._id}`);
        }

        

        return {
          product: product._id,
          // title: product.title,
          // price: product.price,
          quantity: item.quantity
        };
      })
    );

    // Create the order
    const order = {
      orderBy: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentStatus:"Paid",
      
    };

    // await order.save();
    const response = await Order.create(order);

    if (!response) {
      return res.status(404).send({
        status: 0,
        message: "order failed",
      });
    }

    res.status(201).json({
      status: 1,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }

};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id
    const response = await Order.find({orderBy:userId} ).populate("items.product");
      // .select("_id title images price description"); // projection

    if (!response || response.length === 0) {
      return res.status(404).send({
        status: 0,
        message: "order not found"
      });
    }

    return res.status(200).send({
      status: 1,
      order: response
    });

  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: error.message
    });
  }
};