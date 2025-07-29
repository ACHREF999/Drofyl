'use client'
import Link from "next/link";
import {useUser} from '@clerk/nextjs';
import { Divider } from "@heroui/react";
import { usePathname } from "next/navigation";
import { ChevronDown, Folders, LayoutDashboard, List, Minus ,Settings,Star, Trash, User} from "lucide-react";
import { useState } from "react";





export default function SideBar(){
    const pathname = usePathname()
    const [collapsedFolders, setCollapsedFolders] = useState(true) 
    const {user,isSignedIn,isLoaded} = useUser()
    // console.log(user)

    // console.log(pathname)

    const ActiveLink = ({href,children}:any)=>{
        return (
            <Link 
            href={href}
            className={`flex flex-row items-center rounded-md p-2 gap-2  hover:bg-[#343434] ${href==pathname?"bg-[#343434] font-semibold ":""}`}>
                {children}
                
            </Link>
        )
    }

    return (
        <div className="h-[98%] max-sm:hidden sm:w-[35%] max-w-[320px]  flex flex-col justify-between text-white bg-[#1d1d1d] p-4  rounded-md self-center">
            {/* user info */}
            {/* TOP */}
            <div>
            <div className="flex flex-row px-2 gap-2 items-center hover:bg-[#343434]  rounded-md transition-all my-4 py-2 cursor-default">
                <div className="w-10 h-10 bg-blue-300 rounded-md">
                </div>
                <div className="flex flex-col items-start">
                    <h1 className="text-white font-semibold text-md">
                        {user?.primaryEmailAddress?.emailAddress.split('@')[0]} Storage
                    </h1>
                    <p className="text-gray-200 text-md">
                        {user?.primaryEmailAddress?.emailAddress}
                    </p>
                </div>
            </div>

            <Divider className="mb-4"/>

            <ActiveLink href="/dashboard">

                <LayoutDashboard />
                
                <p>
                    Dashboard
                </p>

            </ActiveLink>
            
            <Divider className="mt-4 mb-4"/ >

            <div className="w-full flex flex-row items-center justify-between p-2 gap-2 hover:bg-[#343434]  rounded-md cursor-default " onClick={()=>setCollapsedFolders(!collapsedFolders)}>
                <div className="flex flex-row gap-2">

                    <Folders />
                    <p>Folders</p>
                </div>

                {!collapsedFolders ? 
                (<ChevronDown  className=""/>) 
                :(<Minus className=" justify-self-end"/>)
                }
            </div>

            {collapsedFolders ? (
                <div className="ml-6 text-md font-sm">
                <ActiveLink href="/all">

                    {/* <div  className="w-6 h-6 bg-none"> </div> */}
                    <List />
                    <p>
                        All
                    </p>

                </ActiveLink>

                <ActiveLink href="/starred">

                    {/* <div  className="w-6 h-6 bg-none"> </div> */}
                    <Star />
                    <p>
                        Starred
                    </p>

                </ActiveLink>
                
                <ActiveLink href="/trash">

                    {/* <div  className="w-6 h-6 bg-none"> </div> */}
                    <Trash />
                    <p>
                        Trash
                    </p>

                </ActiveLink>
                
                </div>
            ):null}
            <Divider className="my-4"/>


            </div>


            <div>

            <ActiveLink href="/profile">

                    <User />

                    <p>
                        Profile
                    </p>

            </ActiveLink>


            <ActiveLink href="/settings">

                    <Settings /> 

                    <p>
                        Settings
                    </p>

            </ActiveLink>
            </div>
        </div>
    )
}