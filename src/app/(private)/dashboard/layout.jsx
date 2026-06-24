"use client";

import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/pages/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden w-72 lg:block">
                <DashboardSidebar />
            </aside>

            <div className="flex flex-1 flex-col">
                <DashboardHeader />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}