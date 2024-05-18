"use client"
import Logo from "@/assets/LOGO.png"
import Image from 'next/image'
import { useSession ,signOut} from 'next-auth/react'
import {User} from "next-auth"
import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { toast } from "./ui/use-toast"

const Navbar = () => {

  const {data:session}=useSession();
  const user:User=session?.user ;

  const handleSignOut=async ()=>{
    toast({
      title:"Success",
      description:"Logged Out Successfully"
    });
    signOut();
  }

  return (
    <div className="h-16 bg-Black w-full border-b border-richblack-700 flex items-center justify-center">
      <div   className='w-11/12 max-w-[1200px] mx-auto flex items-center justify-between'>
          <div className="flex items-center justify-center">
            <Image
              src={Logo}
              alt='logo'
              className='h-[120px] w-[230px] cursor-pointer'
            />
            <ModeToggle/>
          </div>
          {
            session &&
            <div>
              <p className="dark:text-neutral-200 text-gray-900 font-bold text-xl cursor-pointer">Welcome {user?.username || user?.email}</p>
            </div>
          }

          {
            !session &&
              <div className="flex items-center justify-center space-x-3">
                <Link href="/signin">
                  <button className="shadow-[inset_0_0_0_2px_#616467] px-4 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
                    Sign in                            
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="shadow-[inset_0_0_0_2px_#616467] px-4 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
                    Sign up                          
                  </button>
                </Link>
              </div>
          }
          {
            session && 
            <div>
               <button className="shadow-[inset_0_0_0_2px_#616467] px-4 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200" onClick={handleSignOut}>
                    Sign out                            
                </button>
            </div>
          }

      </div>
    </div>
  )
}

export default Navbar



