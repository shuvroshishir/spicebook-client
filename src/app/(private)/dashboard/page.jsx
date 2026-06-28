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
  LuSettings 
} from 'react-icons/lu';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

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

    if (user) {
      fetchStats();
    }
  }, [user]);

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

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/dashboard/upgrade">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-default-100 rounded-xl px-5 py-2.5 font-medium text-sm flex items-center gap-1.5 transition-default"
            >
              Upgrade to Pro <LuArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>
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
          <div className="mt-1.5 flex h-2.5 w-2.5 shrink-0 rounded-full bg-foreground animate-pulse" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-foreground text-base sm:text-lg flex items-center gap-2">
              Storage Limit: {stats.publishedRecipes}/2 Recipes
            </h4>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Basic accounts are limited to 2 recipes. Upgrade to unlock unlimited storage.
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="shrink-0"
        >
          <Link href="/dashboard/upgrade">
            <Button
              className="w-full md:w-auto bg-foreground text-background font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-sm hover:opacity-90"
            >
              Upgrade Account
            </Button>
          </Link>
        </motion.div>
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
    </motion.div>
  );
}