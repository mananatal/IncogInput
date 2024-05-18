import { User as AuthUser,getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";




export async function DELETE({params}:{params:{messageId:string}}){
    dbConnect();
    const session=await getServerSession(authOptions);
    const user:AuthUser=session?.user ;

    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"Unauthorized Access"
        },{status:403})
    }    

    const userId=user?._id;
    const {messageId}=params;

    try {

        const user=await User.findById(userId);

        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404});
        }

        const deletedMessage=await User.updateOne(
                        {_id:userId},
                        {
                            $pull:{
                                messages:{
                                    _id:messageId
                                }
                            }
                        },
                        {new:true}
        );

        if(deletedMessage.modifiedCount===0){
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Message Deleted Successfully",            
        },{status:200})

    } catch (error) {
        console.error("Error While Deleting message: ",error);
        return Response.json({
            success:false,
            message:"Error While Deleting Message"
        },{status:500})
    }
}