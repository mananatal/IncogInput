import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from "zod";
import User from "@/models/User.model";

const usernameQuerySchema=z.object({
    username:usernameValidation
});

export async function GET(request:Request){
    dbConnect();
    try {
        const {searchParams}=new URL(request.url);
        const queryParams={
            username:searchParams.get('username')
        }

        const result=usernameQuerySchema.safeParse(queryParams);

        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || [];
            return  Response.json({
                success:false,
                message:usernameErrors.length>0?usernameErrors.join(', '):"Error in validating username,Invalid query parameters"
            },{status:400})
        }

        const {username}=result.data;

        const existingVerifiedUser=await User.findOne({username,isVerified:true});

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Username is Available"
        },{status:200}) 

    } catch (error) {
        console.error("Error while checking uniqueness of username: ",error);
        return Response.json({
            success:false,
            message:"Error while checking uniqueness of username:"
        },{status:500}) 
    }
}