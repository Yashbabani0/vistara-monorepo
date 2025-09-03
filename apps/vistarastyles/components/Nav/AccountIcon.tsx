import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

async function UserAuthStatus() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <Link
        href="/sign-in"
        className="font-bold flex items-center justify-center"
      >
        <User className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard"
      className="w-5 h-5 flex items-center justify-center"
    >
      <UserButton />
    </Link>
  );
}

function AuthLoadingState() {
  return <Skeleton className="h-8 w-8 rounded-full bg-zinc-400" />;
}

export default function AccountIcon() {
  return (
    <div>
      <Suspense fallback={<AuthLoadingState />}>
        <UserAuthStatus />
      </Suspense>
    </div>
  );
}
