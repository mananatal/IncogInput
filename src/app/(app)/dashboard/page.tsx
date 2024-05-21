'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { Message } from '@/models/User.model'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

const Dashboard = () => {

  const [messages,setMessages]=useState<Message[]>([]);
  const [loading,setLoading]=useState(false);
  const [isSwitchLoading,setIsSwitchLoading]=useState(false);

  const {data:session}=useSession();

  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const {register,watch,setValue}=form;

  const handleMessageDelete=(messageId:string)=>{
    setMessages(messages.filter((message)=>message._id!==messageId));    
  }
  
  const acceptMessages=watch("acceptMessages")

  const fetchAcceptMessages=useCallback(async ()=>{
      setIsSwitchLoading(true);
      try {
        const response=await axios.get<ApiResponse>("/api/accept-messages");
        if(response.data.success){
            setValue("acceptMessages",response.data.isAcceptingMessages!);
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>;
        console.error("Error while fetching accept messagess: ",axiosError.response?.data?.message);
      }finally{
        setIsSwitchLoading(false);
      }
    },[setValue])

  const fetchMessages=useCallback(async (refresh:boolean=false)=>{
      try {
        setIsSwitchLoading(true);
        setLoading(true);
        const response=await axios.get<ApiResponse>("/api/get-messages");
        if(response.data.success){
          setMessages(response.data.messages || []);
        }
        if(refresh){
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>;
        // console.error("Error while fetching accept messagess: ",axiosError.response?.data?.message);
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      }finally{
        setIsSwitchLoading(false);
        setLoading(false);
      }
  },[setLoading,setMessages])

  const handleSwitchChange=async ()=>{
    try {
      setIsSwitchLoading(true);
      const response=await axios.post<ApiResponse>("/api/accept-messages",{acceptMessages:!acceptMessages})
      if(response.data.success){
        setValue("acceptMessages",response.data.isAcceptingMessages!);
        toast({
          title: response.data.message,
          variant: 'default',
        });
      }
    } catch (error) {
      const axiosError=error as AxiosError<ApiResponse>;
      // console.error("Error while fetching accept messagess: ",axiosError.response?.data?.message);
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }finally{
      setIsSwitchLoading(false);
    }
  }

  const username=session?.user?.username;
  // const baseUrl=`${window.location.protocol}//${window.location.host}`
  const baseUrl=window.location.origin;
  const profileUrl=baseUrl+`/u/${username}`

  const copyToClipboard=()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title:`Copied ${profileUrl}`
    })
  }

  useEffect(()=>{
    if(!session || !session?.user) return;
    fetchAcceptMessages();
    fetchMessages();
  },[setMessages,setLoading,session,fetchAcceptMessages,fetchMessages])


  return (
    <div className='md:w-[75%] mx-auto'>
      <div className='mt-10'>
        <h2 className="text-2xl md:text-6xl font-bold dark:text-white px-4">User Dashboard</h2>
      </div>

      <div className='mt-6 px-4'>
        <h2 className='font-bold dark:text-white text-lg'>Copy Your Unique Link</h2>
        <div className='flex items-center mt-2 space-x-1 '>
          <div className='w-[70%]'>
            <Input
              type="text"
              readOnly
              value={profileUrl}
              className='cursor-pointer'
            />
          </div>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className='mt-6 flex flex-col space-y-2 px-4'>
        <p className='font-bold dark:text-white text-lg'>Accept Messages</p>
        <Switch
          className='text-2xl'
          checked={acceptMessages}
          disabled={isSwitchLoading}
          onCheckedChange={handleSwitchChange}
          {...register("acceptMessages")}
        />
      </div>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className='px-4'>
        <Button
          className='-mt-6'
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div>
        {
          messages.length>0?
          <div className='grid md:grid-cols-2 gap-6 mt-6 pb-10 px-4'>
            {
              messages.map((message,index)=>(
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleMessageDelete}
                />
              ))
            }
          </div>
          :
          <div className='px-4 mt-2'>
            No Feedback Found
          </div>
        }
      </div>


    </div>
  )
}

export default Dashboard