"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { LuPlus, LuUpload, LuLoader, LuCrown, LuAlertTriangle, LuCheck } from "react-icons/lu";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

// Categories and Cuisine Types for select options
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

const CUISINES = [
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "Japanese",
  "American",
  "French",
  "Mediterranean",
  "Thai",
  "Bengali",
  "Other"
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function AddRecipePage() {
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const fileInputRef = useRef(null);

  // Form states
  const [recipeName, setRecipeName] = useState("");
  const [recipeImage, setRecipeImage] = useState("");
  const [category, setCategory] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isPremiumRecipe, setIsPremiumRecipe] = useState(false);
  const [price, setPrice] = useState("");

  // Loading and limit states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(true);
  const [isUpgradingLoading, setIsUpgradingLoading] = useState(false);

  // Fetch current user recipe count
  useEffect(() => {
    const checkLimit = async () => {
      if (!user) return;
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult?.data?.token;
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        const response = await fetch(`${serverUrl}/recipes/my`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRecipeCount(data.length || 0);
        }
      } catch (error) {
        console.error("Error checking recipe limit:", error);
      } finally {
        setLoadingCount(false);
      }
    };
    checkLimit();
  }, [user]);

  // Stripe Premium upgrade handler
  const handleUpgradeToPremium = async () => {
    setIsUpgradingLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) {
        toast.error("Please login to upgrade your account.");
        return;
      }

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/create-checkout-session/premium`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          redirectPath: "/dashboard/add-recipe"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to initiate premium checkout");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout URL missing");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error(error.message || "Failed to start checkout process");
    } finally {
      setIsUpgradingLoading(false);
    }
  };

  // Trigger file upload selector
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Image upload handler (Imgbb API)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Retrieve Imgbb key from client environment
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbKey || imgbbKey === "YOUR_IMGBB_API_KEY") {
      toast.error("Imgbb API Key is not configured in environment variables.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Imgbb upload failed");
      }

      const data = await response.json();
      if (data?.success && data?.data?.url) {
        setRecipeImage(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(data?.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName || !category || !difficulty || !ingredients || !instructions) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    if (isPremiumRecipe && (!price || parseFloat(price) <= 0)) {
      toast.error("Please enter a valid price for your premium recipe.");
      return;
    }

    setIsSubmitting(true);

    // Format ingredients and instructions into arrays by line
    const ingredientsArray = ingredients
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const instructionsArray = instructions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const recipeData = {
      recipeName,
      recipeImage,
      category,
      cuisineType,
      difficultyLevel: difficulty,
      preparationTime: prepTime,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      isPremiumRecipe,
      price: isPremiumRecipe ? parseFloat(price) : 0
    };

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const response = await fetch(`${serverUrl}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save recipe");
      }

      toast.success("Recipe added successfully!");
      
      // Reset form
      setRecipeName("");
      setRecipeImage("");
      setCategory("");
      setCuisineType("");
      setDifficulty("");
      setPrepTime("");
      setIngredients("");
      setInstructions("");
      setIsPremiumRecipe(false);
      setPrice("");

      // Redirect to recipes listings page
      router.push("/dashboard/my-recipes");
    } catch (error) {
      console.error("Recipe submit error:", error);
      toast.error(error.message || "Something went wrong while adding recipe.");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loadingCount && user && !user.isPremium) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center space-y-4">
        <LuLoader className="size-12 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Checking account status...</p>
      </div>
    );
  }

  if (user && !user.isPremium && recipeCount >= 2) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto text-center my-12"
      >
        <div className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 shadow-xl space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <LuCrown className="size-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground tracking-tight">Recipe Limit Reached</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Standard accounts are limited to <span className="font-semibold text-foreground">2 recipes</span>. You currently have {recipeCount} recipes published.
            </p>
          </div>

          <div className="bg-default-50 border border-border rounded-2xl p-4 text-left space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Unlock SpiceBook Premium:</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <LuCheck className="text-amber-500 size-4 shrink-0" />
                <span>Unlimited recipe uploads (lifetime)</span>
              </li>
              <li className="flex items-center gap-2">
                <LuCheck className="text-amber-500 size-4 shrink-0" />
                <span>Exclusive premium chef profile badge</span>
              </li>
              <li className="flex items-center gap-2">
                <LuCheck className="text-amber-500 size-4 shrink-0" />
                <span>Access to all locked/premium recipes</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="flat"
              className="flex-1 font-semibold rounded-xl border border-border h-11"
            >
              Back to Overview
            </Button>
            <Button
              onClick={handleUpgradeToPremium}
              disabled={isUpgradingLoading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-md hover:opacity-90 rounded-xl h-11"
            >
              {isUpgradingLoading ? (
                <LuLoader className="size-5 animate-spin" />
              ) : (
                "Upgrade for $9.99"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          Add New Recipe <LuPlus className="text-primary size-7" />
        </h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Share your culinary creation with the community
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Recipe Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center">
              Recipe Name <span className="text-primary ml-0.5">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Creamy Tomato Pasta"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>

          {/* Recipe Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Recipe Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste image URL"
                value={recipeImage}
                onChange={(e) => setRecipeImage(e.target.value)}
                className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                variant="outline"
                className="h-11 px-4 border-border bg-card text-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all border shrink-0"
              >
                {isUploading ? (
                  <LuLoader className="animate-spin size-4" />
                ) : (
                  <LuUpload className="size-4" />
                )}
                <span>{isUploading ? "Uploading..." : "Upload"}</span>
              </Button>
            </div>

            {/* Image Preview Thumbnail */}
            {recipeImage && (
              <div className="mt-3 relative w-32 h-20 rounded-xl overflow-hidden border border-border bg-accent/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipeImage}
                  alt="Recipe Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setRecipeImage("")}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 text-[10px] hover:bg-red-500 transition-colors"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Category & Cuisine Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Category <span className="text-primary ml-0.5">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              >
                <option value="" disabled hidden>
                  Select category...
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Cuisine Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Cuisine Type
              </label>
              <select
                value={cuisineType}
                onChange={(e) => setCuisineType(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              >
                <option value="" disabled hidden>
                  Select cuisine...
                </option>
                <option value="">None</option>
                {CUISINES.map((cui) => (
                  <option key={cui} value={cui}>
                    {cui}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Difficulty & Prep Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Difficulty <span className="text-primary ml-0.5">*</span>
              </label>
              <select
                required
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              >
                <option value="" disabled hidden>
                  Select difficulty...
                </option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Preparation Time */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Preparation Time
              </label>
              <input
                type="text"
                placeholder="e.g., 30 minutes"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
              />
            </div>

          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Ingredients <span className="text-primary ml-0.5">*</span> <span className="text-xs text-muted-foreground font-normal">(one per line)</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g.&#10;2 cups pasta&#10;1 cup heavy cream&#10;3 cloves garlic"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Instructions <span className="text-primary ml-0.5">*</span> <span className="text-xs text-muted-foreground font-normal">(one per line)</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g.&#10;1. Boil pasta in salted water.&#10;2. Heat cream and garlic in a pan.&#10;3. Combine and serve hot."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
            />
          </div>

          {/* Premium Recipe Checkbox / Pricing */}
          <div className="p-5 rounded-2xl border border-border bg-default-50/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-bold text-foreground flex items-center gap-1.5 cursor-pointer select-none" htmlFor="premium-recipe-checkbox">
                  <LuCrown className="text-amber-500 size-4.5" />
                  <span>Make this a Premium Recipe</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  Users will need to buy this specific recipe using Stripe to unlock its details.
                </p>
              </div>
              <input
                id="premium-recipe-checkbox"
                type="checkbox"
                checked={isPremiumRecipe}
                onChange={(e) => {
                  setIsPremiumRecipe(e.target.checked);
                  if (!e.target.checked) setPrice("");
                }}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/25 cursor-pointer accent-primary"
              />
            </div>

            {isPremiumRecipe && (
              <div className="space-y-2 pt-2 border-t border-dashed border-border/80">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1">
                  Recipe Price (USD) <span className="text-primary">*</span>
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-sm font-semibold">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.50"
                    placeholder="4.99"
                    required={isPremiumRecipe}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-11 pl-7 pr-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default font-semibold"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Minimum recommended price is $0.50.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              size="lg"
              className="brand-gradient font-bold text-white shadow-brand hover:scale-[1.02] active:scale-[0.98] transition-default rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="animate-spin size-5 mr-2" />
                  <span>Adding Recipe...</span>
                </>
              ) : (
                <span>Add Recipe</span>
              )}
            </Button>
          </div>

        </form>
      </div>
    </motion.div>
  );
}