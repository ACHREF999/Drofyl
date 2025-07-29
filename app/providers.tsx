import React from 'react'
import type {ThemeProviderProps} from 'next-themes';
import { HeroUIProvider } from '@heroui/system';
export interface ProviderProps{
    children:React.ReactNode,
    themeProps?: ThemeProviderProps
}

export function Providers({children}:ProviderProps){
    return (
        <HeroUIProvider className="w-full h-full">
        {children}
        </HeroUIProvider>
    )
}