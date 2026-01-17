
import AuthRoutes from './routers/authRouter.js'
import productRoutes from './routers/productRouter.js'
import userRoutes from './routers/userRouter.js'

import express, { json } from 'express'

import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import cors from 'cors'
import { verifyToken } from './middleware/verifyToken.js'
import path from 'path'
import mongoose from "mongoose";
import Stripe from 'stripe'


dotenv.config()

   
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch((err) => console.log("DB Error:", err));

mongoose.connection.on("error", err => {

  console.log("err", err)

})
mongoose.connection.on("connected", (err, res) => {

  console.log("mongoose is connected")

})
  const app = express();
  const port = process.env.PORT;

  
  app.use(
  cors({
    origin: "https://minimart-five.vercel.app",
    credentials: true, // allow cookies, authorization headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // Allow the headers you are sending (like Content-Type)
    allowedHeaders: 'Content-Type,Authorization',
  })
);

  app.use(express.json());
  app.use(cookieParser());

  // This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static('public'));

const YOUR_DOMAIN = 'https://minimart-backend-nine.vercel.app';

app.post('/create-checkout-session', verifyToken, async (req, res) => {

  const {cart, totalAmount, deliveryAddress }=req.body;
  const userId=req.user._id;
  const data ={
    items: JSON.stringify(cart),
    userId,
    totalAmount,
    deliveryAddress,
  }
 try {
        // Convert your cart items to Stripe line items
        const line_items = cart.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image],
                },
                unit_amount: item.price * 100, // Stripe expects cents
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items,
          mode: 'payment',
          metadata: {
            userId: req.user._id.toString(),
            cart: JSON.stringify(cart),
          },
success_url: `https://minimart-five.vercel.app/success.html?orderData=${encodeURIComponent(JSON.stringify(data))}`,

          cancel_url: `${YOUR_DOMAIN}/cart.html`,
        });
        
        
        
        res.json({ url: session.url });
        // console.log(session);
        // if (stripe.checkout.session.succeede){
        //   console.log('done...');
          
        //  }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Stripe checkout session failed' });
    }
      // console.log(cart);
  
});


// app.listen(4242, () => console.log('Running on port 4242'));
  app.use(AuthRoutes);
  app.use(productRoutes);
  app.use(userRoutes);
  //console.log(process.env.SECRET);
  
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
//   app.use(verifyToken)
  
  

  
  
  
  app.listen(port, () => {
    console.log("Server running at http://localhost:3000");
  });
  