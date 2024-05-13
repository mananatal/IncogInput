import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/models/User.model";


export async function POST(request:Request){
    dbConnect();
    try {
        const {username,content}=await request.json();

        const result=messageSchema.safeParse({content});

        if(!result.success){
            const contentErrors=result.error.format().Content?._errors|| [];
            return  Response.json({
                success:false,
                message:contentErrors.length>0?contentErrors.join(', '):"Error in validating content"
            },{status:400})
        }

        const user=await User.findOne({username});

        if(!user) {
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting messages"
            },{status:400});
        }
        
        const feedback={
            content,
            createdAt:new Date()
        }

        user.messages.push(feedback as Message);        
        await user.save(); 

        return Response.json({
            success:false,
            message:"Message sent successfully"
        },{status:201});

    } catch (error) {
        console.error("Error while sending User messages ",error);
        return Response.json({
            success:false,
            message:"Error while sending User messages"
        },{status:500})
    }
}