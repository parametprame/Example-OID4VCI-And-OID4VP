import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleModal = () => {
    setIsOpen(!isOpen);
  };
  return { isOpen, handleModal };
};
