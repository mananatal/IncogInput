'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { useCompletion } from "ai/react"
import Link from 'next/link';
import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/ModeToggle';
import { BottomGradient } from '@/components/BottomGradient';
import { LabelInputContainer } from '@/components/LabelInputContainer';


const UserPage = ({params}:{params:{username:string}}) => {
  const [isSending,setIsSending]=useState(false);
  const [feedback,setFeedback]=useState("");
  const { completion,complete,isLoading } =useCompletion({api:"/api/suggest-messages"});

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const {setValue}=form;


  const onSubmit=async (data:z.infer<typeof messageSchema>)=>{
    console.log("PRINTING DATA: ",data)
    try {
      setIsSending(true);
      const response=await axios.post<ApiResponse>('/api/send-message',{username:params.username,content:data.content});
      if(response.data.success){
        toast({
          title:"success",
          description:"Feedback Send Successfully"
        });
      }

    } catch (error) {
        const axiosError=error as AxiosError<ApiResponse>;
        toast({
          title:"OOPS!",
          description:axiosError.response?.data.message ?? "Error while sending Feedback",
          variant:"destructive"
        })
    }finally{
      setIsSending(false);
    }
  }

  useEffect(()=>{
    if(completion.length==0){
      complete("");
    }
  },[completion,complete])

  return (
    <>
    <div className='md:w-[60%] mx-auto relative'>

        <div className='mt-10 flex items-center justify-between'>
          <h2 className="text-2xl md:text-6xl font-bold dark:text-white px-4">Public Profile Link</h2>
          <div className='pr-4'>
            <ModeToggle/>
          </div>
        </div>  

        <div className=" w-full mt-6 mx-auto rounded-none md:rounded-2xl  p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <div className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">                    
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <LabelInputContainer>
                                    <FormLabel>Send Anonynomous Feedback to @{params.username}</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                          placeholder="Write Your Anonymous Feedback Here" 
                                          {...field} 
                                          onChange={
                                            (e)=>{
                                              setFeedback(e.target.value); 
                                              field.onChange(e);                                       
                                            }}
                                          value={feedback}
                                        />
                                    </FormControl>
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <button
                        type="submit"
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        disabled={isSending}
                    >
                        Send
                        <BottomGradient />
                    </button>                        
                </form>
            </Form>
          </div>
        </div>

        <div className='mt-6 mb-10  px-4 '>            
            <button
                type="submit"
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 px-6 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                disabled={isLoading}
                onClick={()=>complete("")}
            >
                Suggest Feedbacks
                <BottomGradient />
            </button>    

            <p className="text-neutral-600 text-[1rem] max-w-sm mt-3 dark:text-neutral-300">
              Click on any Feedback below to select it.
            </p>                    

            <div className=" w-full mt-4 mx-auto rounded-lg md:rounded-2xl p-4 md:p-6 shadow-input bg-white dark:bg-black">
                <h2 className="font-bold text-2xl mb-2 text-neutral-800 dark:text-neutral-200">
                   Feedbacks
                </h2>
                <div className='flex flex-col space-y-3'>
                  {
                      completion.split("||").map((value,index)=>(
                          <button                    
                            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 px-6 min-h-10 text-white rounded-md py-2 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                            key={index}
                            onClick={
                              ()=>{
                                setFeedback(value)
                                setValue('content',value);
                              }}
                          >
                              {value}
                              <BottomGradient />
                            </button> 
                      ))
                  }
                </div>
              
            </div>            
        </div>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        
        <div className='flex flex-col justify-center items-center gap-4 mb-8'>
          <p>Get Your Feedback Board</p>
          <Link href={"/signup"}>
            <button
                  type="submit"
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 px-6 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              >
                  Create Your Account
                  <BottomGradient />
            </button>
          </Link>
          
        </div>


    </div>
    <Footer/>
    </>
  )
}

export default UserPage

