"use client";

import { useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchMoreMessages, Message } from "@/src/redux/slices/chat/chatSlice";
import { Avatar, Skeleton } from "antd";
import clsx from "clsx";
import { isWithinDynamicMinutes } from "@/src/utils/timestamptUtil";
import MessageContent from "./MessageContent";

const ChatMessages: React.FC = () => {
  const { messages, selectedRoom, hasMoreMessage, loadingMore,triggerNewMessage } =
    useSelector((state: RootState) => state.chat);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  // Reverse messages (oldest to newest) so latest messages are at the bottom
  // Reverse messages once using useMemo (cached result)
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if(selectedRoom?.id){
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  }, [selectedRoom?.id, triggerNewMessage]);

  // Function to load more messages when scrolling to the top
  const handleScroll = async () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || loadingMore || !hasMoreMessage || !selectedRoom?.id) return;

    if (chatContainer.scrollTop === 0) {
      // User reached the top, load more messages
      const previousScrollHeight = chatContainer.scrollHeight;
      const lastMessage = reversedMessages[0];

      await dispatch(
        fetchMoreMessages({
          roomId: selectedRoom.id,
          before: lastMessage.createdAt,
        })
      );

      // Restore scroll position
      requestAnimationFrame(() => {
        chatContainer.scrollTop =
          chatContainer.scrollHeight - previousScrollHeight;
      });
    }
  };


  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    return messages.reduce((acc: { [key: string]: Message[] }, message) => {
      const date = format(new Date(message.createdAt), "MMMM dd yyyy"); // Convert timestamp to Date
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});
  };

  // Grouped messages (cached with useMemo)
  const groupedMessages = useMemo(
    () => groupMessagesByDate(reversedMessages),
    [reversedMessages]
  );

  return (
    <div  
    ref={chatContainerRef} 
    className="flex flex-col h-full overflow-y-auto px-4 py-2 pb-0 relative"
    onScroll={handleScroll} // Attach scroll event
    >
      {!!loadingMore && (
        <div className="flex flex-col space-y-2">
          {/* Skeleton Messages Placeholder */}
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start space-x-2">
              <Skeleton.Avatar active size={40} shape="circle" />
              <div className="flex flex-col space-y-1">
                <Skeleton.Input active size="small" style={{ width: 120 }} />
                <Skeleton.Input active size="default" style={{ width: 200 }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Render messages by date */}
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="text-center text-gray-400 text-sm py-2">{date}</div>
          {/* Messages */}
          <div>
            {msgs.map((msg, index) => {
              const isFirstMessageOfSender =
                index === 0 ||
                msgs[index - 1].senderId !== msg.senderId ||
                !isWithinDynamicMinutes(
                  new Date(msg.createdAt),
                  new Date(msgs[index - 1].createdAt),
                  5
                );

              return (
                <div
                  key={`${msg.id}-${msg.createdAt}`}
                  className="flex items-start my-1"
                >
                  {/* Intersection Observer (Load More) */}
                  {/* Show avatar & name only for the first message of a user in a sequence */}
                  {isFirstMessageOfSender && (
                    <Avatar
                      size={40}
                      className="rounded-full h-[40px] w-[40px]"
                    >
                      {msg.sender?.name}
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    {/* Show name & timestamp only for the first message of a user in a sequence */}
                    {isFirstMessageOfSender && (
                      <div className="text-white font-bold px-3">
                        {msg?.sender?.name}
                        <span className="font-normal text-xs ml-2 text-gray-400">
                          {format(new Date(msg.createdAt), "hh:mm a")}
                        </span>
                      </div>
                    )}
                    <div
                      className={clsx(
                        `px-3 py-[1px] rounded-lg text-white self-start`,
                        { "ml-[40px]": !isFirstMessageOfSender },
                        {"mb-[5px]": isFirstMessageOfSender}
                      )}
                    >
                      <MessageContent content={msg.content} type={msg.type} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div className="" ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
