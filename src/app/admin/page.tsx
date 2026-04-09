"use client";

import { useAuth } from "@/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminRoute({ children }: any) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, loading]);

  if (!user) return <p>Loading...</p>;

  return children;
}