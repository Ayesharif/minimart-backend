import { Product } from "../model/Product.js";

export const addProduct = async (req, res) => {
  try {
    // map uploaded files to paths
const imageData = req.files.map(file => ({
  imageUrl: file.path,       // Cloudinary URL
  publicId: file.filename,   // Cloudinary public_id
}));

    const product = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantiy,
      images: imageData,  
       // ✅ store image paths
      // createdAt: Date.now(),
      // updatedAt: Date.now(),
    };

    const response = await Product.create(product);

    if (!response) {
      return res.status(404).send({
        status: 0,
        message: "product not found",
      });
    }

    return res.status(200).send({
      status: 1,
      message: "product added successfully",
      data:product,
    });
  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: error.message,
    });
  }
};

export const getActiveProduct = async (req, res) => {
  try {
    const response = await Product.find( )
      .select("_id title images price description"); // projection

    if (!response || response.length === 0) {
      return res.status(404).send({
        status: 0,
        message: "Product not found"
      });
    }

    return res.status(200).send({
      status: 1,
      data: response
    });

  } catch (error) {
    return res.status(500).send({
      status: 0,
      message: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the main product
    const oneProduct = await Product.findOne(
      { _id: productId},
      {  title: 1, images: 1, price: 1, description: 1,  quantity: 1 }
    );

    if (!oneProduct) {
      return res.status(404).json({
        status: 0,
        message: "Product not found",
      });
    }
    return res.status(200).json({
        product: oneProduct

    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
};


export const updateProduct= async(req, res)=>{
  
  try{
    
    const    productId =req.params.id;
    console.log(productId);
    
    const updateData = { ...req.body };
   console.log(updateData);
   
    const StoredUser = await Product.findOne({ _id: productId});
    

    if (!StoredUser) {
      return res.status(500).send({
        status: 0,
        message: "Product Not Found"
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
    
const productUpdate = await Product.updateOne({ _id: productId }, {$set:updateData});



    if (productUpdate.modifiedCount > 0) {

      return res.status(200).send({
        status: 1,
        message: "Product updated successfully",

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