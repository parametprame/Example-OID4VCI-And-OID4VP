"use client";

import React, { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { BrowserProvider } from "ethers";
import { getCsrfToken, signIn } from "next-auth/react";

export const Login = () => {
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      setProvider(new BrowserProvider(window.ethereum));
    }
  }, []);

  const createSiweMessage = async (address: string, statement: string) => {
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement,
      uri: window.location.origin,
      version: "1",
      chainId: 1,
    });
    return message.prepareMessage();
  };

  const signInWithEthereum = async () => {
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = await createSiweMessage(
        address,
        "Sign in with Ethereum to the app."
      );

      const signature = await signer.signMessage(message);

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Error signing in with Ethereum:", error);
      window.alert(error);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Digital Wallet
          </h1>
          <p className="text-white mt-1">
            The most popular wallet that everyone wants to use!
          </p>
        </div>
      </div>
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white">
        <div className="bg-white">
          <h1 className="text-gray-800 font-bold text-2xl mb-1 text-center md:text-left">
            Hello Again!
          </h1>
          <p className="text-sm font-normal text-gray-600 mb-7 text-center md:text-left">
            Welcome Back
          </p>
          <button
            type="button"
            className="block w-full bg-indigo-600 mt-4 py-2 px-5 rounded-2xl text-white font-semibold mb-2"
            onClick={signInWithEthereum}
          >
            Sign-In with Ethereum
          </button>
        </div>
      </div>
    </div>
  );
};
