'use client'

import React, {useState} from 'react'
import {Divider, Button} from '@heroui/react';
import { useUser,useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import {Check, CircleX, Pen} from 'lucide-react';



function Profile() {
    const {user} = useUser()
    const [updateUserParams,setUpdateUserParams] = useState({
        username:user?.username,
        firstName:user?.firstName,
        lastName:user?.lastName,
    })
    const {signOut} = useClerk()
    
    const [isLoading,setIsLoading] = useState(false)

    const handleChange =  (e:React.ChangeEvent<HTMLInputElement>)=>{
        setUpdateUserParams({
            ...updateUserParams,
            [e.target.name]:e.target.value
        })

    }

    const handleSubmit = async ()=>{
        setIsLoading(true)
        try{

            console.log(updateUserParams)
            const updateData :{
                username:string|undefined,
                firstName:string|undefined,
                lastName:string|undefined,

            } = {firstName:undefined,lastName:undefined,username:undefined}
            if(updateUserParams.username ){
                updateData.username = updateUserParams.username
            }
            if(updateUserParams.firstName ){
                updateData.firstName = updateUserParams.firstName
            }
            if(updateUserParams.lastName ){
                updateData.lastName= updateUserParams.lastName
            }
            const response = await user?.update(updateData)
            console.log('User Update Response: ',response)
        }catch(err){
            console.log('err : ',err)

        }finally{
            setIsLoading(false)
        }

        

    }
    
    const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault()
        const file = e?.target?.files?.[0] || null 
        if(!file) return;
        try{

            setIsLoading(true)
            await user?.setProfileImage({file})
            // await user.updateUserProfileImage(file)
            await user?.reload()
            
        }catch(e){ 
            console.log(e)
        }finally{
            setIsLoading(false)
        }
    }
    const logout = ()=> {
        signOut({redirectUrl:'/'})
    }
    return (
    <div className=" w-full rounded-md h-[98%] border-1 border-gray-300 flex flex-col gap-4 p-3 text-white my-[2%] self-center">
        <h1 className=" text-2xl  text-white font-semibold py-2 ">
            Profile
        </h1>
        <Divider />
        <div className="flex flex-row gap-4 hover:bg-[#121212]/35 w-full min-w-[270px] rounded-xl px-2 cursor-default py-1">
            <label className="w-24 h-24 rounded-full relative cursor-pointer group border border-gray-600 hover:shadow-sm shadow-gray-400"  htmlFor='image_input'>
                <input type="file" className="hidden" id="image_input" onChange={handleImageUpload} />
            <Pen className="hidden group-hover:block absolute w-[50%] h-[50%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300/25 "/>
            {
                user?.hasImage ? (<Image src={user?.imageUrl} width={96} height={96} alt="User Avatar" className="w-full h-full rounded-full" />):
                (<div className="w-full h-full rounded-full bg-blue-300 shadow-[#666] shadow-md">

                </div>)
            }  
            </label>
            <div className="flex flex-col gap-2 items-start justify-center">
                <h1 className="text-xl lg:text-2xl text-white font-semibold">
                    {(user?.fullName)  || user?.primaryEmailAddress?.emailAddress.split('@')[0]}
                </h1>
                <span className="text-gray-400 text-sm">
                    Joined : {user?.createdAt?.toDateString()}
                </span>
            </div>

        </div>
        <Divider />
        <form className="flex flex-col gap-4">
            <div className="flex  gap-4">
                <div className="w-[50%]  border-gray-300 border-1 flex items-center rounded-md relative">
                <input 
                    type="text"
                    className="px-4 w-full peer focus:outline-none "
                    placeholder=""
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    value={updateUserParams['firstName']||''}
                    />
                <label htmlFor="firstName" className={`cursor-text text-sm absolute left-3 bg-black/70 px-1 `  +(updateUserParams['firstName']?` text-gray-200  top-0 -translate-y-1/2  `:` text-gray-300 top-1/2 -translate-y-1/2 peer-focus:top-0  peer-focus:-translate-y-1/2 transition-all`)}>
                    First Name
                </label>
                </div>

                <div className="w-[50%]  border-gray-300 border-1 flex items-center rounded-md relative h-12">

                    <input 
                        type="text"
                        id="lastName"
                        // label="Last Name"
                        className="px-4 w-full peer focus:outline-none"
                        placeholder=""
                        name="lastName"
                        onChange={handleChange}
                        value={updateUserParams['lastName']||undefined}
                    />
                    <label htmlFor="lastName" className={`cursor-text text-sm absolute left-3 bg-black/70 px-1 `  +(updateUserParams['lastName']?` text-gray-200  top-0 -translate-y-1/2  `:` text-gray-300 top-1/2 -translate-y-1/2 peer-focus:top-0  peer-focus:-translate-y-1/2 transition-all`)}>
                    Last Name</label>
                </div>
            </div>
        <Button
            type="submit"
            className="bg-white rounded-md p-1 text-black hover:bg-[#eee]" 
            onClick={()=>{handleSubmit()}}
            isLoading={isLoading}
        >
            Save Changes
        </Button>
        </form>


        <Divider />
        
        <h1 className="text-2xl  text-white font-semibold py-2">
            Account Status
        </h1>

        <div className="flex flex-row justify-between ">
            <h2 className="text-gray-300">
                Email Address 
            </h2>

            <span>
                {!user?.hasVerifiedEmailAddress ? 
                (<span className="bg-red-300/10 border border-red-300/75  flex rounded-md cursor-default p-1 px-2 items-center gap-2">
                        <span className="text-sm text-green-200">
                            Email Not Verified
                        </span>
                        <CircleX className="text-red-400 text-xl"/>
                </span>):
                (<span className="bg-green-300/10 border border-green-300/75  flex rounded-md cursor-default p-1 px-2 items-center gap-2">
                        <span className="text-sm text-green-200">
                            Email Verified
                        </span>
                        <Check className="text-green-400 text-xl"/>
                </span>) }

            </span>
        </div>
        <div className="flex flex-row justify-between ">
            <h2 className="text-gray-300">
                Phone Number
            </h2>

            <span>
                {!user?.hasVerifiedPhoneNumber ? 
                (<span className="bg-red-300/10 border border-red-300/75  flex rounded-md cursor-default p-1 px-2 items-center gap-2">
                        <span className="text-sm text-green-200">
                            Phone Number Not Verified
                        </span>
                        <CircleX className="text-red-400 text-xl"/>
                </span>):
                (<span className="bg-green-300/10 border border-green-300/75  flex rounded-md cursor-default p-1 px-2 items-center gap-2">
                        <span className="text-sm text-green-200">
                            Phone number Verified
                        </span>
                        <Check className="text-green-400 text-xl"/>
                </span>) }

            </span>
        </div>

        <div className="self-center justify-self-center">
                    <Button className="bg-red-600/50  px-4 py-2 rounded-sm mt-12" onClick={()=>logout}>
                        LogOut
                    </Button>
        </div>

    </div>
    )
}

export default Profile