"use client";

import { useState } from "react";
import {
    Avatar,
    Button
} from "@heroui/react";
import {
    HiBars3,
    HiXMark,
} from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { IoLogOutOutline } from "react-icons/io5";
import { LuCrown } from "react-icons/lu";

// nav links
const navItems = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Browse",
        href: "/browse-recipes",
    },
    {
        label: "Dashboard",
        href: "/dashboard",
    },
];


const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();


    // user session and signout functionality
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const router = useRouter();
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
        <nav className="sticky top-0 z-50 border-b border-border bg-accent/80 backdrop-blur-xl">

            <div className="container">

                <header className="flex h-12 sm:h-16 items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center"
                        >
                            <Image
                                src="/assets/logo.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="rounded-full h-7 w-7 sm:h-10 sm:w-10"
                            />

                            <span className="text-md sm:text-xl font-bold">
                                Spice Book
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}

                    <ul className=" hidden items-center gap-8 md:flex">

                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`relative text-foreground text-sm font-medium transition-default after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-red-400 after:transition-transform hover:after:scale-x-100
                                        ${pathname === item.href
                                            ? "text-primary"
                                            : ""
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                    </ul>

                    {/* Right */}

                    <div className="flex items-center gap-3">
                        {/* theme toggle button */}
                        <ThemeToggle />


                        {/* User avater */}
                        {user &&
                            <div className="items-center gap-3 flex">
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex flex-col text-[12px] text-foreground text-right leading-4">
                                        <p className="flex items-center justify-end gap-1 font-bold">
                                            {user?.name}
                                            {user?.isPremium && (
                                                <LuCrown className="text-amber-500 size-3.5 shrink-0 animate-pulse" title="Premium Pro Member" />
                                            )}
                                        </p>
                                        <p className="text-primary">{user?.email}</p>
                                    </div>
                                    {user?.isPremium ? (
                                        <Link href="/dashboard/profile" className="relative group block rounded-full transition-all duration-300 hover:scale-105">
                                            <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-500 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
                                                <div className="p-[2px] bg-accent rounded-full">
                                                    <Avatar size="sm" className="cursor-pointer">
                                                        <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
                                                        <Avatar.Fallback>{user?.name.charAt(0)}</Avatar.Fallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-0.5 border border-accent shadow-sm" title="Premium Pro Member">
                                                <LuCrown className="size-2.5 text-white" />
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link href="/dashboard/profile" className="p-1 border border-gray-400 hover:border-gray-600 rounded-full block transition-all duration-300 hover:scale-105">
                                            <Avatar size="sm" className="cursor-pointer">
                                                <Avatar.Image referrerPolicy="no-referrer" alt={user?.name} src={user?.image} />
                                                <Avatar.Fallback>{user?.name.charAt(0)}</Avatar.Fallback>
                                            </Avatar>
                                        </Link>
                                    )}
                                </div>

                                <Button
                                    onClick={handleSignout}
                                    variant="outline"
                                    className="hidden sm:flex items-center gap-1.5 border-primary text-primary hover:bg-primary/10 transition-default font-medium">
                                    <IoLogOutOutline className="size-4" /> Logout
                                </Button>
                            </div>
                        }


                        {/* Auth Buttons */}
                        {!user &&
                            <div className="hidden items-center gap-3 md:flex">
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10 transition-default"
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/register">
                                    <Button className="brand-gradient text-white shadow-brand hover:scale-105 transition-default">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>}

                        <Button
                            isIconOnly
                            variant="light"
                            onClick={() =>
                                setIsMenuOpen(!isMenuOpen)
                            }
                            className="text-foreground md:hidden"
                        >
                            {isMenuOpen ? (
                                <HiXMark size={24} />
                            ) : (
                                <HiBars3 size={24} />
                            )}
                        </Button>

                    </div>

                </header>

                {/* Mobile Menu */}

                <div
                    className={`overflow-hidden transition-all duration-300 md:hidden ${isMenuOpen
                        ? "max-h-80 py-4"
                        : "max-h-0"
                        }`}
                >
                    <ul className="space-y-4">

                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    color="foreground"
                                    className={`block rounded-xl py-2 text-base font-medium hover:text-red-400
                                        ${pathname === item.href
                                            ? "text-primary"
                                            : ""
                                        }`}
                                    onClick={() =>
                                        setIsMenuOpen(false)
                                    }
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* Auth Buttons */}
                        {user &&
                            <div className="flex items-center gap-3 border-t pt-5">
                                <Button
                                    onClick={handleSignout}
                                    variant="outline"
                                    className=" sm:hidden border-primary text-primary hover:bg-primary/10 transition-default">
                                    <IoLogOutOutline /> Logout
                                </Button>
                            </div>}


                        {/* Auth Buttons */}
                        {!user &&
                            <div className="flex items-center gap-3 border-t pt-5">
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-primary text-primary hover:bg-primary/10 transition-default"
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="brand-gradient text-white shadow-brand hover:scale-105 transition-default">
                                        Register
                                    </Button>
                                </Link>
                            </div>}
                    </ul>
                </div>

            </div>
        </nav >
    );
};

export default NavBar;