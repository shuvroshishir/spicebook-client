"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuCompass, LuImage } from "react-icons/lu";
import RecipeCard from "@/components/pages/browse-recipes/Card";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Salad",
  "Soup",
  "Appetizer",
  "Snack",
  "Beverage",
  "Other"
];

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const limit = 9;
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const categoryQuery = selectedCategories.length > 0
        ? `&categories=${selectedCategories.join(",")}`
        : "";
      const res = await fetch(
        `${serverUrl}/recipes?page=${page}&limit=${limit}${categoryQuery}`
      );
      if (!res.ok) throw new Error("Failed to fetch recipes");
      const data = await res.json();
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page, selectedCategories]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      const updated = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];
      // Reset page to 1 on filter change
      setPage(1);
      return updated;
    });
  };

  return (
    <div className="py-16 min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              All Recipes
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Explore your favorite recipes from around the world.
            </p>
          </motion.div>
        </div>

        {/* Category Pills (Filters) */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border cursor-pointer ${isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-card text-foreground hover:bg-default-100 border-border/80"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex items-center justify-between text-sm text-muted-foreground font-medium">
          <div>
            {!loading && (
              <span>
                Showing {recipes.length} results (Page {page} of {totalPages})
              </span>
            )}
          </div>
        </div>

        {/* Recipes Grid / Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-[2rem] overflow-hidden h-[450px] flex flex-col animate-pulse"
              >
                <div className="w-full h-44 bg-muted" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-3/4 h-6 bg-muted rounded-lg" />
                    <div className="w-1/2 h-4 bg-muted rounded-md" />
                    <div className="w-16 h-4 bg-muted rounded-full" />
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between">
                    <div className="w-24 h-6 bg-muted rounded-md" />
                    <div className="w-12 h-6 bg-muted rounded-md" />
                  </div>
                  <div className="w-full h-11 bg-muted rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-[2.5rem] border border-dashed border-border max-w-xl mx-auto">
            <LuCompass className="mx-auto size-14 text-muted-foreground mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-foreground">No Recipes Found</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Try selecting different category filters or check back later.
            </p>
          </div>
        ) : (
          <>
            {/* Recipes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-16">
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
                      className={`size-11 rounded-2xl font-bold transition-all duration-200 cursor-pointer shadow-sm ${page === pageNum
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
    </div>
  );
}