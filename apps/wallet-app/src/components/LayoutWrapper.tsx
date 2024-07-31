"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { NavBar } from "./common/NavBar";
import { Loading } from "./common/Loading";
import { Login } from "./common/Login";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
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
