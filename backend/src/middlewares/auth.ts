import { NextFunction,Request,Response } from "express";
import { UnauthorisedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prisma } from "..";
const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {

    const token = req.headers.Authorization;
    if(!token){
        next(new UnauthorisedException('Unauthorised',ErrorCode.UNAUTHORISED));
    }
    try {
        const payload = jwt.verify(token as string, JWT_SECRET) as any
        const user = await prisma.user.findFirst({
            where:{
                id:payload.userId                                       
            }
        })
        if(!user){
            next(new UnauthorisedException('Unauthorised',ErrorCode.UNAUTHORISED))
        }
        req.user = user
        next()
        
    } catch (error) {
        next(new UnauthorisedException('Unauthorised',ErrorCode.UNAUTHORISED));
    }
    
}

export default authMiddleware;

