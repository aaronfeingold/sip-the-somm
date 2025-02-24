"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/chat");
  }, [router]);

  return null;
}
