"use client"
import Link from "next/link";

export default function Home() {

  return (
    <div className="bg-black bg-home-img bg-cover bg-center">
      <main className="flex flex-col  text-center h-dvh justify-center max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 sm:max-w-96 mx-auto  text-white sm:text-2xl">
          <h1 className="text-4xl font-bold">KESAN&apos;Employee<br/> Leave Tracker</h1>
          
          <div className="flex flex-col gap-4 mt-4">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200">
              <Link href="/leave_register">
              Saff Access
              </Link>
            </button>
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200">
              <Link href="/trackers_submit">
              Admin Access
              </Link>            
            </button>
          </div>


        </div>
        <div>
          <button className="cursor-pointer"
            onClick={async () => {
              console.log("clicked")
              await fetch("/api/send-sms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: "+66943579062",
                  message: "Hello from KESAN Leave Tracker!"
                }),
              });
            }}
          >
            SendMessage
          </button>
        </div>     
      </main>
    
    </div>
  );
}
