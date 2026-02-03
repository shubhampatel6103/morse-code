import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h1 className="text-4xl font-bold text-center mb-8 font-press-start-2p text-orange-900">
      {text}
    </h1>
  );
};

export default Title;
