"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Loader2, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Logo } from "@/components/ui/logo";
import { BackButton } from "@/components/auth/BackButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const user = useAuthStore((s) => s.user);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Timer for resending OTP: 60 seconds
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already logged in and onboarding done, redirect
  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  // Handle countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle digit input change
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only keep the last character
    setOtp(newOtp);
    setError("");

    // Move focus to next input
    if (index < 5 && element.value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      setError("");

      // Move focus to previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").substring(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle submit verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otpCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error?.message || "Invalid or expired OTP code.");
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      
      // Update local auth store user session
      useAuthStore.getState().setSessionUser(data.user);

      setSuccess("Email verified successfully! Setting up your session...");
      await new Promise((r) => setTimeout(r, 800));
      
      // Redirect to onboarding step 2 (organization setup)
      router.push("/onboarding");
    } catch (err) {
      setError("Verification failed due to a network error.");
      setIsSubmitting(false);
    }
  };

  // Handle resending OTP
  const handleResend = async () => {
    if (timer > 0) return;
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error?.message || "Failed to resend OTP.");
        setIsResending(false);
        return;
      }

      setSuccess("A new 6-digit OTP code has been sent to your email.");
      setTimer(60);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend OTP due to a network error.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <AuthCard className="lg:max-w-xl">
        <div className="flex flex-col items-center -mt-4 mb-6">
          <Logo layout="vertical" size={40} />
          <p className="text-sm font-medium text-slate-500 mt-3 flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-blue-600" />
            Security Verification Required
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black">1</div>
            <span className="text-xs font-bold text-blue-600">Verification</span>
          </div>
          <div className="flex-1 mx-2 h-0.5 bg-slate-200" />
          {[2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-400 text-xs font-black">{n}</div>
              {n < 5 && <div className="flex-1 mx-2 h-0.5 bg-slate-200" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-black text-slate-800">Enter Verification Code</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We have sent a cryptographically secure 6-digit code to <br />
              <span className="font-bold text-slate-700">{email || "your registered email"}</span>
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 animate-shake">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs font-semibold text-green-600">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 md:gap-3 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  onChange={(e) => handleChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white focus:outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-500">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className="flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-500 disabled:text-slate-400 disabled:opacity-60 transition-all cursor-pointer"
              >
                {isResending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500">
            Need to change your email?{" "}
            <Link href="/auth/sign-up" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign up again
            </Link>
          </p>
        </div>
      </AuthCard>

      <div className="flex justify-center items-center gap-6 opacity-40 grayscale">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          SOC2 Type II Certified · HIPAA Compliant
        </span>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
