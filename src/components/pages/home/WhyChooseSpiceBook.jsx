import { FaBookOpen, FaUsers, FaUtensils } from "react-icons/fa";

const WhyChooseSpiceBook = () => {
    const features = [
        {
            icon: <FaUtensils size={28} />,
            title: "Discover Delicious Recipes",
            description:
                "Explore thousands of handpicked recipes from quick everyday meals to gourmet dishes for every occasion.",
        },
        {
            icon: <FaBookOpen size={28} />,
            title: "Cook with Confidence",
            description:
                "Follow easy step-by-step instructions, ingredient lists, and cooking tips designed for every skill level.",
        },
        {
            icon: <FaUsers size={28} />,
            title: "Join a Food Community",
            description:
                "Connect with food lovers, share your favorite recipes, exchange ideas, and inspire others through cooking.",
        },
    ];

    return (
        <section className="section bg-background">
            <div className="container">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                        Why Choose SpiceBook?
                    </span>

                    <h2 className="section-title mt-5 text-foreground">
                        Everything You Need for Your Culinary Journey
                    </h2>

                    <p className="section-description mt-4">
                        SpiceBook brings together delicious recipes, expert cooking tips,
                        and a passionate community to make every meal memorable.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group rounded-3xl border border-default-200 bg-content1 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-orange-500 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                {feature.icon}
                            </div>

                            <h3 className="mt-6 text-2xl font-bold text-foreground">
                                {feature.title}
                            </h3>

                            <p className="mt-4 leading-7 text-muted-foreground">
                                {feature.description}
                            </p>

                            <div className="mt-6 h-1 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseSpiceBook;