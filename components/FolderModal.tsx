'use client'
import {useState} from 'react'
import { FolderModalState, useFolderModal } from '@/lib/state'
import {Button, Divider} from '@heroui/react';
import { X } from 'lucide-react';
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { mutate } from 'swr';
import { useSearchParams } from 'next/navigation';

function FolderModal() {
  const {isOpen,toggle}:FolderModalState = useFolderModal()
  // const {currentParent,currentPath} : any = useCurrentParent()
  const [isLoading,setIsLoading] = useState(false)
  const [folderName,setFolderName]= useState('')
  const {user} = useUser()
  const params = useSearchParams()
  const currentParent = params.get('parentId') || null
  const [formError,setFormError] = useState(false)


  const handleSubmit = async( ) =>{
    if(!folderName) {
      setFormError(true)
      return
    };

    setIsLoading(true)
    try { 
      
      await axios.post('/api/folders/create',{
        name:folderName,
        parentId:currentParent,
        userId:user?.id
      })
      await mutate('http://localhost:3000/api/files/')
      setFolderName('')
      toggle()
    }catch(err){
      console.log(err)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className={`${isOpen?'absolute ':'hidden '} h-[100vh] w-[100vw] bg-slate-700/50 top-0 left-0 flex flex-col items-center justify-center  `} onClick={()=>toggle()}>
      <div className={isLoading?`absolute w-full h-full top-0 left-0 bg-black/10 z-10`:''} onClick={(e)=>{e.stopPropagation()}} onDoubleClick={(e)=>{e.stopPropagation()}}>
            
          </div>
        <div className="flex flex-col bg-black rounded-lg border-slate-700 w-[75%] max-h-[360px] min-h-[360px] lg:max-h-[400px] p-6 lg:p-8 gap-6 lg:gap-8 max-w-180 " onClick={(e)=>{e.stopPropagation()}}>
          
          <div className="flex justify-between">

            <h1 className="text-white text-2xl lg:text-3xl"> 
              Create Folder
            </h1>

            <Button className="text-gray-400 w-8 h-8" isIconOnly onClick={()=>toggle()} > 
                <X/>
            </Button>

          </div>
          <Divider className="text-gray-500"/>
          <div>

            <h2 className="text-md lg:text-xl text-gray-300">
              Folder Will be created in the Current Directory
            </h2>
            {/* <span className="text-gray-600 text-md font-semibold">
              /
            </span> */}
          </div>

          <Divider className="text-gray-800"/>
          {formError && (
            <span className="text-red-600/75 text-sm font-thin -my-4">
              You Must Provide a Valid Folder Name
            </span>
          )}
          <div className={` w-full  border-gray-300 border-1 flex items-center rounded-md relative h-12 ` + (formError ? `border-red-600/75` : ``)}>

                    <input 
                        type="text"
                        id="lastName"
                        // label="Last Name"
                        className={`px-4 w-full peer focus:outline-none text-gray-100`}
                        placeholder=""
                        name="lastName"
                        onChange={(e)=>{
                          setFormError(false)
                          setFolderName(e.target.value)}}
                        value={folderName}
                        
                    />
                    <label htmlFor="lastName" className={`cursor-text text-sm absolute left-3 bg-black/70 px-1 `  +(folderName?` text-gray-200  top-0 -translate-y-1/2  `:` text-gray-300 top-1/2 -translate-y-1/2 peer-focus:top-0  peer-focus:-translate-y-1/2 transition-all`) + (formError?' text-red-600/75 ':``)}>
                    Folder Name</label>
                </div>
          {/* <Input 
          // label="New Folder Name"
          placeholder="New Folder"
          type="text"
          className="border border-gray-700 rounded-sm text-gray-400 px-2 flex py-auto "
          value={folderName}
          onChange={(e)=>setFolderName(e.target.value)}
          /> */}

          <Button className="border border-white bg-gray-100 rounded-sm " onClick={handleSubmit}>
            {isLoading ? "Creating ..." : "Create"}
          </Button>
        </div>
    </div>
  )
}

export default FolderModal