"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { Button } from '@heroui/react';
import { 
  LuBookOpen, 
  LuBookmark, 
  LuHeart, 
  LuArrowRight, 
  LuPlus, 
  LuCompass, 
  LuSettings,
  LuCrown,
  LuLoader,
  LuCheck,
  LuUsers,
  LuTriangleAlert,
  LuReceipt
} from 'react-icons/lu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function AdminDashboardView({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalPremiumMembers: 0,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult?.data?.token;
        if (!token) return;

        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
        const response = await fetch(`${serverUrl}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LuLoader className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 lg:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Admin Control Center
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Logged in as <span className="font-semibold text-primary">{user?.name} (Administrator)</span>.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-sm font-extrabold uppercase tracking-wider shadow-sm animate-pulse">
          System Admin
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={itemVariants}
      >
        {/* Total Users */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Total Users
            </span>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
              <LuUsers className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.totalUsers}
            </span>
            <Link href="/dashboard/manage-users" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
              Manage Users &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Total Recipes */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Total Recipes
            </span>
            <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-500">
              <LuBookOpen className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.totalRecipes}
            </span>
            <Link href="/dashboard/manage-recipes" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
              Manage Recipes &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Premium Members */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Premium Users
            </span>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
              <LuCrown className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.totalPremiumMembers}
            </span>
            <Link href="/dashboard/transactions" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
              View Transactions &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Total Reports */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Active Reports
            </span>
            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500">
              <LuTriangleAlert className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight text-rose-500">
              {stats.totalReports}
            </span>
            <Link href="/dashboard/reports" className="text-xs text-primary font-semibold hover:underline mt-2 inline-block">
              Review Reports &rarr;
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Admin Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/manage-users">
              <Button className="w-full h-14 bg-foreground text-background font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 shadow-sm transition-all">
                <LuUsers className="size-5 text-background animate-pulse" />
                Manage Users
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/manage-recipes">
              <Button variant="outline" className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all">
                <LuBookOpen className="size-5" />
                Manage Recipes
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all">
                <LuTriangleAlert className="size-5" />
                Review Reports
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/dashboard/transactions">
              <Button variant="outline" className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all">
                <LuReceipt className="size-5" />
                View Transactions
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isUpgradingLoading, setIsUpgradingLoading] = useState(false);

  const [stats, setStats] = useState({
    publishedRecipes: 0,
    savedFavorites: 2,
    totalEngagement: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tokenResult = await authClient.token();
        const token = tokenResult?.data?.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'}/my-listings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            publishedRecipes: data.length || 0
          }));
        }
      } catch (error) {
        console.log("Could not fetch database stats, using mock values:", error);
      }
    };

    if (user && user.role !== "admin") {
      fetchStats();
    }
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
          redirectPath: "/dashboard" // success redirect page context
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

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const name = user?.name || "Abc";

  if (user?.role === "admin") {
    return <AdminDashboardView user={user} />;
  }

  return (
    <motion.div 
      className="p-4 sm:p-6 lg:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header section */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Overview
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">
            Welcome back, <span className="font-semibold text-foreground">{name}</span>. Here is your command center.
          </p>
        </div>

        {/* Upgrade / Member Badge */}
        {user?.isPremium ? (
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-extrabold uppercase tracking-wider shadow-sm"
          >
            <LuCrown className="size-5 animate-pulse text-amber-500" />
            Premium Pro Member
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setIsUpgradeOpen(true)}
              variant="outline"
              className="border-border text-foreground hover:bg-default-100 rounded-xl px-5 py-2.5 font-medium text-sm flex items-center gap-1.5 transition-default"
            >
              Upgrade to Pro <LuArrowRight className="size-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Card 1: Published Recipes */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Published Recipes
            </span>
            <div className="p-2.5 bg-accent/40 rounded-xl text-primary">
              <LuBookOpen className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.publishedRecipes}
            </span>
            <Link 
              href="/dashboard/my-recipes" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors mt-4 group"
            >
              View details 
              <LuArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Saved Favorites */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Saved Favorites
            </span>
            <div className="p-2.5 bg-accent/40 rounded-xl text-primary">
              <LuBookmark className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.savedFavorites}
            </span>
            <Link 
              href="/dashboard/my-favorites" 
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors mt-4 group"
            >
              View details 
              <LuArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Card 3: Total Engagement */}
        <motion.div 
          className="bg-card border border-border rounded-3xl p-6 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20 sm:col-span-2 lg:col-span-1"
          whileHover={{ y: -4 }}
        >
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Total Engagement
            </span>
            <div className="p-2.5 bg-accent/40 rounded-xl text-primary">
              <LuHeart className="size-5" />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black text-foreground block tracking-tight">
              {stats.totalEngagement}
            </span>
            <span className="text-xs text-muted-foreground font-medium block mt-5">
              Across all recipes
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Storage Limit Banner */}
      <motion.div 
        className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 hover:shadow-md"
        variants={itemVariants}
      >
        <div className="flex items-start gap-4">
          <div className={`mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full animate-pulse ${user?.isPremium ? "bg-amber-500" : "bg-foreground"}`} />
          <div className="space-y-1">
            <h4 className="font-extrabold text-foreground text-base sm:text-lg flex items-center gap-2">
              {user?.isPremium ? (
                <>
                  Storage Limit: Unlimited Recipes
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-extrabold">
                    PRO
                  </span>
                </>
              ) : (
                `Storage Limit: ${stats.publishedRecipes}/2 Recipes`
              )}
            </h4>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {user?.isPremium ? (
                "You have lifetime access to SpiceBook Premium. Upload as many recipes as you'd like without limit."
              ) : (
                "Basic accounts are limited to 2 recipes. Upgrade to unlock unlimited storage."
              )}
            </p>
          </div>
        </div>

        {!user?.isPremium && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="shrink-0"
          >
            <Button
              onClick={() => setIsUpgradeOpen(true)}
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:opacity-90 animate-pulse"
            >
              Upgrade Account
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Create new recipe */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/dashboard/add-recipe" className="w-full">
              <Button
                className="w-full h-14 bg-foreground text-background font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 shadow-sm transition-all"
              >
                <LuPlus className="size-5" />
                Create new recipe
              </Button>
            </Link>
          </motion.div>

          {/* Browse gallery */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/browse-recipes" className="w-full">
              <Button
                variant="outline"
                className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all"
              >
                <LuCompass className="size-5" />
                Browse gallery
              </Button>
            </Link>
          </motion.div>

          {/* View saved items */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/dashboard/my-favorites" className="w-full">
              <Button
                variant="outline"
                className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all"
              >
                <LuBookmark className="size-5" />
                View saved items
              </Button>
            </Link>
          </motion.div>

          {/* Account settings */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/dashboard/profile" className="w-full">
              <Button
                variant="outline"
                className="w-full h-14 border-border bg-card text-foreground font-semibold rounded-2xl flex items-center justify-center gap-2 hover:bg-default-100 transition-all"
              >
                <LuSettings className="size-5" />
                Account settings
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Upgrade to Premium Details Modal */}
      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header with golden gradient */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center relative">
              <LuCrown className="size-12 mx-auto mb-2 animate-bounce" />
              <h3 className="text-2xl font-black tracking-tight">SpiceBook Premium</h3>
              <p className="text-white/80 text-xs mt-1">Unlock the ultimate culinary experience</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Price Details */}
              <div className="text-center bg-default-50 border border-border rounded-2xl py-4">
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-bold block">One-Time Payment</span>
                <span className="text-4xl font-extrabold text-foreground tracking-tight">$9.99</span>
                <span className="text-muted-foreground text-xs block mt-0.5">Lifetime Access • No Subscriptions</span>
              </div>

              {/* Features List */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-sm text-foreground uppercase tracking-wider">What's Included:</h4>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-start gap-2.5 text-muted-foreground">
                    <LuCheck className="text-amber-500 size-5 shrink-0 mt-0.5" />
                    <span>Access all locked premium recipes and instructions</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-muted-foreground">
                    <LuCheck className="text-amber-500 size-5 shrink-0 mt-0.5" />
                    <span>Exclusive badges to stand out as a Pro Chef</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-muted-foreground">
                    <LuCheck className="text-amber-500 size-5 shrink-0 mt-0.5" />
                    <span>Feature your own recipes on the landing page</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-muted-foreground">
                    <LuCheck className="text-amber-500 size-5 shrink-0 mt-0.5" />
                    <span>Completely ad-free browsing experience</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsUpgradeOpen(false)}
                  variant="flat"
                  className="flex-1 font-semibold rounded-2xl border border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpgradeToPremium}
                  disabled={isUpgradingLoading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-md hover:opacity-90 rounded-2xl"
                >
                  {isUpgradingLoading ? (
                    <LuLoader className="size-5 animate-spin" />
                  ) : (
                    "Upgrade Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}