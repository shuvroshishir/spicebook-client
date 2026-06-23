import Link from "next/link";
import Image from "next/image";

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaHeart,
    FaArrowRight,
} from "react-icons/fa";
import BackToTopBtn from "./BackToTopBtn";

const Footer = () => {
    return (
        <footer id="about" className="relative border-t border-muted-foreground/20 bg-accent">

            {/* Back To Top */}
            <BackToTopBtn />

            <div className="container py-16">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Logo & Description */}
                    <div className="space-y-5">

                        <Link
                            href="/"
                            className="flex items-center gap-3"
                        >
                            <Image
                                src="/assets/logo.png"
                                alt="Logo"
                                width={44}
                                height={44}
                                className="rounded-full"
                            />

                            <h2 className="text-3xl font-black text-foreground">
                                Spice Book
                            </h2>
                        </Link>

                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Discover, share, and save delicious recipes from around the world.
                            Join a growing community of passionate home cooks and food lovers
                            who inspire every meal.
                        </p>

                        {/* Socials */}
                        <div className="flex items-center gap-3">

                            <Link
                                href="#"
                                className="flex-center h-11 w-11 rounded-full border border-muted-foreground/20 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                            >
                                <FaFacebookF size={16} />
                            </Link>

                            <Link
                                href="#"
                                className="flex-center h-11 w-11 rounded-full border border-muted-foreground/20 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                            >
                                <FaInstagram size={16} />
                            </Link>

                            <Link
                                href="#"
                                className="flex-center h-11 w-11 rounded-full border border-muted-foreground/20 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                            >
                                <FaTwitter size={16} />
                            </Link>

                            <Link
                                href="#"
                                className="flex-center h-11 w-11 rounded-full border border-muted-foreground/20 text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"
                            >
                                <FaLinkedinIn size={16} />
                            </Link>

                        </div>

                    </div>

                    {/* Quick Links */}
                    <div>

                        <h3 className="mb-5 text-lg font-bold text-foreground">
                            Quick Links
                        </h3>

                        <ul className="space-y-3 text-sm text-muted-foreground">

                            <li>
                                <Link
                                    href="/"
                                    className="transition-all duration-300 hover:pl-1 hover:text-primary"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/browse-recipes"
                                    className="transition-all duration-300 hover:pl-1 hover:text-primary"
                                >
                                    Browse Recipes
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/add-recipe"
                                    className="transition-all duration-300 hover:pl-1 hover:text-primary"
                                >
                                    Add Recipe
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/my-recipes"
                                    className="transition-all duration-300 hover:pl-1 hover:text-primary"
                                >
                                    My Recipes
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/favorites"
                                    className="transition-all duration-300 hover:pl-1 hover:text-primary"
                                >
                                    My Favorites
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* Contact */}
                    <div>

                        <h3 className="mb-5 text-lg font-bold text-foreground">
                            Contact Info
                        </h3>

                        <div className="space-y-4 text-sm text-muted-foreground">

                            <p>
                                Dhaka, Bangladesh
                            </p>

                            <p>
                                support@spicebook.com
                            </p>

                            <p>
                                +880 1234-567890
                            </p>

                        </div>

                    </div>

                    {/* Newsletter */}
                    <div>

                        <h3 className="mb-5 text-lg font-bold text-foreground">
                            Newsletter
                        </h3>

                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                            Subscribe to receive the latest recipes, cooking tips,
                            and exclusive food inspiration directly in your inbox.
                        </p>

                        <div className="flex overflow-hidden rounded-full border border-primary/10 bg-background">

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-transparent px-5 py-3 text-sm outline-none"
                            />

                            <button className="bg-gradient px-5 text-white transition-all duration-300 hover:brightness-105">
                                <FaArrowRight size={18} />
                            </button>

                        </div>

                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-muted-foreground/20 pt-6 text-sm text-muted-foreground md:flex-row">

                    <p>
                        &copy;{" "}
                        {new Date().getFullYear()}{" "}
                        Spice Book. All rights reserved.
                    </p>

                    <p className="flex items-center gap-2">
                        Made with{" "}
                        <FaHeart className="fill-primary text-primary" />{" "}
                        by Shishir
                    </p>

                </div>

            </div>

        </footer>
    );
};

export default Footer;