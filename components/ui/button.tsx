"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "white" | "text";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center text-xs tracking-[0.2em] uppercase transition-all duration-300 font-light focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-black text-white hover:bg-neutral-900 border border-black py-4 px-8",
    secondary: "bg-transparent text-black border border-black hover:bg-black hover:text-white py-4 px-8",
    white: "bg-white text-black hover:bg-neutral-100 border border-white py-4 px-8",
    text: "bg-transparent text-black py-2 border-b border-black/40 hover:border-black hover:pl-1 px-0 tracking-[0.25em]",
  };

  const buttonContent = (
    <motion.span
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center w-full"
    >
      {children}
    </motion.span>
  );

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {buttonContent}
    </button>
  );
}
