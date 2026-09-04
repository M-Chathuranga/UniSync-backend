import jwt from 'jsonwebtoken';
export default function authenticateUser(req,res,next){

        const header = req.header("Authorization");
        

        if(!header){

            return res.status(401).json(
                {
                    message: "Access denied. No token provided. Please log in or register."
                }
            );
        }    

            const token = header.replace("Bearer ","");
            // console.log(token);
            

            jwt.verify(token, process.env.JWT_SECRET, 
                (error, decoded) => {
                    
                    if (error || !decoded) {
                        res.status(401).json(
                            {
                            message: "Invalid token plz login again",
                            }
                        );
                    } else {
                        req.user = decoded;
                        next()
                    }
                }
            );

}   