"use client"
 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn} from "next-auth/react"

const SignInPage = () => {

    const router=useRouter();

    

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          identifier: "",
          password:"",
        },
    });

    const onSubmit=async (data: z.infer<typeof signInSchema>)=>{
        const result=await signIn("credentials",
            {
                redirect:false,
                identifier:data.identifier,
                password:data.password,
            }
        )
        console.log(result)

        if(!result?.ok){
            toast({
                title:"Login Failed",
                description:result?.error,
                variant:"destructive"
            });
        }

        if(result?.ok){
            toast({
                title:"Success",
                description:"Logged In Successfully",            
            });
            router.replace("/dashboard")
        }
    }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="max-w-md  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
            Welcome to IncogInput
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Login to start your Anonymous Adventure
        </p>

        {/* signup form */}
        <div className="mt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <LabelInputContainer>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Your Email or Username" {...field} />
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
                    >
                        Sign in &rarr;
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Didn&apos;t Have an Account? {' '}
                        <Link href={`/signup`} className="text-blue-600 hover:text-blue-800">
                            Sign Up
                        </Link>
                    </div>    
                </form>
            </Form>
        </div>


        </div>
    </div>
  )
}

export default SignInPage


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