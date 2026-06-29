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
  User,
  Chip,
  Button,
  Input,
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
      <motion.div variants={itemVariants}>
        <Input
          isClearable
          className="w-full max-w-md"
          placeholder="Search by name, email, or role..."
          startContent={<LuSearch className="text-default-400 size-4 shrink-0" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        <Table aria-label="Registered user database table" className="p-0 border-none">
          <TableHeader>
            <TableColumn className="bg-default-50 text-xs font-bold text-muted-foreground uppercase py-4">User Details</TableColumn>
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
                    <User
                      avatarProps={{
                        src: userObj.image,
                        name: userObj.name ? userObj.name.charAt(0) : "U",
                        className: "bg-default-100 text-foreground font-black border border-border/40",
                      }}
                      description={userObj.email}
                      name={userObj.name || "User"}
                    />
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
                        startContent={<LuCrown className="size-3.5 mr-0.5 text-amber-500" />}
                        variant="flat"
                        color="warning"
                        size="sm"
                        className="font-extrabold text-[10px] tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      >
                        PRO
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
                    {isUserAdmin ? (
                      <span className="text-xs text-muted-foreground italic font-medium">No actions</span>
                    ) : (
                      <Tooltip content={isBlocked ? "Unblock this User" : "Block this User"}>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color={isBlocked ? "success" : "danger"}
                          isLoading={actionLoading === userId}
                          onClick={() => handleBlockToggle(userId, isBlocked)}
                          className="rounded-xl hover:bg-default-100"
                        >
                          {isBlocked ? (
                            <LuUserCheck className="size-4" />
                          ) : (
                            <LuShieldAlert className="size-4" />
                          )}
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
