"use client";

import React, { useState, useEffect } from "react";
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
import { userMenuItems, adminMenuItems } from "./menuItems";

const DashboardHeader = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const isLoading = !mounted || isPending;
    const items = user?.role === "admin" ? adminMenuItems : userMenuItems;

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

                                {isLoading ? (
                                    <>
                                        {/* User Skeleton */}
                                        <Drawer.Header>
                                            <div className="flex items-center gap-3 animate-pulse w-full">
                                                <div className="w-12 h-12 rounded-full bg-default-200 shrink-0" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 w-24 bg-default-200 rounded-sm animate-pulse" />
                                                    <div className="h-3 w-36 bg-default-200 rounded-sm animate-pulse" />
                                                </div>
                                            </div>
                                        </Drawer.Header>

                                        {/* Menu Skeleton */}
                                        <Drawer.Body>
                                            <div className="space-y-2 animate-pulse">
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <div key={val} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-default-50/20">
                                                        <div className="size-5 rounded-md bg-default-200 shrink-0 animate-pulse" />
                                                        <div className="h-4 w-28 bg-default-200 rounded-sm animate-pulse" />
                                                    </div>
                                                ))}
                                            </div>
                                        </Drawer.Body>
                                    </>
                                ) : (
                                    <>
                                        {/* User */}
                                        <Drawer.Header>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="lg">
                                                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                                                    <Avatar.Fallback>{user?.name ? user.name.charAt(0) : "U"}</Avatar.Fallback>
                                                </Avatar>

                                                <div>
                                                    <h3 className="font-semibold text-foreground">
                                                        {user?.name || "User"}
                                                    </h3>

                                                    <p className="text-sm text-default-500">
                                                        {user?.email || ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </Drawer.Header>

                                        {/* Menu */}
                                        <Drawer.Body>
                                            <nav className="space-y-2">
                                                {items.map((item) => (
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
                                    </>
                                )}

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