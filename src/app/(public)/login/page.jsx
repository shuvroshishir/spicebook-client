"use client"

import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import {
    Button,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {

    const router = useRouter();
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries());

        const { data, error } = await authClient.signIn.email({
            email: user.email,
            password: user.password,
        });

        if (data) {
            toast.success("Login Successful");
            router.push('/')
        }

        if (error) {
            toast.error("Error: " + error.message);
            e.target.reset();
        }
    };


    const handleGoogleSignin = async () => {
        const data = await authClient.signIn.social({
            provider: "google"
        })
    }

    return (
        <section className="bg-background py-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8max-w-5xl">
                <div className="overflow-hidden rounded-[32px] border border-primary/10 bg-background shadow-xl shadow-primary/20 lg:grid lg:min-h-[80vh] lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="relative hidden lg:block">
                        <Image
                            src="https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?w=600&auto=format&fit=crop"
                            alt="Pet"
                            fill
                            priority
                            className="object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50" />

                        {/* Content */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-12">

                            {/* Logo */}
                            <Link
                                href="/"
                                className="inline-flex items-center"
                            >
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />

                                <h2 className="text-2xl font-black text-white">
                                    Spice Book
                                </h2>
                            </Link>

                            <h1 className="mt-5 max-w-md text-6xl font-black leading-tight text-white">
                                Every Recipe Has a Story.
                            </h1>

                            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
                                Explore thousands of delicious recipes, share your signature dishes, and inspire food lovers around the world. Join the SpiceBook community and turn every meal into a memorable experience.
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center justify-center bg-background p-6  sm:px-10 ">
                        <div className="w-full max-w-md">
                            <h2 className="text-4xl font-black text-foreground mt-3">
                                Welcome Back
                            </h2>

                            <p className="my-3 text-muted-foreground">
                                Login to continue discovering, creating, and sharing amazing recipes.
                            </p>


                            {/* signup form */}
                            <Form
                                onSubmit={onSubmit}
                                className="flex w-full flex-col gap-4">

                                <TextField
                                    isRequired
                                    name="email"
                                    type="email"
                                    validate={(value) => {
                                        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                            return "Please enter a valid email address";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>Email</Label>
                                    <Input placeholder="Enter your email" />
                                    <FieldError />
                                </TextField>

                                <TextField
                                    isRequired
                                    name="password"
                                    type="password"
                                >
                                    <Label>Password</Label>
                                    <Input placeholder="Enter your password" />
                                </TextField>

                                {/* Button */}
                                <Button
                                    fullWidth
                                    size="lg"
                                    type="submit"
                                    className="brand-gradient font-semibold text-white mt-3"
                                >
                                    Login
                                </Button>

                            </Form>



                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-muted-foreground/20" />
                                </div>

                                <div className="relative flex justify-center">
                                    <span className="bg-background px-4 text-sm text-muted-foreground">
                                        OR
                                    </span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <Button
                                onClick={handleGoogleSignin}
                                fullWidth
                                size="lg"
                                variant="outline"
                                className="border-primary hover:bg-primary/10"
                            >
                                <FcGoogle /> Sign in with Google
                            </Button>

                            {/* Login */}
                            <p className="text-center text-muted-foreground mt-5">
                                Do not have an account?{" "}
                                <Link
                                    href="/register"
                                    className="font-semibold text-primary"
                                >
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;