"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata?.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return <SignIn />;
}
