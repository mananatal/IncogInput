'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
  
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/User.model"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "./ui/use-toast"
  
type MessageCardProps={
    message: Message;
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {

    const [isDeleting,setIsDeleting]=useState(false);

    const handleMessageDelete=async ()=>{
        try {
            setIsDeleting(true);
            const response=await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`)

            if(response?.data?.success){
                toast({
                    title:response.data.message
                })
            }
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            toast({
                title:axiosError?.response?.data?.message
            })
        }finally{
            setIsDeleting(false);
        }
        onMessageDelete(message?._id)
    }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" onClick={handleMessageDelete}><X className="h-5 w-5"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
    </Card>
  )
}

export default MessageCard