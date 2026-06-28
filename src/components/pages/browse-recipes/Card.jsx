"use client";

import React from "react";
import Link from "next/link";
import { LuHeart, LuChevronRight, LuCrown } from "react-icons/lu";

export default function RecipeCard({ recipe }) {
  const authorInitial = recipe.authorName ? recipe.authorName.charAt(0).toUpperCase() : "C";

  return (
    <div className="bg-card hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary/20 rounded-[2rem] overflow-hidden flex flex-col h-[450px] group relative transform">
      {/* Recipe Image & Category floating badge */}
      <div className="relative h-44 w-full overflow-hidden bg-muted shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.recipeImage}
          alt={recipe.recipeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-md border border-primary/20">
            {recipe.category}
          </span>
        </div>
        {/* Floating Premium Price Badge */}
        {recipe.isPremiumRecipe === true && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md border border-amber-400/30 flex items-center gap-1">
              <LuCrown className="size-3 text-white animate-pulse" />
              <span>${recipe.price ? recipe.price.toFixed(2) : "4.99"}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {recipe.recipeName}
          </h3>

          {/* Cuisine & Prep Time */}
          <p className="text-sm text-muted-foreground">
            {recipe.cuisineType} • {recipe.preparationTime}
          </p>

          {/* Difficulty Badge */}
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
              {recipe.difficultyLevel || "Easy"}
            </span>
          </div>
        </div>

        {/* Divider and Footer */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {authorInitial}
              </div>
              {recipe.isAuthorPremium && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5" title="Premium Pro Chef">
                  <LuCrown className="size-2 text-white" />
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[120px] flex items-center gap-1">
              {recipe.authorName || "Anonymous"}
              {recipe.isAuthorPremium && (
                <LuCrown className="text-amber-500 size-3.5 shrink-0" title="Premium Pro Chef" />
              )}
            </span>
          </div>

          {/* Likes */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm font-semibold">
            <LuHeart className="size-4 text-primary fill-current" />
            <span>{recipe.likesCount || 0}</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4">
          <Link href={`/recipe/${recipe._id}`} className="block w-full">
            <span className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-primary/30 bg-primary/5 hover:bg-primary text-primary hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-sm group-hover:shadow-md cursor-pointer">
              <span>View Details</span>
              <LuChevronRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
