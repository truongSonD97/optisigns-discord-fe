import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../services/axiosInstance";
import socketService from "@/src/services/socketService";
import { isEmpty } from "lodash";
import { IMessageType } from "@/src/components/chat/MessageContent";

export interface Room {
  id: number;
  name: string;
}

interface ChatState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  messages: Message[];
  selectedRoom?: Room | null;
  hasMoreMessage?: boolean;
  loadingMore:boolean;
  triggerNewMessage:boolean
}

export interface Message {
  id?: number;
  content: string;
  roomId: number;
  senderId?: number;
  type: IMessageType;
  username?: string;
  createdAt: number;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface MessageSending {
  content: string;
  roomId: number;
  type: IMessageType;
  senderId: number;
  createdAt: number;
}



const initialState: ChatState = {
  rooms: [],
  loading: false,
  error: null,
  messages: [],
  selectedRoom: null,
  hasMoreMessage: false,
  loadingMore:false,
  triggerNewMessage:false
};

// ✅ Fetch Rooms API
export const fetchRooms = createAsyncThunk<
  Room[],
  void,
  { rejectValue: string }
>("chat/fetchRooms", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/rooms");
    return response.data;
  } catch (error) {
    return rejectWithValue("Failed to fetch rooms");
  }
});

export const fetchRoomMessages = createAsyncThunk(
  "chat/fetchRoomMessages",
  async ({ room, query }: { room: Room; query?: Record<string,string> }) => {
    const queryString = new URLSearchParams(query).toString();
    const res = await axios.get(`/messages/${room.id}?${queryString}`);
    return {messageData: res.data, room}; // API should return { messages, hasMore }
  }
);


// Fetch More Messages
export const fetchMoreMessages = createAsyncThunk(
  "chat/fetchMoreMessages",
  async ({ roomId, before }: { roomId: number; before: number }) => {
    const response = await axios.get(`/messages/${roomId}`, {
      params: { before },
    });
    return response.data;
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: initialState as ChatState,
  reducers: {
    sendMessage: (state, action: PayloadAction<MessageSending>) => {
      socketService.sendMessage(action.payload);
      state.messages.unshift(action.payload); 
      state.triggerNewMessage = !state.triggerNewMessage// Optimistic UI update
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      state.messages.unshift(action.payload);
      state.triggerNewMessage = !state.triggerNewMessage
    },
    onSelectedRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchRoomMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        const {messageData,room} = action.payload
        state.messages = [...messageData]; // Prepend older messages
        state.hasMoreMessage = !!messageData?.length;
        state.loading = false;
        state.selectedRoom = room
      })
      .addCase(fetchMoreMessages.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreMessages.fulfilled, (state, action) => {
        state.loadingMore = false;
        if(!action.payload?.length){
          state.hasMoreMessage = false
          return
        }
        const newMessage = ([...state.messages]).concat(action.payload)
        state.messages = newMessage
        state.hasMoreMessage = true
      })
      .addCase(fetchMoreMessages.rejected, (state) => {
        state.loadingMore = false;
        state.hasMoreMessage = false
      });
  },
});

export const { sendMessage, receiveMessage, onSelectedRoom } =
  chatSlice.actions;
export default chatSlice.reducer;
