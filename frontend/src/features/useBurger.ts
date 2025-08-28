import { useState } from "react";

export const useBurger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  return { isOpen, toggle };
};
