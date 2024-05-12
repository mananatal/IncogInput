import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",

            credentials: {
                email: { label: "Username", type: "text", placeholder: "Please Enter your email here" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials:any):Promise<any> {
                dbConnect();
                
                try {
                    const user=await User.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    });
                    if(!user){
                        throw new Error("User not registered, Please register first");
                    }
                    if(!user.isVerified){
                        throw new Error("User not verified, Please Verify your Account before login");
                    }
                    if(!bcrypt.compare(credentials.password,user.password)){
                        throw new Error("Password doesn't match. Please enter correct password");
                    }

                    return user;
                } catch (error:any) {
                    throw new Error(error)                    
                }              
            }
        })
    ],
    pages:{
        signIn: '/signin',
    },
    callbacks:{
        async session({ session,token }) {
            if(token){
                session.user._id=token._id
                session.user.isVerified=token.isVerified
                session.user.isAcceptingMessages,
                session.user.username=token.username
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id=user._id.toString()
                token.username=user.username,
                token.isAcceptingMessages=user.isAcceptingMessages
                token.isVerified=user.isVerified
            }
            return token
        }
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}