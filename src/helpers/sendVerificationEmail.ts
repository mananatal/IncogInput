import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(username:string,email:string,otp:string):Promise<ApiResponse>{
    try {
          await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Hello world',
            react: VerificationEmail({username,otp}),
          });

          return {
            success:true,
            message:"Verification Email send successfully"
          }
    } catch (error) {
        console.error("ERROR WHILE SENDING VERIFICATION EMAIL: ",error);
        return {
            success:false,
            message:"Failed to send verification email"
        }
    }
}

