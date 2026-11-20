/**
 * Skeleton.tsx — Shimmering placeholder blocks for loading states.
 */

import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

/** Single placeholder block — size it with Tailwind classes (e.g. "h-4 w-32"). */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={clsx('skeleton', className)} aria-hidden="true" />
);

interface SkeletonGroupProps {
  /** Accessible loading message announced to screen readers */
  label: string;
  className?: string;
  children: React.ReactNode;
}

/** Wraps skeletons in a polite live region so the loading state is announced once. */
export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({ label, className, children }) => (
  <div role="status" aria-live="polite" aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);
