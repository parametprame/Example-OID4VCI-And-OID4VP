"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { NavBar } from "./NavBar";
import { Loading } from "./Loading";
import { Login } from "./Login";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status, data } = useSession();
  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Login />;
  }

  return (
    <>
      {status === "authenticated" && <NavBar />}
      {children}
    </>
  );
};

export default LayoutWrapper;
