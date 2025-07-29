import {auth} from '@clerk/nextjs/server'
import db from '@/lib';
import {files} from '@/lib/schema';
import { NextResponse,NextRequest } from 'next/server';
import {and , eq} from 'drizzle-orm';



export async function PATCH(request:NextRequest,props:{params:Promise<{id:string}>}){
    try{
        const {id:fileId}  = await props.params
        if(!fileId){
            throw new Error("FILE ID REQUIRED")
        }

        const {userId} = await auth()
        if(!userId){
            throw new Error('UNAUTHORIZED')
        }

        const [file] = await db.select().from(files).where(
            and(
                eq(files.userId,userId),
                eq(files.id,fileId),
            )
        )

        if(!file){
            throw new Error('File Not Found , Invalid File ID')
        }

        const [newFile] = await db.update(files).set({isStarred:!file.isStarred}).where(and(
            eq(files.userId,userId),
            eq(files.id,fileId)
        )).returning()
        console.log(newFile)


        return NextResponse.json({updatedFile:newFile},{status:202})

    }catch(e){
        return NextResponse.json({error:e},{status:500})
    }
}


