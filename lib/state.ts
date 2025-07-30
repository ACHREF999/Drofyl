import {create} from 'zustand';

export interface FolderModalState {
    isOpen:boolean;
    toggle:()=>void;
}


export const useFolderModal = create<FolderModalState>((set)=>{
    return {
        isOpen:false,
        toggle:()=>set((state:FolderModalState)=>({isOpen:!state.isOpen}))
    }
})

// export interface CurrentFolderState {
//     currentParent:string;
//     currentPath:string;
//     setCurrentParent:(arg0:string)=>void;
//     setCurrentPath:(arg0:string)=>void;
// }

// export const useCurrentParent = create<CurrentFolderState>((set)=>{
//     return {
//         currentParent : null,
//         currentPath:'/',
//         setCurrentParent:(newParent:string)=>set(()=>({currentParent:newParent})),
//         setCurrentPath:(newPath:string)=>set(()=>({currentPath:newPath}))
//     }
// })




