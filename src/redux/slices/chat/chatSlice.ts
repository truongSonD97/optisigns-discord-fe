import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../services/axiosInstance";
import socketService from "@/src/services/socketService";
import { isEmpty } from "lodash";

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
}

export interface Message {
  id?: number;
  content: string;
  roomId: number;
  senderId?: number;
  type: string;
  username?: string;
}

export interface MessageSending {
  content: string;
  roomId: number;
  type: string;
  senderId: number;
}



const initialState: ChatState = {
  rooms: [],
  loading: false,
  error: null,
  messages: [],
  selectedRoom: null,
  hasMoreMessage: false,
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

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState as ChatState,
  reducers: {
    sendMessage: (state, action: PayloadAction<MessageSending>) => {
      socketService.sendMessage(action.payload);
      state.messages.push(action.payload); // Optimistic UI update
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
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
        state.messages = [...messageData, ...state.messages]; // Prepend older messages
        state.hasMoreMessage = !messageData?.length;
        state.loading = false;
        state.selectedRoom = room

      });
  },
});

export const { sendMessage, receiveMessage, onSelectedRoom } =
  chatSlice.actions;
export default chatSlice.reducer;
