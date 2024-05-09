import {z} from "zod";

export const usernameValidation=z.string()
                        .min(2,{message:"UserName must be of atlest 2 chatactors"})
                        .max(20,{message:"UserName must be of atmost 20 charactors"})
                        .regex(/^[a-zA-Z0-9_]+$/,{message:"Username must not contain special characters"});


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid Email Address"}),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters"}),
});