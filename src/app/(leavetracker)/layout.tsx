

import React, { Suspense } from 'react'
import Header from '@/components/Header'
import Loading from '@/app/loading'


export  default async function  RSLayout({
    children,
}:{children:React.ReactNode}) {

  return (
    <div className=''>
      <Suspense fallback={<Loading/>}>
        <Header>
          {children}
        </Header>
      </Suspense>
    </div>
  )
}
