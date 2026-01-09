
// import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// const myDB = client.db("olxClone");
// const Users = myDB.collection("users");


import { User } from '../model/User.js';

export const register =async (req, res)=>{
    console.log(req.body);
    
        if(!req.body.fullName  || !req.body.phone || !req.body.password || !req.body.email){
            
              return res.status(400).send({
                  message:"please fill out complete form",
                status: 0
                })
        
          }
        else{
            const userEmail=req.body.email.toLowerCase();
    
            const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    
            const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    
    if(userEmail.match(emailFormat) && req.body.password.match(passwordValidation)){
    
        const checkUser = await User.findOne({email: userEmail})
    
        if(checkUser){
                            return res.status(409).send({
                  message:"Email already exist",
                status: 0
                })
        }
        else{
    
           const hashedPassword = await bcrypt.hashSync(req.body.password)
            const user={

                fullName: req.body.fullName,
                email: userEmail,
                phone: req.body.phone,
                city: req.body.city,
                password: hashedPassword,

            }
            
            
            const response=  await User.create(user);
            if(response){
                return res.status(201).send({
                  message:"User registeration successfully",
                status: 1
                })
            }
            else{
                return res.status(500).send({
                  message:"Something went wrong",
                status: 0
                })
            }
        }
            }else{
                return res.status(400).send({
                  message:"invalid email or password",
                status: 0
                })
              }
        }
    
}

export const login = async (req, res)=>{

    console.log(req.body);
    

     if( !req.body.password || !req.body.email){
 return res.status(400).send({
        status : 0,
        message : "Email or Password is required"
      })
    }

        const email=req.body.email.toLowerCase()
        const emailFormat = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        if(!email.match(emailFormat)){
      return res.status(400).send({
        status : 0,
        message : "Email is Invalid"
      })
    }
        const user = await User.findOne({email: email}).select("+password")
        // console.log(user);
        
        if(!user){
              return res.status(400).send({
        status : 0,
        message : "Email is not registered!"
      })
        }
   const matchPassword = await bcrypt.compareSync(req.body.password, user.password)
    if(!matchPassword){
      return res.status(401).send({
        status : 0,
        message : "Email or Password is incorrect"
      })
    }
    const token= await jwt.sign({
        _id: user._id,
        email,
        fullName:user.fullName,
    }, process.env.SECRET, {expiresIn: "24h"})
     res.cookie("token", token,{
      httpOnly:true,
      secure: true,
      sameSite: "none"
    })
return res.status(200).send({
    status : 1,
      message : "Login Successful"

})

    
}


export const authMe=async (req, res)=>{
   try{
        const token = req.cookies?.token
        if(!token){
            return res.status(401).send({
                status: 0,
                message : 'Unauthorized'
            })
        }else{


         jwt.verify(token, process.env.SECRET,async (err, decoded)=>{


              if (err) {

    if (err.name === "TokenExpiredError") {

      return res.status(401).send({
        status:0,
        message:"Token expired"
      })

    } else {

            return res.status(401).send({
        status:0,
        message:"Invalid token"
      })
    }
    
  } else {


      const checkUser = await User.findOne({ _id: decoded._id}).select({password:0, updatedAt:0, createdAt:0});
    return res.status(200).send({
                status: 1,
                user : checkUser
            })
  }
          });
          
            
        }

    }catch(error){
        return res.status(500).send({
            status: 0,
            error: error,
            message: "Something Went Wrong"
        })
    }
}

export const logOut=(req, res)=>{
   try{
        const token = req.cookies?.token
        if(!token){
            return res.status(401).send({
                status: 0,
                message : 'Unauthorized'
            })
        }else{
            let decoded = jwt.verify(token, process.env.SECRET);
            if(decoded){
                res.clearCookie('token',{
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                })
                return res.status(200).send({
                status: 1,
                message: "logout successfully"
            })
            }
        }
    }catch(error){
        return res.send({
            status: 0,
            error: error,
            message: "Something Went Wrong"
        })
    }
}