import jwt from "jsonwebtoken";

// function to generate a token from a user

export const generateToken = (userID)=> {

    const token = jwt.sign({userID}, process.env.JWT_SECTET)
    return token;

}