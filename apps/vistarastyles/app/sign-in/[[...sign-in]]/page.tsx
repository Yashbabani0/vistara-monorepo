import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center my-8 justify-center w-screen">
      <SignIn />
    </div>
  );
}
