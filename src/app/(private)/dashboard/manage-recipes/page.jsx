"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  Table,
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Chip,
} from "@heroui/react";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuStar,
  LuLoader,
  LuCrown,
  LuCompass,
  LuChefHat,
  LuCheck,
  LuTriangleAlert,
} from "react-icons/lu";
import toast from "react-hot-toast";

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
  "Other",
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
  "Other",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function ManageRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Edit Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCuisine, setEditCuisine] = useState("");
  const [editDifficulty, setEditDifficulty] = useState("");
  const [editPrepTime, setEditPrepTime] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editIsPremium, setEditIsPremium] = useState(false);
  const [editPrice, setEditPrice] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  
  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteRecipeId, setDeleteRecipeId] = useState(null);

  const fetchRecipes = async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/recipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        toast.error("Failed to load recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      toast.error("Error loading recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleToggleFeatured = async (recipeId) => {
    setActionLoading(recipeId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/recipes/${recipeId}/feature`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setRecipes((prev) =>
          prev.map((r) =>
            r._id === recipeId ? { ...r, isFeatured: result.isFeatured } : r
          )
        );
      } else {
        toast.error("Failed to toggle featured status");
      }
    } catch (error) {
      console.error("Error featuring recipe:", error);
      toast.error("Failed to update recipe featured status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRecipe = (recipeId) => {
    setDeleteRecipeId(recipeId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteRecipeId) return;
    setIsDeleteModalOpen(false);

    setActionLoading(deleteRecipeId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/recipes/${deleteRecipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Recipe deleted successfully");
        setRecipes((prev) => prev.filter((r) => r._id !== deleteRecipeId));
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setActionLoading(null);
      setDeleteRecipeId(null);
    }
  };

  const handleOpenEditModal = (recipe) => {
    setSelectedRecipe(recipe);
    setEditName(recipe.recipeName || "");
    setEditImage(recipe.recipeImage || "");
    setEditCategory(recipe.category || "");
    setEditCuisine(recipe.cuisineType || "");
    setEditDifficulty(recipe.difficultyLevel || "");
    setEditPrepTime(recipe.preparationTime || "");
    setEditIngredients(
      Array.isArray(recipe.ingredients) ? recipe.ingredients.join("\n") : ""
    );
    setEditInstructions(
      Array.isArray(recipe.instructions) ? recipe.instructions.join("\n") : ""
    );
    setEditIsPremium(recipe.isPremiumRecipe === true);
    setEditPrice(recipe.price || "");
    setIsOpen(true);
  };

  const handleSaveRecipe = async () => {
    if (!editName || !editCategory || !editDifficulty || !editIngredients || !editInstructions) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editIsPremium && (!editPrice || parseFloat(editPrice) <= 0)) {
      toast.error("Please enter a valid price for premium recipes.");
      return;
    }

    setEditSubmitting(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      
      const ingredientsArray = editIngredients
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const instructionsArray = editInstructions
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const updatedRecipeData = {
        recipeName: editName,
        recipeImage: editImage,
        category: editCategory,
        cuisineType: editCuisine,
        difficultyLevel: editDifficulty,
        preparationTime: editPrepTime,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        isPremiumRecipe: editIsPremium,
        price: editIsPremium ? parseFloat(editPrice) : 0,
      };

      const response = await fetch(`${serverUrl}/admin/recipes/${selectedRecipe._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRecipeData),
      });

      if (response.ok) {
        toast.success("Recipe updated successfully!");
        setRecipes((prev) =>
          prev.map((r) =>
            r._id === selectedRecipe._id ? { ...r, ...updatedRecipeData } : r
          )
        );
        setIsOpen(false);
      } else {
        toast.error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Error editing recipe:", error);
      toast.error("Failed to update recipe");
    } finally {
      setEditSubmitting(false);
    }
  };

  const filteredRecipes = recipes.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      (r.recipeName || "").toLowerCase().includes(query) ||
      (r.category || "").toLowerCase().includes(query) ||
      (r.cuisineType || "").toLowerCase().includes(query)
    );
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LuLoader className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={itemVariants}>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Manage Recipes <LuChefHat className="text-primary size-7" />
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Moderate community recipes, toggle featured content, edit details, or remove inappropriate submissions.
          </p>
        </div>
      </motion.div>

      {/* Filter and Search */}
      <motion.div variants={itemVariants} className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LuSearch className="text-default-400 size-4 shrink-0" />
        </div>
        <input
          type="text"
          className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="Search by title, category, or cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-default-400 hover:text-foreground transition-colors"
          >
            ✕
          </button>
        )}
      </motion.div>

      {/* Recipes Table (Desktop) */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hidden md:block">
        <Table className="p-0 border-none">
          <TableScrollContainer>
            <TableContent aria-label="Community recipe listings database">
          <TableHeader>
            <TableColumn isRowHeader className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Recipe Details</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Category</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Status</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Featured</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4 text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No recipes found in the database.">
            {filteredRecipes.map((recipe) => {
              const recipeId = recipe._id;
              const isPremium = recipe.isPremiumRecipe === true;
              const isFeatured = recipe.isFeatured === true;

              return (
                <TableRow key={recipeId} className="border-b border-border/40 hover:bg-default-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200"}
                        alt={recipe.recipeName}
                        className="w-12 h-12 rounded-xl object-cover border border-border/40 shrink-0"
                      />
                      <div className="overflow-hidden min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate max-w-xs sm:max-w-md">
                          {recipe.recipeName || "Untitled Recipe"}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          by {recipe.authorName || recipe.authorEmail || "Anonymous"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {recipe.category || "General"}
                      </span>
                      {recipe.cuisineType && (
                        <span className="text-xs text-muted-foreground">
                          {recipe.cuisineType} Cuisine
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {isPremium ? (
                      <Chip
                        variant="flat"
                        color="warning"
                        size="sm"
                        className="font-extrabold text-[10px] tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1"
                      >
                        <LuCrown className="size-3.5 text-amber-500" />
                        <span>${recipe.price?.toFixed(2) || "0.50"}</span>
                      </Chip>
                    ) : (
                      <Chip size="sm" variant="flat" className="font-semibold text-xs text-muted-foreground uppercase">
                        Free
                      </Chip>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Tooltip content={isFeatured ? "Remove from Featured" : "Pin to Featured"}>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={isFeatured ? "warning" : "default"}
                        isLoading={actionLoading === recipeId}
                        onClick={() => handleToggleFeatured(recipeId)}
                        className="rounded-xl hover:bg-default-100"
                      >
                        <LuStar className={`size-4 ${isFeatured ? "fill-amber-500 text-amber-500" : "text-default-400"}`} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex justify-center gap-1">
                      <Tooltip content="Edit Details">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="default"
                          onClick={() => handleOpenEditModal(recipe)}
                          className="rounded-xl hover:bg-default-100"
                        >
                          <LuPencil className="size-4 text-default-600" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete Recipe">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          isLoading={actionLoading === recipeId}
                          onClick={() => handleDeleteRecipe(recipeId)}
                          className="rounded-xl hover:bg-default-100"
                        >
                          <LuTrash2 className="size-4 text-rose-500" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
            </TableContent>
          </TableScrollContainer>
        </Table>
      </motion.div>

      {/* Recipes Cards (Mobile/Tablet) */}
      <motion.div variants={itemVariants} className="md:hidden">
        {filteredRecipes.length === 0 ? (
          <div className="text-center p-8 border border-border rounded-3xl bg-card text-muted-foreground text-sm">
            No recipes found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecipes.map((recipe) => {
              const recipeId = recipe._id;
              const isPremium = recipe.isPremiumRecipe === true;
              const isFeatured = recipe.isFeatured === true;

              return (
                <div
                  key={recipeId}
                  className="p-5 border border-border rounded-2xl bg-card hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={recipe.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200"}
                      alt={recipe.recipeName}
                      className="w-14 h-14 rounded-xl object-cover border border-border/40 shrink-0"
                    />
                    <div className="overflow-hidden min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-foreground truncate">
                        {recipe.recipeName || "Untitled Recipe"}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        by {recipe.authorName || recipe.authorEmail || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-semibold">Category:</span>
                      <span className="text-xs font-semibold text-foreground bg-default-100 dark:bg-default-900 px-2 py-0.5 rounded-md ml-1">
                        {recipe.category || "General"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {isPremium ? (
                        <Chip
                          variant="flat"
                          color="warning"
                          size="sm"
                          className="font-extrabold text-[9px] tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1"
                        >
                          <LuCrown className="size-3 text-amber-500" />
                          <span>${recipe.price?.toFixed(2) || "0.50"}</span>
                        </Chip>
                      ) : (
                        <Chip size="sm" variant="flat" className="font-semibold text-[9px] text-muted-foreground uppercase">
                          Free
                        </Chip>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground font-semibold">Featured:</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color={isFeatured ? "warning" : "default"}
                        isLoading={actionLoading === recipeId}
                        onClick={() => handleToggleFeatured(recipeId)}
                        className="rounded-xl hover:bg-default-100"
                      >
                        <LuStar className={`size-4 ${isFeatured ? "fill-amber-500 text-amber-500" : "text-default-400"}`} />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="default"
                        onClick={() => handleOpenEditModal(recipe)}
                        className="font-bold text-xs rounded-xl flex items-center gap-1.5 px-3 h-8 shadow-xs"
                      >
                        <LuPencil className="size-3.5 text-default-600 mr-0.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isLoading={actionLoading === recipeId}
                        onClick={() => handleDeleteRecipe(recipeId)}
                        className="font-bold text-xs rounded-xl flex items-center gap-1.5 px-3 h-8 shadow-xs"
                      >
                        <LuTrash2 className="size-3.5 text-rose-500 mr-0.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Edit Recipe Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
              <h3 className="text-xl font-bold text-foreground">Edit Recipe Details</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground text-2xl font-light cursor-pointer"
              >
                &times;
              </button>
            </div>
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Recipe Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Recipe Name *</label>
                <input
                  required
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter recipe title"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>

              {/* Recipe Image URL */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Image URL</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Paste thumbnail image URL"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>

              {/* Category & Cuisine Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Cuisine</label>
                  <select
                    value={editCuisine}
                    onChange={(e) => setEditCuisine(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  >
                    <option value="">None</option>
                    {CUISINES.map((cui) => (
                      <option key={cui} value={cui}>
                        {cui}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prep Time & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Prep Time</label>
                  <input
                    type="text"
                    value={editPrepTime}
                    onChange={(e) => setEditPrepTime(e.target.value)}
                    placeholder="e.g. 20 minutes"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Difficulty Level *</label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ingredients Textarea */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Ingredients (one per line) *</label>
                <textarea
                  required
                  value={editIngredients}
                  onChange={(e) => setEditIngredients(e.target.value)}
                  rows={4}
                  placeholder="Enter ingredients on separate lines"
                  className="w-full p-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>

              {/* Instructions Textarea */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Instructions (one per line) *</label>
                <textarea
                  required
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                  rows={4}
                  placeholder="Enter steps on separate lines"
                  className="w-full p-4 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default"
                />
              </div>

              {/* Premium Setting */}
              <div className="p-4 rounded-xl border border-border bg-default-50/50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <LuCrown className="text-amber-500 size-4" /> Premium Locked Recipe
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Whether this recipe requires payment to unlock instructions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsPremium}
                    onChange={(e) => {
                      setEditIsPremium(e.target.checked);
                      if (!e.target.checked) setEditPrice("");
                    }}
                    className="w-4 h-4 rounded border-border text-primary cursor-pointer accent-primary"
                  />
                </div>
                {editIsPremium && (
                  <div className="flex items-center gap-3 pt-3 border-t border-dashed border-border/80">
                    <span className="text-sm font-semibold text-foreground">Price (USD):</span>
                    <div className="relative rounded-xl shadow-xs w-36">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-muted-foreground text-sm font-semibold">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0.50"
                        placeholder="2.99"
                        required={editIsPremium}
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full h-10 pl-7 pr-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-default font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              <Button variant="flat" color="default" onClick={() => setIsOpen(false)} className="border border-border rounded-xl font-semibold">
                Cancel
              </Button>
              <Button
                color="success"
                isLoading={editSubmitting}
                onClick={handleSaveRecipe}
                className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Warning Icon & Header */}
            <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-3">
                <LuTriangleAlert className="size-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Delete Recipe</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Are you sure you want to permanently delete this recipe? This will also remove any user reviews, favorites, or reports associated with it. This action cannot be undone.
              </p>
            </div>
            {/* Actions */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border flex items-center justify-end gap-3">
              <Button
                variant="flat"
                color="default"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteRecipeId(null);
                }}
                className="border border-border font-semibold rounded-xl"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={handleConfirmDelete}
                className="font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs rounded-xl"
              >
                Delete Recipe
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
