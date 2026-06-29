"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Tooltip,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from "@heroui/react";
import {
  LuSearch,
  LuTrash2,
  LuEdit3,
  LuStar,
  LuLoader,
  LuCrown,
  LuCompass,
  LuChefHat,
  LuCheck,
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to permanently delete this recipe? This will also remove any user reviews, favorites, or reports associated with it.")) {
      return;
    }

    setActionLoading(recipeId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/recipes/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Recipe deleted successfully");
        setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      } else {
        toast.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    } finally {
      setActionLoading(null);
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
    onOpen();
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
        onOpenChange(false);
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
      <motion.div variants={itemVariants}>
        <Input
          isClearable
          className="w-full max-w-md"
          placeholder="Search by title, category, or cuisine..."
          startContent={<LuSearch className="text-default-400 size-4 shrink-0" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </motion.div>

      {/* Recipes Table */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        <Table aria-label="Community recipe listings database" className="p-0 border-none">
          <TableHeader>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Recipe Details</TableColumn>
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
                        startContent={<LuCrown className="size-3.5 mr-0.5 text-amber-500" />}
                        variant="flat"
                        color="warning"
                        size="sm"
                        className="font-extrabold text-[10px] tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        ${recipe.price?.toFixed(2) || "0.50"}
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
                          <LuEdit3 className="size-4 text-default-600" />
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
        </Table>
      </motion.div>

      {/* Edit Recipe Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" className="bg-card border border-border">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl font-black text-foreground">
                Edit Recipe details
              </ModalHeader>
              <ModalBody className="space-y-4 py-6">
                
                {/* Recipe Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Recipe Name *</label>
                  <Input
                    required
                    value={editName}
                    onValueChange={setEditName}
                    placeholder="Enter recipe title"
                  />
                </div>

                {/* Recipe Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Image URL</label>
                  <Input
                    value={editImage}
                    onValueChange={setEditImage}
                    placeholder="Paste thumbnail image URL"
                  />
                </div>

                {/* Category & Cuisine Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Category *</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Cuisine</label>
                    <select
                      value={editCuisine}
                      onChange={(e) => setEditCuisine(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
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
                    <label className="text-xs font-bold text-foreground">Prep Time</label>
                    <Input
                      value={editPrepTime}
                      onValueChange={setEditPrepTime}
                      placeholder="e.g. 20 minutes"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Difficulty Level *</label>
                    <select
                      value={editDifficulty}
                      onChange={(e) => setEditDifficulty(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
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
                  <label className="text-xs font-bold text-foreground">Ingredients (one per line) *</label>
                  <Textarea
                    required
                    value={editIngredients}
                    onValueChange={setEditIngredients}
                    rows={4}
                    placeholder="Enter ingredients on separate lines"
                  />
                </div>

                {/* Instructions Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Instructions (one per line) *</label>
                  <Textarea
                    required
                    value={editInstructions}
                    onValueChange={setEditInstructions}
                    rows={4}
                    placeholder="Enter steps on separate lines"
                  />
                </div>

                {/* Premium Setting */}
                <div className="p-4 rounded-xl border border-border bg-default-50/50 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-foreground flex items-center gap-1">
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
                    <div className="flex items-center gap-2 pt-2 border-t border-dashed border-border/80">
                      <span className="text-sm font-semibold text-foreground">Price (USD):</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.50"
                        placeholder="2.99"
                        value={editPrice}
                        onValueChange={setEditPrice}
                        className="w-28 font-bold"
                        startContent={<span className="text-xs text-muted-foreground font-semibold">$</span>}
                      />
                    </div>
                  )}
                </div>

              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="default" onPress={onClose} className="border border-border">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={editSubmitting}
                  onPress={handleSaveRecipe}
                  className="font-bold text-white shadow-xs"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
