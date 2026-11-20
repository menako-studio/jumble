/**
 * IconButton.tsx — Icon-only button with a mandatory accessible label
 * and a minimum 44×44px touch target (WCAG 2.5.5).
 */

import React from 'react';
import { clsx } from 'clsx';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Required: accessible name (also used as tooltip) */
  label: string;
  variant?: 'ghost' | 'soft' | 'solid';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const VARIANT = {
  ghost: 'bg-transparent hover:bg-slate-100 text-ink-500 hover:text-ink-900',
  soft: 'bg-sky-50 hover:bg-sky-100 text-duo-blue-dark border border-sky-200',
  solid: 'bg-duo-blue hover:bg-duo-blue-dark text-white',
} as const;

const SIZE = {
  md: 'min-w-11 min-h-11 text-base',
  lg: 'min-w-12 min-h-12 text-xl',
} as const;

export const IconButton: React.FC<IconButtonProps> = ({
  label,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  children,
  ...props
}) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={clsx(
      'inline-flex items-center justify-center rounded-full shrink-0 cursor-pointer',
      'transition-[background-color,color,transform] duration-150 active:scale-95',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      VARIANT[variant],
      SIZE[size],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
