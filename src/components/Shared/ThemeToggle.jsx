"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { TbMoonStars } from "react-icons/tb";


const ThemeToggle = () => {

    const [mounted, setMounted] = useState(false);

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                isIconOnly
                variant="light"
                className="hover:bg-primary/30"
            >
                <div className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            isIconOnly
            variant="light"
            className="hover:bg-primary/30"
            onClick={() =>
                setTheme(
                    theme === "dark"
                        ? "light"
                        : "dark"
                )
            }
        >
            {
                theme === "dark" ? (
                    <LuSun className="h-5 w-5  text-primary" />
                ) : (
                    <TbMoonStars className="h-5 w-5 " />
                )
            }
        </Button>
    );
};

export default ThemeToggle;