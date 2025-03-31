import React from "react";
import Image from "next/image";
import ReactPlayer from "react-player";

export type IMessageType = 'text' | 'image' | 'emoji' | 'gif' | 'video';

interface MessageContentProps {
  content: string;
  type: IMessageType
}

const MessageContent: React.FC<MessageContentProps> = ({ content,type }) => {
  if (type === "image") {
    return (
      <Image 
        src={content} 
        alt="Sent Image" 
        width={200} 
        height={200} 
        className="rounded-lg shadow-md" 
        priority 
      />
    );
  }

  if (type === "video") {
    return <ReactPlayer url={content} controls width="100%" height="auto" />;
  }

  return (
      <p className="text-white rounded-lg font-medium">{content}</p>
  );
};

export default MessageContent;
