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
import menuItems from "./menuItems";

const SidebarContent = () => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get user session
    const { data: session } = authClient.useSession();
    const user = session?.user;

    return (
        <>
            {/* User Profile */}
            <div className="border-b p-6">
                <div className="flex items-center gap-3">
                    {mounted && user?.isPremium ? (
                        <div className="relative group">
                            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-500 shadow-md">
                                <div className="p-[2px] bg-accent rounded-full">
                                    <Avatar size="lg" className="cursor-pointer">
                                        <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                        <Avatar.Fallback>{user?.name ? user.name.charAt(0) : "S"}</Avatar.Fallback>
                                    </Avatar>
                                </div>
                            </div>
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-1 border border-accent shadow-sm" title="Premium Pro Member">
                                <LuCrown className="size-3 text-white" />
                            </div>
                        </div>
                    ) : (
                        <Avatar size="lg">
                            <Avatar.Image referrerPolicy="no-referrer" alt={(mounted && user?.name) ? user.name : "User"} src={mounted ? user?.image : undefined} />
                            <Avatar.Fallback>{(mounted && user?.name) ? user.name.charAt(0) : "S"}</Avatar.Fallback>
                        </Avatar>
                    )}

                    <div className="overflow-hidden">
                        {mounted && user?.isPremium ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-semibold text-foreground truncate max-w-[100px]" title={user?.name}>
                                    {user?.name || "User"}
                                </h3>
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[9px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0">
                                    <LuCrown className="size-2 text-amber-500" /> Pro
                                </span>
                            </div>
                        ) : (
                            <h3 className="font-semibold text-foreground">
                                {(mounted && user?.name) ? user.name : "User"}
                            </h3>
                        )}
                        <p className="text-sm text-default-500 truncate" title={(mounted && user?.email) ? user.email : ""}>
                            {(mounted && user?.email) ? user.email : "...@gmail.com"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2 p-4">
                {menuItems.map((item) => {
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
                            <Icon className="size-5" />
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

