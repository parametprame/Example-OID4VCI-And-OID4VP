import { useSession } from "next-auth/react";

const useGetCredentials = () => {
  const { data } = useSession();

  const HOLDER_URL = process.env.NEXT_PUBLIC_HOLDER_URL!;

  const handleRequestCredentials = async () => {
    try {
      const response = await fetch(
        `${HOLDER_URL}/credentials/${data?.user?.name}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRequestCredentials,
  };
};

export default useGetCredentials;
