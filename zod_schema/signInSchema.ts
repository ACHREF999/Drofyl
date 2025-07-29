import z from 'zod';




export const signInSchema = z.object({
    email : z.string().email({message:"Enter valid email"}), 
    password : z.string().min(8,{message:"at least 8 chars "}), 


})
