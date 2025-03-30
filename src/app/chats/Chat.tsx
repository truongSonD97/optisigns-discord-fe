'use client';

import { useState, useEffect, useRef } from 'react';
import { List, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/redux/store';
import { fetchRooms } from '@/src/redux/slices/chat/chatSlice';
import RoomSidebar from '@/src/components/chat/RoomSidebar';
import FormInput from '@/src/components/chat/FormInput';

interface Message {
  username: string;
  content: string;
}

export default function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const {  messages, loading,selectedRoom } = useSelector((state: RootState) => state.chat);
  console.log("🚀 ~ Chat ~ messages:", messages)
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white px-4 py-5">
      {/* 🔥 Discord-Style Room Sidebar */}
      <RoomSidebar />

      {/* 🔥 Chat Area */}
      <div className="w-full flex flex-col border-t  border-bd-base rounded-tr-lg bg-[#1a1a1e]">
        <div className="text-lg font-bold border-b border-bd-base p-2 rounded">
          {selectedRoom?.name || ""}
          </div>
        <div className="flex-1 overflow-y-auto">
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{msg.username}</Avatar>}
                  title={msg.username}
                  description={msg.content}
                />
              </List.Item>
            )}
          />
          <div ref={chatEndRef} />
        </div>
        {/* Input Area */}
        <FormInput/>
      </div>
    </div>
  );
}
