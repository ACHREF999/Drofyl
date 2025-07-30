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
        const parents = [];
        if (parentId){
            const [parent]  = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.id,parentId),
                    eq(files.isFolder,true)
                )
            )

            result = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    eq(files.parentId,parentId),
                    eq(files.isDeleted,false)
                )
            )

            let tempParentId = parent.parentId || null;
            parents.push({
                name:parent.name,
                id:parent.id,
                parentId:parent.parentId
            })
            let tempParent;
            while(tempParentId !== null){
                tempParent = await db.select().from(files).where(
                    and(
                        eq(files.userId,userId),
                        eq(files.id,tempParentId),
                        eq(files.isDeleted,false)
                    )
                )
                if(!tempParent) {
                    break;
                }
                parents.push({
                    name:tempParent[0].name,
                    id:tempParent[0].id,
                    parentId:tempParent[0].parentId
                })
                tempParentId = tempParent[0].parentId
            }


        }else{
            console.log('root files fetched')
            result = await db.select().from(files).where(
                and(
                    eq(files.userId,userId),
                    isNull(files.parentId),
                    eq(files.isDeleted,false)
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
        console.log({parents})
        return NextResponse.json({result,parents},{status:200})
    
    }catch(e){
        console.log(e)
        return NextResponse.json({message:"Failed Fetching Files ",error:e},{status:402})
    }
}

