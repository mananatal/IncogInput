import {z} from "zod";

export const usernameValidation=z.string()
                        .min(2,{message:"Username Must be of Atleast 2 Charactors"})
                        .max(20,{message:"UserName must be of atmost 20 charactors"})
                        .regex(/^[a-zA-Z0-9_]+$/,{message:"Username must not contain special characters"});


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email Address"}),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters"}),
});