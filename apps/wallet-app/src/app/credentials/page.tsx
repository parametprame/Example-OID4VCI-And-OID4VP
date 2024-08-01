import { YourCredentials } from "@/components/credential/YourCredentials";

export default async function CredentialPage() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col gap-5">
        <YourCredentials />
      </div>
    </div>
  );
}
