// src/components/ui/Button.tsx
import * as React from 'react';
// Presupunem că folosești tailwind-merge, dar îl putem înlocui cu o simplă concatenare dacă nu este instalat
import { twMerge } from 'tailwind-merge'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; // Prop nou adăugată pentru Minting
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  className = '',
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}: ButtonProps) {
  
  // Clases preluate din imaginea 4130ba
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const fullWidthClasses = fullWidth ? "w-full max-w-xs mx-auto block" : "";

  // Folosim twMerge sau simpla concatenare
  const combinedClasses = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidthClasses,
    className
  );

  return (
    <button
      className={combinedClasses}
      disabled={props.disabled || isLoading} // ESENȚIAL: Dezactivează la încărcare/pending
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          {/* Adaugă un spinner pentru a arăta că tranzacția este în așteptare */}
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent mr-2" />
          Se încarcă...
        </div>
      ) : (
        children
      )}
    </button>
  );
}