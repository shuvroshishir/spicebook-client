"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@heroui/react";
import { FaArrowRotateRight, FaHouse } from "react-icons/fa6";

const ErrorPage = ({ error, reset }) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section className="flex min-h-screen items-center justify-center bg-background py-10">
            <div className="container">
                <div className="mx-auto max-w-3xl rounded-[32px] border border-primary/10 bg-accent p-8 shadow-2xl sm:p-12 lg:p-16">

                    {/* Error Code */}
                    <div className="text-center">
                        <h1 className="text-7xl font-black text-primary">
                            Error
                        </h1>

                        <h2 className="mt-4 text-4xl font-black text-foreground">
                            Something went wrong
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            An unexpected error occurred while loading this
                            page. Please try again or return to the homepage.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

                        <Button
                            size="lg"
                            onPress={() => reset()}
                            className="brand-gradient px-8 font-semibold text-white"
                        >
                            <FaArrowRotateRight />

                            Try Again
                        </Button>

                        <Link href="/">
                            <Button
                                size="lg"
                                variant="bordered"
                                className="border-primary/20 px-8 font-semibold text-primary"
                            >
                                <FaHouse />

                                Back Home
                            </Button>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;