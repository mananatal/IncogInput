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
import dayjs from "dayjs"
  
type MessageCardProps={
    message: Message;
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {

    const [isDeleting,setIsDeleting]=useState(false);

    const handleMessageDelete=async ()=>{
        try {
            setIsDeleting(true);
            onMessageDelete(message?._id)
            const response=await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`)

            if(response?.data?.success){
                toast({
                    title:response.data.message
                })
            }
        } catch (error) {
            const axiosError=error as AxiosError<ApiResponse>;
            toast({
                title:axiosError?.response?.data?.message ?? "Error while deleting message",
                variant:"destructive"
            })
        }finally{
            setIsDeleting(false);
        }
    }

  return (
    <Card>
        <CardHeader >
            <div className="flex justify-between items-center">
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive"  ><X className="h-5 w-5"/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMessageDelete} disabled={isDeleting}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="text-sm">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>
        </CardHeader>
        
    </Card>
  )
}

export default MessageCard