import FolderModal from '@/components/FolderModal';
import React from 'react'

function FoldersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <FolderModal />
    {children}
    </>
)
}

export default FoldersLayout