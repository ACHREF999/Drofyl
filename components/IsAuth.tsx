'use client'
import React from 'react'
import {useUser} from '@clerk/nextjs';
import {useRouter} from 'next/navigation';
import { LoaderCircle } from 'lucide-react';


function IsAuth({children}:{children:React.ReactNode}) {
    const router = useRouter()
    const {user,isSignedIn,isLoaded} = useUser()
    if(!isLoaded){
        return (
            <LoaderCircle className="motion-safe:animate-spin self-center place-self-center justify-self-center"/>
        )
    }
    if (isLoaded && !isSignedIn) {
        router.push('/sign-in')
    }
    return (
        <>
            {children}
        </>
    )
}

export default IsAuth