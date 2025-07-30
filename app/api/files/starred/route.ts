import {auth} from '@clerk/nextjs/server';
import db from '@/lib';
import {files} from '@/lib/schema';
import { NextRequest,NextResponse } from 'next/server';
import {eq,and,isNull} from 'drizzle-orm';



export async function GET(request: NextRequest) {
    try{
        const user = await auth()
        const userId = user.userId

        if (!userId){ 
            return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        }
        const searchParams = request.nextUrl.searchParams
        // const queryUserId = searchParams.get("userId")
        const parentId = searchParams.get("parentId")
        // console.log(queryUserId)
        console.log(parentId)
        // if(!queryUserId || queryUserId !== userId){
        //     return NextResponse.json({error:"UNAUTHORIZED"},{status:401})
        // }

        // is the parentId valid ? 
        
        let result ; 
        if (parentId){
            const [parent]  = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.id,parentId),
                    eq(files.isFolder,true)
                )
            )
            if(!parent){
                throw new Error('Incorect ParentId')
            }

            result = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.parentId,parentId),
                    eq(files.isDeleted,false),
                    eq(files.isStarred,true)
                )
            )

            
            


        }else{
            console.log('root files fetched')
            result = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    isNull(files.parentId),
                    eq(files.isDeleted,false),
                    eq(files.isStarred,true)
                )
            )
        }


        // console.log(result)
        // const parents = [
        //     {
        //         name:'',
        //         id : null,
        //         parentId:null
        //     },
        // ]
        return NextResponse.json({result},{status:200})
    
    }catch(e){
        console.log(e)
        return NextResponse.json({message:"Failed Fetching Files ",error:e},{status:402})
    }
}

