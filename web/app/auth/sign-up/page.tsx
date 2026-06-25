"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User, ShieldCheck, ArrowRight, Loader2, Building2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Logo } from "@/components/ui/logo";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { BackButton } from "@/components/auth/BackButton";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { signUpSchema } from "@/lib/validations/auth";

export default function SignUpPage() {
  const router = useRouter();
  const setAccountDetails = useWorkspaceStore((s) => s.setAccountDetails);
  const resetOnboarding = useWorkspaceStore((s) => s.resetOnboarding);
  const user = useAuthStore((s) => s.user);

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hipaaChecked, setHipaaChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // If already logged in and onboarding done, redirect
  React.useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signUpSchema.safeParse({
      firstName: fullName,
      lastName: fullName, // Simple mock since the form only has fullName
      email: workEmail,
      password,
      hipaaChecked,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        fullName: fieldErrors.firstName?.[0] || fieldErrors.lastName?.[0] || "",
        workEmail: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        hipaa: fieldErrors.hipaaChecked?.[0] || "",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: workEmail, password, fullName }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ general: data?.error?.message || "Failed to register." });
        setIsSubmitting(false);
        return;
      }

      // Reset any prior onboarding state then save account details
      resetOnboarding();
      setAccountDetails({ fullName, workEmail });

      router.push(`/auth/verify-otp?email=${encodeURIComponent(workEmail)}`);
    } catch (err) {
      setErrors({ general: "Network error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <BackButton />

      <AuthCard className="lg:max-w-xl">
        <div className="flex flex-col items-center -mt-4 mb-6">
          <Logo layout="vertical" size={40} />
          <p className="text-sm font-medium text-slate-500 mt-3">
            Create your enterprise workspace
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-black">1</div>
            <span className="text-xs font-bold text-blue-600">Account</span>
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
          <AuthDivider text="Account Details" />

          <form className="space-y-5" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                {errors.general}
              </div>
            )}
            <AuthInput
              id="fullName"
              label="Full Name"
              placeholder="Dr. Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              leftIcon={<User className="h-4 w-4" />}
            />

            <AuthInput
              id="workEmail"
              label="Work Email"
              type="email"
              placeholder="jane@northshorehospital.com"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              error={errors.workEmail}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <PasswordInput
              id="password"
              label="Password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              showIcon
            />

            <div className="space-y-4">
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer group transition-all shadow-sm ${errors.hipaa ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                <input
                  type="checkbox"
                  checked={hipaaChecked}
                  onChange={(e) => {
                    setHipaaChecked(e.target.checked);
                    if (e.target.checked) setErrors((prev) => ({ ...prev, hipaa: "" }));
                  }}
                  className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-0"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-700">HIPAA Compliance Agreement</p>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                    and HIPAA data processing standards for healthcare infrastructure.
                  </p>
                  {errors.hipaa && <p className="text-[10px] font-bold text-red-500">{errors.hipaa}</p>}
                </div>
              </label>

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
                    Continue to Workspace Setup
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <p className="text-center text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign in
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