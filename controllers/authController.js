import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Registration

async function createUser(req,res) {
    try{
        console.log("REQ BODY:", req.body);   // Log the incoming request body for debugging

        const passwordHash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User(
            {
                email : req.body.email,
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                password : passwordHash
            }
        );

        await newUser.save()

        res.status(201).json({
            message: "User created successfully"
        })

        console.log("User created")


    }catch (err) {
        res.status(500).json({
            message : "Error Creating User"
        })

        console.log(err)

    };
    
}

// User Login

async function loginUser(req, res) {

    try{
        const user = await User.findOne({ 
            email: req.body.email 
        });

    
        console.log(user);

        if(user == null){
            res.status(404).json({
                message: "User not found"
                
            })
        }else{
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
            if(isPasswordCorrect){

                const payload = {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isEmailVerified: user.isEmailVerified,
                    Image: user.image
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET,
                    {   //48 hours
                        expiresIn: "48h"
                    }
                );

                res.status(200).json({
                    message: "User logged in successfully",
                    token: token
                })

                console.log("User logged in successfully");
                


            }else{
                res.status(401).json({
                    message: "Invalid password"
                })
            }
        }


    }catch (error) {
        res.status(500).json(
            {
                message: "Error logging in user",
            }
        )
    }
}

export { createUser, loginUser };