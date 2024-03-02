import { Request,Response } from "express";
import { PrismaClient } from '@prisma/client'
import {hashSync} from 'bcrypt';


const prisma = new PrismaClient()

export const signup = async(req:Request,res:Response)=>{
    try {
        const {name,email,password} = req.body;
        const user = await prisma.user.findUnique({
            where:{
                email:email,
            },
        })
        if(user){
            res.status(409).json({
                message:"User exists,Try Login!"
            })
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