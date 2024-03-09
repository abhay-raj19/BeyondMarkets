import { NextFunction,Request,Response } from "express";
import { UnauthorisedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JsonWebTokenError } from "jsonwebtoken";
const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {

    const token = req.headers.authorization
    if(!token){
        next(new UnauthorisedException('Unauthorised',ErrorCode.UNAUTHORISED))
    }
    
}

export default authMiddleware;