"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { 
  LuBookmark, 
  LuEye, 
  LuTrash2, 
  LuHeart, 
  LuClock,
  LuLoader,
  LuCrown
} from "react-icons/lu";
import Link from "next/link";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

export default function MyFavoritesPage() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) {
        toast.error("Please login to see your favorites");
        return;
      }

      const response = await fetch(`${serverUrl}/recipes/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch favorites (Status ${response.status}): ${errText}`);
      }

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("fetchFavorites Error:", error);
      toast.error(error.message || "Could not load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (recipeId) => {
    setRemoveLoadingId(recipeId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${recipeId}/favorite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      if (!data.isFavorite) {
        toast.success("Removed from favorites");
        setFavorites(favorites.filter(fav => fav.recipeId !== recipeId));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not remove favorite");
    } finally {
      setRemoveLoadingId(null);
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "hard":
        return "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800";
      default:
        return "bg-default-100 text-default-700";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Saved Favorites <LuBookmark className="size-8 text-primary fill-primary/10" />
        </h1>
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading saved recipes..." : `You have ${favorites.length} recipe${favorites.length === 1 ? "" : "s"} saved in your collection`}
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-3xl bg-card/50 backdrop-blur-sm min-h-[400px]">
          <div className="size-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
            <LuBookmark className="size-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Favorites Saved</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            Explore our curated recipes gallery and bookmark your favorite cooking guides to see them here!
          </p>
          <Link href="/browse-recipes" className="mt-6">
            <Button className="brand-gradient text-white font-semibold rounded-xl px-6 h-11 shadow-brand">
              Browse Recipes
            </Button>
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div 
              key={fav._id} 
              className="group bg-card rounded-3xl border border-border shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={fav.recipeImage} 
                  alt={fav.recipeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-md">
                    {fav.category}
                  </span>
                </div>
                {fav.isPremiumRecipe === true && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md border border-amber-400/30 flex items-center gap-1 uppercase tracking-wider animate-pulse">
                      <LuCrown className="size-3 text-white" />
                      <span>Premium</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground tracking-tight line-clamp-1 mb-2">
                    {fav.recipeName}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                      {fav.cuisineType}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${getDifficultyClass(fav.difficultyLevel)}`}>
                      {fav.difficultyLevel || "Easy"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                    <span className="flex items-center gap-1">
                      <LuClock className="size-3 text-primary" />
                      {fav.preparationTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <LuHeart className="size-3 text-rose-500 fill-rose-500" />
                      {fav.likesCount || 0} Likes
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <Link href={`/recipe/${fav.recipeId}`} className="w-full">
                    <Button 
                      className="w-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 font-semibold rounded-xl flex items-center justify-center gap-1.5 h-10 px-3 cursor-pointer"
                    >
                      <LuEye className="size-4" />
                      <span>Details</span>
                    </Button>
                  </Link>

                  <Button 
                    onClick={() => handleRemove(fav.recipeId)}
                    disabled={removeLoadingId === fav.recipeId}
                    className="w-full bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border border-rose-500/20 font-semibold rounded-xl flex items-center justify-center gap-1.5 h-10 px-3 cursor-pointer"
                  >
                    {removeLoadingId === fav.recipeId ? (
                      <LuLoader className="size-4 animate-spin" />
                    ) : (
                      <LuTrash2 className="size-4" />
                    )}
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}