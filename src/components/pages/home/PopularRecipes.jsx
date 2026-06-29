"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuHeart, LuCompass, LuTrendingUp, LuCrown } from "react-icons/lu";

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const fetchPopularRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/recipes/popular?limit=9`);
      if (!res.ok) throw new Error("Failed to fetch popular recipes");
      const data = await res.json();
      setRecipes(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  return (
    <section className="py-20 bg-background/50 border-t border-border relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              <LuTrendingUp className="size-3.5" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Popular Recipes
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              The highest liked recipes across our platform.
            </p>
          </motion.div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="p-3 bg-card border border-border/40 rounded-2xl flex items-center gap-4 animate-pulse h-24"
              >
                <div className="w-8 h-8 bg-muted rounded-lg shrink-0" />
                <div className="w-16 h-16 bg-muted rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-5 bg-muted rounded-md" />
                  <div className="w-1/2 h-4 bg-muted rounded-sm" />
                </div>
                <div className="w-10 h-5 bg-muted rounded-md shrink-0" />
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-[2.5rem] border border-dashed border-border max-w-xl mx-auto">
            <LuCompass className="mx-auto size-12 text-muted-foreground mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-foreground">No Popular Recipes</h3>
            <p className="text-muted-foreground mt-1 text-sm">Explore other sections or check back later.</p>
          </div>
        ) : (
          /* Popular Recipes Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => {
              const rank = index + 1;
              const isTopRank = rank <= 3;

              return (
                <Link href={`/recipe/${recipe._id}`} key={recipe._id}>
                  <div className="p-3 bg-card hover:bg-default-50 border border-border/40 hover:border-border/80 hover:shadow-sm rounded-2xl flex items-center gap-4 transition-all duration-300 cursor-pointer group transform hover:-translate-y-0.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${isTopRank
                          ? "bg-black dark:bg-default-800 text-white"
                          : "bg-default-100 text-default-500"
                        }`}
                    >
                      {rank}
                    </div>

                    {/* Recipe Image */}
                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.recipeImage}
                        alt={recipe.recipeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base truncate group-hover:text-primary transition-colors duration-200 flex items-center gap-1.5">
                        <span className="truncate">{recipe.recipeName}</span>
                        {recipe.isPremiumRecipe === true && (
                          <span className="shrink-0 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm border border-amber-400/20">
                            <LuCrown className="size-2.5 text-white animate-pulse" />
                            <span>Pro</span>
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {recipe.authorName || "Anonymous"} • {recipe.category}
                      </p>
                    </div>

                    {/* Likes Count */}
                    <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-default-100 dark:bg-default-800 text-foreground/80 rounded-lg text-xs font-semibold border border-border/40 group-hover:border-primary/20 group-hover:text-primary transition-all duration-300">
                      <LuHeart className="size-3.5 fill-current text-primary" />
                      <span>{recipe.likesCount || 0}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
