import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { User as AuthUser,getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";



export async function POST(request:Request){
    dbConnect();

    const session=await getServerSession(authOptions);
    const user:AuthUser=session?.user ;

    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"Unauthirized Access"
        },{status:403})
    }    

    const userId=user?._id;

    try {
        const {acceptMessages}=await request.json();

        const result=AcceptMessageSchema.safeParse({acceptMessages});
        if(!result.success){
            const acceptMessagesError=result.error.format().acceptMessages?._errors || [];
            return Response.json({
                success:false,
                message:acceptMessagesError.length>0?acceptMessagesError.join(', '):"Invalid fotmat for accept message schema"
            },{status:400});
        }

        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage:acceptMessages
            },
            {new:true}
        );

        if(!updatedUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            message:"Accept Messages Status Toggled Successfully",
            isAcceptingMessages:updatedUser.isAcceptingMessage            
        },{status:200})

    } catch (error:any) {
        console.error("Error while toggling user isAccepting Messages status",error);
        return Response.json({
            success:false,
            message:"Error while toggling user isAccepting Messages status",
            error:error.message
        },{status:500})
    }
}


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

    const userId=user?._id;

    try {
        const user=await User.findById(userId);
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        return Response.json({
            success:true,
            isAcceptingMessages:user.isAcceptingMessage,
        },{status:200})

    } catch (error:any) {
        console.error("Error while getting user isAcceptingMessages Status",error);
        return Response.json({
            success:false,
            message:"Error while getting user isAcceptingMessages Status",
            error:error.message
        },{status:500})
    }
}