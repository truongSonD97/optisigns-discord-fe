import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  content: string;
  roomId: number;
  senderId: number;
  type: string;
}

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
