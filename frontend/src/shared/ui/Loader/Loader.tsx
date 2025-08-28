// shared/ui/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: number; // размер круга
  color?: string; // цвет бордера
}

const Loader: React.FC<LoaderProps> = ({
  size = 40,
  color = "border-black",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
      style={{ width: size, height: size }}
    />
  );
};

export default Loader;
