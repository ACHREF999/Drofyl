'use client'
import React from 'react'
import {Divider} from '@heroui/react';
import {useState} from 'react';
import useSWR from 'swr';
import {fetcher} from '@/lib/fetcher';
import { Folder,File,Undo2,Trash } from 'lucide-react';
import axios from 'axios';
import {mutate} from 'swr';
import { LoaderCircle } from 'lucide-react';

function Trashed() {
    
    const {data,error,isLoading:isDataLoading} = useSWR('http://localhost:3000/api/files/trash/',fetcher)
    const [isLoading,setIsLoading] = useState(false);


    // const onDoubleClick = (isFolder:boolean)=>{
    //     alert(`YOU CANT UNTIL U RESTORE THE ${isFolder ? 'Folder' : 'File' } `)
    // }

    const handleDelete = async (fileId:string)=>{
        try{
            setIsLoading(true)

            await axios.delete(
                `http://localhost:3000/api/files/${fileId}/delete`
            )
            const filterFunction = (key:string)=>{
                const keys :string[]= [
                    'http://localhost:3000/api/files/',
                    'http://localhost:3000/api/files/trash/']
                return keys.includes(key)
            }
            await mutate(filterFunction)
            
        }catch(err){
            console.error(err)
        }finally{
            setIsLoading(false)
        }
    }


    const handleTrash = async (fileId:string)=>{

        try{
            setIsLoading(true)

            await axios.patch(
                `http://localhost:3000/api/files/${fileId}/trash`
            )
            const filterFunction = (key:string)=>{
                const keys :string[]= [
                    'http://localhost:3000/api/files/',
                    'http://localhost:3000/api/files/trash/']
                return keys.includes(key)
            }
            await mutate(filterFunction)
            
        }catch(err){
            console.error(err)
        }finally{
            setIsLoading(false)
        }
        
    }
    return (
    <div className="-2 w-full rounded-md h-[98%] border-1 border-gray-300 flex flex-col gap-4 p-3 text-white my-[2%] self-center">
        <div className={isLoading?`absolute w-full h-full bg-black/10 top-0 left-0 rounded-md flex items-center justify-center`:`hidden`} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
                    <LoaderCircle className="motion-safe:animate-spin self-center place-self-center justify-self-center "/>
        </div>
        <h1 className=" text-2xl font-semibold py-2 ">
            Starred Files & Folders
        </h1>
        <Divider />
            <div className="text-md  text-gray-400 py-2 ">
                {/* <span className="text-medium font-medium text-gray-400">PATH : </span>{" "} */ }
                {/* {"Home"}{currentFolder}  */}
                This is where your favorite files and folders go , 
                <br/>
                note that this is NOT a hirearchical representation
            </div>

        <Divider className="text-gray-700"/>

        {isDataLoading && (
                <span className="text-gray-600 text-md">
                    Fetching files

                </span>
            )}
            {error && (
                <span className="text-red-400 text-md">
                    Error fetching files
                </span>
            )}
            {(!isDataLoading && !error && data?.result?.length>0 ) ? (<div className="flex flex-col gap-2">
                {data.result.map((item:{id:string,name:string,fileUrl:string,isFolder:boolean,isStarred:boolean,isDeleted:boolean}) =>{
                    if(item.isFolder) {
                        return (
                            <div className="bg-gray-950/50 p-2 rounded-md border border-gray-400 flex justify-between items-center w-full" key={item.id} >
                                <div className="flex flex-row items-center gap-1">
                                    <Folder />
                                    {item.name}
                                </div>

                                <div className="flex flex-row gap-1">
                                <Undo2  className={`${item.isStarred ?'text-gray-300 ': 'text-gray-500'}  hover:text-gray-200 `}  onClick={()=>handleTrash(item.id)}/>
                                <Trash  className="text-gray-500  hover:text-gray-200" onClick={()=>handleDelete(item.id)} fill={item.isDeleted?' red ':''}/>
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
                                <Undo2  className="text-gray-500  hover:text-gray-200" onClick={()=>handleDelete(item.id)}/>
                                <Trash  className="text-gray-500  hover:text-gray-200" fill={item.isDeleted?' red ':''}/>
                            </div>
                        </a>
                    )

                })}
            </div>) : 
            (!isDataLoading && !error && (
                <span className="text-gray-500">
                    No Files Yet
                </span>
                    )
                )
            }



            
    </div>
  )
}

export default Trashed