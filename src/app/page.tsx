"use client"
export default function Home() {

  return (
    <div className="bg-black bg-home-img bg-cover bg-center">
      <main className="flex flex-col  text-center h-dvh justify-center max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 p-12 rounded-xl bg-black/90 sm:max-w-96 mx-auto  text-white sm:text-2xl">
          <h1 className="text-4xl font-bold">KESAN&apos;Employee<br/> Leave Tracker</h1>
          <address>
            This is KESAN Employee Leave Tracker System<br/>
            Only Admin or authenticated staff are allowed to use the system.
          </address>

        </div>
      </main>
    
    </div>
  );
}
