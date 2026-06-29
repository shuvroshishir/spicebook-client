import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
    Drawer,
    Button,
    Avatar,
    Divider,
} from "@heroui/react";

import {
    Bars,
    House,
    CirclePlus,
    Heart,
    Person,
} from "@gravity-ui/icons";

import { LuCrown } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import { userMenuItems, adminMenuItems } from "./menuItems";

const SidebarContent = () => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get user session
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isLoading = !mounted || isPending;

    if (isLoading) {
        return (
            <>
                {/* User Profile Card Skeleton */}
                <div className="p-4 border-b border-border/50">
                    <div className="rounded-2xl p-4 bg-default-50/50 border border-border/40 flex items-center gap-3 animate-pulse">
                        {/* Avatar Skeleton */}
                        <div className="w-8 h-8 rounded-full bg-default-200 shrink-0" />
                        {/* Text Skeleton */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-3 w-20 bg-default-200 rounded-sm animate-pulse" />
                            <div className="h-2 w-32 bg-default-200 rounded-sm animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Navigation Skeleton */}
                <div className="space-y-2 p-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <div key={val} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-default-50/20">
                            <div className="size-5 rounded-md bg-default-200 shrink-0 animate-pulse" />
                            <div className="h-4 w-28 bg-default-200 rounded-sm animate-pulse" />
                        </div>
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            {/* User Profile Card */}
            <div className="p-4 border-b border-border/50">
                <Link href="/dashboard/profile" className="block group">
                    <div className="relative overflow-hidden rounded-2xl p-4 bg-default-50/50 border border-border/40 hover:bg-default-100/60 hover:border-primary/20 hover:shadow-xs transition-all duration-300">
                        {/* Glow effect for premium user */}
                        {user?.isPremium && (
                            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                            {user?.isPremium ? (
                                <div className="relative shrink-0">
                                    <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-500 shadow-xs">
                                        <div className="p-[1px] bg-background rounded-full">
                                            <Avatar size="sm" className="cursor-pointer">
                                                <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                                <Avatar.Fallback className="bg-default-100 text-foreground font-black text-xs">
                                                    {user?.name ? user.name.charAt(0) : "U"}
                                                </Avatar.Fallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-0.5 border border-background shadow-xs">
                                        <LuCrown className="size-2 text-white" />
                                    </div>
                                </div>
                            ) : (
                                <Avatar size="sm" className="shrink-0 border-2 border-border/60">
                                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name ? user.name : "User"} src={user?.image} />
                                    <Avatar.Fallback className="bg-default-100 text-foreground font-black text-xs">
                                        {user?.name ? user.name.charAt(0) : "U"}
                                    </Avatar.Fallback>
                                </Avatar>
                            )}

                            <div className="overflow-hidden flex-1 min-w-0">
                                {user?.isPremium ? (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h3 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                                            {user?.name || "User"}
                                        </h3>
                                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest shrink-0">
                                            <LuCrown className="size-2 text-amber-500" /> PRO
                                        </span>
                                    </div>
                                ) : (
                                    <h3 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                                        {user?.name ? user.name : "User"}
                                    </h3>
                                )}
                                <p className="text-[10px] text-muted-foreground break-all font-medium mt-0.5 leading-tight" title={user?.email ? user.email : ""}>
                                    {user?.email ? user.email : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <nav className="space-y-2 p-4">
                {(user?.role === "admin" ? adminMenuItems : userMenuItems).map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                ? "bg-primary text-white"
                                : "hover:bg-default-100 text-foreground"
                                }`}
                        >
                            <Icon className="size-5 shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};

export default function DashboardSidebar() {
    return (
        <>
            {/* Desktop */}
            <aside className="hidden h-full w-72 border-r bg-accent lg:flex lg:flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile */}
            <Drawer>
                <Drawer.Trigger>
                    <div className="cursor-pointer rounded-lg p-2 hover:bg-default-100 lg:hidden">
                        <Bars className="size-6" />
                    </div>
                </Drawer.Trigger>

                <Drawer.Backdrop>
                    <Drawer.Content
                        placement="left"
                        className="w-72 bg-accent"
                    >
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />

                            <Drawer.Body className="p-0">
                                <SidebarContent />
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}

