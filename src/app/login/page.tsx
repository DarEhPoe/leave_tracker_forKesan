import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

import React from 'react'

export default function LoginPage() {
  return (


    <div className="bg-black bg-home-img bg-cover bg-center">
    <main className="flex flex-col  text-center h-dvh justify-center max-w-5xl mx-auto">
      <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 sm:max-w-96 mx-auto  text-white sm:text-2xl">
        <main className="">
        <h1>KESAN Leave Tracker</h1>
        <Button asChild>
          <LoginLink>Sign In</LoginLink>
        </Button>
      </main>
      </div>
    </main>
  </div>

  )
}

