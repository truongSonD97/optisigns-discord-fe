"use client";
import { useState } from "react";
import axios from "../../../services/axiosInstance";
import Input from "@/src/components/commons/Input";
import Button from "@/src/components/commons/Button";


export default function RegisterPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleRegister = async () => {
    try {
      await axios.post("/auth/register", credentials);
      alert("Registered successfully. Please log in.");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl">Register</h1>
      <Input type="text" placeholder="Username" onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
      <Input type="password" placeholder="Password" onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
      <Button text="Register" onClick={handleRegister} />
    </div>
  );
}
