import SideBar from "@/components/SideBar";
import { useUser } from "@clerk/nextjs";
import IsAuth from '@/components/IsAuth';


export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){


    return (
        <IsAuth>
          <div className="w-full h-full flex flex-row gap-4 p-2">

              <SideBar />
              {children}
          </div>

        </IsAuth>
    )
}