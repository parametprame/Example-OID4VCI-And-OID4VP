import { useSession } from "next-auth/react";

const useResolveCredential = () => {
  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;
  const { data } = useSession();

  const handleResolveCredential = async (uri: string) => {
    const response = await fetch(`${HOLDER_URL}/resolve-credential-offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: uri, address: data?.user?.name }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  };

  return {
    handleResolveCredential,
  };
};

export default useResolveCredential;
