"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Building2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Logo } from "@/components/ui/logo";
import { SSOButton } from "@/components/auth/SSOButton";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { BackButton } from "@/components/auth/BackButton";
import { PrimaryButton } from "@/components/forms/PrimaryButton";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { signInSchema } from "@/lib/validations/auth";

export default function SignInPage() {
    const router = useRouter();
    const setSessionUser = useAuthStore((state) => state.setSessionUser);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hipaaChecked, setHipaaChecked] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setFormError("");

        const validation = signInSchema.safeParse({ email, password, hipaaChecked });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            if (fieldErrors.email) setEmailError(fieldErrors.email[0]);
            if (fieldErrors.password) setPasswordError(fieldErrors.password[0]);
            if (fieldErrors.hipaaChecked) setFormError(fieldErrors.hipaaChecked[0]);
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await AuthService.login(validation.data);
            setSessionUser(response.user);
            // Route: if onboarding not completed, send to wizard; else go to dashboard
            if (!response.user.onboardingCompleted) {
                router.push("/onboarding");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setFormError("Account not found. Please create an account.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSSOSignIn = () => {
        if (!hipaaChecked) {
            setFormError("You must agree to the HIPAA Compliance Agreement.");
            return;
        }
        setFormError("Enterprise SSO is being configured by your workspace admin.");
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <BackButton />

            <AuthCard>
                <div className="flex flex-col items-center -mt-4 mb-4">
                    <Logo layout="vertical" size={40} />
                    <p className="text-sm font-medium text-slate-500 mt-3">Sign in to your account</p>
                </div>

                {formError && (
                    <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium">
                        {formError}
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-4">
                        <SSOButton
                            type="button"
                            onClick={handleSSOSignIn}
                            icon={<Building2 className="h-5 w-5" />}
                        >
                            Continue with Enterprise SSO
                        </SSOButton>
                    </div>

                    <AuthDivider />

                    <form className="space-y-5" onSubmit={handleSignIn}>
                        <AuthInput
                            id="email"
                            label="Work Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={emailError || "name@organization.com"}
                            error={emailError}
                            leftIcon={<Mail className="h-4 w-4" />}
                        />

                        <div className="space-y-2">
                            <PasswordInput
                                id="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={passwordError || "••••••••"}
                                error={passwordError}
                            />
                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="h-3 w-3 rounded border-slate-300 bg-white text-blue-600 focus:ring-0 focus:ring-offset-0 transition-all"
                                    />
                                    <span className="group-hover:text-slate-400">Remember me</span>
                                </label>
                                <Link
                                    href="#"
                                    className="text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer group hover:bg-slate-100 transition-all shadow-sm">
                            <input
                                type="checkbox"
                                checked={hipaaChecked}
                                onChange={(e) => setHipaaChecked(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-0 focus:ring-offset-0 transition-all"
                            />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                    HIPAA Compliance Agreement
                                </p>
                                <p className="text-[10px] leading-relaxed text-slate-500">
                                    I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and data processing standards.
                                </p>
                            </div>
                        </label>

                        <PrimaryButton className="w-full mt-2" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing In..." : "Sign In to MediBridgeX"}
                        </PrimaryButton>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500">
                        New to MediBridgeX?{" "}
                        <Link
                            href="/auth/sign-up"
                            className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </AuthCard>


            <div className="flex justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Secure enterprise encryption active
                </p>
            </div>
        </div>
    );
}