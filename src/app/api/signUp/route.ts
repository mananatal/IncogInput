import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import bcrypt from "bcrypt";

export async function POST(request:Request){
    await dbConnect();

    try {
        const {username,email,password}=await request.json();

        if(!username || !email || !password){
            return Response.json({
                success:false,
                message:"Some fields are missing"
            },{status:400})
        }

        const existingUserVerifiedByUsername=await User.findOne({username,isVerified:true});
        const verifyCode=Math.floor(100000+Math.random()*800000).toString();


        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"User already exists with same username"
            },{status:400})
        }

        const existingUserByEmail=await User.findOne({email});

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already Registered with this email"
                },{status:500});
            }else{
                const hashedPassword=await bcrypt.hash(password,10);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                await existingUserByEmail.save();
            }   
        }else{
            const hashedPassword=await bcrypt.hash(password,10);
            const verifyCodeExpiry=new Date(Date.now()+3600000);
            // const verifyCodeExpiry = new Date();
            // verifyCodeExpiry.setHours(expiryDate.getHours() + 1);

            const newUser=new User({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save();
        }

        //send Verification mail
        const mailResponse=await sendVerificationEmail(username,email,verifyCode);

        if(!mailResponse.success){
            return Response.json({
                success:false,
                message:mailResponse.message
            },{status:500});
        }

        return Response.json({
            success:true,
            message:"User Registered successfully, Please Verify"
        },{status:500});

    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
        {
            success: false,
            message: 'Error registering user',
        },
        { status: 500 }
        );
    }
}