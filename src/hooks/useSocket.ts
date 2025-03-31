import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../services/socketService";
import { RootState } from "../redux/store";
import { Message, receiveMessage } from "../redux/slices/chat/chatSlice";

export const useSocket = () => {
  const dispatch = useDispatch();
  const socket = socketService.getSocket();
  const selectedRoom = useSelector((state: RootState) => state.chat.selectedRoom);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!socket || !selectedRoom?.id || !user) return;

    // Join the selected chat room
    socket.emit("joinRoom", { roomId: selectedRoom.id });

    // Listen for incoming messages in the room
    socket.on("receiveMessage", (message: Message) => {
      if(user.id !== message.senderId){
        dispatch(receiveMessage(message));
      }
    });

    // Clean up on unmount or room change
    return () => {
      socket.emit("leaveRoom", { roomId: selectedRoom.id });
      socket.off("receiveMessage");
    };
  }, [socket, dispatch, selectedRoom, user]);
};
