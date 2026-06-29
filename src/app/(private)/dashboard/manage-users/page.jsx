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
  Button,
  Tooltip,
} from "@heroui/react";
import { LuSearch, LuShieldAlert, LuUserCheck, LuCrown, LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const response = await fetch(`${serverUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (userId, currentBlockedStatus) => {
    setActionLoading(userId);
    try {
      const tokenResult = await authClient.token();
      const token = tokenResult?.data?.token;
      if (!token) return;

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const endpoint = currentBlockedStatus
        ? `${serverUrl}/admin/users/${userId}/unblock`
        : `${serverUrl}/admin/users/${userId}/block`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success(
          currentBlockedStatus
            ? "User unblocked successfully"
            : "User blocked successfully"
        );
        // Refresh local list state
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId || u._id === userId
              ? { ...u, isBlocked: !currentBlockedStatus }
              : u
          )
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error toggling user block:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query) ||
      (u.role || "").toLowerCase().includes(query)
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
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Manage Users
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor registered accounts, block suspicious actors, or view user privileges.
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
          placeholder="Search by name, email, or role..."
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

      {/* Users Table (Desktop) */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hidden md:block">
        <Table className="p-0 border-none">
          <TableScrollContainer>
            <TableContent aria-label="Registered user database table">
              <TableHeader>
                <TableColumn isRowHeader className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">User Details</TableColumn>
                <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Role</TableColumn>
                <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Membership</TableColumn>
                <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">Account Status</TableColumn>
                <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4 text-center">Actions</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No registered users found matching the query.">
                {filteredUsers.map((userObj) => {
                  const userId = userObj.id || userObj._id;
                  const isUserAdmin = userObj.role === "admin";
                  const isBlocked = userObj.isBlocked === true;
                  const isPremium = userObj.isPremium === true;

                  return (
                    <TableRow key={userId} className="border-b border-border/40 hover:bg-default-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full border border-border/40 bg-default-100 text-foreground font-black flex items-center justify-center shrink-0 overflow-hidden relative">
                            {userObj.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={userObj.image}
                                alt={userObj.name || "User"}
                                className="w-full h-full object-cover relative z-10"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : null}
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                              {userObj.name ? userObj.name.charAt(0).toUpperCase() : "U"}
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate">
                              {userObj.name || "User"}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {userObj.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Chip
                          size="sm"
                          variant="flat"
                          color={isUserAdmin ? "warning" : "default"}
                          className="font-semibold text-xs capitalize"
                        >
                          {userObj.role || "user"}
                        </Chip>
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
                            <span>PRO</span>
                          </Chip>
                        ) : (
                          <Chip size="sm" variant="flat" className="font-semibold text-xs text-muted-foreground uppercase">
                            BASIC
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <Chip
                          size="sm"
                          variant="dot"
                          color={isBlocked ? "danger" : "success"}
                          className="font-semibold text-xs"
                        >
                          {isBlocked ? "Blocked" : "Active"}
                        </Chip>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <div className="flex justify-center">
                          {isUserAdmin ? (
                            <span className="text-xs text-muted-foreground italic font-medium">No actions</span>
                          ) : (
                            <Button
                              size="sm"
                              isLoading={actionLoading === userId}
                              onClick={() => handleBlockToggle(userId, isBlocked)}
                              className={`font-bold text-xs rounded-xl flex items-center gap-1.5 px-3 h-8 shadow-xs border transition-all ${
                                isBlocked
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-transparent border-rose-500/50 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10"
                              }`}
                            >
                              {isBlocked ? (
                                <>
                                  <LuUserCheck className="size-3.5" />
                                  <span>Unblock</span>
                                </>
                              ) : (
                                <>
                                  <LuShieldAlert className="size-3.5" />
                                  <span>Block</span>
                                </>
                              )}
                            </Button>
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

      {/* Users Cards (Mobile/Tablet) */}
      <motion.div variants={itemVariants} className="md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center p-8 border border-border rounded-3xl bg-card text-muted-foreground text-sm">
            No registered users found matching the query.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((userObj) => {
              const userId = userObj.id || userObj._id;
              const isUserAdmin = userObj.role === "admin";
              const isBlocked = userObj.isBlocked === true;
              const isPremium = userObj.isPremium === true;

              return (
                <div
                  key={userId}
                  className="p-5 border border-border rounded-2xl bg-card hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full border border-border/40 bg-default-100 text-foreground font-black flex items-center justify-center shrink-0 overflow-hidden relative">
                      {userObj.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={userObj.image}
                          alt={userObj.name || "User"}
                          className="w-full h-full object-cover relative z-10"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        {userObj.name ? userObj.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{userObj.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{userObj.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground font-semibold">Role:</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={isUserAdmin ? "warning" : "default"}
                        className="font-semibold text-[10px] capitalize"
                      >
                        {userObj.role || "user"}
                      </Chip>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-xs text-muted-foreground font-semibold">Status:</span>
                      <Chip
                        size="sm"
                        variant="dot"
                        color={isBlocked ? "danger" : "success"}
                        className="font-semibold text-[10px]"
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </Chip>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground font-semibold">Membership:</span>
                      {isPremium ? (
                        <Chip
                          variant="flat"
                          color="warning"
                          size="sm"
                          className="font-extrabold text-[9px] tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1"
                        >
                          <LuCrown className="size-3 text-amber-500" />
                          <span>PRO</span>
                        </Chip>
                      ) : (
                        <Chip size="sm" variant="flat" className="font-semibold text-[9px] text-muted-foreground uppercase">
                          BASIC
                        </Chip>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!isUserAdmin && (
                        <Button
                          size="sm"
                          isLoading={actionLoading === userId}
                          onClick={() => handleBlockToggle(userId, isBlocked)}
                          className={`font-bold text-xs rounded-xl flex items-center gap-1.5 px-4 h-8 shadow-xs border transition-all ${
                            isBlocked
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-transparent border-rose-500/50 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10"
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <LuUserCheck className="size-3.5" />
                              <span>Unblock</span>
                            </>
                          ) : (
                            <>
                              <LuShieldAlert className="size-3.5" />
                              <span>Block</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
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
