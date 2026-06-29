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
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  LuTriangleAlert,
  LuTrash2,
  LuCircleCheck,
  LuLoader,
  LuExternalLink,
} from "react-icons/lu";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RecipeReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        toast.error("Failed to load reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Error loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDismissReport = async (reportId) => {
    setActionLoading(reportId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/reports/${reportId}/dismiss`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Report dismissed successfully");
        setReports((prev) =>
          prev.map((rep) =>
            rep._id === reportId ? { ...rep, status: "dismissed" } : rep
          )
        );
      } else {
        toast.error("Failed to dismiss report");
      }
    } catch (error) {
      console.error("Error dismissing report:", error);
      toast.error("Failed to dismiss report");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRecipe = async (recipeId, reportId) => {
    if (!confirm("Are you sure you want to delete this reported recipe? This action cannot be undone.")) {
      return;
    }

    setActionLoading(reportId);
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
        toast.success("Recipe deleted and related reports cleaned up");
        // Remove from local list
        setReports((prev) => prev.filter((r) => r.recipeId !== recipeId));
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
            Recipe Reports <LuTriangleAlert className="text-rose-500 size-7 animate-pulse" />
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Review inappropriate content flags raised by users. You can dismiss reports or remove recipes.
          </p>
        </div>
      </motion.div>

      {/* Reports Table (Desktop) */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hidden md:block">
        <Table className="p-0 border-none">
          <TableScrollContainer>
            <TableContent aria-label="Community recipe reports listings">
          <TableHeader>
            <TableColumn isRowHeader className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Report Details</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Recipe Info</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Reporter</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Status</TableColumn>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4 text-center">Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No recipe reports have been filed.">
            {reports.map((report) => {
              const reportId = report._id;
              const hasRecipe = !!report.recipeDetails;
              const status = report.status || "active";
              const isDismissed = status === "dismissed";

              return (
                <TableRow key={reportId} className="border-b border-border/40 hover:bg-default-50/50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1 max-w-sm">
                      <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">
                        Reason: {report.reason || "General Violation"}
                      </span>
                      {report.details && (
                        <p className="text-xs text-muted-foreground leading-normal mt-0.5 break-words">
                          "{report.details}"
                        </p>
                      )}
                      <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                        Reported on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {hasRecipe ? (
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={report.recipeDetails.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200"}
                          alt={report.recipeDetails.recipeName}
                          className="w-10 h-10 rounded-lg object-cover border border-border/40 shrink-0"
                        />
                        <div className="overflow-hidden min-w-0">
                          <h4 className="font-bold text-xs text-foreground truncate max-w-[150px] sm:max-w-[200px]" title={report.recipeDetails.recipeName}>
                            {report.recipeDetails.recipeName}
                          </h4>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            by {report.recipeDetails.authorEmail || "Anonymous"}
                          </span>
                          <Link
                            href={`/recipes/${report.recipeId}`}
                            target="_blank"
                            className="inline-flex items-center gap-0.5 text-[10px] text-primary font-semibold hover:underline mt-1"
                          >
                            View recipe <LuExternalLink className="size-2.5" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Recipe Already Deleted</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-xs font-semibold text-foreground break-all">
                      {report.userEmail || "Anonymous User"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={isDismissed ? "success" : "danger"}
                      className="font-semibold text-xs capitalize"
                    >
                      {status}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex justify-center gap-1">
                      {!isDismissed && (
                        <Tooltip content="Dismiss Report">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="success"
                            isLoading={actionLoading === reportId}
                            onClick={() => handleDismissReport(reportId)}
                            className="rounded-xl hover:bg-default-100"
                          >
                            <LuCircleCheck className="size-4 text-emerald-500" />
                          </Button>
                        </Tooltip>
                      )}
                      {hasRecipe && (
                        <Tooltip content="Delete Reported Recipe">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            isLoading={actionLoading === reportId}
                            onClick={() => handleDeleteRecipe(report.recipeId, reportId)}
                            className="rounded-xl hover:bg-default-100"
                          >
                            <LuTrash2 className="size-4 text-rose-500" />
                          </Button>
                        </Tooltip>
                      )}
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

      {/* Reports Cards (Mobile/Tablet) */}
      <motion.div variants={itemVariants} className="md:hidden">
        {reports.length === 0 ? (
          <div className="text-center p-8 border border-border rounded-3xl bg-card text-muted-foreground text-sm">
            No recipe reports have been filed.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report) => {
              const reportId = report._id;
              const hasRecipe = !!report.recipeDetails;
              const status = report.status || "active";
              const isDismissed = status === "dismissed";

              return (
                <div
                  key={reportId}
                  className="p-5 border border-border rounded-2xl bg-card hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div>
                    <span className="text-xs text-rose-500 font-bold uppercase tracking-wider block">
                      Reason: {report.reason || "General Violation"}
                    </span>
                    {report.details && (
                      <p className="text-xs text-muted-foreground leading-normal mt-1 italic">
                        "{report.details}"
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1.5 block">
                      Reported on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">Target Recipe:</p>
                    {hasRecipe ? (
                      <div className="flex items-center gap-3 bg-default-50/50 p-2.5 rounded-xl border border-border/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={report.recipeDetails.recipeImage || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200"}
                          alt={report.recipeDetails.recipeName}
                          className="w-12 h-12 rounded-lg object-cover border border-border/40 shrink-0"
                        />
                        <div className="overflow-hidden min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-foreground truncate">
                            {report.recipeDetails.recipeName}
                          </h4>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            by {report.recipeDetails.authorEmail || "Anonymous"}
                          </span>
                          <Link
                            href={`/recipes/${report.recipeId}`}
                            target="_blank"
                            className="inline-flex items-center gap-0.5 text-[10px] text-primary font-semibold hover:underline mt-1"
                          >
                            View recipe <LuExternalLink className="size-2.5" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Recipe Already Deleted</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50 items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-semibold font-semibold">Reporter:</p>
                      <p className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                        {report.userEmail || "Anonymous User"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground font-semibold">Status:</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={isDismissed ? "success" : "danger"}
                        className="font-semibold text-[10px] capitalize"
                      >
                        {status}
                      </Chip>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border/50 justify-end">
                    {!isDismissed && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        isLoading={actionLoading === reportId}
                        onClick={() => handleDismissReport(reportId)}
                        className="font-bold text-xs rounded-xl flex items-center gap-1.5 px-3 h-8 shadow-xs"
                      >
                        <LuCircleCheck className="size-3.5 text-emerald-500 mr-0.5" />
                        <span>Dismiss Report</span>
                      </Button>
                    )}
                    {hasRecipe && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isLoading={actionLoading === reportId}
                        onClick={() => handleDeleteRecipe(report.recipeId, reportId)}
                        className="font-bold text-xs rounded-xl flex items-center gap-1.5 px-3 h-8 shadow-xs"
                      >
                        <LuTrash2 className="size-3.5 text-rose-500 mr-0.5" />
                        <span>Delete Recipe</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
