"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { useRouter } from 'next/navigation'
import { loginUser } from "@/src/redux/slices/auth/authSlice";
import { AppDispatch } from "@/src/redux/store";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

  const handleLogin = async (values:{username:string, password:string}) => {
    setLoading(true);
    try {
      const result = await dispatch(loginUser(values));
      console.log("🚀 ~ handleLogin ~ result:", result)
    if (loginUser.fulfilled.match(result)) {
      router.push('/chats'); // Redirect if login successful
    }
    } catch (err) {
      setError("Invalid username or password.");
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={handleLogin}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
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
        or <a href="">Register now!</a>
      </Form.Item>
    </Form>
    </div>

  );
}
