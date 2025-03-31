import { Avatar, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/redux/store";
import { fetchRoomMessages, Room } from "@/src/redux/slices/chat/chatSlice";

const DEMO_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0ngAqc8J4-EBp59RH5H7G9LC3q-QaKYg8aA&s";


export default function RoomSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms,selectedRoom } = useSelector((state: RootState) => state.chat);
   

  const handleSelectedRoom = (room:Room) => {
    dispatch(fetchRoomMessages({room}))
  }

  return (
    <div className="w-[300px] px-2 bg-[#121214] h-screen flex flex-col py-3 space-y-3 border border-bd-base rounded-tl-lg rounded-bl-lg h-full">
      {rooms.map((room) => (
        <Tooltip title={room.name} placement="right" key={room.id}>
          <div onClick={()=> handleSelectedRoom(room)} className="cursor-pointer flex items-center bg-bd-base p-1 rounded-lg">
            <div
              className={`relative flex items-center justify-center rounded-full  transition-all 
              ${
                selectedRoom?.id === room.id
                  ? "bg-gray-700 scale-110"
                  : "hover:bg-gray-700"
              }
            `}
            >
              <Avatar src={DEMO_URL} size={32} />
              {/* {selectedRoom === room.name && (
                <div className="absolute top-1/2 -left-1 w-2 h-6 bg-white rounded-full"></div>
              )} */}
            </div>
            <span className="font-semibold text-sm ml-2">{room?.name}</span>
          </div>
        </Tooltip>
      ))}
      </div>
  );
}
