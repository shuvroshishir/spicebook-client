"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    Button,
    Drawer,
    Avatar,
} from "@heroui/react";

import {
    Bars,
} from "@gravity-ui/icons";
import { LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import menuItems from "./menuItems";

const DashboardHeader = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleSignout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logout successful");
                    router.push("/");
                },
                onError: () => {
                    toast.error("Failed to logout");
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-8">
            <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                <Drawer>
                    <Button
                        isIconOnly
                        variant="light"
                        className="lg:hidden"
                    >
                        <Bars />
                    </Button>

                    <Drawer.Backdrop>
                        <Drawer.Content
                            placement="left"
                            className="w-72 bg-accent"
                        >
                            <Drawer.Dialog>

                                <Drawer.CloseTrigger />

                                {/* User */}
                                <Drawer.Header>
                                    <div className="flex items-center gap-3">
                                        <Avatar size="lg">
                                            <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                            <Avatar.Fallback>{user?.name ? user.name.charAt(0) : "S"}</Avatar.Fallback>
                                        </Avatar>

                                        <div>
                                            <h3 className="font-semibold text-foreground">
                                                {user?.name || "Shishir"}
                                            </h3>

                                            <p className="text-sm text-default-500">
                                                {user?.email || "shuvro@gmail.com"}
                                            </p>
                                        </div>
                                    </div>
                                </Drawer.Header>

                                {/* Menu */}
                                <Drawer.Body>
                                    <nav className="space-y-2">
                                        {menuItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-default-100"
                                            >
                                                <item.icon className="size-5" />

                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </nav>
                                </Drawer.Body>

                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>

                <h1 className="text-xl font-bold flex items-center gap-2">
                    <LuLayoutDashboard className="text-primary" />
                    Dashboard
                </h1>
            </div>

            <Button
                onClick={handleSignout}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 transition-default font-semibold flex items-center gap-1.5 lg:hidden"
            >
                <LuLogOut className="size-4" />
                Logout
            </Button>
        </header>
    );
};

export default DashboardHeader;