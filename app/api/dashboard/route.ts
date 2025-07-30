import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import db from '@/lib'
import {files, } from '@/lib/schema';
import { and, count, eq, sum } from 'drizzle-orm';

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];


function getFileType(fileName: string): 'image' | 'video' | 'document' | 'other' {
    const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

    if (imageExtensions.includes(ext)) return 'image';
    if (videoExtensions.includes(ext)) return 'video';
    if (documentExtensions.includes(ext)) return 'document';
    return 'other';
}


export async function GET(){
    try{
        // console.log('\n\n\ndashboard route \n\n\n')
        // we get the total size 
        const user = await auth()
        
        const counts = {
            image: 0,
            video: 0,
            document: 0,
            other: 0,
            };

        if(!user || !user.userId){
            throw new Error('UNAUTHORIZED ACCESS')
        }
        const filesList = await db.select({
            id:files.id,
            name:files.name
        }).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isFolder,false),
                
            )
        );


        for (const file of filesList) {
            const type = getFileType(file.name); // or file.filename depending on your schema
            counts[type]++;
        }
        const [totalSize]  = await db.select({value:sum(files.size)}).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isFolder,false)
            )
        )
        
        

        // we get the number of files and folders

        const [filesCount] = await db.select({value:count(files.id)}).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isFolder,false)
            )
        )
        const [foldersCount] = await db.select({value:count(files.id)}).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isFolder,true)
            )
        )
        
        // we get how many trashed files
        const [trashCount] = await db.select({value:count(files.id)}).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isDeleted,true)
            )
        )
        // we get the size of trash
        const [nonTrashSize]  = await db.select({value:sum(files.size)}).from(files).where(
            and(
                eq(files.userId,user.userId),
                eq(files.isDeleted,false),
                
            )
        )

        const trashSize = Number(totalSize.value) - Number(nonTrashSize.value)

        console.log({
            totalSize,
            filesCount,
            foldersCount,
            trashCount,
            trashSize
        })
        return NextResponse.json(
            {
                totalSize:Number(totalSize.value),
                filesCount:Number(filesCount.value),
                foldersCount:Number(foldersCount.value),
                trashCount:Number(trashCount.value),
                trashSize,
                counts
            },
            {
                status:200
            });

            
    }catch(e){
        return NextResponse.json({error:e},{status:500})
    }
}