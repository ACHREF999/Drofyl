import {NextResponse} from 'next/server'
import {auth} from '@clerk/nextjs/server';
import ImageKit from 'imagekit';
// import {getUploadAuthParams} from '@imagekit/next/server';


const imageKit = new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY||"",
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY||"",
    urlEndpoint:process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT||""
});


export async function GET(){
    
    try{
        const user = await auth()
    
        if (!user.userId) {
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
    
        const authParams = imageKit.getAuthenticationParameters()
        
        return NextResponse.json(authParams)

    }catch(e){

        return NextResponse.json({error:`Failed to generate authentication parameters ${e}`},{status:500})
    }
}



