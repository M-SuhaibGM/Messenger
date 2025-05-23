"use client"
import useConversation from "@/hooks/useConversation"
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi";


const Form = () => {
    const { conversationId } = useConversation();



    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ""
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true })
        axios.post('/api/messages', {
            ...data,
            conversationId,
        })
    }
    return (
        <div
            className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full"
        >
            <HiPhoto size={30} className="text-sky-700" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
                <MessageInput
                    id='message'
                    register={register}
                    errors={errors}
                    required
                    placeholder="write a message"
                />
                <button className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition" type="submit">
                    <HiPaperAirplane size={18}   className="text-white rotate-90 " />
                </button>
            </form>
        </div>
    )
} 

export default Form 