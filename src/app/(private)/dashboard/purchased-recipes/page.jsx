"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LuCircleCheck, 
  LuLock, 
  LuLoader, 
  LuArrowRight, 
  LuTriangleAlert, 
  LuBookOpen, 
  LuClock, 
  LuUtensils 
} from "react-icons/lu";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";
import Loading from "@/app/loading";

function PurchasedRecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const recipeId = searchParams.get("recipeId");

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [unlockedRecipe, setUnlockedRecipe] = useState(null);
  
  // Purchased recipes list state
  const [purchasedList, setPurchasedList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Verify payment
  useEffect(() => {
    if (sessionId && recipeId) {
      const verifyPurchase = async () => {
        setIsVerifying(true);
        try {
          const tokenResult = await authClient.token();
          const token = tokenResult?.data?.token;

          const response = await fetch(`${serverUrl}/recipes/verify-purchase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId })
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Verification failed");
          }

          // Fetch the recipe details to show in success card
          const recipeRes = await fetch(`${serverUrl}/recipes/${recipeId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (recipeRes.ok) {
            const recipeData = await recipeRes.json();
            setUnlockedRecipe(recipeData);
          }

          toast.success("Recipe unlocked successfully!");
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationError(error.message || "Failed to verify purchase.");
          toast.error("Failed to verify purchase.");
        } finally {
          setIsVerifying(false);
        }
      };

      verifyPurchase();
    } else {
      // Load purchased list instead
      const fetchPurchasedRecipes = async () => {
        setListLoading(true);
        try {
          const tokenResult = await authClient.token();
          const token = tokenResult?.data?.token;
          if (!token) return;

          const res = await fetch(`${serverUrl}/recipes/purchased`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setPurchasedList(data);
          }
        } catch (e) {
          console.error("Error fetching purchased recipes:", e);
        } finally {
          setListLoading(false);
        }
      };

      fetchPurchasedRecipes();
    }
  }, [sessionId, recipeId]);

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center space-y-4 p-6">
        <div className="relative">
          <LuLoader className="size-16 animate-spin text-primary" />
          <LuLock className="size-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Verifying Payment...</h2>
        <p className="text-muted-foreground text-sm">Please do not refresh or close this window.</p>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-[60vh] bg-background flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="bg-danger-500/10 border border-danger-500/20 w-16 h-16 rounded-full flex items-center justify-center text-danger-500">
          <LuTriangleAlert className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Verification Failed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{verificationError}</p>
        </div>
        <Button
          onClick={() => router.push("/browse-recipes")}
          className="w-full bg-default-100 hover:bg-default-200 text-foreground font-semibold rounded-2xl h-11"
        >
          Back to Browse Recipes
        </Button>
      </div>
    );
  }

  // Render Verification Success Screen
  if (sessionId && recipeId && unlockedRecipe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 sm:p-6 max-w-lg mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-10 shadow-2xl w-full text-center space-y-6"
        >
          <div className="bg-success-500/10 border border-success-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-success-500">
            <LuCircleCheck className="size-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Recipe Unlocked!</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your payment was verified successfully. You now have lifetime access to this recipe.
            </p>
          </div>

          {/* Recipe Card Preview */}
          <div className="p-4 border border-border rounded-3xl bg-default-50/50 flex items-center gap-4 text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={unlockedRecipe.recipeImage} 
              alt={unlockedRecipe.recipeName}
              className="size-16 sm:size-20 rounded-2xl object-cover border border-border shrink-0" 
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {unlockedRecipe.category}
              </span>
              <h4 className="font-extrabold text-foreground text-base sm:text-lg truncate mt-1">{unlockedRecipe.recipeName}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">By {unlockedRecipe.authorName || "Chef"}</p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => router.push(`/recipe/${recipeId}`)}
              className="w-full brand-gradient text-white font-extrabold rounded-2xl h-12 shadow-brand flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Start Cooking <LuArrowRight className="size-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Purchased List Screen
  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Purchased Recipes <LuLock className="size-8 text-primary" />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {listLoading ? "Loading your purchases..." : `You have unlocked ${purchasedList.length} premium recipe${purchasedList.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {listLoading ? (
        <Loading />
      ) : purchasedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-3xl bg-card/50 backdrop-blur-sm min-h-[400px]">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <LuLock className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Purchased Recipes</h3>
          <p className="text-muted-foreground max-w-md mt-2">
            You haven&apos;t purchased any premium recipes yet. Browse recipes to unlock exclusive gourmet creations.
          </p>
          <Link href="/browse-recipes" className="mt-6">
            <Button className="brand-gradient text-white font-semibold rounded-xl px-6 h-11 shadow-brand">
              Explore Premium Recipes
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedList.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ y: -4 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-[380px]"
            >
              {/* Image Banner */}
              <div className="h-44 relative overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.recipeImage}
                  alt={item.recipeName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground text-lg line-clamp-1" title={item.recipeName}>
                    {item.recipeName}
                  </h3>
                  
                  {/* Meta Grid */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <LuUtensils className="size-3.5" />
                      {item.cuisineType || "General"}
                    </span>
                    <span className="flex items-center gap-1">
                      <LuClock className="size-3.5" />
                      {item.preparationTime}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Unlocked
                  </span>
                  
                  <Link href={`/recipe/${item.recipeId}`}>
                    <Button className="bg-default-100 hover:bg-default-200 text-foreground font-semibold rounded-xl text-xs h-9 px-4 flex items-center gap-1">
                      <span>View Details</span>
                      <LuArrowRight className="size-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PurchasedRecipesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PurchasedRecipesContent />
    </Suspense>
  );
}