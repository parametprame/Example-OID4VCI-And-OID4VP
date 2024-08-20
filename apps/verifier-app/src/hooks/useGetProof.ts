import { useState } from "react";

const useGetProof = () => {
  const [proof, setProof] = useState("");
  const [error, setError] = useState<string | null>(null);
  const VERIFIER_URL = process.env.NEXT_PUBLIC_VERIFIER_URL!;

  const handleRequestProof = async () => {
    try {
      const response = await fetch(`${VERIFIER_URL}/request-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProof(data.proofRequest);
      } else {
        setError("Request proof failed: " + response.statusText);
      }
    } catch (error) {
      setError("Error during request proof: " + (error as Error).message);
    }
  };

  return {
    proof,
    handleRequestProof,
    error,
  };
};

export default useGetProof;
