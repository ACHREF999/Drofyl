import {create} from 'zustand';


export const useFolderModal = create((set)=>{
    return {
        isOpen:false,
        toggle:()=>set((state:any)=>({isOpen:!state.isOpen}))
    }
})


export const useCurrentParent = create((set)=>{
    return {
        currentParent : null,
        currentPath:'/',
        setCurrentParent:(newParent:any)=>set((state:any)=>({currentParent:newParent})),
        setCurrentPath:(newPath:string)=>set((state:any)=>({currentPath:newPath}))
    }
})




