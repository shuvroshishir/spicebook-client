"use client";

import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import {
    FaArrowRight,
    FaHeart,
    FaShare,
} from "react-icons/fa";
import { IoFastFood } from "react-icons/io5";

const Banner = () => {

    return (
        <section className="section relative overflow-hidden bg-background">

            {/* Blur */}
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl dark:bg-primary/10" />

            <div className="container">

                <div className="grid items-center gap-16 lg:grid-cols-2">

                    {/* Left Content */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 40,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        transition={{
                            duration: 0.6,
                        }}

                        className="space-y-8"
                    >

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-accent px-4 py-2 text-sm font-medium text-primary">

                            <FaHeart />

                            Discover & Share Amazing Recipes

                        </div>

                        {/* Heading */}
                        <div className="space-y-5">

                            <h1 className="max-w-2xl text-5xl font-black leading-tight text-foreground md:text-6xl">
                                Taste the
                                <span className="text-primary"> Art </span>
                                of Cooking.
                            </h1>

                            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">

                                Discover thousands of delicious recipes, share your signature dishes,
                                and connect with a passionate community of food lovers. Every recipe
                                has a story—start sharing yours today.

                            </p>

                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-4">

                            <Link
                                href="/browse-recipes"
                                className="group inline-flex items-center gap-3 rounded-full brand-gradient px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-105"
                            >

                                Browse Recipes

                                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                            </Link>

                            <Link
                                href="/dashboard/add-recipe"
                                className="rounded-full inline-flex items-center gap-3 border border-primary px-7 py-3.5 font-semibold text-primary transition-all duration-300 hover:bg-primary/20"
                            >

                                Share Recipe

                                <FaShare className="transition-transform duration-300 group-hover:translate-x-1" />

                            </Link>

                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 pt-4">

                            <div>

                                <h3 className="text-3xl font-black text-foreground">
                                    10K+
                                </h3>

                                <p className="text-muted-foreground">
                                    Recipes Shared
                                </p>

                            </div>

                            <div>

                                <h3 className="text-3xl font-black text-foreground">
                                    50k+
                                </h3>

                                <p className="text-muted-foreground">
                                    Food Lovers
                                </p>

                            </div>

                            <div>

                                <h3 className="text-3xl font-black text-foreground">
                                    15k+
                                </h3>

                                <p className="text-muted-foreground">
                                    Favorites Saved
                                </p>

                            </div>

                        </div>

                    </motion.div>

                    {/* Right Grid Images */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}

                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}

                        transition={{
                            duration: 0.7,
                        }}

                        className="relative mx-auto mt-10 w-full max-w-[620px] lg:mt-0"
                    >

                        {/* Floating Badge */}
                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                            }}

                            transition={{
                                duration: 4,
                                repeat: Infinity,
                            }}

                            className="absolute left-2 top-10 z-20 hidden rounded-3xl border border-primary/10 bg-background/85 px-5 py-4 shadow-2xl backdrop-blur-xl md:block"
                        >

                            <div className="flex items-center gap-4">

                                <div className="flex-center h-14 w-14 rounded-2xl bg-primary/10 text-2xl text-primary">

                                    <IoFastFood />

                                </div>

                                <div>

                                    <h4 className="text-xl font-black text-foreground">
                                        10k+
                                    </h4>

                                    <p className="text-sm text-muted-foreground">
                                        Recipes Shared
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                        {/* Grid */}
                        <div className="grid h-[420px] grid-cols-2 gap-4 sm:h-[520px]">

                            {/* Big Image */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: [0, -4, 0],
                                }}

                                transition={{
                                    opacity: {
                                        duration: 0.8,
                                        delay: 0.2,
                                    },

                                    y: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}

                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.3,
                                    },
                                }}

                                className="relative row-span-2 overflow-hidden rounded-[30px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] sm:rounded-[40px]"
                            >

                                <Image
                                    src="https://plus.unsplash.com/premium_photo-1683619761468-b06992704398?w=600&auto=format&fit=crop"
                                    alt="burger"
                                    fill
                                    priority
                                    sizes="(max-width:768px) 100vw, 50vw"
                                    className="object-cover transition duration-700 hover:scale-110"
                                />

                                {/* Shine */}
                                <motion.div
                                    animate={{
                                        x: ["-120%", "220%"],
                                    }}

                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 2,
                                        delay: 1,
                                    }}

                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                {/* Floating Text */}
                                <motion.div
                                    animate={{
                                        y: [0, -6, 0],
                                    }}

                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}

                                    className="absolute bottom-4 left-4 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl"
                                >

                                    <h3 className="text-lg font-black text-white">
                                        Burger
                                    </h3>

                                    <p className="text-sm text-white/80">
                                        Delicious and Juicy
                                    </p>

                                </motion.div>

                            </motion.div>

                            {/* White Persian Cat */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: [0, -4, 0],
                                }}

                                transition={{
                                    opacity: {
                                        duration: 0.8,
                                        delay: 0.2,
                                    },

                                    y: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}

                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.3,
                                    },
                                }}

                                className="group relative overflow-hidden rounded-[26px] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.25)] sm:rounded-[32px]"
                            >

                                <Image
                                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop"
                                    alt="pizza"
                                    fill
                                    sizes="(max-width:768px) 100vw, 25vw"
                                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                                />

                                {/* Shine */}
                                <motion.div
                                    animate={{
                                        x: ["-120%", "220%"],
                                    }}

                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 2,
                                        delay: 1,
                                    }}

                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                />

                            </motion.div>

                            {/* bird */}
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: [0, 4, 0],
                                }}

                                transition={{
                                    opacity: {
                                        duration: 0.8,
                                        delay: 0.4,
                                    },

                                    y: {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}

                                whileHover={{
                                    y: -4,
                                    transition: {
                                        duration: 0.3,
                                    },
                                }}

                                className="group relative overflow-hidden rounded-[26px] shadow-[0_15px_40px_-12px_rgba(0,0,0,0.25)] sm:rounded-[32px]"
                            >

                                <Image
                                    src="https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg"
                                    alt="Biriyani"
                                    fill
                                    sizes="(max-width:768px) 100vw, 25vw"
                                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                                />

                                {/* Shine */}
                                <motion.div
                                    animate={{
                                        x: ["-120%", "220%"],
                                    }}

                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 2,
                                        delay: 2,
                                    }}

                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                                />

                            </motion.div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </section>
    );
};

export default Banner;