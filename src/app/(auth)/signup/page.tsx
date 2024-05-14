"use client"
 
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {Loader2} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";


const Page = () => {

    const [username,setUsername]=useState('');
    const [usernameMessage,setUsernameMessage]=useState('');
    const [isCheckingUsernameUnique,setIsCheckingUsernameUnique]=useState(false);
    const [isFormSubmitting,setIsFormSubmitting]=useState(false);
    const debounced = useDebounceCallback(setUsername, 400);
    const router=useRouter();

    useEffect(()=>{
        const checkIsUsernameUnique=async()=>{
            try {
                if(username){
                    setIsCheckingUsernameUnique(true);
                    setUsernameMessage('');
                    const response=await axios.get(`/api/check-username-unique?username=${username}`);
                    if(response?.data?.success){
                        setUsernameMessage(response.data?.message);
                    }
                }
            } catch (error) {
                const axiosError=error as AxiosError<ApiResponse>;
                setUsernameMessage( axiosError.response?.data.message ?? 'Error checking username');
            }finally{
                setIsCheckingUsernameUnique(false);
            }
        }
        checkIsUsernameUnique();
    },[username]);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          username: "",
          password:"",
          email:""
        },
    });

    const onSubmit=async (data: z.infer<typeof signUpSchema>)=>{
        try {
            setIsFormSubmitting(true);
            const response=await axios.post('/api/signUp',data);
            if(response?.data?.success){
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
                router.replace(`/verify/${username}`)
            }
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            ('There was a problem with your sign-up. Please try again.');
            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant:"destructive"
            });
        }finally{
            setIsFormSubmitting(false);
        }
    }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
        <div className="max-w-md  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
            Welcome to IncogInput
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Sign up to start your Anonymous Adventure
        </p>

        {/* signup form */}
        <div className="mt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <LabelInputContainer>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Username"                                            
                                            {...field} 
                                            onChange={(e)=>{
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {
                                        isCheckingUsernameUnique && <Loader2 className="animate-spin dark:text-white text-sm"/>
                                    }
                                <p 
                                    className={`text-sm ${usernameMessage==="Username is Available"?'text-green-500':'text-red-500'}`}
                                >
                                    {username && usernameMessage}
                                </p>
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <LabelInputContainer>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Email" {...field} />
                                    </FormControl>
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <LabelInputContainer>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Password" type="password" {...field} />
                                    </FormControl>
                                </LabelInputContainer>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <button
                        type="submit"
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        disabled={isFormSubmitting}
                    >
                        Sign up &rarr;
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Already Have An Account? {' '}
                        <Link href={`/signin`} className="text-blue-600 hover:text-blue-800">
                            Sign In
                        </Link>
                    </div>    
                </form>
            </Form>
        </div>


        </div>
    </div>
  )
}

export default Page


const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
  };
   
  const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };