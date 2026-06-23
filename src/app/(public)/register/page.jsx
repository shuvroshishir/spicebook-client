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
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const RegisterPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries());

        const { data, error } = await authClient.signUp.email({
            email: user.email,
            password: user.password,
            name: user.name,
            image: user.image,
        });

        if (data) {
            toast.success("Sign Up Successful");
            router.push("/");
        }

        if (error) {
            toast.error("Error: " + error.message);
        }
    }

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
                            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop"
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
                                className="inline-flex items-center gap-2"
                            >
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />

                                <h2 className="text-2xl font-black text-white">
                                    Spice Book
                                </h2>
                            </Link>

                            <h1 className="mt-5 max-w-md text-6xl font-black leading-tight text-white">
                                Share Your Flavor With The World.
                            </h1>

                            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
                                Join thousands of home cooks and food enthusiasts. Create your account to share recipes, discover new flavors, save your favorites, and become part of the SpiceBook community.
                            </p>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center justify-center bg-background p-6  sm:px-10 ">
                        <div className="w-full max-w-md">
                            <h2 className="text-4xl font-black text-foreground mt-3">
                                Create an account
                            </h2>

                            <p className="my-3 text-muted-foreground">
                                Create your SpiceBook account to discover, share, and save delicious recipes.
                            </p>


                            {/* signup form */}
                            <Form
                                onSubmit={onSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                className="flex w-full flex-col gap-4">
                                <TextField isRequired name="name" type="text">
                                    <Label>Name</Label>
                                    <Input placeholder="Enter your name" />
                                    <FieldError />
                                </TextField>

                                <TextField name="image" type="url">
                                    <Label>Image URL <small className="text-muted-foreground">(Optional)</small> </Label>
                                    <Input placeholder="Enter an image url" />
                                    <FieldError />
                                </TextField>

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

                                {/* password */}
                                <TextField
                                    isRequired
                                    minLength={8}
                                    name="password"
                                    type="password"
                                    validate={(value) => {
                                        if (value.length < 8) {
                                            return "Password must be at least 8 characters";
                                        }
                                        if (!/[A-Z]/.test(value)) {
                                            return "Password must contain at least one uppercase letter";
                                        }
                                        if (!/[0-9]/.test(value)) {
                                            return "Password must contain at least one number";
                                        }
                                        return null;
                                    }}
                                >
                                    <Label>Password</Label>
                                    <Input
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <FieldError />
                                </TextField>


                                {/* confirm password */}
                                <TextField
                                    isRequired
                                    minLength={8}
                                    name="confirm-password"
                                    type="password"
                                    validate={(value) => {
                                        if (value !== password) {
                                            return "Passwords do not match";
                                        }

                                        return null;
                                    }}
                                >
                                    <Label>Confirm Password</Label>
                                    <Input
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <FieldError />
                                    {confirmPassword &&
                                        confirmPassword === password && (
                                            <p className="text-success text-sm">
                                                Password Matched!
                                            </p>
                                        )}
                                </TextField>

                                {/* Button */}
                                <Button
                                    fullWidth
                                    size="lg"
                                    type="submit"
                                    className="brand-gradient font-semibold text-white mt-3"
                                >
                                    Register
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
                                <FcGoogle /> Continue with Google
                            </Button>

                            {/* Login */}
                            <p className="text-center text-muted-foreground mt-5">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-semibold text-primary"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;