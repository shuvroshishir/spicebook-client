"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { 
  LuHeart, 
  LuBookmark, 
  LuTriangleAlert, 
  LuUtensils, 
  LuClock, 
  LuSparkles, 
  LuChevronLeft,
  LuShoppingBag,
  LuLoader,
  LuCheck,
  LuCrown
} from "react-icons/lu";

export default function RecipeDetailsPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  // Report Modal states
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate Content");
  const [reportDetails, setReportDetails] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const fetchRecipeDetails = async () => {
    try {
      const headers = {};
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${serverUrl}/recipes/${id}`, { headers });
      if (!response.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load recipe details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like this recipe");
      router.push("/login");
      return;
    }
    setLikeLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setRecipe(prev => ({
        ...prev,
        likesCount: data.likesCount,
        hasLiked: data.hasLiked
      }));
      toast.success(data.hasLiked ? "Recipe liked!" : "Recipe unliked!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to save favorites");
      router.push("/login");
      return;
    }
    setFavLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${id}/favorite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setRecipe(prev => ({
        ...prev,
        isFavorite: data.isFavorite
      }));
      toast.success(data.isFavorite ? "Added to favorites!" : "Removed from favorites!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setFavLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to report recipes");
      router.push("/login");
      return;
    }
    setReportLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/recipes/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
        }),
      });

      if (!response.ok) throw new Error();
      toast.success("Report submitted successfully");
      setIsReportOpen(false);
      setReportDetails("");
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Please login to purchase recipes");
      router.push("/login");
      return;
    }
    setBuyLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;

      const response = await fetch(`${serverUrl}/create-checkout-session/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipeId: id,
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Could not initiate Stripe checkout");
      setBuyLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Recipe not found</h2>
        <Link href="/browse-recipes" className="text-primary hover:underline">
          Back to Recipes
        </Link>
      </div>
    );
  }

  const isAuthor = user && (user.email === recipe.authorEmail || user.id === recipe.authorId);
  console.log("recipe client details:", { isPremiumRecipe: recipe.isPremiumRecipe, isAuthor, hasPurchased: recipe.hasPurchased });
  const isUnlocked = recipe.isPremiumRecipe !== true || isAuthor || recipe.hasPurchased;

  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : (typeof recipe.ingredients === "string" ? recipe.ingredients.split("\n") : []);

  const instructionsList = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : (typeof recipe.instructions === "string" ? recipe.instructions.split("\n") : []);

  return (
    <div className="min-h-screen bg-background py-12 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Back navigation */}
        <Link 
          href="/browse-recipes" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <LuChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Recipes</span>
        </Link>

        {/* Hero Section Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-6 relative rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-xl group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={recipe.recipeImage} 
              alt={recipe.recipeName} 
              className="w-full h-[350px] sm:h-[450px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            {/* Category Tag */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-lg border border-primary/20">
                {recipe.category}
              </span>
            </div>
          </div>

          {/* Right Column: Recipe Meta Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
                {recipe.recipeName}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {recipe.cuisineType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/10">
                  {recipe.difficultyLevel || "Easy"}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                  <LuClock className="size-4 text-primary" />
                  {recipe.preparationTime}
                </span>
              </div>

              {/* Author and stats card */}
              <div className="p-6 rounded-3xl bg-card border border-border/80 flex items-center justify-between shadow-sm mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {recipe.authorName ? recipe.authorName.charAt(0).toUpperCase() : "A"}
                    </div>
                    {recipe.isAuthorPremium && (
                      <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5" title="Premium Pro Chef">
                        <LuCrown className="size-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Created By</span>
                    <span className="text-sm font-bold text-foreground truncate max-w-[200px] flex items-center gap-1">
                      {recipe.authorName || "Anonymous"}
                      {recipe.isAuthorPremium && (
                        <LuCrown className="text-amber-500 size-4 shrink-0" title="Premium Pro Chef" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                  <LuHeart className="size-5 text-primary fill-primary" />
                  <span className="text-sm font-bold text-foreground">{recipe.likesCount || 0} Likes</span>
                </div>
              </div>
            </div>

            {/* Interaction Action Buttons Bar */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center justify-center gap-2 py-3.5 border rounded-2xl font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
                    recipe.hasLiked
                      ? "bg-primary text-white border-primary hover:bg-primary/95"
                      : "bg-primary/5 border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                >
                  {likeLoading ? (
                    <LuLoader className="size-5 animate-spin" />
                  ) : (
                    <LuHeart className={`size-5 ${recipe.hasLiked ? "fill-white" : ""}`} />
                  )}
                  <span>{recipe.hasLiked ? "Liked" : "Like"}</span>
                </button>

                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`flex items-center justify-center gap-2 py-3.5 border rounded-2xl font-semibold transition-all duration-300 shadow-sm cursor-pointer ${
                    recipe.isFavorite
                      ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-500/95"
                      : "bg-amber-500/5 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                  }`}
                >
                  {favLoading ? (
                    <LuLoader className="size-5 animate-spin" />
                  ) : (
                    <LuBookmark className={`size-5 ${recipe.isFavorite ? "fill-white" : ""}`} />
                  )}
                  <span>Save</span>
                </button>

                {/* Report Button */}
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to report recipes");
                      router.push("/login");
                    } else {
                      setIsReportOpen(true);
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 rounded-2xl font-semibold transition-all duration-300 shadow-sm cursor-pointer"
                >
                  <LuTriangleAlert className="size-5" />
                  <span>Report</span>
                </button>
              </div>

              {/* Purchase CTA Widget */}
              {!isAuthor && recipe.isPremiumRecipe === true && (
                <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md">
                  {isUnlocked ? (
                    <div className="flex items-center gap-3 text-emerald-600 font-semibold bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
                      <LuCheck className="size-5 shrink-0" />
                      <span>Recipe Purchased & Fully Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground block">Premium Recipe Pricing</span>
                        <span className="text-2xl font-extrabold text-foreground">
                          ${recipe.price ? recipe.price.toFixed(2) : "4.99"}
                        </span>
                      </div>
                      <button
                        onClick={handlePurchase}
                        disabled={buyLoading}
                        className="w-full sm:w-auto px-6 py-3.5 brand-gradient hover:opacity-95 text-white font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-brand cursor-pointer disabled:opacity-50"
                      >
                        {buyLoading ? (
                          <LuLoader className="size-5 animate-spin" />
                        ) : (
                          <LuShoppingBag className="size-5" />
                        )}
                        <span>Unlock Full Recipe</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recipe Body: Ingredients & Instructions (Locked/Unlocked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ingredients list */}
          <div className="lg:col-span-5 p-8 rounded-[2rem] bg-card border border-border shadow-sm">
            <h2 className="text-2xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <LuUtensils className="size-6 text-primary" />
              <span>Ingredients</span>
            </h2>

            <div className="relative">
              {isUnlocked ? (
                <ul className="space-y-4">
                  {ingredientsList.filter(i => i && i.trim()).map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-foreground/95 leading-relaxed">
                      <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-4 filter blur-sm select-none pointer-events-none">
                  <div className="h-6 bg-muted rounded-md w-3/4 animate-pulse" />
                  <div className="h-6 bg-muted rounded-md w-5/6 animate-pulse" />
                  <div className="h-6 bg-muted rounded-md w-2/3 animate-pulse" />
                  <div className="h-6 bg-muted rounded-md w-4/5 animate-pulse" />
                  <div className="h-6 bg-muted rounded-md w-3/4 animate-pulse" />
                </div>
              )}

              {!isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-card/65 backdrop-blur-xs rounded-2xl border border-dashed border-border z-20">
                  <LuShoppingBag className="size-10 text-primary mb-3" />
                  <h4 className="text-lg font-bold text-foreground">Content Locked</h4>
                  <p className="text-xs text-muted-foreground max-w-[250px] mt-1 mb-4">
                    Purchase this premium recipe to unlock ingredients.
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={buyLoading}
                    className="px-4 py-2 border border-primary bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Unlock Details
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Instructions Step-by-Step */}
          <div className="lg:col-span-7 p-8 rounded-[2rem] bg-card border border-border shadow-sm">
            <h2 className="text-2xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <LuSparkles className="size-6 text-primary" />
              <span>Step-by-Step Instructions</span>
            </h2>

            <div className="relative">
              {isUnlocked ? (
                <ol className="space-y-6">
                  {instructionsList.filter(i => i && i.trim()).map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-foreground/95 leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="space-y-6 filter blur-sm select-none pointer-events-none">
                  <div className="flex gap-4">
                    <div className="w-7 h-7 bg-muted rounded-xl shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-5 bg-muted rounded w-11/12" />
                      <div className="h-5 bg-muted rounded w-4/5" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-7 h-7 bg-muted rounded-xl shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-5 bg-muted rounded w-5/6" />
                      <div className="h-5 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              )}

              {!isUnlocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-card/65 backdrop-blur-xs rounded-2xl border border-dashed border-border z-20">
                  <LuShoppingBag className="size-10 text-primary mb-3" />
                  <h4 className="text-lg font-bold text-foreground">Instructions Locked</h4>
                  <p className="text-xs text-muted-foreground max-w-[250px] mt-1 mb-4">
                    Purchase this premium recipe to unlock cooking steps.
                  </p>
                  <button
                    onClick={handlePurchase}
                    disabled={buyLoading}
                    className="px-4 py-2 border border-primary bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Unlock Details
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border/80 flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <LuTriangleAlert className="size-5 text-rose-500" />
                <span>Report Recipe</span>
              </h3>
              <button 
                onClick={() => setIsReportOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1 hover:bg-muted/50 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  Reason for Reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground focus:outline-hidden focus:border-primary/50 transition-colors"
                >
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Plagiarism">Plagiarism / Copied Recipe</option>
                  <option value="Incorrect Instructions">Incorrect Instructions</option>
                  <option value="Spam or Advertising">Spam or Advertising</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  Additional Details
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why you are reporting this recipe..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-card text-sm text-foreground placeholder-muted-foreground focus:outline-hidden focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="flex-1 py-3 border border-border bg-card hover:bg-default-50 text-foreground font-semibold rounded-2xl text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportLoading}
                  className="flex-1 py-3 bg-rose-600 hover:opacity-95 text-white font-semibold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {reportLoading ? (
                    <LuLoader className="size-4 animate-spin" />
                  ) : (
                    <span>Submit Report</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}