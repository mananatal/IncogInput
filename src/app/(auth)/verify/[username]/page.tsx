"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";



const VerifyAccount = () => {

    const {username}=useParams();
    const router=useRouter();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
          code:'',
        },
    });


    const onSubmit=async(data: z.infer<typeof verifySchema>)=> {
      try {
          const response=await axios.post("/api/verify-code",{code:data.code,username});
          if(response.data?.success){
            toast({
              title:"Success",
              description:"Account Verified Successfully"
            })
            router.replace('signin');
          }
      } catch (error) {
          const axiosErrors=error as AxiosError<ApiResponse>;
          toast({
            title:"OOPS!",
            description:axiosErrors?.response?.data?.message,
            variant:"destructive"
          })
      }
    }



    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="max-w-md  w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
          <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
              Verify Your Account
          </h2>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Enter the verification code sent to your email
          </p>
  
          <div className="mt-6">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      
                      <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                              <FormItem>
                                  <LabelInputContainer>
                                      <FormLabel>One-Time Password</FormLabel>
                                      <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                          <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                          </InputOTPGroup>
                                          <InputOTPSeparator />
                                          <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                          </InputOTPGroup>
                                        </InputOTP>
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
                          Verify &rarr;
                          <BottomGradient />
                      </button>  
              
                  </form>
              </Form>
          </div>
  
  
          </div>
      </div>
  ); 
 
}

export default VerifyAccount

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
