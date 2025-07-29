'use client'
import { Divider ,Button,Input} from '@heroui/react'
import { Upload, FolderPlus, LoaderCircle } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import {useAuth,useUser} from '@clerk/nextjs';
import { useFolderModal } from '@/lib/state';
import useSWR, { mutate } from 'swr';
import {fetcher} from '@/lib/fetcher';
import {useCurrentParent} from '@/lib/state';
import { Trash,Folder , File, Star } from 'lucide-react';
import Link from 'next/link';
import {useSearchParams,useRouter} from 'next/navigation';



function All() {
    const [file,setFile] = useState<File | null>(null)
    const [status,setStatus] = useState('idle')
    const Auth = useAuth();
    const params = useSearchParams();
    const currentParent = params.get('parentId') || null;
    const router = useRouter()
    // const token = Auth.getToken();
    // const [currentFolder,setCurrentFolder] = useState(null)
    // const {currentParent,currentPath,setCurrentParent} : any = useCurrentParent()

    const setCurrentParent = (parentId:string|null)=>{
        if(parentId){
            router.push(`/all?parentId=${parentId}`)
        }
        else{
            router.push(`/all`)
            
        }
    }

    const {isOpen,toggle}:any = useFolderModal()
    const {user,isLoaded,isSignedIn} = useUser()
    // const [filesList,setFilesList] = useState([])
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);

    

    // const {data,error,isLoading} = useSWR([`/api/files?userId=${user?.id}${currentParent? `&parentId=${currentParent}`: ""}`,token],fetcher)
    // console.log('current parent',currentParent)
    const url = ((currentParent ===null) ? `http://localhost:3000/api/files/` : `http://localhost:3000/api/files?parentId=${currentParent}`)
    // console.log(url)
    const {data,error,isLoading} = useSWR(url,fetcher)
    console.log(data)
    // const handleDrop = (e:any)=>{
    //     e.preventDefault()
    //     // if(!file ) return;

    // }

    // const handleDragOver = (e:any)=>{
    //     e.preventDefault()
    // }

    const handleChange = (e:any)=>{

        e.preventDefault()
        const file = e.target.files[0]
        if(!file) return
        setStatus('ready')

        setFile(file)
        console.log(file)
        
    }
    
    const handleSubmit = async (e:any)=>{
        setIsSubmitLoading(true);
        try{

            const formData = new FormData();
            formData.append('file',file!);
            formData.append('userId',user?.id!);
    
            if(currentParent) {
                console.log('parentId fORMdATA :',currentParent)
                formData.append('parentId',currentParent)
            }
    
            const response = await axios.post('/api/files/upload',formData
            //     ,{
            //         headers:{
            //             Authorization : `Bearer ${token.split('_')[1]}`
            //          }
            //      }
            )
    
    
            console.log('response : ',response)
            setFile(null);

        }catch(e){
            console.error(`error occured : ${e}`)
        }finally{
            setIsSubmitLoading(false)
        }

        
    }

    const changeDirectory = (nextDirectory:string)=>{

        setCurrentParent(nextDirectory)
        
    }


    const handleStar = async (fileId:string)=>{
        try{
            setIsSubmitLoading(true)
            const response = await axios.patch(
                `http://localhost:3000/api/files/${fileId}/star`
            )
            await mutate('http://localhost:3000/api/files/')
        }catch(e){
            console.error(e)
        }finally{
            setIsSubmitLoading(false)
        }
    }
    
    
    const handleTrash = async (fileId:string)=>{
        try{

            setIsSubmitLoading(true)
            const response = await axios.patch(
                `http://localhost:3000/api/files/${fileId}/trash`
            )
            await mutate('http://localhost:3000/api/files/')
        }catch(e){
            console.error(e)
        }finally{
            setIsSubmitLoading(false)
        }
    }

    return (
        <div className="m-2 my-[2%] self-center w-full rounded-md h-[98%] border-1 border-gray-300 flex flex-col gap-4 p-3 text-white">
            <div className={isSubmitLoading?`absolute w-full h-full bg-black/10 top-0 left-0 rounded-md `:`hidden`} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
                        <LoaderCircle className="motion-safe:animate-spin self-center place-self-center justify-self-center"/>
                    </div>
            <h1 className=" text-2xl font-semibold py-2 ">
                All Files & Folders
            </h1>
            <Divider />
            <div className="flex flex-row gap-6 my-2">
                <Button className="flex flex-col  h-24 w-[35%] max-w-[320px] items-start border-gray-100 rounded-sm  border-1  hover:shadow-md  shadow-[#666] hover:bg-[#55555555] " onClick={(e)=>toggle()}>
                    <FolderPlus className="text-gray-400 w-8 h-8"/>
                    <p className="text-xl">
                        New Folder
                    </p>
                </Button>
                
                <div className="flex  w-64  items-start border-gray-100 rounded-sm  border-1  hover:shadow-md  shadow-[#666] grow max-w-[520px] hover:bg-[#55555555] ">

                    <label 
                    htmlFor="file"
                    className=" self-center justify-self-center  shadow-none  h-full w-full text-center flex justify-center items-center cursor-pointer "
                    >
                        <p>
                            {!file ? (<span className="text-gray-300 text-xl">Select a File</span>):file.name}


                        </p>
                    </label>
                    <input 
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    />
                    <Button
                    className="bg-blue-500/60 hover:bg-blue-500/85 hover:font-bold w-[30%] flex items-center h-full border-l-1 " isIconOnly isDisabled={file==null} onClick={handleSubmit}
                    >
                        <Upload className="text-white font-semibold w-8 h-8"/>
                    </Button>
                </div>


                
            </div>

            <Divider />

            <div className="text-2xl  font-medium text-gray-300 py-2 flex flex-row gap-1 ">
                {/* <span className="text-medium font-medium text-gray-400">PATH : </span>{" "} */ }
                {/* {"/home"}{currentPath}  */}
                {
                    isLoading ? 
                    (<span>

                    </span>)
                    : null
                }
                {
                    error ? 
                    (<span>

                    </span>)
                    : null
                }

                {
                    data ? 
                    <div className="flex flex-row items-center gap-0">
                    <Button className="text-white text-md font-extralight  px-1 mx-0 pl-1 border-b border-transparent hover:border-b hover:border-gray-400 hover:bg-gray-300/5 rounded-sm" onClick={e=>{setCurrentParent(null)}}>
                        /home
                    </Button>

                    {
                        data?.parents?.toReversed().map((parent:any)=>(
                            <Button className="text-white text-md font-extralight  px-1 mx-0 pl-1 border-b border-transparent hover:border-b hover:border-gray-400 hover:bg-gray-300/5 rounded-sm" onClick={e=>{setCurrentParent(parent.id)}} key={'navigation-'+parent.id}>
                                /{parent.name}
                            </Button>
                        ))
                    }
                    </div>
                    : null
                }
            </div>

            <Divider className="text-gray-700"/>

            {/* Now we Display the Files/Folders */}
            {isLoading && (
                <span className="text-gray-600 text-md">
                    Fetching files

                </span>
            )}
            {error && (
                <span className="text-red-400 text-md">
                    Error fetching files
                </span>
            )}
            {(!isLoading && !error && data?.result?.length>0 ) ? (<div className="flex flex-col gap-2">
                {data.result.map((item:any) =>{
                    if(item.isFolder) {
                        return (
                            <div className="bg-gray-950/50 p-2 rounded-md border border-gray-400 flex justify-between items-center w-full cursor-default" key={item.id} onDoubleClick={e=>changeDirectory(item.id)}>
                                <div className="flex flex-row items-center gap-1">
                                    <Folder />
                                    {item.name}
                                </div>

                                <div className="flex flex-row gap-1">
                                <Star  className={`${item.isStarred ?'text-gray-300 ': 'text-gray-500'}  hover:text-gray-200 `} fill={item.isStarred?' gold ':''} onClick={e=>handleStar(item.id)}/>
                                <Trash  className="text-gray-500  hover:text-gray-200" onClick={e=>handleTrash(item.id)}/>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <a className="bg-gray-950/50 p-2 rounded-md border border-gray-400 flex justify-between items-center w-full" key={item.id} href={item.fileUrl} download={item.name} target="_blank" rel="noopener noreferrer">
                            <div className="flex flex-row items-center gap-1">
                                <File />
                                {item.name}
                            </div>

                            <div className="flex flex-row gap-1">
                                <Star  className="text-gray-500  hover:text-gray-200"/>
                                <Trash  className="text-gray-500  hover:text-gray-200"/>
                            </div>
                        </a>
                    )

                })}
            </div>) : 
            (!isLoading && !error && (
                <span className="text-gray-500">
                    No Files Yet
                </span>
                    )
                )
            }



            

        </div>
    )
}

export default All