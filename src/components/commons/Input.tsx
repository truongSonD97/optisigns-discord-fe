import { Input as AntInput } from "antd";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ type = "text", placeholder, value, onChange }: InputProps) {
  return (
    <AntInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border rounded p-2 w-full"
    />
  );
}
