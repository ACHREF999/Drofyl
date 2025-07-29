import {auth} from '@clerk/nextjs/server';
import  { NextRequest,NextResponse } from 'next/server'
import {files,File as FileType} from '@/lib/schema'
import db from '@/lib/';
import {v4 as uuidv4} from 'uuid'
import ImageKit from 'imagekit'
import {and , eq } from 'drizzle-orm';


const imagekit = new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY||"",
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT|| "",
});



export async function POST(request:NextRequest){
    try{

        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        }
        
        const formData = await request.formData()
        const file =formData.get("file") as File
        const formUserId = formData.get("userId") as string 
        const parentId = formData.get("parentId") as string || null

        if(formUserId !== userId) {
            return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        }
        
        if(!file){
            return NextResponse.json({error:"BAD REQUEST"},{status:403})
        }
        let parent :any;
        if(parentId){
            [parent] = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.id,parentId),
                    eq(files.isFolder,true),
                )
            )

            if(!parent){
                return NextResponse.json({error:"NOT FOUND"},{status:404})
            }
        }

        // i will allow all types of files
        // if(!file.type.startsWith("image/") &&  file.type !== "application/pdf"){
        //     return NextResponse.json({error:"Invalid File Type"},{status:403})
        // }
        // we change the form file to buffer then to file buffer
        const buffer = await file.arrayBuffer()
        const fileBuffer = Buffer.from(buffer)

        const folderPath = parentId ? `/drofyl/${userId}/folder/${parentId}`:`/drofyl/${userId}`

        // there is a file , a parent and correct user permissions
        const id = uuidv4()
        
        const originalFilename = file.name
        const uploadResponse = await imagekit.upload({
            file:fileBuffer,
            fileName: originalFilename + '_'+ id,
            folder : folderPath,
            useUniqueFileName:false,
        })

        // after we upload to ImageKit we insert a row in our db
        const fileData = {
            name:originalFilename,
            fileId:uploadResponse.fileId,
            path:uploadResponse.filePath,
            size:file.size,
            type:file.type,
            fileUrl:uploadResponse.url,
            thumbnailUrl:uploadResponse.thumbnailUrl||null,
            userId:userId,
            parentId:parentId,
            isFolder:false,
        }


        // const [newFile,updatedParent ] = await db.transaction(async tx=>{

        const newFile = await db.insert(files).values(fileData).returning()
        //     let updatedParent:any=null;
        //     if(parent){
        //         updatedParent = await db.update(files).set({size:parent.size + file.size}).where(
        //             and(
        //                 eq(files.id,parent.id)
        //             )
        //         )
        //     }

        //     return [insertedRow,updatedParent]
        // })
        return NextResponse.json({newFile,},{status:201})

    }catch(e){  
        console.log(`error at POST /api/files/upload : ${e}`)
        return NextResponse.json({message:"Error Occured",error:e},{status:500})

    }
}
