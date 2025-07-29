import z from 'zod';



export const signUpSchema = z.object({
    email:z.string().min(1,{message:"email required"}).email({message:"enter valid email"}).nonempty(),
    password:z.string().min(8,{message:"at least 8 chars"}),
    passwordConfirmation : z.string().min(8,{message:"at least 8 chars"}),

}).refine((data)=>data.password==data.passwordConfirmation , {
    message  : "Non Matching Passwords",
    // where to put the error of this predicate  ? 
    path : ['password','passwordConfirmation']
});


// .refine sets the predicats to be calced






