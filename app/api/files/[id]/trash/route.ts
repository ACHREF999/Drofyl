import { NextRequest ,NextResponse} from 'next/server';
import {auth} from '@clerk/nextjs/server';
import db from '@/lib';
import { files } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';




export async function PATCH(request:NextRequest,props : {params:Promise<{id:string}>}){


    try{

    const {id:fileId }= await props.params
    if(!fileId){
        throw new Error('Missing Required File ID')
    }
    const {userId} = await auth()

    if(!userId){
        throw new Error('UNAUTHORIZED REQUEST')
    }

    const [file] = await db.select().from(files).where(
        and(
            eq(files.userId,userId),
            eq(files.id,fileId)
        )
    )

    if(!file){
        throw new Error('FILE NOT FOUND , INVALID FILE ID per USER ID')
    }

    const [updatedFile] = await db.update(files).set({isDeleted:!file.isDeleted}).where(
        and(
            eq(files.userId,userId),
            eq(files.id,fileId)
        )
    ).returning()

    return NextResponse.json({result:updatedFile},{status:202})
    }catch(e){

        return NextResponse.json({error:e,message:'Failed to Trash the File'})

    }
}

