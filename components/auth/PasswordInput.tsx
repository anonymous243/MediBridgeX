"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { AuthInput } from "./AuthInput";

interface PasswordInputProps extends Omit<React.ComponentProps<typeof AuthInput>, "type" | "leftIcon" | "rightIcon"> {
  showIcon?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showIcon = true, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const calculateStrength = (pass: string) => {
      if (!pass) return 0;
      let strength = 0;
      if (pass.length > 7) strength += 1;
      if (/[A-Z]/.test(pass)) strength += 1;
      if (/[0-9]/.test(pass)) strength += 1;
      if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
      return strength;
    };

    const strength = calculateStrength(password);
    const getStrengthDetails = (s: number) => {
      switch (s) {
        case 1: return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
        case 2: return { label: "Fair", color: "bg-orange-500", width: "w-2/4" };
        case 3: return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
        case 4: return { label: "Strong", color: "bg-green-500", width: "w-full" };
        default: return { label: "", color: "bg-transparent", width: "w-0" };
      }
    };

    const details = getStrengthDetails(strength);

    return (
      <div className="space-y-1">
        <AuthInput
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          leftIcon={showIcon ? <Lock className="h-4 w-4" /> : undefined}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center hover:text-slate-900 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />
        {password && (
          <div className="pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-medium text-slate-500">Password strength</span>
              <span className={`text-[10px] font-bold ${details.color.replace('bg-', 'text-')}`}>
                {details.label}
              </span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-300 ${details.color} ${details.width}`}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
