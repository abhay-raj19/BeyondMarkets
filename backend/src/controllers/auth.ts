import { NextFunction, Request,Response } from "express";
import {hashSync,compareSync} from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "..";
import { UnprocessableEntity } from "../exceptions/validation";
import { signupSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";


export const signup = async(req:Request,res:Response,next:NextFunction)=>{
    signupSchema.parse(req.body);
        const {name,email,password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email:email,
            },
        })
        if(user){
            // res.status(409).json({
            //     message:"User exists,Try Login!"
            // })
            next(new BadRequestsException('User exists,Try Login!',ErrorCode.USER_ALREADY_EXISTS))
        }else{
            const newUser =await prisma.user.create({
                    data:{
                        name:name,
                        email:email,
                        password:hashSync(password,10)
                    }
            });
            // console.log(newUser);
            res.json({
                message:"New User Created Successfully!"
            })
    }
}


export const login = async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password} = req.body;
    const user = await prisma.user.findUnique({
        where:{
            email:email,
        },
    })
    if(!user){
        // res.status(404).json({
        //     error: "User not found. Please check your credentials.",
        // })
        throw new NotFoundException('User not found!',ErrorCode.USER_NOT_FOUND);
        
    
    }
    if(!compareSync(password,user.password)){
        // res.status(401).json({
        //     error:"Opps! Incorrect Password"
        // })
        throw new BadRequestsException("Opps! Incorrect Password",ErrorCode.INCORRECT_PASSWORD);
    }
    
    const token = jwt.sign({userId:user.id},JWT_SECRET);
    res.json({
        message:"User Login Successfully!",
        userInfo:user,
        token:token,
    })
    
}