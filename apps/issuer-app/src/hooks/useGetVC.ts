import { useState } from "react";

const useGetVC = () => {
  const [vc, setVc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ISSUER_URL = process.env.NEXT_PUBLIC_ISSUER_URL!;

  const handleRequestVc = async () => {
    const userId = localStorage.getItem("user_id");

    try {
      const response = await fetch(`${ISSUER_URL}/request-credential`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setVc(data.credentials);
      } else {
        setError("Login failed: " + response.statusText);
      }
    } catch (error) {
      setError("Error during login: " + (error as Error).message);
    }
  };

  return {
    vc,
    handleRequestVc,
    error,
  };
};

export default useGetVC;
