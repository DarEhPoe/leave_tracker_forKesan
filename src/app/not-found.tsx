import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata={
    title:"Page Not Found"
}

export default function notFound() {
  return (
    <div className='px-2 w-full'>
        <div className='mx-auto py-4 flex flex-col justify-center items-center gap-4'>            
            <h2>
                Page Not Found
            </h2>
            <Image src="/images/not-found-1024x1024.png"
            width={300}
            height={300}
            sizes='300px'
            alt='Page Not Found'
            priority={true}
            title='page Not found'
            >
                
            </Image>
        </div>
        <Link href="/leave_tracker" className="text-center hover:underline"><h3>Go Home</h3></Link>
      
    </div>
  )
}
