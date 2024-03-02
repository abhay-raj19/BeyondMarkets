import { NextFunction, Request,Response } from "express";
import {hashSync,compareSync} from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { prisma } from "..";


export const signup = async(req:Request,res:Response,next:NextFunction)=>{
    try {
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
            });
            }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const login = async(req:Request,res:Response)=>{
    try {
        const {email,password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email:email,
            },
        })
        if(!user){
            res.status(404).json({
                error: "User not found. Please check your credentials.",
            })
            throw Error('User Does Not Exist!')
        
        }
        if(!compareSync(password,user.password)){
            res.status(401).json({
                error:"Opps! Incorrect Password"
            })
        }
        const token = jwt.sign({userId:user.id},JWT_SECRET);
        res.json({
            message:"User Login Successfully!",
            userInfo:user,
            token:token,
        })

    } catch (error) {
        console.error(error);
    }
}