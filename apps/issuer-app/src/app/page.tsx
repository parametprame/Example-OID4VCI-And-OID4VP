"use client";

import { Profile } from "@/components/Profile";
import { Login } from "@/components/Login";
import useGetUser from "@/hooks/useGetUser";
import { Loading } from "@/components/Loading";

export default function Home() {
  const { user, loading } = useGetUser();

  if (loading) return <Loading />;

  return <>{user ? <Profile {...user} /> : <Login />}</>;
}
