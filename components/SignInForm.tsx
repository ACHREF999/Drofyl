'use client'
import {signInSchema} from '@/zod_schema/signInSchema'
import {useForm} from 'react-hook-form'
import {useRouter} from 'next/navigation'
import {useSignIn} from '@clerk/nextjs'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import Link from 'next/link'


import {Card, CardHeader,CardBody,CardFooter,Divider,Input,Button} from '@heroui/react';
import {Mail,Lock,Eye,EyeOff} from 'lucide-react';


export default function SignInForm() {

    const router  = useRouter()
    const {signIn, isLoaded, setActive} = useSignIn()
    const [authError,setAuthError] = useState<string | null >(null)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [showPassword , setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState : {errors}
    } = useForm({
        resolver : zodResolver(signInSchema),
        defaultValues:{
            email:"",
            password: ""
        }
    })

    const onSubmit = async (data:z.infer<typeof signInSchema>) =>{

    if (!isLoaded) return ;

    setIsSubmitting(true)
    setAuthError(null)

    try{
        const result = await signIn.create({
            identifier:data.email,
            password:data.password
        })

        if(result.status =='complete'){
            await setActive({
                session : result.createdSessionId
            })
            router.push('/dashboard')
        }else{
            setAuthError("Result Status Error")
        }

    }catch(e:any){
        setAuthError(e.errors?.[0]?.message || `An error Occured : ${e}`)
    }finally{
        setIsSubmitting(false)
    }

    }

    return (
        <Card className="bg-default-50 w-full max-w-md border border-default-200">

            <CardHeader className="flex flex-col gap-1 items-center pb-2">

                <h1 className="text-2xl font-bold text-default-900">Welcome Back</h1>
                <p className="text-default-500 text-center"> Sign in to access your secure cloud storage</p>
            </CardHeader> 
            <Divider />
            <CardBody className="py-6">
                {authError && (
                    <div className="bg-danger-50 text-danger-700 p-4 mb-6 flex items-center gap-2">
                        <p>{authError}</p>
                    </div>
                    )
                }
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        
                        <label 
                        htmlFor="email"
                        className={(errors.email ? ` text-red-400` : ` text-gray-300/ `)+` text-sm flex gap-1  font-medium `}
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
                        <Divider className={(errors.email ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                    </div>

                    <div className="space-y-2">
                        <label 
                            htmlFor="password"
                            className={(errors.password ? ` text-red-400` : ` text-gray-300/ `)+` text-sm flex gap-1  font-medium `}
                        >
                            <Lock className="h-4 w-4  "/>
                            Password
                        </label>
                        <div className="w-full flex ">
                            
                        <input 
                            id="password"
                            type={showPassword ? "text":"password"}
                            // isInvalid={!!errors.password}
                            // errorMessage={errors.password?.message}
                            {...register('password')}
                            className="w-[90%] flex focus:outline-none p-1 h-6"

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
                        
                    <Divider className={(errors.password ? ` text-red-400/80` : ` text-gray-500/50 `)+`  `}/>
                    </div>
                    
                    <Button 
                        type="submit"
                        color="primary"
                        className="w-full bg-teal-500/5 rounded-md hover:bg-teal-500/10 text-lg hover:shadow-md shadow-white/5"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting?"Signing In ..." : "Sign In " }
                    </Button>

                </form>

            </CardBody>
            <Divider />

            <CardFooter className="flex justify-center py-4">
                <p className="text-sm text-default-600">
                    Don't have an account ? {" "}
                    <Link
                        href = "/sign-up"
                        className="text-primary hover:underline font-medium"
                    >Sign Up</Link>
                </p>

            </CardFooter>
        </Card>
    )
}
