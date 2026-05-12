"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  role: string;
}

export default function AuthGuard({ children, role }: AuthGuardProps) {
  const router = useRouter();
    const userRole = localStorage.getItem("role");

 if (userRole !== role)
      {router.push("/");
      return}
  

  return <>{children}</>;
}