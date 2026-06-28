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
                    <Avatar size="lg">
                        <Avatar.Image referrerPolicy="no-referrer" alt={(mounted && user?.name) ? user.name : "User"} src={mounted ? user?.image : undefined} />
                        <Avatar.Fallback>{(mounted && user?.name) ? user.name.charAt(0) : "S"}</Avatar.Fallback>
                    </Avatar>

                    <div>
                        <h3 className="font-semibold text-foreground">
                            {(mounted && user?.name) ? user.name : "User"}
                        </h3>
                        <p className="text-sm text-default-500">
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

