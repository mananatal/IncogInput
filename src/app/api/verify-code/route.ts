import dbConnect from "@/lib/dbConnect";
import {z} from "zod";
import User from "@/models/User.model";
import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code}=await request.json();

        // const decodedUsername = decodeURIComponent(username);

        const result=verifySchema.safeParse({code});

        if(!result.success){
            const verifyCodeErrors=result.error.format().code?._errors || [];
            return  Response.json({
                success:false,
                message:verifyCodeErrors.length>0?verifyCodeErrors.join(', '):"Error in validating code"
            },{status:400})
        }

        const user=await User.findOne({username});
        
        if (!user) {
            return  Response.json({
                success:false,
                message:"User Not Found"
            },{status:404})
        }

        const isCodeValid=user.verifyCode===code;
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true;
            await user.save();

            return  Response.json({
                success:true,
                message:"User Verified Successfully"
            },{status:200})
        }else if(!isCodeValid){
            return  Response.json({
                success:false,
                message:"Verify Code doesnt match"
            },{status:400})
        }else{
            return  Response.json({
                success:false,
                message:"Verify Code Expires, Please SignUp again to get New Code"
            },{status:400})
        }

    } catch (error) {
        console.error("Error while verifying the code: ",error);
        return Response.json({
            success:false,
            message:"Error while verifying the code"
        },{status:400}); 
    }
}