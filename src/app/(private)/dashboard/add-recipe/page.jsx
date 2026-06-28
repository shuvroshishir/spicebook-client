"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { LuPlus, LuUpload, LuLoader } from "react-icons/lu";
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

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Redirect to recipes listings page
      router.push("/dashboard/my-recipes");
    } catch (error) {
      console.error("Recipe submit error:", error);
      toast.error(error.message || "Something went wrong while adding recipe.");
    } finally {
      setIsSubmitting(false);
    }
  };

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