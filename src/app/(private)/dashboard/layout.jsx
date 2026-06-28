"use client";

import React, { useEffect } from "react";
import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/pages/dashboard/DashboardHeader";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (user && !user.isPremium) {
      const checkAndRefreshSession = async () => {
        try {
          const tokenResult = await authClient.token();
          const token = tokenResult?.data?.token;
          if (!token) return;

          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
          const res = await fetch(`${serverUrl}/users/status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            // If the database says they are premium but the session JWT says they are not
            if (data.isPremium) {
              // Trigger a dummy update to force Better Auth to regenerate & update the JWT cookie
              await authClient.updateUser({
                name: user.name,
              });
              // Force refresh local session context state
              await authClient.getSession({ force: true });
            }
          }
        } catch (error) {
          console.error("Error auto-syncing premium status session:", error);
        }
      };

      checkAndRefreshSession();
    }
  }, [user]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 lg:block">
        <DashboardSidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}