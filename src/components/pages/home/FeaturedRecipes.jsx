"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuClock, LuChefHat, LuChevronLeft, LuChevronRight, LuCompass } from "react-icons/lu";

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Fetch a larger list for the slider (e.g., 10 recipes)
  const fetchFeaturedRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/recipes/featured?page=1&limit=12`);
      if (!res.ok) throw new Error("Failed to fetch featured recipes");
      const data = await res.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header with Left/Right Arrows on top right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <LuChefHat className="size-3.5" />
              <span>Chef's Choice</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Featured Recipes
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              Explore our hand-picked selection of gourmet, popular, and seasonal culinary masterpieces curated just for you.
            </p>
          </div>

          {/* Navigation Controls (Only show if not loading and has recipes) */}
          {!loading && recipes.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleScroll("left")}
                aria-label="Slide Left"
                className="p-3.5 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <LuChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                aria-label="Slide Right"
                className="p-3.5 rounded-full border border-border bg-card text-foreground hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <LuChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-[2.5rem] overflow-hidden w-[330px] shrink-0 h-[460px] flex flex-col animate-pulse"
              >
                <div className="w-full h-56 bg-muted" />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-16 h-5 bg-muted rounded-full" />
                      <div className="w-16 h-5 bg-muted rounded-full" />
                    </div>
                    <div className="w-3/4 h-7 bg-muted rounded-lg" />
                    <div className="w-1/2 h-5 bg-muted rounded-md" />
                  </div>
                  <div className="w-full h-11 bg-muted rounded-2xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-[2.5rem] border border-dashed border-border max-w-xl mx-auto">
            <LuCompass className="mx-auto size-12 text-muted-foreground mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-foreground">No Featured Recipes</h3>
            <p className="text-muted-foreground mt-1 text-sm">Check back later or explore other sections.</p>
          </div>
        ) : (
          /* Horizontal Slider Container */
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 px-1 -mx-4 md:mx-0 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {recipes.map((recipe) => (
              <motion.div
                key={recipe._id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-border hover:border-primary/20 rounded-[2.5rem] overflow-hidden flex flex-col w-[330px] shrink-0 h-[460px] snap-start group relative"
              >
                {/* Recipe Image */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/10">
                        {recipe.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/10">
                        {recipe.cuisineType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                      {recipe.recipeName}
                    </h3>

                    {/* Prep Time */}
                    <div className="flex items-center gap-2 text-muted-foreground mt-3 text-sm">
                      <LuClock className="size-4 text-primary" />
                      <span>{recipe.preparationTime}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <Link href={`/recipe/${recipe._id}`} className="block w-full">
                      <span className="flex items-center justify-center gap-2 w-full py-3 bg-default-100 hover:bg-primary hover:text-white text-foreground font-semibold rounded-2xl transition-all duration-300 text-sm shadow-sm group-hover:shadow-md">
                        View Full Recipe
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
