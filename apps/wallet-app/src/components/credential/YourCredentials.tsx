"use client";

import React, { useState } from "react";
import { Modal } from "../common/Modal";
import useResolveCredential from "@/hooks/useResolveCredential";

export const YourCredentials = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uri, setUri] = useState<string>("");
  const { handleResolveCredential } = useResolveCredential();

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleReceiveCredential = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const res = await handleResolveCredential(uri);
    console.log(res);
    setUri("");
    // setIsOpen(!isOpen);
  };

  return (
    <div className="flex w-full justify-between items-center">
      <h2 className="font-bold text-2xl font-sans">Your Credentials</h2>
      <button
        onClick={handleModal}
        className="bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 rounded-md px-5 py-2.5"
      >
        Receive credentials
      </button>
      <Modal
        isOpen={isOpen}
        handleCloseModal={handleModal}
        handleSetUri={setUri}
        handleReceiveCredential={handleReceiveCredential}
        uri={uri}
      />
    </div>
  );
};
