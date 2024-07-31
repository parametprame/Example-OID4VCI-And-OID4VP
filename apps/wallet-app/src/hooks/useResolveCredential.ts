import { useState } from "react";

const useResolveCredential = () => {
  const [error, setError] = useState<string | null>(null);
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;

  const handleResolveCredential = async (uri: string) => {
    try {
      const response = await fetch(`${HOLDER_URL}/resolve-credential-offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: uri }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        setError("Resolve credential failed: " + response.statusText);
      }
    } catch (error) {
      setError("Error during Resolve credential: " + (error as Error).message);
    }
  };

  return {
    handleResolveCredential,
    error,
  };
};

export default useResolveCredential;
