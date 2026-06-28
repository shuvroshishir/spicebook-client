"use client";

import React, { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@heroui/react";
import { 
  LuUser, 
  LuMail, 
  LuCamera, 
  LuCheck, 
  LuLoader,
  LuCrown,
  LuSparkles
} from "react-icons/lu";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isUpgradingLoading, setIsUpgradingLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state with Better Auth user session data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setImage(user.image || "");
    }
  }, [user]);

  if (!mounted || isPending) {
    return <Loading />;
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Image upload handler using Imgbb API
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbKey) {
      toast.error("Imgbb API Key is not configured in client environment.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Imgbb upload failed");
      }

      const resData = await response.json();
      const uploadedUrl = resData.data.url;
      setImage(uploadedUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Update profile handler using Better Auth client updateUser method
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      
      // Refresh the page session to update header and sidebar instantly
      setTimeout(() => {
        window.location.reload();
      }, 850);

    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

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
          redirectPath: "/dashboard/profile"
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground py-10 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <LuSparkles className="text-primary size-7" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Manage your account settings, update your profile image, and change your display name.
          </p>
        </div>

        {/* Profile Card and Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar Section */}
          <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
            <div className="relative group cursor-pointer" onClick={handleUploadClick}>
              {/* Image Circle Container */}
              {user?.isPremium ? (
                <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-500 shadow-lg relative transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden bg-accent relative">
                    {image ? (
                      <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 text-primary text-4xl font-extrabold flex items-center justify-center">
                        {name ? name.charAt(0).toUpperCase() : <LuUser className="size-12" />}
                      </div>
                    )}

                    {/* Upload Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold transition-opacity duration-300">
                      <LuCamera className="size-6 mb-1 text-white" />
                      <span>Change Photo</span>
                    </div>

                    {/* Uploading Spinner */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                        <LuLoader className="size-8 animate-spin" />
                      </div>
                    )}
                  </div>
                  {/* Floating badge inside */}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full p-1 border border-accent shadow-md">
                    <LuCrown className="size-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-36 h-36 rounded-full overflow-hidden border-3 border-primary/20 group-hover:border-primary transition-all duration-300 relative shadow-md">
                  {image ? (
                    <img 
                      src={image} 
                      alt={name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 text-primary text-4xl font-extrabold flex items-center justify-center">
                      {name ? name.charAt(0).toUpperCase() : <LuUser className="size-12" />}
                    </div>
                  )}

                  {/* Upload Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold transition-opacity duration-300">
                    <LuCamera className="size-6 mb-1 text-white" />
                    <span>Change Photo</span>
                  </div>

                  {/* Uploading Spinner */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                      <LuLoader className="size-8 animate-spin" />
                    </div>
                  )}
                </div>
              )}

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">{name || "User Name"}</h2>
              <p className="text-muted-foreground text-xs">{user?.email || "user@email.com"}</p>
            </div>

            {/* Premium Status Badge / Upgrade Option */}
            <div className="pt-2 w-full">
              {user?.isPremium ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider w-full justify-center shadow-sm">
                  <LuCrown className="size-4 animate-pulse text-amber-500" />
                  Premium Pro
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-default-100 border border-border text-muted-foreground text-xs font-bold uppercase tracking-wider w-full justify-center">
                    Standard Member
                  </div>
                  <Button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-md hover:shadow-amber-500/25 transition-all duration-300 rounded-2xl py-2"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: Edit Settings Form */}
          <div className="md:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
                <LuUser className="text-primary size-5" />
                Profile Information
              </h3>

              <div className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name-input" className="text-sm font-semibold text-foreground">
                    Display Name
                  </label>
                  <Input
                    id="name-input"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                    radius="md"
                    startcontent={<LuUser className="text-muted-foreground size-4 shrink-0" />}
                    classnames={{
                      inputWrapper: "border-border hover:border-primary/50 focus-within:!border-primary",
                      input: "text-foreground",
                    }}
                    required
                  />
                </div>

                {/* Email (Read Only) Input */}
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-sm font-semibold text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email-input"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    variant="flat"
                    radius="md"
                    startcontent={<LuMail className="text-muted-foreground/50 size-4 shrink-0" />}
                    description="Email address cannot be changed."
                    classnames={{
                      inputWrapper: "bg-default-50 border border-transparent cursor-not-allowed opacity-75",
                      input: "text-muted-foreground cursor-not-allowed",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  radius="md"
                  className="font-semibold px-6"
                  disabled={isSaving || isUploading}
                >
                  {isSaving ? (
                    <>
                      <LuLoader className="size-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <LuCheck className="size-4 mr-1.5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

        </div>

      </div>

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
    </div>
  );
}