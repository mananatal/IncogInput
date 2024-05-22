import Image from 'next/image'
import React from 'react'
import Logo from "@/assets/LOGO.png"
import { Heart, HeartIcon } from 'lucide-react'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import { FaHeart } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className=' bg-slate-300 dark:bg-gray-800 w-full  '>
        <div className='w-[80%]  flex flex-col md:flex-row items-center justify-between mx-auto'>            
                <Image
                    src={Logo}
                    alt='logo'
                    className='h-14 w-[230px] cursor-pointer object-cover'
                />          
           
                <p className='flex items-center pb-4 md:pb-0 text-neutral-800 dark:text-neutral-200 font-bold'>
                    Made with&nbsp;<HeartFilledIcon className='h-5 w-5 text-red-700'/>&nbsp;by Manan
                </p>            
        </div>
    </footer>
  )
}

export default Footer