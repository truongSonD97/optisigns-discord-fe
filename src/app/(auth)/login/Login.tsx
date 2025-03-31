"use client";
import { useDispatch } from "react-redux";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { useRouter } from "next/navigation";
import { loginUser } from "@/src/redux/slices/auth/authSlice";
import { AppDispatch } from "@/src/redux/store";
import Link from "next/link";

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        router.push("/chats"); // Redirect if login successful
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-white h-2/3 w-2/3 rounded-xl flex items-center justify-center">
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          className="w-2/3"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            or <Link href="/signup">Register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
