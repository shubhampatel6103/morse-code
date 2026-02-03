import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="bg-orange-700 hover:bg-orange-900 text-white font-bold py-2 px-4 rounded font-press-start-2p text-sm"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
