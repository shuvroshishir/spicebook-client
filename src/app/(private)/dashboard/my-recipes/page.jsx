"use client";

import React, { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Input,
  Spinner,
} from "@heroui/react";
import {
  LuPlus,
  LuHeart,
  LuPencil,
  LuTrash2,
  LuEye,
  LuLoader,
  LuUpload,
  LuUtensils,
  LuBookOpen,
} from "react-icons/lu";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Beverage",
];

const CUISINES = [
  "Bengali",
  "Italian",
  "Indian",
  "American",
  "Chinese",
  "Mexican",
  "Japanese",
  "Mediterranean",
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export default function MyRecipesPage() {
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Selected recipe state for view/edit
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCuisine, setEditCuisine] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("");
  const [editPrepTime, setEditPrepTime] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all recipes for current user
  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) {
        toast.error("You must be logged in to view your recipes");
        setLoading(false);
        return;
      }

      const response = await fetch(`${serverUrl}/recipes/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  // Handle opening View modal
  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setIsViewOpen(true);
  };

  // Handle opening Edit modal
  const handleOpenEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setEditName(recipe.recipeName);
    setEditImage(recipe.recipeImage);
    setEditCategory(recipe.category);
    setEditCuisine(recipe.cuisineType);
    setEditDifficulty(recipe.difficultyLevel);
    setEditPrepTime(recipe.preparationTime);
    setEditIngredients(recipe.ingredients.join("\n"));
    setEditInstructions(recipe.instructions.join("\n"));
    setIsEditOpen(true);
  };

  // Image upload handler
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!imgbbApiKey) {
      toast.error("Imgbb API key is missing. Paste URL directly.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Imgbb upload failed");
      }

      const resData = await response.json();
      const imageUrl = resData.data.url;
      setEditImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName || !editImage || !editCategory || !editCuisine || !editDifficulty || !editPrepTime || !editIngredients || !editInstructions) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const ingredientsArray = editIngredients
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const instructionsArray = editInstructions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const updatedData = {
      recipeName: editName,
      recipeImage: editImage,
      category: editCategory,
      cuisineType: editCuisine,
      difficultyLevel: editDifficulty,
      preparationTime: editPrepTime,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
    };

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${selectedRecipe._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      toast.success("Recipe updated successfully!");
      setIsEditOpen(false);
      fetchMyRecipes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Recipe
  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      return;
    }

    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      toast.success("Recipe deleted successfully!");
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete recipe");
    }
  };

  // Get Difficulty Badge Class
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

  // Format date
  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const dateObj = dateInput.$date ? new Date(dateInput.$date) : new Date(dateInput);
    return dateObj.toLocaleDateString("en-GB"); // Returns DD/MM/YYYY
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            My Recipes <LuBookOpen className="size-8 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading published recipes..." : `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} published`}
          </p>
        </div>

        <Link href="/dashboard/add-recipe">
          <Button className="brand-gradient text-white font-semibold rounded-xl flex items-center gap-2 shadow-brand hover:opacity-90 transition-all h-11 px-5">
            <LuPlus className="size-5" />
            <span>Add Recipe</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-3xl bg-card/50 backdrop-blur-sm min-h-[400px]">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <LuUtensils className="size-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Recipes Yet</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            You haven&apos;t shared any recipes yet. Start sharing your culinary masterpieces with the world!
          </p>
          <Link href="/dashboard/add-recipe" className="mt-6">
            <Button className="brand-gradient text-white font-semibold rounded-xl px-6 h-11 shadow-brand">
              Create Your First Recipe
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden md:block overflow-hidden border border-border rounded-2xl bg-card">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recipe</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Likes</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={recipe.recipeImage}
                          alt={recipe.recipeName}
                          className="size-14 rounded-xl object-cover border border-border"
                        />
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">{recipe.recipeName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(recipe.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(recipe.difficultyLevel)}`}>
                        {recipe.difficultyLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                        <LuHeart className="fill-rose-500" />
                        {recipe.likesCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-default-100 dark:bg-default-900 text-default-800 dark:text-default-200 border border-default-200 dark:border-default-800 capitalize">
                        {recipe.status || "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-foreground hover:text-primary transition-colors"
                          onClick={() => handleViewDetails(recipe)}
                          title="View Details"
                        >
                          <LuEye className="size-5" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-warning-500 hover:bg-warning-50 transition-colors"
                          onClick={() => handleOpenEdit(recipe)}
                          title="Edit Recipe"
                        >
                          <LuPencil className="size-5" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-rose-500 hover:bg-rose-50 transition-colors"
                          onClick={() => handleDeleteRecipe(recipe._id)}
                          title="Delete Recipe"
                        >
                          <LuTrash2 className="size-5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack View - Shown on Mobile only */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="p-5 border border-border rounded-2xl bg-card hover:shadow-md transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="size-16 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground line-clamp-1">{recipe.recipeName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatDate(recipe.createdAt)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
                        {recipe.category}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getDifficultyClass(recipe.difficultyLevel)}`}>
                        {recipe.difficultyLevel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex gap-4">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500">
                      <LuHeart className="fill-rose-500" />
                      {recipe.likesCount || 0}
                    </span>
                    <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-default-100 dark:bg-default-900 text-default-800 dark:text-default-200 border border-default-200 dark:border-default-800 capitalize">
                      {recipe.status || "Regular"}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-foreground"
                      onClick={() => handleViewDetails(recipe)}
                    >
                      <LuEye className="size-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-warning-500"
                      onClick={() => handleOpenEdit(recipe)}
                    >
                      <LuPencil className="size-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-rose-500"
                      onClick={() => handleDeleteRecipe(recipe._id)}
                    >
                      <LuTrash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewOpen && selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="text-xl font-bold text-foreground">
                {selectedRecipe.recipeName}
              </h3>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl font-light cursor-pointer"
              >
                &times;
              </button>
            </div>
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedRecipe.recipeImage}
                alt={selectedRecipe.recipeName}
                className="w-full h-64 object-cover rounded-xl border border-border"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Category</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedRecipe.category}</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Cuisine</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedRecipe.cuisineType}</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Difficulty</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedRecipe.difficultyLevel}</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/20">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Prep Time</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedRecipe.preparationTime}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-2 mb-3">Ingredients</h4>
                <ul className="list-disc list-inside space-y-1.5 text-foreground/80 text-sm">
                  {selectedRecipe.ingredients?.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-foreground border-b border-border pb-2 mb-3">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-foreground/80 text-sm">
                  {selectedRecipe.instructions?.map((inst, idx) => (
                    <li key={idx} className="pl-1 align-top">{inst}</li>
                  ))}
                </ol>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <Button color="danger" variant="light" onClick={() => setIsViewOpen(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT RECIPE MODAL */}
      {isEditOpen && selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="text-xl font-bold text-foreground">Edit Recipe</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl font-light cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {/* Recipe Name */}
                <Input
                  label="Recipe Name"
                  placeholder="Enter recipe name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  variant="bordered"
                  className="w-full"
                />

                {/* Recipe Image Upload & input */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    Recipe Image
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste image URL or upload"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      required
                      variant="bordered"
                      className="flex-1"
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
                      className="h-10 px-4 border-border bg-card text-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all border shrink-0"
                    >
                      {isUploading ? (
                        <LuLoader className="animate-spin size-4" />
                      ) : (
                        <LuUpload className="size-4" />
                      )}
                      <span>{isUploading ? "Uploading..." : "Upload"}</span>
                    </Button>
                  </div>
                </div>

                {/* Grid Inputs for metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border border-default-300 hover:border-default-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-card text-foreground transition-all text-sm"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      Cuisine Type
                    </label>
                    <select
                      value={editCuisine}
                      onChange={(e) => setEditCuisine(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border border-default-300 hover:border-default-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-card text-foreground transition-all text-sm"
                      required
                    >
                      <option value="" disabled>Select Cuisine</option>
                      {CUISINES.map((cui) => (
                        <option key={cui} value={cui}>
                          {cui}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={editDifficulty}
                      onChange={(e) => setEditDifficulty(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border border-default-300 hover:border-default-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-card text-foreground transition-all text-sm"
                      required
                    >
                      <option value="" disabled>Select Difficulty</option>
                      {DIFFICULTY_LEVELS.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Preparation Time"
                    placeholder="e.g. 30 mins, 2 hours"
                    value={editPrepTime}
                    onChange={(e) => setEditPrepTime(e.target.value)}
                    required
                    variant="bordered"
                  />
                </div>

                {/* Ingredients Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    Ingredients (one per line)
                  </label>
                  <textarea
                    placeholder="e.g.&#10;2 cups Flour&#10;1 tsp Salt"
                    value={editIngredients}
                    onChange={(e) => setEditIngredients(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-default-300 hover:border-default-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-card text-foreground transition-all text-sm placeholder:text-muted-foreground"
                  ></textarea>
                </div>

                {/* Instructions Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">
                    Instructions (one per line)
                  </label>
                  <textarea
                    placeholder="e.g.&#10;Preheat the oven&#10;Mix all ingredients in a bowl"
                    value={editInstructions}
                    onChange={(e) => setEditInstructions(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-default-300 hover:border-default-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-card text-foreground transition-all text-sm placeholder:text-muted-foreground"
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
                <Button color="danger" variant="light" onClick={() => setIsEditOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="brand-gradient text-white font-semibold rounded-xl px-5 shadow-brand"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <LuLoader className="animate-spin size-4" /> Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}