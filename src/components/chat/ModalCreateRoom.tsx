import { useAuth } from "@/src/hooks/useAuth";
import { createNewRoom } from "@/src/redux/slices/chat/chatSlice";
import { AppDispatch } from "@/src/redux/store";
import { Modal, Input, Form } from "antd";
import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import AsyncSelect from "react-select/async";
import axios from '@/src/services/axiosInstance'
import { debounce, map } from "lodash";

interface CreateRoomModalProps {
  visible: boolean;
  onClose: () => void;
}

interface UserOption {
  value: string;
  label: string;
}

export default function CreateRoomModal({ visible, onClose }: CreateRoomModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const cacheRef = useRef<Record<string, UserOption[]>>({}); // Cache for search results

  const handleCreate = ({ roomName, usernames }: { roomName: string; usernames: UserOption[] }) => {
    if (!user?.id) return;
    if (!roomName.trim()) {
      alert("Room name is required!");
      return;
    }
    const params = { name: roomName, ownerId: user?.id, usernames: map(usernames, (u) => u.value) };
    dispatch(createNewRoom(params));
    onClose();
    form.resetFields();
  };

  // Debounced function to fetch users (Returns a Promise)
//   const fetchUsers = debounce(async (inputValue: string): Promise<UserOption[]> => {
//     if (!inputValue.trim()) return [];

//     if (cacheRef.current[inputValue]) {
//       return cacheRef.current[inputValue]; // Return cached result if available
//     }

//     try {
//       const response = await axios.get(`/users/search?query=${inputValue}`);
//       const optionsData = response.data.map((u: any) => ({
//         value: u.email,
//         label: u.name,
//       }));

//       cacheRef.current[inputValue] = optionsData; // Cache result
//       return optionsData;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       return [];
//     }
//   }, 500);

//   // Ensure loadUsers is stable across renders and returns a Promise
//   const loadUsers = useCallback((inputValue: string) => fetchUsers(inputValue), []);


const loadUsers = async (inputValue: string): Promise<UserOption[]> => {
    if (!inputValue.trim()) return [];
    const response = await axios.get(`/users/search?query=${inputValue}`);
    const data =  response.data;
    const optionsData = map(data, u => ({value:u.username, label:u.name}))
    return optionsData; // ✅ Ensure this returns an array of { value, label }
  };

  return (
    <Modal
      open={visible}
      title="Create a new Room"
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      onCancel={onClose}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
          clearOnDestroy
          onFinish={(values) => handleCreate(values)}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item name="roomName" label="Room Name" rules={[{ required: true, message: "Please input the name of the room!" }]}>
        <Input />
      </Form.Item>
      {/* Multiple Emails Input */}
      <Form.Item
        name="usernames"
        label="Members (Emails)"
        rules={[{ required: true, message: "Please add at least one email!" }]}
      >
        <AsyncSelect
          isMulti
          cacheOptions
          loadOptions={loadUsers} // ✅ Now returns a Promise correctly
          defaultOptions
          placeholder="Search and select users"
        />
      </Form.Item>
    </Modal>
  );
}
