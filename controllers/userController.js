import User from "../models/user.js";
import bcrypt from "bcrypt";

async function createUser(req,res) {
    try{
        console.log("REQ BODY:", req.body);
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

        res.json({
            message: "User created successfully"
        })

        console.log("User created")


    }catch (err) {
        res.json({
            message : "Error Creating User"
        })

        console.log(err)

    };
    
}

export {createUser};