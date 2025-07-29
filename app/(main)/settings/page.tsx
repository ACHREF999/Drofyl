import { TriangleAlert } from "lucide-react"
import {Divider} from '@heroui/react';


export default function Settings(){



    return (
        <div className="m-2 my-[2%] self-center w-full rounded-md h-[98%] border-1 border-gray-300 flex flex-col gap-4 p-3 text-white">
            <h1 className=" text-2xl font-semibold py-2 ">
                Settings 
            </h1>
            <Divider />
            <div className="flex flex-col w-full h-full items-center justify-center gap-4">
                <TriangleAlert className="w-80 h-80 text-gray-400" />
                <div>
                    <h1 className="text-white text-3xl font-bold inline ">
                        501
                    </h1>
                    <h2 className="text-gray-400 text-lg inline px-2">
                        Not Implemented Yet
                    </h2>
                </div>
            </div>

        </div>
    )
}