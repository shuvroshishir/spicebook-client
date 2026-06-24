import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
    return (
        <section className="flex min-h-screen items-center justify-center bg-background py-10">
            <div className="container">
                <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-primary/10 bg-accent shadow-2xl lg:grid lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="relative hidden lg:block">
                        <Image
                            src="https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/generated/thumbnails/crispy-fried-chicken-with-french-fries-SyM0c9HqKU2MrTD1ocea3.webp"
                            alt="Lost Pet"
                            fill
                            priority
                            className="object-cover"
                        />

                        <div className="absolute inset-0 bg-black/45" />

                        <div className="absolute bottom-0 left-0 z-10 p-10">
                            <h2 className="max-w-sm text-5xl font-black leading-tight text-white">
                                Oops! This page got lost.
                            </h2>

                            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
                                The page you’re looking for doesn’t exist or may
                                have been moved somewhere else.
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                        <div className="text-center">
                            <h1 className="text-8xl font-black text-primary">
                                404
                            </h1>

                            <h2 className="mt-4 text-4xl font-black text-foreground">
                                Page Not Found
                            </h2>

                            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                                Looks like this page doesn’t exist anymore.
                                Let’s get you back to exploring delicious dishes.
                            </p>

                            <Link href="/" className="mt-10 inline-block">
                                <Button
                                    size="lg"
                                    className="brand-gradient px-8 font-semibold text-white transition-all duration-300 hover:scale-105"
                                >
                                    <FaArrowLeft />

                                    Back To Home
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;