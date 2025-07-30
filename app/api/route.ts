import {NextResponse} from 'next/server';


export async function GET(){


    return NextResponse.json({message:'Success , BACKEND API WORKING'},{status:200})

}