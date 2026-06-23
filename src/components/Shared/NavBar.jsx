"use client";

import { useState } from "react";
import {
    Button
} from "@heroui/react";
import {
    HiBars3,
    HiXMark,
} from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">

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

                        {/* <Avatar
                            size="sm"
                            src="https://i.pravatar.cc/150?u=1"
                        /> */}


                        {/* Auth Buttons */}
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
                        </div>

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
                        </div>
                    </ul>
                </div>

            </div>
        </nav >
    );
};

export default NavBar;