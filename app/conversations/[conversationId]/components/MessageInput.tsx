"use client"

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface Props {
    placeholder?: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
}

const MessageInput = ({ placeholder, id, type, required, register, errors }: Props) => {
    return (
        <div className="relative w-full">
            <input
                id={id}
                required
                placeholder={placeholder}
                type={type}
                autoComplete={id}
                {...register(id, { required })}
                className="
                text-black
                font-light
                py-2
                px-4
                bg-neutral-100
                w-full
                rounded-full
                focus:outline-none
                "
            />
        </div>
    )
}

export default MessageInput