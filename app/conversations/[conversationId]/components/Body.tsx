"use client"
import useConversation from "@/hooks/useConversation";
import { FullMessageType } from "@/types/index"
import { useState, useRef, useEffect } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/lib/Pusher";
import { find } from "lodash";

interface Props {
  initialMessages: FullMessageType[];
}
const Body = ({ initialMessages }: Props) => {
  const [messages, setmessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);

  }, [conversationId])
  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();
    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setmessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message]
      })
      bottomRef?.current?.scrollIntoView();
    }


    const updatemessageHandler = (message: FullMessageType) => {
      setmessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === message.id) {
          return message;
        }
        return currentMessage;
      }))
    }
    pusherClient.bind('messages:new', messageHandler)
    pusherClient.bind('message:update', updatemessageHandler)
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler)
      pusherClient.unbind('message:update', updatemessageHandler)
    }
  }, [conversationId])




  return (
    <div className="flex-1 overflow-y-auto">
      
      {messages.map((message, i) => (
        <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />
      ))}
      <div ref={bottomRef} className="p-4" />
    </div>
  )
}

export default Body