'use client'

import React from 'react'
import { Divider } from '@heroui/react'
import { useUser } from '@clerk/nextjs'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import {PieChart} from '@mui/x-charts/PieChart';
import {BarChart} from '@mui/x-charts/BarChart';


function Dashboard() {
  const {user,isLoaded,isSignedIn} = useUser()
  const {data,isLoading,error} = useSWR('http://localhost:3000/api/dashboard',fetcher);
  const valueFormatter = (item: { value: number }) => `${item.value}%`;

  let pieChartData  = null ;
  if(data){
      pieChartData = [
        {value:5,label:'Disk Size'},
        {value:data.totalSize,label:'Occupied Size'},
        {value:data.trashSize,label:'Trash Size'},
        ]
  }
  if(!isLoaded){
    return 
    <>
      Loading
    </>
  }

  if(!isSignedIn){
    return (
      <a href="/sign-in"> 
        You Need To sign in
      </a>
    );
  }
  console.log(data)
  return (
<div className="m-2 my-[2%] self-center w-full rounded-md h-[98%] border-1 border-gray-300 flex flex-col gap-4 p-3 text-white">
            <h1 className=" text-2xl font-semibold py-2 ">
                Welcome Back {user?.firstName || user?.emailAddresses?.[0]?.emailAddress.split('@')[0]}
            </h1>
            <Divider />
            
            {isLoading?
            <>Loading ...</>:
            <></>}
            {error?
            <>
            error fetching occured {JSON.stringify(error)}
            </>:
            <></>}

            {data ? (
            <div className="flex flex-col lg:flex-row  gap-16 pr-4 mt-8">
            {/* Current Plan */}
            {/*  @static */}
                <div className="flex flex-col items-start gap-4 rounded-md border-gray-400 border-1 shadow-sm shadow-gray-600/25 grow min-w-[300px] h-[20%] lg:h-42 pt-3 pl-4 bg-gray-500/10  hover:shadow-md cursor-default">
                  <p className="text-gray-400 text-lg">
                    Current Plan
                  </p>
                  <h1 className='text-3xl'>
                    Free Plan
                  </h1>
                  <p className="text-gray-400 text-md">
                    Limited Access and Bandwidth
                  </p>
                </div>
            {/* How much storage left and consumed */}
                
                <div className="flex flex-col items-start gap-4 rounded-md border-gray-400 border-1 shadow-sm shadow-blue-300/25 grow min-w-[300px] h-[20%] lg:h-42 pt-3 pl-4 bg-gray-500/10  hover:shadow-md cursor-default ">
                  <p className="text-gray-400 text-lg">
                    Current Usage
                  </p>
                  
                  <h1 className="text-white text-3xl font-semibold ">
                    {/* {JSON.stringify(data)} */}
                    {(data.totalSize/(1024*1024)).toFixed(2)}/ {5*1024} Mb
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {/*  */}
                    {/* @ts-expect-error */}
                    You have {(1 -  data.totalSize/(5*1024*1024*1024)).toFixed(4) * 100}% left in your storage.
                  </p>
                </div>
            {/* how many files */}
                <div className="flex flex-col items-start gap-4 rounded-md border-gray-400 shadow-sm shadow-blue-300/25 w-[300px] grow  h-[20%] lg:h-42 pt-3 pl-4 bg-gray-500/10  hover:shadow-md cursor-default border-1 ">
                  <p className="text-gray-400 text-lg">
                    File System Structure
                  </p>
                  <h1 className="text-white font-semibold text-3xl ">
                    Files & Folders. 
                  </h1>
                  <p className="text-gray-500 text-sm">
                    You have {data.filesCount} files & {data.foldersCount} folders.
                  </p>
                </div>
            {/* how many starred files */}
                <div className="flex flex-col items-start gap-4 rounded-md border-gray-400 shadow-sm shadow-blue-300/25 w-[300px] grow h-[20%] lg:h-42 pt-3 pl-4 bg-gray-500/10  hover:shadow-md cursor-default border-1">
                  <p className="text-gray-400 text-lg">
                    Trash Monitor
                  </p>
                  <h1 className="text-white font-semibold text-3xl">
                    {data.trashCount} in Recycle Bin. 
                  </h1>
                  <p className="text-gray-500 text-sm">
                    You have {data.trashSize} worth of trash .
                    This makes up {(data.trashSize/data.totalSize)/100}% of all your uploads.
                  </p>
                </div>
            </div>
            ):null}
            {/*  */}
            <Divider className="text-gray-200 my-2" />
              <h1 className="text-2xl text-white ">
                  Usage Statistics
              </h1>
            <Divider className="text-gray-200 my-2" />

            <div className="flex flex-row w-full h-full items-center -pt-16   text-white text-xl ">
              {pieChartData ? (
                
                  <PieChart
                series={[
                  {
                    data: pieChartData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter,
                    cornerRadius:15,
                    
                  },
                //   sx={{
                //   "& .MuiChartsLegend-series text": {
                //     fontSize: "1.2em", // Example: change font size
                //     fill: "blue",     // Example: change text color
                //     fontWeight: "bold", // Example: change font weight
                //   },
                  
                // }}
                
              ]}
              slotProps={{
                legend:{
                  sx:{
                    fontSize:19,
                    color:'white'
                  }
                }
              }}
                height={200}
                width={200}
                className='text-white text-xl self-center justify-center'
                
              />):null}

            {

              data?.counts ? (
  <BarChart
      layout="horizontal"
      xAxis={[
        {
          scaleType: 'linear',
          label: 'Count',
          tickLabelStyle: {
            fontSize: 14,
            fill: 'white',
          },
          labelStyle: {
            fontSize: 16,
            fill: 'white',
          },
          lineStyle: {
            stroke: 'white',
          },
          tickLineStyle: {
            stroke: 'white',
          },
        },
      ]}
      yAxis={[
        {
          data: Object.keys(data.counts),
          scaleType: 'band',
          label: 'Type',
          tickLabelStyle: {
            fontSize: 14,
            // tabSize:100,
            fill: 'white',
            width:29,
            columnWidth:39,
            // textOrientation:'revert'
            // direction:'revert'
          },
          labelStyle: {
            fontSize: 16,
            fill: 'white',
            textOrientation:'sideways',
            marginRight:10,
          },
          lineStyle: {
            stroke: 'white',
          },
          tickLineStyle: {
            stroke: 'white',
          },
        },
      ]}
      series={[
        {
          data: Object.values(data.counts),
        },
      ]}
      height={400}
      width={600}
      padding={{left:100}}
      margin={{ top: 20, bottom: 40, left: 20, right: 20 }} // ⬅️ this prevents label truncation
      slotProps={{
        tooltip:{
          sx:{
            width:200
          }
        }
      }}
    />



              ):null

            }
            </div>

    </div>  
  )
}

export default Dashboard