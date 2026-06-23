import Image from "next/image";
import { Button, Input } from "@heroui/react";
import { IoMailOutline } from "react-icons/io5";
import {
    TextField,
    InputGroup,
} from "@heroui/react";


const Newsletter = () => {
    return (
        <section className="section bg-background">
            <div className="container">
                <div className="relative overflow-hidden rounded-[32px]">
                    {/* Background Image */}
                    <Image
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop"
                        alt="Food Background"
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/70"></div>

                    {/* Decorative Blur */}
                    <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-between gap-10 px-8 py-16 md:px-14 lg:flex-row lg:py-20">
                        {/* Left */}
                        <div className="max-w-xl text-center lg:text-left">
                            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                                🍽️ Join 10,000+ Food Lovers
                            </span>

                            <h2 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                                A Taste of Perfection in Your Inbox
                            </h2>

                            <p className="mt-5 text-lg leading-8 text-gray-200">
                                Discover delicious recipes, cooking tips, chef
                                secrets, and weekly inspiration delivered
                                straight to your inbox. No spam—just great food.
                            </p>
                        </div>

                        {/* Right */}
                        <form className="flex w-full max-w-xl flex-col gap-4 sm:flex-row">
                            <TextField className="flex-1" name="email">
                                <InputGroup>
                                    <InputGroup.Prefix>
                                        <IoMailOutline className="text-lg" />
                                    </InputGroup.Prefix>

                                    <InputGroup.Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-14"
                                        classnames={{
                                            inputWrapper:
                                                "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl",
                                            input:
                                                "text-white placeholder:text-white/60",
                                        }}
                                    />
                                </InputGroup>
                            </TextField>

                            <Button
                                className="h-14 rounded-2xl bg-primary px-8 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-primary/90"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;