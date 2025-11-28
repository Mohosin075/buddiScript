import React from "react";

interface SpinnerProps {
  size?: number; // px
  colorClass?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 48,
  colorClass = "border-blue-500",
}) => {
  const style: React.CSSProperties = {
    height: size,
    width: size,
  };
  return (
    <div
      style={style}
      className={`animate-spin rounded-full border-b-2 ${colorClass}`}
    />
  );
};

export default Spinner;
