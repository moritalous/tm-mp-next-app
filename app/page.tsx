// import TwinMakerScene from "@/components/TwinMakerScene";

import dynamic from "next/dynamic"

const TwinMakerScene = dynamic(() => import('@/components/TwinMakerScene'), { ssr: false })

export default function Home() {
  return (
    <div className='relative flex-grow w-full'>
      <TwinMakerScene />
    </div>
  )
}
