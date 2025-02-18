"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Gunakan next/navigation

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, []);

  return null;
}
