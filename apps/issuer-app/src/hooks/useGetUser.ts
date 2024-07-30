import { useState, useEffect } from "react";

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  faculty: string;
  major: string;
  status: string;
  gpa: number;
}

const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const ISSUER_URL = process.env.NEXT_PUBLIC_ISSUER_URL!;

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${ISSUER_URL}/user/${userId}`, {
          method: "GET",
        });

        if (response.ok) {
          const data: User = await response.json();
          setUser(data);
        } else {
          setError("Failed to fetch user data: " + response.statusText);
        }
      } catch (error) {
        setError("Error fetching user data: " + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useGetUser;
