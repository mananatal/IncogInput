import {z} from "zod";

export const messageSchema=z.object({
    Content:z.string()
                .min(10,{message:"COntent must be of atleast 10 charactors"})
                .max(350,{message:"content must be of atmost 300 charactors"})
});