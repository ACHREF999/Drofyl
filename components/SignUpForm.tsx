"use client"


import {useForm} from 'react-hook-form';
import {useSignUp} from '@clerk/nextjs'
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {signUpSchema} from '@/zod_schema/signUpSchema'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Card,CardHeader,CardBody,Divider,Input,Button, CardFooter} from '@heroui/react';
import {Mail,Lock,EyeOff,Eye,CheckCircle} from 'lucide-react'

export default function SignUpForm(){

    const router = useRouter()
    const {signUp , isLoaded  , setActive } = useSignUp()
    const [isVerifying , setIsVerifying] = useState(false)
    const [isSubmitting , setIsSubmitting] = useState(false)
    const [authError , setAuthError] = useState<any >(null)
    const [verificationError,setVerificationError] = useState(null)
    const [OTPCode,setOTPCode] = useState("")
    const [email,setEmail] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    console.log(authError)
    const {
        register , 
        handleSubmit,
        watch,
        formState:{errors},
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver : zodResolver(signUpSchema),
        defaultValues : {
            email : "",
            password: "",
            passwordConfirmation : ""
        }
    })


    // the submit handler for the User Infomration sign up
    const onSubmit = async (data : z.infer<typeof signUpSchema>) =>{

        console.log('isLoaded: ',isLoaded)
        
        if (!isLoaded) return;
        setIsSubmitting(true);
        setAuthError(null);
        console.log('submitting')
        try {
            // creating a user
            await signUp.create({
                emailAddress: data.email,
                password : data.password
            })
            setEmail(data.email)
            await signUp.prepareEmailAddressVerification({
                strategy:"email_code"
            })
            setIsVerifying(true)
        }catch(e:any){
            // console.error(e)
            setAuthError(
                // e.errors?.[0]?.message 
                e.errors.map((item:any)=>item.message+' \n ') 
                || "an error occured"
            )
            
        }finally {
            setIsSubmitting(false)
        }



    }

    // the submit handler for OTP code
    const handleVerificationSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!isLoaded) return 
        setIsSubmitting(true)
        setAuthError(null)

        try { 
        const result  = await signUp.attemptEmailAddressVerification({
            code:OTPCode
        })

        console.log("ATTEMPT EM @ VERIFICATION  RESULT : ", result)
        if (result.status = "complete"){
            // setActive is if we want to create a session now (after verification)
            await setActive({
                session : result.createdSessionId
            })

            router.push('/dashboard')
        }
        else { 
            console.log("Result Status is : ",result.status)
        }
        }catch(e:any){
            console.error("Verification Failed")
            setVerificationError(e.errors?.[0]?.message|| "Verification Error")
            
        }finally{
            setIsSubmitting(false)
        }
    }


    if(isVerifying){
        return (
            <>
            <Card className="text-white w-[80%] max-w-[720px] self-center shadow-xl p-6 border-gray-300 border-solid border-1 rounded-sm">
                <CardHeader className="flex flex-col gap-1 items-start pb-2">
                    <h1 className="text-2xl font-bold text-default-900">Verify Your Email</h1>
                    <p className="text-lg text-gray-200">An OTP code was sent to {' '}
                        <span className="text-white text-sm font-semibold">
                            {email} 
                        </span>
                    </p>
                </CardHeader>
                <Divider className="my-4"/>
                <CardBody>
                    {verificationError && (
                        <div className="bg-danger-50 text-danger-700">{verificationError}</div>
                    )}
                    
                    <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-2"> 
                        <div> 
                            <label htmlFor="OTPCode">
                                Verification Code
                            </label>
                            <input
                                id="OTPCode"
                                type="text"
                                placeholder="Enter 6-digit OTP Code"
                                value={OTPCode}
                                onChange={e=>setOTPCode(e.target.value)}
                                autoFocus
                                className="w-full focus:outline-none py-1"
                                />
                        </div>
                        <Divider className={( verificationError ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                        <Button
                        type="submit"
                        color="primary"
                        className="w-full bg-teal-500/5 rounded-md hover:bg-teal-500/10 text-lg hover:shadow-md shadow-white/5 my-2"
                        isLoading={isSubmitting}
                        >
                            {isSubmitting?"Verifiying .. ":" Verify Email"}

                        </Button>
                    </form>




                </CardBody>
                    {/* No OTP Code Recieved */}
                    <CardFooter className="flex justify-center py-4">
                        <p className="text-sm text-default-600">
                            Didn't recieve OTP code ?{" "}
                            <button 
                                onClick= {async()=>{
                                    if(signUp) {
                                        await signUp.prepareEmailAddressVerification({
                                            strategy:"email_code",
                                        });
                                    }
                                }}
                                className="text-white hover:underline font-medium cursor-pointer"
                            >
                                Resend Code
                            </button>
                        </p>
                    
                    </CardFooter>
                    
            </Card>
            </>
        )
    }



    return (
        <>
        <Card className="text-white w-[80%] shadow-xl p-6 border-gray-300 border-solid border-1 rounded-sm"> 
            <CardHeader className="flex flex-col items-start space-y-4">
                <h1 className="text-2xl">Create Your Account </h1 > 
                
                {errors?.email?.message ? 
                (
                    <span className="text-red-600/90 text-sm font-thin ">
                        Email : {errors.email.message}
                    </span>
                ):
                null}
                <div id="clerk-captcha" >
                    {/* CAPTCHA placeholder */}
                </div>
                {errors?.password?.message ? 
                (
                    <span className="text-red-600/90 text-sm font-thin ">
                        Password : {errors.password.message}
                    </span>
                ):
                null}
                {errors?.passwordConfirmation?.message ? 
                (
                    <span className="text-red-600/90 text-sm font-thin ">
                        Password Confirmation : {errors.passwordConfirmation.message}
                    </span>
                ):
                null}
            </CardHeader>

            <Divider className="py-2" />
            
            <CardBody>
                {authError && (
                    <div className="text-danger-700 bg-danger-50 p-4 flex">
                        <p>{authError.map((message:string)=>(<span className="text-red-700/80 text-sm block "> - {message}</span>))}</p>
                    </div>
                )}
                {/* the use form is like a wraper that bridges data collection from the form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 flex flex-col gap-6 ">
                    <div className="space-y-2">
                        
                        <label 
                        htmlFor="email"
                        className={(errors.email  ? ` text-red-400` : ` text-gray-300/ `)+` text-sm flex gap-1  font-medium `}
                        >
                            <Mail className="h-4 w-4 text-defult-500"/> 
                            <span>
                                Email
                            </span>
                        </label>
                        <input
                        id="email"
                        type="email"
                        placeholder="youremail@example.com"
                        {...register("email")}
                        // isInvalid={!!errors.email}
                        // errorMessage={errors.email?.message}
                        className="w-full focus:outline-none p-1"

                        />
                        <Divider className={((errors.email || authError) ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                    </div>

                    <div className="space-y-2">
                        <label 
                            htmlFor="password"
                            className={(errors.password ? ` text-red-400` : ` text-gray-300/ `)+` text-sm flex gap-1  font-medium `}
                        >
                            <Lock className="h-4 w-4  "/>
                            Password
                        </label>
                        <div className="w-full flex justify-between ">
                            
                        <input 
                                id="password"
                                type={showPassword ? "text":"password"}
                                // isInvalid={!!errors.password}
                                // errorMessage={errors.password?.message}
                                {...register('password')}
                                className="grow flex focus:outline-none p-1 h-6"

                            />
                            <Button
                                type="button"
                                isIconOnly
                                size='sm'
                                variant="light"
                                onClick={()=>setShowPassword(!showPassword)}
                                className={`self-end`}
                                >
                                        {showPassword ? 
                                        <EyeOff className="h-6 w-6 text-gray-300 hover:text-gray-100" /> 
                                        :
                                        <Eye className="h-6 w-6 text-gray-300 hover:text-gray-100"/>}

                                </Button>
                        </div>
                        
                    <Divider className={((errors.password || authError) ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                    </div>
                    


                    <div className="space-y-2">
                        <label 
                            htmlFor="passwordConfirmation"
                            className={(errors.passwordConfirmation ? ` text-red-400` : ` text-gray-300/ `)+` text-sm flex gap-1  font-medium `}
                        >
                            <Lock className="h-4 w-4  "/>
                            Password Confirmation
                        </label>
                    <div className="w-full flex justify-between ">
                            
                        <input 
                            id="passwordConfirmation"
                            type={showPassword ? "text":"password"}
                            // isInvalid={!!errors.password}
                            // errorMessage={errors.password?.message}
                            {...register('passwordConfirmation')}
                            className="grow flex focus:outline-none p-1 h-6"

                        />
                        <Button
                                    type="button"
                                    isIconOnly
                                    size='sm'
                                    variant="light"
                                    onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 
                                    <EyeOff className="h-6 w-6 text-gray-300 hover:text-gray-100" /> 
                                    :
                                    <Eye className="h-6 w-6 text-gray-300 hover:text-gray-100"/>}

                            </Button>
                        </div>
                        
                    <Divider className={( (errors.passwordConfirmation || authError) ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                    </div>
                    <div>
                        <div className="w-full flex items-center gap-4 font-thin">
                            <CheckCircle className="text-green-400 "/>
                            <p className="text-sm text-gray-300">By signing up , you agree to our terms of Service an Privacy Policy</p>
                        </div>
                    </div>


                    <Button
                    type="submit"
                    color="primary"
                    className="w-full bg-teal-500/5 rounded-md hover:bg-teal-500/10 text-lg hover:shadow-md shadow-white/5 py-1"
                    isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Creating Account ..." : "Create Account"}

                    </Button>


                </form>

            </CardBody>
        </Card>
        
        </>
    )

}


