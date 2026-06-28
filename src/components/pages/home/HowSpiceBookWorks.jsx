"use client";

import { ChevronDown } from "@gravity-ui/icons";
import { Accordion } from "@heroui/react";
import { FaBookOpen, FaHeart, FaUtensils, FaInfoCircle } from "react-icons/fa";


const HowSpiceBookWorks = () => {
    const categories = [
        {
            title: "Recipes",
            items: [
                {
                    title: "How do I share a recipe on SpiceBook?",
                    content:
                        "After signing in, go to your dashboard and click 'Add Recipe'. Fill in the recipe name, ingredients, preparation steps, cuisine type, difficulty level, preparation time, and upload an image. Once submitted, your recipe will be available for the community to explore.",
                },
                {
                    title: "Can I edit or delete my recipes later?",
                    content:
                        "Yes. You have complete control over your recipes. Visit the 'My Recipes' section in your dashboard to update recipe details, change images, or remove a recipe whenever you want.",
                },
                {
                    title: "Can I browse recipes without an account?",
                    content:
                        "Yes. Anyone can browse and discover recipes on SpiceBook. However, you'll need an account to share recipes, save favorites, like recipes, and purchase premium content.",
                },
            ],
        },

        {
            title: "Account & Premium",
            items: [
                {
                    title: "Why should I upgrade to Premium?",
                    content:
                        "Free users can publish up to two recipes. Premium members enjoy unlimited recipe sharing, a premium profile badge, and access to exclusive platform features.",
                },
                {
                    title: "How do I become a Premium member?",
                    content:
                        "Go to your dashboard and purchase the Premium membership using our secure Stripe checkout. Your account will be upgraded instantly after a successful payment.",
                },
                {
                    title: "Can I update my profile information?",
                    content:
                        "Yes. You can update your name and profile photo anytime from the Profile section in your dashboard.",
                },
            ],
        },

        {
            title: "Community & Support",
            items: [
                {
                    title: "How can I save my favorite recipes?",
                    content:
                        "Simply click the Favorite button on any recipe. Your saved recipes will appear in the 'My Favorites' section for quick access anytime.",
                },
                {
                    title: "How do I report an inappropriate recipe?",
                    content:
                        "Open the recipe details page, click the Report button, choose a reason, and submit your report. Our administrators will review it as soon as possible.",
                },
                {
                    title: "How can I contact the SpiceBook support team?",
                    content:
                        "If you experience any issues or have questions, contact us through the Contact page or email our support team. We're always happy to help.",
                },
            ],
        },
    ];

    const steps = [
        {
            icon: <FaUtensils size={28} />,
            title: "Discover Recipes",
            description:
                "Explore thousands of delicious recipes from home cooks and food enthusiasts around the world.",
        },
        {
            icon: <FaBookOpen size={28} />,
            title: "Share Your Recipe",
            description:
                "Publish your favorite recipes with ingredients, cooking instructions, and beautiful food photos.",
        },
        {
            icon: <FaHeart size={28} />,
            title: "Save & Inspire",
            description:
                "Save your favorite recipes, inspire other food lovers, and build your own culinary collection.",
        },
    ];

    return (
        <section className="section bg-background">
            <div className="container">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4 mx-auto">
                        <FaInfoCircle className="size-3.5" />
                        <span>Guide & FAQ</span>
                    </div>
                    <h2 className="section-title text-foreground mt-2">
                        How SpiceBook Works
                    </h2>

                    <p className="section-description mx-auto mt-2">
                        Discover, create, and share delicious recipes in just a few simple steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="card transition-default relative overflow-hidden p-8 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Step Number */}
                            <span className="absolute right-6 top-5 text-6xl font-black text-primary/10">
                                0{index + 1}
                            </span>

                            {/* Icon */}
                            <div className="flex-center mb-6 h-16 w-16 rounded-2xl brand-gradient text-white">
                                {step.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold text-foreground">
                                {step.title}
                            </h3>

                            <p className="mt-4 leading-relaxed text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Faq */}
                <div className="flex w-full flex-col gap-6 mt-20">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        <p className="mb-4 text-lg font-medium text-muted">
                            Find answers to the most common questions about recipes, premium membership, and using SpiceBook.
                        </p>
                    </div>
                    {categories.map((category) => (
                        <div key={category.title}>
                            <p className="text-md mb-2 font-medium text-muted">{category.title}</p>
                            <Accordion className="w-full" variant="surface">
                                {category.items.map((item, index) => (
                                    <Accordion.Item key={index}>
                                        <Accordion.Heading>
                                            <Accordion.Trigger>
                                                {item.title}
                                                <Accordion.Indicator>
                                                    <ChevronDown />
                                                </Accordion.Indicator>
                                            </Accordion.Trigger>
                                        </Accordion.Heading>
                                        <Accordion.Panel>
                                            <Accordion.Body>{item.content}</Accordion.Body>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default HowSpiceBookWorks;