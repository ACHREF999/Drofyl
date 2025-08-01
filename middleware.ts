import { clerkMiddleware,createRouteMatcher,auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


// export default clerkMiddleware()

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)','/sign-up(.*)'])

export default clerkMiddleware(async (auth,request)=>{
    const user = await auth()
    // console.log(user)
    const userId = user.userId
    const url = new URL(request.url)

    if(userId && isPublicRoute(request) ){
        return NextResponse.redirect(new URL('/dashboard',request.url))
    }

    if( !isPublicRoute(request)){
        await auth.protect()
    }

})


export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}