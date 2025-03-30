
import { Button as AntButton } from 'antd';
interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return (
    <AntButton onClick={onClick} className="bg-blue-500 text-white p-2 rounded w-full">
      {text}
    </AntButton>
  );
}
