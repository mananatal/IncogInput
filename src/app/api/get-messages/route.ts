import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { User as AuthUser,getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request:Request){
    dbConnect();

    const session=await getServerSession(authOptions);
    const user:AuthUser=session?.user ;

    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"Unauthirized Access"
        },{status:403})
    }    

    const userId=new mongoose.Types.ObjectId(user?._id);

    try {
        const user=await User.aggregate([
            {
                $match:{_id:userId}
            },
            {
                $unwind:"$messages"
            },
            {
                $sort:{"messages.createdAt":-1}
            },
            {
                $group:{
                    _id:"$_id",
                    messages:{
                        $push:"$messages"
                    }
                }
            }
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json({
                success:false,
                message:"User Messages not found"
            },{status:404})
        }        
    
        return Response.json({
            success:true,
            messages: user[0].messages
        },{status:200});

    } catch (error) {
        console.error("Error while getting User messages ",error);
        return Response.json({
            success:false,
            message:"Error while getting User messages"
        },{status:500})
    }

}