import {NextRequest,NextResponse} from 'next/server';
import {auth} from '@clerk/nextjs/server';
import {files} from '@/lib/schema';
import db from '@/lib';
import {and, AnyColumn, eq, inArray, sql } from 'drizzle-orm';
import ImageKit from 'imagekit';
// import type {User} from '@clerk/nextjs/server'

const imageKit = new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY||"",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT|| ""
})

const recursiveIds = async (fileId:string,user:{userId:string})=>{
    
    let currentIds :string[]= []
    let nextIds :string[] = [fileId]
    let imagekitIds : string[] = []
    while(nextIds.length>0){
        currentIds =  [ ...currentIds,...nextIds]
        const tempIds : string[] = []
        for (const id of nextIds){
            const children = await db.select().from(files).where(
                and(
                    eq(files.parentId,id),
                    eq(files.userId,user.userId),
                )
            )
            for (const child of children){
                tempIds.push(child.id)
                if(!child.isFolder){
                    imagekitIds = [...imagekitIds,child.fileId as string]
                }
            }
        }

        nextIds = [...tempIds]
    
    }

    return [currentIds,imagekitIds]
}



export async function DELETE(request:NextRequest,props:{params:Promise<{id:string}>}){
    const {id:fileId} = await props.params
    try{
        const user = await auth()
        if(!user.userId){
            throw new Error('UNAUTHORIZED')
        }
        const [file]  = await db.select().from(files).where(
            and(
                eq(files.id,fileId),
                eq(files.userId,user.userId)
            )
        )
        let ids:string[]=[];
        let uploadIds:string[] = [];
        if(file.isFolder){
            [ids,uploadIds] = await recursiveIds(fileId,user)
        }

        console.log([...ids])
        console.log([...uploadIds])
        // now we have the list of files in image kit 
        // and the ids in the db
        // now we need to delete the files in the bucket
        // then remove from the db
        // right now i am sacrificing the user experience 
        // to prevent data leakage in the bucket
        

        // clearing bucket
        let deleteResponse;
        if(uploadIds.length>0){

            deleteResponse = await imageKit.bulkDeleteFiles([...uploadIds])
        }




        // clearing db
        const deletedFiles = await db.delete(files).where(
            and(
                inArray(files.id,[...ids])
            )
        )
        const decerement = (column:AnyColumn,value=1)=>{
            console.log(`column name : ${column}`)
            return sql`${column} - ${value}`
        };
        let updatedParent;
        if(file.parentId){

            updatedParent = await db.update(files).set({
                size:decerement(files.size,file.size)
            }).where(
                and(
                    eq(files.parentId,file.parentId)
                )
            )
        }
        return NextResponse.json({message:'succesfully Deleted Files',deleteResponse,deletedFiles,updatedParent},{status:203})

    }catch(e){
        console.error(e)
        return NextResponse.json({message:'An error occured',error:e},{status:407})
    }
    
}