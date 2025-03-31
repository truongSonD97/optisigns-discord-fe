"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { loginUser } from "@/src/redux/slices/auth/authSlice";
import { AppDispatch } from "@/src/redux/store";
import Link from "next/link";
import axios from "@/src/services/axiosInstance";

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogin = async (values: {
    username: string;
    password: string;
    name: string;
  }) => {
    setLoading(true);
    try {
      await axios.post("/auth/signup", values);
      router.push("/login");
    } catch (err) {
      setError("Invalid username or password.");
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-white h-2/3 w-2/3 rounded-xl flex items-center justify-center">
        <Form
          name="signUp"
          initialValues={{ remember: true }}
          className="w-2/3"
          onFinish={handleLogin}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
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
            <Button block type="primary" htmlType="submit">
              Sign Up
            </Button>
            or <Link href="/login">Login now!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
