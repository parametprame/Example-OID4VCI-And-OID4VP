"use client";

import { Loading } from "@/components/Loading";
import { Login } from "@/components/Login";
import { useSession } from "next-auth/react";

const Home = () => {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    return <Login />;
  }

  return <p>Home</p>;
};

export default Home;
