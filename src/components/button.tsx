"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, href, icon }) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) return router.push(href);
    if (onClick) return onClick();
  };

  return (
    <button
      className="flex items-center gap-2 bg-orange-700 hover:bg-orange-900 text-white font-bold py-1 px-3 sm:py-2 sm:px-4 rounded font-press-start-2p text-xs sm:text-sm"
      onClick={handleClick}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
