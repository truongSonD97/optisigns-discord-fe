'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/redux/store';
import { fetchRooms } from '@/src/redux/slices/chat/chatSlice';
import RoomSidebar from '@/src/components/chat/RoomSidebar';
import FormInput from '@/src/components/chat/FormInput';
import ChatMessages from '@/src/components/chat/MessagesContent';
import { useSocket } from '@/src/hooks/useSocket';



export default function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedRoom } = useSelector((state: RootState) => state.chat);
  useSocket()
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-900 text-white px-4 py-5">
      {/* 🔥 Discord-Style Room Sidebar */}
      <RoomSidebar />

      {/* 🔥 Chat Area */}
      <div className="w-full flex flex-col border-t  border-bd-base rounded-tr-lg bg-[#1a1a1e]">
        <div className="text-lg font-bold border-b border-bd-base p-2 rounded">
          {selectedRoom?.name || ""}
          </div>
        <ChatMessages/>
        {/* Input Area */}
        {!!selectedRoom && <FormInput/>}
      </div>
    </div>
  );
}
