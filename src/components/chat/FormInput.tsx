"use client";

import { Upload, Input, Button, Spin } from "antd";
import {  CloseCircleFilled, PlusCircleFilled, SmileFilled } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { sendMessage } from "@/src/redux/slices/chat/chatSlice";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import Image from "next/image";
import ReactPlayer from "react-player";
import { uploadFileToS3 } from "@/src/services/s3Service";
import { nanoid } from 'nanoid'

export default function FormInput() {
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { selectedRoom } = useSelector((state: RootState) => state.chat);
  const {user} = useAuth()


  const handleUpload = (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Only images and videos are supported");
      return false;
    }

    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false; // Prevent automatic upload
  };


  const handleSendMessage = async () => {
    if(uploading){
      return
    }
    if (!selectedRoom || !user?.id){
      toast.error("Please select room")
      return
    } ;
    if (!message.trim() && !file) {
      return
    } ;
    const payload = {
      id: `temp-${Date.now()}-${nanoid()}`,  
      roomId: selectedRoom.id,
      senderId: user.id,
      sender: user,
      createdAt: Date.now(),
    };
    if (file) {
      setUploading(true);
      try {
        const s3Url = await uploadFileToS3(file);
        if(!s3Url) {
          toast.error("S3 error")
          return
        }
        dispatch(
          sendMessage({
            ...payload,
            content: s3Url, // Send the S3 URL
            type: file.type.startsWith("image/") ? "image" : "video",
          })
        );
      } catch (error:any) {
        toast.error(error?.message || "Failed to upload file");
        return;
      } finally {
        setUploading(false);
        setFile(null);
        setPreviewUrl(null);
      }
    } else {
      dispatch(sendMessage({ ...payload, content: message, type: "text", }));
    }
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };



  return (
    <div className="px-2">
      <div className="flex flex-col justify-center space-x-2 mt-2 relative bg-[#212125] p-2 border border-bd-base rounded-lg">
         {/* File Preview Area */}
         {previewUrl && (
          <div className="relative p-2 bg-[#18181b] rounded-lg mb-2 flex items-center w-fit">
            {file?.type.startsWith("image/") ? (
              <Image src={previewUrl} alt="Preview" width={80} height={80} className="rounded-lg" />
            ) : (
              <ReactPlayer url={previewUrl} controls width="80px" height="80px" />
            )}
            <CloseCircleFilled
              className="text-red-500 text-xl ml-2 cursor-pointer"
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
              }}
            />
          {/* Loading Spinner for Upload */}
          {uploading && <div className="left-1/2 -translate-x-1/2 absolute"><Spin /></div> }
          </div>
        )}
        <div className="flex items-center space-x-2 w-full">
        <Upload  accept="" showUploadList={false} beforeUpload={handleUpload}>
          <Button
            className="!bg-transparent !border-0 flex items-center !text-xl "
            icon={<PlusCircleFilled className="!text-white flex self-center" />}
          />
        </Upload>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 placeholder:!text-gray-500 !bg-transparent !border-0 !outline-none !text-white focus:!border-0 focus:!outline-none focus:!shadow-none active:!border-0 active:!outline-none"
          onKeyDown={handleKeyDown}
        />
        <Button
          icon={<SmileFilled className="!text-white flex self-center" />}
          className="!bg-transparent !border-0 flex items-center !text-xl "
          onClick={() => setShowEmoji(!showEmoji)}
        />
        <div className="relative">
          {showEmoji && (
            <div className="absolute bottom-10 right-0 bg-white p-2 rounded shadow-md z-10">
              <EmojiPicker
                onEmojiClick={(emojiObject) =>
                  setMessage((prev) => prev + emojiObject.emoji)
                }
              />
            </div>
          )}
        </div>
        </div>
      </div>

    </div>
  );
}
