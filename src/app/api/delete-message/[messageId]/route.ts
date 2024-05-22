import { User as AuthUser,getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request:Request,{params}:{params:{messageId:string}}){
    await dbConnect();
    const session=await getServerSession(authOptions);
    const user:AuthUser=session?.user ;

    if(!session || !session?.user){
        return Response.json({
            success:false,
            message:"Unauthorized Access"
        },{status:403})
    }    

    const userId=user?._id;
    const messageId=params.messageId;

    try {
        const user=await User.findOne({_id:userId});      

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
                message:"Feedback not found or already deleted"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Feedback Deleted Successfully",            
        },{status:200})

    } catch (error) {
        console.error("Error While Deleting Feedback: ",error);
        return Response.json({
            success:false,
            message:"Error While Deleting Feedback"
        },{status:500})
    }
}