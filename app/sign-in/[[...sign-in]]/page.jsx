

import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
 
        <div className=" p-4 rounded-lg">
          <SignIn />
        </div>

    </div>
  )
}
