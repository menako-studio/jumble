/**
 * Button.tsx — Reusable tactile button (hover / focus-visible / active / disabled / loading)
 */

import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner, blocks clicks and announces busy state */
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANT_CLASS = {
  primary: 'btn-primary',
  success: 'btn-success',
  danger: 'btn-danger',
  warning: 'btn-warning',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
} as const;

const SIZE_CLASS = {
  sm: 'btn-sm',
  md: '',
  lg: 'text-2xl px-10 py-5',
} as const;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  children,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={clsx(VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
      {children}
    </button>
  );
};
