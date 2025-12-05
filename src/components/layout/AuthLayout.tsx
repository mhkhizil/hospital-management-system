"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Auth Layout Component
 * Beautiful, responsive layout for authentication pages
 */
export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl animate-pulse delay-500" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen my-2">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                HMS
              </span>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
                Hospital Management
                <span className="block text-primary">System</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Streamline your healthcare operations with our comprehensive 
                management platform. Secure, efficient, and designed for 
                modern healthcare providers.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4">
              {[
                { icon: "🏥", text: "Complete patient management" },
                { icon: "📅", text: "Appointment scheduling" },
                { icon: "👨‍⚕️", text: "Staff coordination" },
                { icon: "🔒", text: "Secure & HIPAA compliant" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2 xl:w-2/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn(
              "w-full max-w-md space-y-8 rounded-2xl border border-border/50 bg-card/80 p-8 shadow-xl backdrop-blur-sm",
              "sm:p-10",
              className
            )}
          >
            {/* Mobile Logo */}
            <div className="flex flex-col items-center space-y-2 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Hospital Management System</h2>
            </div>

            {children}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="  absolute bottom-1 left-0 right-0 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
      </div>
    </div>
  );
}




