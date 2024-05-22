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
    <div className="h-16 bg-white dark:bg-black w-full border-b border-richblack-700 flex items-center justify-center">
      <div   className='w-11/12 max-w-[1200px] mx-auto flex items-center justify-between'>
          <div className="flex items-center justify-center">
            <Image
              src={Logo}
              alt='logo'
              className='h-[120px] w-[230px] cursor-pointer hidden md:block'
            />
            <ModeToggle/>
          </div>
          {
            session &&
            <div className="hidden md:block">
              <p className="dark:text-neutral-200 text-gray-900 font-bold text-xl cursor-pointer">Welcome {user?.username || user?.email}</p>
            </div>
          }

          {
            !session &&
              <div className="flex items-center justify-center space-x-3">
                <Link href="/signin">
                    <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10 ">
                        <span className="text-[14px]">
                          Sign In
                        </span>
                        
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                </Link>
                
              </div>
          }
          {
            session && 
            <div>
               <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block" onClick={handleSignOut}>
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-6 ring-1 ring-white/10 ">
                        <span className="text-[14px]">
                          Sign Out
                        </span>
                        
                      </div>
                      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
            </div>
          }

      </div>
    </div>
  )
}

export default Navbar



