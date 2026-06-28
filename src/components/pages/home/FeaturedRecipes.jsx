"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LuClock, LuChefHat, LuChevronLeft, LuChevronRight, LuCompass } from "react-icons/lu";

export default function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 6;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const fetchFeaturedRecipes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${serverUrl}/recipes/featured?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch featured recipes");
      const data = await res.json();
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRecipes();
  }, [page]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <LuChefHat className="size-3.5" />
            <span>Chef's Choice</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight"
          >
            Featured Recipes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 text-base"
          >
            Explore our hand-picked selection of gourmet, popular, and seasonal culinary masterpieces curated just for you.
          </motion.p>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-3xl overflow-hidden h-[450px] flex flex-col animate-pulse"
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
                  <div className="w-full h-11 bg-muted rounded-xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 rounded-3xl border border-dashed border-border max-w-xl mx-auto">
            <LuCompass className="mx-auto size-12 text-muted-foreground mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-foreground">No Featured Recipes</h3>
            <p className="text-muted-foreground mt-1 text-sm">Check back later or explore other sections.</p>
          </div>
        ) : (
          <>
            {/* Recipes Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe._id}
                    variants={cardVariants}
                    layout
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-border/60 hover:border-primary/20 rounded-3xl overflow-hidden flex flex-col h-[460px] group relative"
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
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {/* Prev Button */}
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-3 rounded-2xl border border-border bg-card text-foreground hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-200 cursor-pointer shadow-sm disabled:cursor-not-allowed"
                >
                  <LuChevronLeft className="size-5" />
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`size-11 rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                        page === pageNum
                          ? "bg-primary text-white scale-105"
                          : "border border-border bg-card text-foreground hover:bg-default-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-3 rounded-2xl border border-border bg-card text-foreground hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-200 cursor-pointer shadow-sm disabled:cursor-not-allowed"
                >
                  <LuChevronRight className="size-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
