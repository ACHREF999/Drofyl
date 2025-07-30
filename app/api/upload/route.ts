import {auth} from '@clerk/nextjs/server'
import db from '@/lib'
import {files} from '@/lib/schema'
import {NextRequest,NextResponse} from 'next/server';
import { and, eq, InferModel } from 'drizzle-orm';


export async function POST(request:NextRequest){
    try{
        const user= await auth()
        const userId = user?.userId

        if(!userId) {
            return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        }

        const body  = await request.json()
        const {imagekit , userId:bodyUserId,parentId} = body

        if (bodyUserId !== userId){
            return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        }
        if (!imagekit || !imagekit.url){
            return NextResponse.json(
                {error : "Invalid Upload Data"},
                {status : 401})
        }
        if(parentId){
            const [parent] = await db.select().from(files).where(
                and(
                    eq(files.userId,userId ),
                    eq(files.id,parentId),
                    eq(files.isFolder,true)
                )
            )
            if(!parent){
                throw new Error('INVALID ParentId')
            }
        }
        if(!parent){
            throw new Error('INVALID ParentId')
        }
        
        const fileData = {
            name : imagekit.name || "untitled",
            path : imagekit.filePath || `/drofyl/${userId}/${imagekit.name || 'untitled'}`,
            size : imagekit.size || 0,
            type: imagekit.fileType || "image",
            fileUrl : imagekit.url,// this is what we can refrence in ImageKit
            thumbnailUrl : imagekit.thumbnailUrl || null, 
            userId : userId,
            parentId : parentId || null ,
            isFolder  : false,
            isStarred : false,
            isDeleted : false,
        }

        const [newFile] = await db.insert(files).values(fileData as InferModel<typeof files>).returning()
        console.log('file upload successfull')
        return NextResponse.json({newFile},{status:201})

    }catch(e){
        return NextResponse.json({error:`Failed to save file info to db : ${e}`},{status : 500})
    }
}

