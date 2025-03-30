"use client";

import { Upload, Input, Button } from "antd";
import { SendOutlined, PlusCircleFilled, SmileFilled } from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { sendMessage } from "@/src/redux/slices/chat/chatSlice";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";

export default function FormInput() {
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const { selectedRoom } = useSelector((state: RootState) => state.chat);
  const {user} = useAuth()

  const handleSendMessage = () => {
    if (!selectedRoom || !user?.id){
      toast.error("Please select room")
      return
    } ;
    if (!message.trim()) {
      toast.error("Please enter message")
      return
    } ;
    setMessage("");
    dispatch(sendMessage({roomId:selectedRoom.id,content:message,type:"text",senderId:user.id}))
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };


  return (
    <div className="px-2">
      <div className="flex items-center space-x-2 mt-2 relative bg-[#212125] p-2 border border-bd-base rounded-lg">
        <Upload showUploadList={false} beforeUpload={() => false}>
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
  );
}
