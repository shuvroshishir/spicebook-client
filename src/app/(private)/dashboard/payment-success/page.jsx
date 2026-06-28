"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LuCircleCheck, LuCrown, LuSparkles, LuLoader, LuArrowRight, LuTriangleAlert } from "react-icons/lu";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgradeSuccess = searchParams.get("upgrade_success");
  const upgradeSessionId = searchParams.get("session_id");

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyUpgrade = async () => {
      if (upgradeSuccess === "true" && upgradeSessionId) {
        try {
          const tokenResult = await authClient.token();
          const token = tokenResult?.data?.token;
          const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

          const response = await fetch(`${serverUrl}/users/verify-premium-upgrade`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId: upgradeSessionId })
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Verification failed");
          }

          const resData = await response.json();
          setPaymentDetails({
            transactionId: upgradeSessionId,
            amount: 9.99,
            status: "Success",
            date: new Date().toLocaleDateString()
          });

          toast.success("Welcome to Premium Pro!");
          try {
            const currentSession = await authClient.getSession();
            if (currentSession?.data?.user) {
              await authClient.updateUser({
                name: currentSession.data.user.name
              });
            }
            await authClient.getSession({ force: true });
          } catch (e) {
            console.error("Failed to force refresh session:", e);
          }
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationError(error.message || "Failed to verify premium upgrade.");
          toast.error("Failed to verify premium upgrade.");
        } finally {
          setIsVerifying(false);
        }
      } else {
        setIsVerifying(false);
        setVerificationError("No session information found.");
      }
    };

    verifyUpgrade();
  }, [upgradeSuccess, upgradeSessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center space-y-4 p-6">
        <div className="relative">
          <LuLoader className="size-16 animate-spin text-amber-500" />
          <LuCrown className="size-6 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Verifying Payment...</h2>
        <p className="text-muted-foreground text-sm">Please do not refresh or close this window.</p>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="bg-danger-500/10 border border-danger-500/20 w-16 h-16 rounded-full flex items-center justify-center text-danger-500">
          <LuTriangleAlert className="size-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-foreground">Verification Failed</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{verificationError}</p>
        </div>
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-default-100 hover:bg-default-200 text-foreground font-semibold rounded-2xl h-11"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-12 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-card border border-border/80 rounded-[3rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Sparkles decorations */}
        <div className="absolute top-8 left-8 text-amber-500/20">
          <LuSparkles className="size-8 animate-pulse" />
        </div>
        <div className="absolute bottom-8 right-8 text-amber-500/20">
          <LuSparkles className="size-10 animate-pulse" />
        </div>

        {/* Success Icon */}
        <div className="text-center space-y-4">
          <div className="inline-flex relative">
            <LuCircleCheck className="size-16 text-emerald-500" />
            <LuCrown className="size-6 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="space-y-2">
            <span className="text-emerald-500 font-extrabold text-xs uppercase tracking-widest block">Upgrade Successful</span>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">You're Pro!</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Thank you for purchasing SpiceBook Premium. Your account has been upgraded with lifetime features.
            </p>
          </div>
        </div>

        {/* Receipt details */}
        <div className="mt-8 bg-default-50 border border-border rounded-[2rem] p-6 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border pb-3">Payment Receipt</h3>
          
          <div className="grid grid-cols-2 gap-y-3.5 text-sm">
            <div className="text-muted-foreground">Premium Status:</div>
            <div className="text-right font-extrabold text-amber-500 flex items-center justify-end gap-1">
              <LuCrown className="size-4" /> Active Pro
            </div>
            
            <div className="text-muted-foreground">Transaction ID:</div>
            <div className="text-right font-mono text-xs text-foreground truncate max-w-[180px] justify-self-end" title={paymentDetails?.transactionId}>
              {paymentDetails?.transactionId}
            </div>

            <div className="text-muted-foreground">Amount Charged:</div>
            <div className="text-right font-bold text-foreground">${paymentDetails?.amount.toFixed(2)} USD</div>

            <div className="text-muted-foreground">Payment Date:</div>
            <div className="text-right text-foreground">{paymentDetails?.date}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
            variant="flat"
            className="flex-1 font-semibold rounded-2xl h-12 border border-border"
          >
            Dashboard Overview
          </Button>
          <Button
            onClick={() => {
              router.push("/dashboard/add-recipe");
            }}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold shadow-md hover:opacity-90 rounded-2xl h-12 flex items-center justify-center gap-1.5"
          >
            Create a Recipe <LuArrowRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
