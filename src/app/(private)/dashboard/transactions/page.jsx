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
  Chip,
} from "@heroui/react";
import { LuReceipt, LuLoader, LuDollarSign, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import toast from "react-hot-toast";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Server-side Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchTransactions = async (pageNumber) => {
    setLoading(true);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(
        `${serverUrl}/admin/transactions?page=${pageNumber}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTransactions(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalItems(result.total || 0);
      } else {
        toast.error("Failed to load transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error loading transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

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
            Stripe Transactions <LuReceipt className="text-primary size-7" />
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Review checkout records, premium upgrades, individual recipe purchases, and transaction IDs.
          </p>
        </div>
        {totalItems > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-default-100 border border-border text-xs font-semibold text-foreground">
            Total Sales: {totalItems}
          </div>
        )}
      </motion.div>

      {/* Transactions Table with Loader */}
      <motion.div variants={itemVariants} className="space-y-4">
        {/* Desktop Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs relative min-h-[300px] hidden md:block">
          {loading && (
            <div className="absolute inset-0 bg-card/60 backdrop-blur-xs flex items-center justify-center z-10 transition-opacity">
              <LuLoader className="size-8 animate-spin text-primary" />
            </div>
          )}
          <Table className="p-0 border-none">
            <TableScrollContainer>
              <TableContent aria-label="Stripe payment records">
                <TableHeader>
                  <TableColumn isRowHeader className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">User Details</TableColumn>
                  <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Transaction ID</TableColumn>
                  <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Amount</TableColumn>
                  <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Date & Time</TableColumn>
                  <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Status</TableColumn>
                </TableHeader>
                <TableBody emptyContent={loading ? "Loading transactions..." : "No transaction records found."}>
                  {transactions.map((tx) => {
                    const txId = tx._id || tx.transactionId;
                    const txDate = tx.paidAt ? new Date(tx.paidAt).toLocaleString() : new Date().toLocaleString();

                    return (
                      <TableRow key={txId} className="border-b border-border/40 hover:bg-default-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground break-all">
                              {tx.userEmail || "Anonymous"}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
                              Type: {tx.recipeId ? "Recipe Unlock" : "Premium Upgrade"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-mono text-xs text-muted-foreground break-all select-all">
                          {tx.transactionId || "N/A"}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-black text-foreground flex items-center">
                            <LuDollarSign className="size-3.5 text-emerald-500" />
                            {tx.amount ? tx.amount.toFixed(2) : "0.00"}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-muted-foreground">
                          {txDate}
                        </TableCell>
                        <TableCell className="py-4">
                          <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            className="font-bold text-xs uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          >
                            {tx.paymentStatus || "paid"}
                          </Chip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </TableContent>
            </TableScrollContainer>
          </Table>
        </div>

        {/* Transactions Cards (Mobile/Tablet) */}
        <div className="relative md:hidden min-h-[150px]">
          {loading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex items-center justify-center z-10 transition-opacity">
              <LuLoader className="size-8 animate-spin text-primary" />
            </div>
          )}
          {transactions.length === 0 ? (
            <div className="text-center p-8 border border-border rounded-3xl bg-card text-muted-foreground text-sm">
              {!loading && "No transaction records found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {transactions.map((tx) => {
                const txId = tx._id || tx.transactionId;
                const txDate = tx.paidAt ? new Date(tx.paidAt).toLocaleString() : new Date().toLocaleString();

                return (
                  <div
                    key={txId}
                    className="p-5 border border-border rounded-2xl bg-card hover:shadow-md transition-shadow flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {tx.userEmail || "Anonymous"}
                        </p>
                        <span className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider block">
                          Type: {tx.recipeId ? "Recipe Unlock" : "Premium Upgrade"}
                        </span>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color="success"
                        className="font-bold text-[10px] uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0"
                      >
                        {tx.paymentStatus || "paid"}
                      </Chip>
                    </div>

                    <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-muted-foreground">Tx ID:</span>
                        <span className="font-mono select-all text-foreground">{tx.transactionId || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-muted-foreground">Date:</span>
                        <span className="text-foreground">{txDate}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Amount Paid:</span>
                      <span className="text-base font-black text-foreground flex items-center">
                        <LuDollarSign className="size-4 text-emerald-500" />
                        {tx.amount ? tx.amount.toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Server-Side Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-200 cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <LuChevronLeft className="size-4" />
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`size-9 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs ${currentPage === pageNum
                    ? "bg-primary text-white scale-105"
                    : "border border-border bg-card text-foreground hover:bg-default-100"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-primary hover:text-white disabled:opacity-50 disabled:hover:bg-card disabled:hover:text-foreground transition-all duration-200 cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <LuChevronRight className="size-4" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
