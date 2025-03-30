import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/slices/message/messageSlice';
import socketService from '../services/socketService';

export const useSocket = () => {
  const dispatch = useDispatch();
  const socket = socketService.getSocket()

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message:any) => {
      dispatch(addMessage(message));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, dispatch]);
};
