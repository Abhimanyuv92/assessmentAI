"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  role: string;
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== role) {
      router.push("/");
    } else {
      setAuthorized(true);
    }
  }, [role, router]);

  if (!authorized) return null;
  return <>{children}</>;
}