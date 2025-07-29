import {auth} from '@clerk/nextjs/server';
import {files} from '@/lib/schema'
import db from '@/lib';
import {eq,and} from 'drizzle-orm'
import {NextRequest,NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';


export async function POST(request:NextRequest){
    try{
        const user = await auth()
        const userId = user.userId
        if(!userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        

        const body  = await request.json()
        const {name,userId:bodyUserId,parentId=null}=body

        if(bodyUserId !== userId){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        if(!name || typeof name !== "string" || name.trim()===""){
            return NextResponse.json({error:"Bad Request"},{status : 402})
        }

        if(parentId){
            const [parent] = await db.select().from(files).where(
                and(
                    eq(files.id , parentId),
                    eq(files.userId,userId),
                    eq(files.isFolder,true)
                )
            )
            if (!parent){
                return NextResponse.json({error:'No Matching Parent Folder'},{status : 402})
            }
        }
        const id = uuidv4()
        const folderData = {
            id:id,
            name : name.trim(),
            path:`/${userId}/folders/${id}`,
            size:0,
            type:"folder",
            fileUrl : "",
            userId:userId,
            parentId:parentId,
            isFolder:true,
        }
        console.log(folderData)
        const createdFolder = await db.insert(files).values(folderData).returning()
        console.log(createdFolder)

        return NextResponse.json({success:true,message:"folder Created Successfully",folder:createdFolder},{status:201})
        
    }catch(e){

        return NextResponse.json({error:e,message:'Failed Folder Creation'},{status:500})

    }
}

