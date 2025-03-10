"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import DashboardAlumni from '../page/alumni/dashboard';
import DashboardAdmin from '../page/admin/dashboard';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {session?.user?.id_role === 1 ? <DashboardAdmin /> : <DashboardAlumni />}
    </div>
  );
}
